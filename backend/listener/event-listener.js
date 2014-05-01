// Require Mongoose
var mongoose = require('mongoose');
// Get the appropriate db model
var EventModel = mongoose.model('Event');

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

};
