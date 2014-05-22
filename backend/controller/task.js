var mongoose = require('mongoose');
var CategoryModel = mongoose.model('Category');

module.exports.route = function(app) {

	app.get('/task', function(req, res) {

		// check if the user is logged in
		if (req.session.user === undefined) {
			res.redirect('/');
		}

		var userId = req.session.user.id;

		CategoryModel.findOne({
			'title': 'Inbox',
			'userId': userId
		}, function(err, results) {

			var userInboxId = results.id;

			res.render('task', {
				'userInboxId': userInboxId,
				'user': req.session.user
			});

		});

	});
	
};