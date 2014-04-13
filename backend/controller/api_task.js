// Require Mongoose
var mongoose = require('mongoose');
// Get the appropriate db model
var TaskModel = mongoose.model('Task');

module.exports.route = function(app) {

	app.get('/api_task/read_tasks_by_category', function(req, res) {
		TaskModel.find({
			'category' : req.query.categoryId
		}, function(err, results) {
			if (err || !results) {
				console.log('bye');
				res.json({
					error:true
				});
			}
			res.json({
				error : false,
				data : results
			})
		})
	});
};
