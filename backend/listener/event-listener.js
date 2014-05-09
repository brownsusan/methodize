// Require Mongoose
var mongoose = require('mongoose');
// Get the appropriate db model
var EventModel = mongoose.model('Event');
var TaskModel = mongoose.model('Task');

module.exports.setup = function(socketServer, userSocket) {

	var session = userSocket.handshake.session;

	userSocket.on('create_event', function(data) {
		var newEvent = new EventModel();
		newEvent.userId = session.user.id;
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
			console.log(err);
			if (err || !results) {
				userSocket.emit('create_event_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}
			userSocket.emit('create_event_complete', {

				// Send an error as part of data
				'error' : false,
				'newEvent' : results
			});

		});

	});

	userSocket.on('read_events', function(data) {
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
				// Send an error as part of data
				'error' : false,
				'events' : results
			});
			
		});
	});

	userSocket.on('update_event', function(data) {

		if (session.user === undefined) {
			return;
		}

		EventModel.findOne({
			'id' : data.id
		}, function(err, results) {

			if (err || !results) {
				userSocket.emit('update_event_complete', {
					'error' : true
				});
			}

			var eventToUpdate = results;
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

				userSocket.emit('update_event_complete', {
					// Send an error as part of data
					'error' : false,
					'updatedEvent' : results
				});

			});

		});

	});

	userSocket.on('delete_event', function(data) {
		if (session.user === undefined) {
			return;
		}
		EventModel.findOne({
			'id' : data.id,
			'userId' : session.user.id
		}, function(err, results) {

			var eventToDelete = results;

			if (!err) {
				eventToDelete.remove(function(err, results) {
					if (!err) {
						userSocket.emit('delete_event_complete', {
							'error' : false,
							'id' : results.id
						});
					}
				});
			}
		});
	});

	userSocket.on('read_all_task_event_by_user', function(data) {

		console.log('read_all_task_event_by_user');

		var calendarData = [];
		if (session.user === undefined) {
			return;
		}
		EventModel.find({
			'userId' : session.user.id
		}, function(err, results) {
			if (!err) {
				// LOOP OVER RESULTS AND PUSH THEM INTO THE ARRAY
				for (var i = 0, j = results.length; i < j; i++) {
					calendarData.push(results[i]);
				};

				TaskModel.find({
					'userId' : session.user.id
				}, function(err, results) {

					if (!err) {
						for (var i = 0, j = results.length; i < j; i++) {
							calendarData.push(results[i]);
						};
						userSocket.emit('read_all_task_event_by_user_complete', {
							'error' : false,
							'calendarData' : calendarData
						})
					}
				});

			}

		});

	});

};
