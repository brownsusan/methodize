// Require Mongoose
var mongoose = require('mongoose');
var blueimpMd5 = require('blueimp-md5');
var md5 = blueimpMd5.md5;
// Get the appropriate db model
var UserModel = mongoose.model('User');
var CategoryModel = mongoose.model('Category');

module.exports.setup = function(socketServer, userSocket) {

	var session = userSocket.handshake.session;

	userSocket.on('signin_user', function(data) {
		var email = data.email.toLowerCase();
		var password = data.password;

		UserModel.findOne({
			'email' : email
		}, function(err, results) {
			// Check for an error
			if (err || !results) {
				//Emit an event from the server to the client using the userSocket
				userSocket.emit('signin_user_complete', {
					// Send error as part of data
					'error' : true,
					'message' : 'Error finding a user for signin'
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
					'error' : true
				});
				return;
			}
			//Have to call session.save() after changing the session in any way - just how socketio works
			session.user = user;
			session.save();
			//Emit an event from the server to the client using the userSocket
			userSocket.emit('signin_user_complete', {
				// Send error as part of data - this is the success
				'error' : false
			});

		});
	});

	userSocket.on('signup_user', function(data) {
		var user = new UserModel();
		user.email = data.email;
		user.password = data.password;
		user.phoneNumber = data.phone;
		
		// TODO
		// Validation

		user.save(function(err, results) {
			var user = results;

			if (err || !results) {
				userSocket.emit('signup_user_complete', {
					// Send error as part of data - this is the success
					'error' : true
				});
				return;
			}

			var category = new CategoryModel();
			category.userId = results.id;
			category.title = 'Inbox';
			category.color = '#4281DB';

			category.save(function(err, results) {
				if (!err || results) {
					session.user = user;
					session.save();
					userSocket.emit('signup_user_complete', {
						// Send error as part of data - this is the success
						'error' : false
					});
				}

			});

		});

	});

	userSocket.on('update_user', function(data) {
		var userId = data.userId;
		
		if (data.email !== undefined) {
			var email = data.email.toLowerCase();
		}
		if (data.password !== undefined) {
			var password = data.password;
		}
		if (data.phone !== undefined) {
			var phone = data.phone;
		}

		UserModel.findOne({
			'id' : userId
		}, function(err, results) {
			// Check for an error
			if (err || !results) {
				//Emit an event from the server to the client using the userSocket
				userSocket.emit('update_user_complete', {
					// Send error as part of data
					'error' : true,
					'message' : 'Issue finding user to update'
				});
				return;
			}

			var user = results;
			if (password) {
				// Hash the password
				var passwordHash = md5(password + user.salt);
				user.password = passwordHash
			}
			if (phone) {
				user.phoneNumber = phone;
			}
			if (email) {
				user.email = email;
			}
			//Have to call session.save() after changing the session in any way - just how socketio works
			user.save(function(err, results) {

				if (err || !results) {
					userSocket.emit('update_user_complete', {
						// Send error as part of data
						'error' : true,
						'message' : 'error in the user.save function'
					});
					return;
				}

				userSocket.emit('update_user_complete', {
					// Send an error as part of data
					'error' : false,
					'user' : results
				});
				session.user = user;
				session.save();
			});

		});
	});

};
