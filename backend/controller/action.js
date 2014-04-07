var mongoose = require('mongoose');

var UserModel = mongoose.model('User');

module.exports.route = function(app) {

	app.get('/action', function(req, res) {
		res.send('/action');
	});

	app.post('/action/create_user', function(req, res) {

		var user = new UserModel();
		user.email = req.body.email;
		user.password = req.body.password;
		user.phoneNumber = req.body.phone;

		user.save(function(err, results) {

			console.log(err);

			res.json(results);

		});

	});

	app.post('/action/create_user', function(req, res) {

		var user = new UserModel();
		user.email = req.body.email;
		user.password = req.body.password;
		user.phoneNumber = req.body.phone;

		user.save(function(err, results) {

			console.log(err);

			res.json(results);

		});

	});

};
