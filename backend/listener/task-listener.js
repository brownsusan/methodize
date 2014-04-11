// Require Mongoose
var mongoose = require('mongoose');
// Get the appropriate db model
var TaskModel = mongoose.model('Task');

module.exports.setup = function(socketServer, userSocket) {
	// Get the session
	var session = userSocket.handshake.session;
	// Set up an event listener
	userSocket.on('create_task', function(data) {
		var task = new TaskModel();
		task.userId = session.user.id;
		task.title = data.title;
		task.dueDate = data.dueDate;
		task.reminder = data.reminder;
		task.category = data.category;
		task.important = data.important;
		task.subtask = data.subtask;
		task.note = data.note;

		task.save(function(err, results) {

			if (err || !results) {
				userSocket.emit('create_task_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			console.log(err);

			userSocket.emit('create_task_complete', {
				// Send an error as part of data
				'error' : false
			});

		});
	});

	userSocket.on('read_tasks', function(data) {
		var userId = session.user.id;
		TaskModel.find({
			'userId' : userId
		}, function(err, results) {
			if (err || !results) {
				userSocket.emit('read_tasks_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			userSocket.emit('read_tasks_complete', {
				// Send an error as part of data
				'error' : false,
				'tasks' : results
			});

		});

	});

};
