// Require Mongoose
var mongoose = require('mongoose');

// Get the appropriate db model
var EventModel = mongoose.model('Event');
var TaskModel = mongoose.model('Task');

module.exports.setup = function(socketServer, userSocket) {

	// Get the session
	var session = userSocket.handshake.session;

	// create
	userSocket.on('create_event', function(data) {

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var newEvent = new EventModel();
		newEvent.userId = userId;
		newEvent.title = data.title;
		newEvent.startDate = data.startDate;
		newEvent.endDate = data.endDate;
		newEvent.allDay = data.allDay;
		newEvent.reminder = data.reminder;
		newEvent.category = data.category;
		newEvent.important = data.important;
		newEvent.subtask = data.subtask;
		newEvent.note = data.note;

		newEvent.save(function(err, results) {

			if (err || !results) {
				userSocket.emit('create_event_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			userSocket.emit('create_event_complete', {
				// Send error as part of data
				'error' : false,
				'newEvent' : results
			});

		});

	});

	// read
	userSocket.on('read_events', function(data) {

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		EventModel.find({
			'userId' : userId
		}, function(err, results) {

			if (err || !results) {
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

	// update
	userSocket.on('update_event', function(data) {

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var id = data.id;

		EventModel.findOne({
			'id' : id
		}, function(err, results) {

			if (err || !results) {
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

			eventToUpdate.save(function(err, results) {

				if (err || !results) {
					userSocket.emit('update_event_complete', {
						// Send error as part of data
						'error' : true
					});
					return;
				}
				
				results.modelType = 'typeEvent';

				userSocket.emit('update_event_complete', {
					// Send error as part of data
					'error' : false,
					'updatedEvent' : results
				});

			});

		});

	});

	// delete
	userSocket.on('delete_event', function(data) {

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
				userSocket.emit('delete_event_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			var eventToDelete = results;

			eventToDelete.remove(function(err, results) {

				if (err || !results) {
					userSocket.emit('delete_event_complete', {
						// Send error as part of data
						'error' : true
					});
					return;
				}

				userSocket.emit('delete_event_complete', {
					// Send error as part of data
					'error' : false,
					'id' : results.id
				});

			});

		});
	});

	// read from multiple collections
	userSocket.on('read_all_task_event_by_user', function(data) {

		console.log('read_all_task_event_by_user');

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var calendarData = [];

		EventModel.find({
			'userId' : userId
		}, function(err, results) {

			if (err || !results) {
				userSocket.emit('read_all_task_event_by_user', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			var eventsRead = results;

			// LOOP OVER RESULTS AND PUSH THEM INTO THE ARRAY
			for (var i = 0, j = eventsRead.length; i < j; i++) {
				calendarData.push(eventsRead[i]);
			}

			TaskModel.find({
				'userId' : userId
			}, function(err, results) {

				if (err || !results) {
					userSocket.emit('read_all_task_event_by_user', {
						// Send error as part of data
						'error' : true
					});
					return;
				}

				var tasksRead = results;

				for (var i = 0, j = tasksRead.length; i < j; i++) {
					calendarData.push(tasksRead[i]);
				}

				userSocket.emit('read_all_task_event_by_user_complete', {
					// Send error as part of data
					'error' : false,
					'calendarData' : calendarData
				});

			});

		});

	});

};
