// dev libraries
var chalk = require('chalk');
var logger = require('tracer').console();

// Require Mongoose
var mongoose = require('mongoose');

// Get the appropriate db model
var TaskModel = mongoose.model('Task');

module.exports.setup = function(socketServer, userSocket) {

	// Get the session
	var session = userSocket.handshake.session;

	// create
	userSocket.on('create_task', function(data) {

		console.log('socket create_task');

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

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
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('create_task_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			userSocket.emit('create_task_complete', {
				// Send an error as part of data
				'error' : false,
				'task' : results
			});

		});

	});

	// read
	userSocket.on('read_tasks', function(data) {

		console.log('socket read_tasks');

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		TaskModel.find({
			'userId' : userId
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('read_tasks_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			userSocket.emit('read_tasks_complete', {
				// Send error as part of data
				'error' : false,
				'tasks' : results
			});
		});

	});

	userSocket.on('read_task_by_id', function(data) {

		console.log('socket read_task_by_id');

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var id = data.id;

		TaskModel.findOne({
			'id' : id
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('read_task_by_id_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			userSocket.emit('read_task_by_id_complete', {
				// Send error as part of data
				'error' : false,
				'task' : results
			});

		});
	});

	userSocket.on('read_tasks_by_category', function(data) {

		console.log('socket read_tasks_by_category');

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var categoryId = data.categoryId;

		TaskModel.find({
			'category' : categoryId
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('read_tasks_by_category_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			userSocket.emit('read_tasks_by_category_complete', {
				// Send error as part of data
				'error' : false,
				'tasks' : results
			});

		});

	});

	// update
	userSocket.on('update_task', function(data) {

		console.log('socket update_task');

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var id = data.id;

		TaskModel.findOne({
			'id' : id
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('update_task_complete', {
					'error' : true,
					'message' : 'Couldnt find a matching task'
				});
				return;
			}

			var task = results;

			// check what needs to be updated
			if (data.title !== undefined) {
				task.title = data.title;
			}

			if (data.dueDate !== undefined) {
				task.dueDate = data.dueDate;
			}

			if (data.reminder !== undefined) {
				task.reminder = data.reminder;
			}

			if (data.category !== undefined) {
				task.category = data.category;
			}

			if (data.important !== undefined) {
				task.important = data.important;
			}

			if (data.subtask !== undefined) {
				task.subtask = data.subtask;
			}

			if (data.note !== undefined) {
				task.note = data.note;
			}

			// if (data.completed !== undefined && data.completed != null) {
			// task.completed = data.completed;
			// }

			task.save(function(err, results) {

				if (err || !results) {
					logger.log(chalk.bgRed('ERROR'));
					userSocket.emit('update_task_complete', {
						// Send error as part of data
						'error' : true,
						'message' : 'error in the task.save function'
					});
					return;
				}

				results.modelType = 'typeTask';

				userSocket.emit('update_task_complete', {
					// Send error as part of data
					'error' : false,
					'task' : results
				});

			});

		});

	});

	userSocket.on('update_subtask', function(data) {

		console.log('socket update_subtask');

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var taskId = data.taskId;
		var subtaskId = data.subtaskId;
		var title = data.title;

		TaskModel.findOne({
			'id' : taskId
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('update_subtask_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			var task = results;

			// loop over the subtasks
			for (var i = 0, j = task.subtask.length; i < j; i++) {

				// check if the subtask matches the subtask we need to update
				if (task.subtask[i].id == subtaskId) {

					task.subtask[i].title = title;

					task.save(function() {

						userSocket.emit('update_subtask_complete', {
							// Send error as part of data
							'error' : false,
							'task' : task
						});

					});

					return;
				}
			}

			// no matching subtask was found
			userSocket.emit('update_subtask_complete', {
				// Send error as part of data
				'error' : true
			});

		});

	});

	// delete
	userSocket.on('delete_task', function(data) {

		console.log('socket delete_task');

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var id = data.id;

		TaskModel.findOne({
			'id' : id,
			'userId' : userId
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('update_subtask_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			var task = results;

			task.remove(function(err, results) {

				if (err || !results) {
					logger.log(chalk.bgRed('ERROR'));
					userSocket.emit('delete_task_complete', {
						// Send error as part of data
						'error' : true
					});
					return;
				}

				userSocket.emit('delete_task_complete', {
					// Send error as part of data
					'error' : false,
					'id' : results.id
				});

			});

		});
	});
};
