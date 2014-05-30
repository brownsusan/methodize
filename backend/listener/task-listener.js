// dev libraries
var chalk = require('chalk');
var logger = require('tracer').console();

// Require needed libraries
var mongoose = require('mongoose');

// Get the appropriate db model
var TaskModel = mongoose.model('Task');

module.exports.setup = function(socketServer, userSocket) {

	// Get the session
	var session = userSocket.handshake.session;

	// create
	userSocket.on('create_task', function(data) {

		// data must include
		// category
		// title
		// dueDate
		// reminder
		// important
		// note
		// subtask

		console.log(chalk.bgGreen('socket create_task'));
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var task = new TaskModel();
		task.category = data.category;
		task.userId = session.user.id;
		task.title = data.title;
		task.dueDate = data.dueDate;
		task.reminder = data.reminder;
		task.important = data.important;
		task.subtask = data.subtask;
		task.note = data.note;

		task.store(task, function(err, results) {

			if (err || !results) {
				console.log(err);
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('create_task_complete', {
					// Send error as part of data
					'error': true
				});
				return;
			}

			socketServer.sockets.in(userId).emit('create_task_complete', {
				// Send an error as part of data
				'error': false,
				'task': results
			});

		});

	});

	// read
	userSocket.on('read_tasks', function(data) {

		// data must include
		// ---- nothing

		console.log(chalk.bgGreen('socket read_tasks'));
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		TaskModel.find({
			'userId': userId
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('read_tasks_complete', {
					// Send error as part of data
					'error': true
				});
				return;
			}

			userSocket.emit('read_tasks_complete', {
				// Send error as part of data
				'error': false,
				'tasks': results
			});
		});

	});

	userSocket.on('read_tasks_by_category', function(data) {

		// data must include
		// categoryId

		console.log(chalk.bgGreen('socket read_tasks_by_category'));
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var categoryId = data.categoryId;

		TaskModel.find({
			'category': categoryId
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('read_tasks_by_category_complete', {
					// Send error as part of data
					'error': true
				});
				return;
			}

			userSocket.emit('read_tasks_by_category_complete', {
				// Send error as part of data
				'error': false,
				'tasks': results
			});

		});

	});

	userSocket.on('read_task', function(data) {

		// data must include
		// id

		console.log(chalk.bgGreen('socket read_task'));
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var id = data.id;

		TaskModel.findOne({
			'id': id
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('read_task_complete', {
					// Send error as part of data
					'error': true
				});
				return;
			}

			userSocket.emit('read_task_complete', {
				// Send error as part of data
				'error': false,
				'task': results
			});

		});

	});

	// update
	userSocket.on('update_task', function(data) {

		// data must include
		// id

		// data could include
		// category
		// title
		// dueDate
		// reminder
		// important
		// note
		// subtask

		console.log(chalk.bgGreen('socket update_task'));
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var id = data.id;

		TaskModel.findOne({
			'id': id
		}, function(err, results) {

			console.log(err);
			console.log(results);

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('update_task_complete', {
					'error': true
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

			if (data.completed !== undefined) {
				task.completed = data.completed;
			}

			task.store(task, function(err, results) {

				if (err || !results) {
					logger.log(chalk.bgRed('ERROR'));
					userSocket.emit('update_task_complete', {
						// Send error as part of data
						'error': true
					});
					return;
				}

				socketServer.sockets.in(userId).emit('update_task_complete', {
					// Send error as part of data
					'error': false,
					'task': results
				});

			});

		});

	});

	// delete
	userSocket.on('delete_task', function(data) {

		// data must include
		// id

		console.log(chalk.bgGreen('socket delete_task'));
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var id = data.id;

		TaskModel.findOne({
			'id': id,
			'userId': userId
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('update_subtask_complete', {
					// Send error as part of data
					'error': true
				});
				return;
			}

			var task = results;

			task.remove(function(err, results) {

				if (err || !results) {
					logger.log(chalk.bgRed('ERROR'));
					userSocket.emit('delete_task_complete', {
						// Send error as part of data
						'error': true
					});
					return;
				}

				socketServer.sockets.in(userId).emit('delete_task_complete', {
					// Send error as part of data
					'error': false,
					'id': id
				});

			});

		});

	});

};