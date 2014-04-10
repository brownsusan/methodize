// Require Mongoose
var mongoose = require('mongoose');
var blueimpMd5 = require('blueimp-md5');
var md5 = blueimpMd5.md5;
// Get the appropriate db model
var UserModel = mongoose.model('User');

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
					'error' : true
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
		console.log(data);
		var user = new UserModel();
		user.email = data.email;
		user.password = data.password;
		user.phoneNumber = data.phone;

		user.save(function(err, results) {

			if (err || !results) {
				userSocket.emit('signup_user_complete', {
					// Send error as part of data - this is the success
					'error' : true
				});
				return;
			}

			console.log(err);

			userSocket.emit('signup_user_complete', {
				// Send error as part of data - this is the success
				'error' : false
			});

		});

	});

};
