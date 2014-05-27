// dev libraries
var chalk = require('chalk');
var logger = require('tracer').console();

// Require needed libraries
var mongoose = require('mongoose');
var blueimpMd5 = require('blueimp-md5');

var md5 = blueimpMd5.md5;

// Get the appropriate db model
var UserModel = mongoose.model('User');
var CategoryModel = mongoose.model('Category');

module.exports.setup = function(socketServer, userSocket) {

	// Get the session
	var session = userSocket.handshake.session;

	if (session.user !== undefined) {
		// have the user join a room for them
		userSocket.join(session.user.id);
	}

	// create
	userSocket.on('signup_user', function(data) {

		// data must include
		// email
		// password
		// phone

		console.log(chalk.bgGreen('socket signup_user'));
		console.log(data);

		var user = new UserModel();
		user.email = data.email;
		user.password = data.password;
		user.phoneNumber = data.phone;

		// TODO
		// Validation

		user.save(function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('signup_user_complete', {
					// Send error as part of data - this is the success
					'error': true
				});
				return;
			}

			var user = results;

			// each users has a default category
			// we need to create this default category when creating the user
			var category = new CategoryModel();
			category.userId = results.id;
			category.title = 'Inbox';
			category.color = '#4281DB';

			category.save(function(err, results) {

				if (err || !results) {
					logger.log(chalk.bgRed('ERROR'));
					userSocket.emit('signup_user_complete', {
						// Send error as part of data
						'error': true
					});
					return;
				}

				//Have to call session.save() after changing the session in any way - just how socketio works
				session.user = user;
				session.save();

				userSocket.emit('signup_user_complete', {
					// Send error as part of data - this is the success
					'error': false
				});

			});

		});

	});

	// read
	userSocket.on('signin_user', function(data) {

		// data must include
		// email
		// password

		console.log(chalk.bgGreen('socket signin_user'));
		console.log(data);

		var email = data.email.toLowerCase();
		var password = data.password;

		UserModel.findOne({
			'email': email
		}, function(err, results) {

			// Check for an error
			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				//Emit an event from the server to the client using the userSocket
				userSocket.emit('signin_user_complete', {
					// Send error as part of data
					'error': true,
					'message': 'Error finding a user for signin'
				});
				return;
			}

			var user = results;

			var passwordHash = md5(password + user.salt);

			// Check if the passwords match
			if (passwordHash != user.password) {
				//Emit an event from the server to the client using the userSocket
				userSocket.emit('signin_user_complete', {
					// Send an error as part of data
					'error': true
				});
				return;
			}

			//Have to call session.save() after changing the session in any way - just how socketio works
			session.user = user;

			session.save(function() {

				//Emit an event from the server to the client using the userSocket
				userSocket.emit('signin_user_complete', {
					// Send error as part of data - this is the success
					'error': false
				});

			});

		});

	});

	// update
	userSocket.on('update_user', function(data) {

		// data must include
		// ---- nothing

		// data could include
		// email
		// password
		// phone

		console.log(chalk.bgGreen('socket update_user'));
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		UserModel.findOne({
			'id': userId
		}, function(err, results) {

			// Check for an error
			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				//Emit an event from the server to the client using the userSocket
				userSocket.emit('update_user_complete', {
					// Send error as part of data
					'error': true,
					'message': 'Issue finding user to update'
				});
				return;
			}

			var user = results;

			if (data.email !== undefined) {
				// the model will lowercase the email
				user.email = data.email;
			}

			// check what needs to be updated
			if (data.password !== undefined) {
				// the model will hash the password
				user.password = data.password;
			}

			if (data.phone !== undefined) {
				user.phoneNumber = data.phone;
			}

			user.save(function(err, results) {

				if (err || !results) {
					logger.log(chalk.bgRed('ERROR'));
					userSocket.emit('update_user_complete', {
						// Send error as part of data
						'error': true,
						'message': 'error in the user.save function'
					});
					return;
				}

				//Have to call session.save() after changing the session in any way - just how socketio works
				session.user = user;
				session.save(function() {

					userSocket.emit('update_user_complete', {
						// Send an error as part of data
						'error': false,
						'user': results
					});

				});


			});

		});

	});

};