var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports.route = function(app) {

	app.get('/calendar', function(req, res) {

		// check if the user is logged in
		if (req.session.user === undefined) {
			res.redirect('/');
		}

		var user = req.session.user;

		res.render('calendar', {
			'user' : user
		});

	});

};