// Require Mongoose
var mongoose = require('mongoose');
// Get the appropriate db model
var TaskModel = mongoose.model('Task');

module.exports.setup = function(socketServer, userSocket) {
	// Get the session
	var session = userSocket.handshake.session;
	// Set up an event listener
	userSocket.on('event_from_client', function(data) {

	});

}; 