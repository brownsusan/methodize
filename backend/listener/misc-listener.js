// dev libraries
var chalk = require('chalk');
var logger = require('tracer').console();

module.exports.setup = function(socketServer, userSocket) {

	userSocket.on('reload', function(data) {
		socketServer.sockets.emit('reload');
	});

};