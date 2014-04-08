var blueimpMd5 = require('blueimp-md5');
var mongoose = require('mongoose');

var md5 = blueimpMd5.md5;

var UserModel = mongoose.model('User');

module.exports.route = function(app) {
	
	app.get('/action/signout', function(req, res) {
		req.session.destroy();
		res.redirect('/');
	});

	app.post('/action/create_user', function(req, res) {

		var user = new UserModel();
		user.email = req.body.email;
		user.password = req.body.password;
		user.phoneNumber = req.body.phone;

		user.save(function(err, results) {
			
			 if (err || !results) {
				res.json({
					'error' : true
				});
				return;
			}

			console.log(err);

			res.json(results);

		});

	});


	app.post('/action/signin_user', function(req, res) {

		var email = req.body.email.toLowerCase();
		var password = req.body.password;

		UserModel.findOne({
			'email' : email
		}, function(err, results) {
			
			
			if (err || !results) {
				res.json({
					'error' : true
				});
				return;
			}

			var user = results;

			var passwordHash = md5(password + user.salt);

			if (passwordHash != user.password) {
				res.json({
					'error' : true
				});
				return;
			}

			req.session.user = user;

			res.json({
				'error' : false
			});

		});

	});

};
