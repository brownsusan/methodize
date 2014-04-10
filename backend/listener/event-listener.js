// Require Mongoose
var mongoose = require('mongoose');
// Get the appropriate db model
var EventModel = mongoose.model('Event');

module.exports.setup = function(socketServer, userSocket) {

	var session = userSocket.handshake.session;

	userSocket.on('event_from_client', function(data) {

	});

}; 