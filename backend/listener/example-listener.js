// var mongoose = require('mongoose');

// var Model = mongoose.model('Model');

module.exports.setup = function(socketServer, userSocket) {

	var session = userSocket.handshake.session;

	userSocket.on('event_from_client', function(data) {

	});

}; 