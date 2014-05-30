// Require needed libraries
var mongoose = require('mongoose');

// Get the appropriate db model
var CategoryModel = mongoose.model('Category');

module.exports.route = function(app) {

	app.get('/task', function(req, res) {

		// check if the user is logged in
		if (req.session.user === undefined) {
			res.redirect('/');
			return;
		}

		// create the data variable to be sent to the view
		var data = {};
		data.user = req.session.user;

		var userId = req.session.user.id;

		CategoryModel.findOne({
			'title' : 'Default',
			'userId' : userId
		}, function(err, results) {

			var userDefaultCategoryId = results.id;

			data.userDefaultCategoryId = userDefaultCategoryId;

			res.render('task', data);

		});

	});

};
