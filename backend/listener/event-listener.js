// dev libraries
var chalk = require('chalk');
var logger = require('tracer').console();

// Require needed libraries
var mongoose = require('mongoose');

// Get the appropriate db model
var EventModel = mongoose.model('Event');
var TaskModel = mongoose.model('Task');

module.exports.setup = function(socketServer, userSocket) {

	// Get the session
	var session = userSocket.handshake.session;

	// create
	userSocket.on('create_event', function(data) {

		// data must include
		// category
		// title
		// startDate
		// endDate
		// allDay
		// reminder
		// important
		// subtask
		// note

		console.log(chalk.bgGreen('socket create_event'));
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var eventToCreate = new EventModel();
		eventToCreate.userId = userId;
		eventToCreate.title = data.title;
		eventToCreate.startDate = data.startDate;
		eventToCreate.endDate = data.endDate;
		eventToCreate.allDay = data.allDay;
		eventToCreate.reminder = data.reminder;
		eventToCreate.category = data.category;
		eventToCreate.important = data.important;
		eventToCreate.subtask = data.subtask;
		eventToCreate.note = data.note;

		eventToCreate.store(eventToCreate, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('create_event_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			socketServer.sockets.in(userId).emit('create_event_complete', {
				// Send error as part of data
				'error' : false,
				'event' : results
			});

		});

	});

	// read
	userSocket.on('read_events', function(data) {

		// data must include
		// ---- nothing

		console.log(chalk.bgGreen('socket read_events'));
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		EventModel.find({
			'userId' : userId
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('read_events_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			userSocket.emit('read_events_complete', {
				// Send error as part of data
				'error' : false,
				'events' : results
			});

		});

	});

	userSocket.on('read_event', function(data) {

		// data must include
		// id

		console.log(chalk.bgGreen('socket read_event'));
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		EventModel.find({
			'id' : data.id
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('read_event_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			userSocket.emit('read_event_complete', {
				// Send error as part of data
				'error' : false,
				'event' : results
			});

		});
		
	});

	// update
	userSocket.on('update_event', function(data) {

		// data must include
		// id

		// data could include
		// category
		// title
		// startDate
		// endDate
		// allDay
		// reminder
		// important
		// subtask
		// note

		console.log(chalk.bgGreen('socket update_event'));
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var id = data.id;

		EventModel.findOne({
			'id' : id
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('update_event_complete', {
					'error' : true
				});
			}

			var eventToUpdate = results;

			// check what needs to be updated
			if (data.title !== undefined) {
				eventToUpdate.title = data.title;
			}

			if (data.startDate !== undefined) {
				eventToUpdate.startDate = data.startDate;
			}

			if (data.endDate !== undefined) {
				eventToUpdate.endDate = data.endDate;
			}

			if (data.allDay !== undefined) {
				eventToUpdate.allDay = data.allDay;
			}

			if (data.reminder !== undefined) {
				eventToUpdate.reminder = data.reminder;
			}

			if (data.category !== undefined) {
				eventToUpdate.category = data.category;
			}

			if (data.important !== undefined) {
				eventToUpdate.important = data.important;
			}

			if (data.subtask !== undefined) {
				eventToUpdate.subtask = data.subtask;
			}

			if (data.note !== undefined) {
				eventToUpdate.note = data.note;
			}

			eventToUpdate.store(eventToUpdate, function(err, results) {

				if (err || !results) {
					logger.log(chalk.bgRed('ERROR'));
					userSocket.emit('update_event_complete', {
						// Send error as part of data
						'error' : true
					});
					return;
				}

				socketServer.sockets.in(userId).emit('update_event_complete', {
					// Send error as part of data
					'error' : false,
					'event' : results
				});

			});

		});

	});

	// delete
	userSocket.on('delete_event', function(data) {

		// data must include
		// id

		console.log(chalk.bgGreen('socket delete_event'));
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var id = data.id;

		EventModel.findOne({
			'id' : id,
			'userId' : userId
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('delete_event_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			var eventToDelete = results;

			eventToDelete.remove(function(err, results) {

				if (err || !results) {
					logger.log(chalk.bgRed('ERROR'));
					userSocket.emit('delete_event_complete', {
						// Send error as part of data
						'error' : true
					});
					return;
				}

				socketServer.sockets.in(userId).emit('delete_event_complete', {
					// Send error as part of data
					'error' : false,
					'id' : id
				});

			});

		});
	});

};
