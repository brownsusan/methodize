var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports.route = function(app) {

	app.get('/calendar', function(req, res) {

		console.log(req.session.user);


		// check if the user is logged in
		if (req.session.user === undefined) {
			res.redirect('/');
		}

		res.end();
		return;

		var user = req.session.user;

		res.render('calendar', {
			'user' : user
		});

	});

};