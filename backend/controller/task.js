module.exports.route = function(app) {
	var mongoose = require('mongoose');
	var CategoryModel = mongoose.model('Category');

	app.get('/task', function(req, res) {
		var userId = req.session.user.id;
		CategoryModel.findOne({
			'title' : 'Inbox',
			'userId' : userId
		}, function(err, results) {
			var userInboxId = results.id;
			res.render('task', {
				'userInboxId' : userInboxId
			});
		});
	});

};
