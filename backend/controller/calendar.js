module.exports.route = function(app) {
	var mongoose = require('mongoose');
	var UserModel = mongoose.model('User');

	app.get('/calendar', function(req, res) {
		res.render('calendar', {
			'user' : req.session.user
		});
	});

};
