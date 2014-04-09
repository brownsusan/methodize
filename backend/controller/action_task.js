var mongoose = require('mongoose');
var TaskModel = mongoose.model('Task');
module.exports.route = function(app) {

	app.post('/action/create-task', function(req, res) {

		var task = new TaskModel();
		task.userId = req.session.user.id;
		task.title = req.body.title;
		task.dueDate = new Date();
		task.reminder = [{
			'start' : new Date(),
			'end' : new Date(),
			'frequency' : 7,
			'via' : ['call', 'email', 'sms']
		}];
		task.category = 'req.body.category';
		task.important = true;
		task.subtask = [{
			'title' : 'Title',
			'completed' : true
		}, {
			'title' : 'Title 2',
			'completed' : false
		}];
		task.note = 'req.body.note';

		// task.title = req.body.title;
		// task.dueDate = req.body.dueDate;
		// task.reminder = req.body.reminder;
		// task.category = req.body.category;
		// task.important = req.body.important;
		// task.subtask = req.body.subtask;
		// task.note = req.body.note;

		task.save(function(err, results) {

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

	app.get('/action/read-task', function(req, res) {

		TaskModel.find({
			userId : req.session.user.id
		}, function(err, results) {
			res.json(results);
		});

	});

	app.get('/action/update-task', function(req, res) {

		TaskModel.findOne({
			id : '8e41d9f9-54c6-4af0-aa3d-3f17193f8e46'
		}, function(err, results) {

			var task = results;
			task.userId = req.session.user.id;
			task.title = 'req.body.titie';
			task.dueDate = new Date();
			task.reminder = [{
				'start' : new Date(),
				'end' : new Date(),
				'frequency' : 7,
				'via' : ['call', 'email', 'sms']
			}];
			task.category = 'req.body.category';
			task.important = true;
			task.subtask = [{
				'title' : 'Title',
				'completed' : true
			}, {
				'title' : 'Title 2',
				'completed' : false
			}];
			task.note = 'req.body.note';

			task.save(function(err, results) {

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

	});

	app.get('/action/delete-task', function(req, res) {

		TaskModel.findOne({
			id : '8e41d9f9-54c6-4af0-aa3d-3f17193f8e46'
		}, function(err, results) {

			var task = results;

			task.remove(function(err, results) {

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

	});

}