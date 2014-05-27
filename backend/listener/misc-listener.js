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

	userSocket.on('reload', function(data) {
		socketServer.sockets.emit('reload');
	});

	// read from multiple collections
	userSocket.on('read_events_tasks', function(data) {

		// data must include
		// ---- nothing

		console.log(chalk.bgGreen('socket read_events_tasks'));
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var calendarData = [];

		EventModel.find({
			'userId': userId
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('read_events_tasks_complete', {
					// Send error as part of data
					'error': true
				});
				return;
			}

			var eventsRead = results;

			// LOOP OVER RESULTS AND PUSH THEM INTO THE ARRAY
			for (var i = 0, j = eventsRead.length; i < j; i++) {
				calendarData.push(eventsRead[i]);
			}

			TaskModel.find({
				'userId': userId
			}, function(err, results) {

				if (err || !results) {
					logger.log(chalk.bgRed('ERROR'));
					userSocket.emit('read_events_tasks_complete', {
						// Send error as part of data
						'error': true
					});
					return;
				}

				var tasksRead = results;

				for (var i = 0, j = tasksRead.length; i < j; i++) {
					calendarData.push(tasksRead[i]);
				}

				userSocket.emit('read_events_tasks_complete', {
					// Send error as part of data
					'error': false,
					'calendarData': calendarData
				});

			});

		});

	});

};