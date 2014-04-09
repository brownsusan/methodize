var mongoose = require('mongoose');
var CategoryModel = mongoose.model('Category');

module.exports.route = function(app) {

	app.post('/action/create-category', function(req, res) {

		var category = new CategoryModel();
		category.userId = req.session.user.id;
		category.title = req.body.title;
		category.color = req.body.color;

		category.save(function(err, results) {

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
}