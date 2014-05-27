//Define Global Variables
//This sets the variable equal to current directory within the context of the file system (Same as pwd)
_root = __dirname;
//Giving a reference to my back end folder
_backend_root = _root + '/backend';
//Giving a reference to my front end folder
_frontend_root = _root + '/frontend';

//Importing libraries
//Route Engine, Duh
var express = require('express');
//File System - Reads/writes files - Part of Node
var fs = require('fs');
//HTTP Server - Part of Node
var http = require('http');
//Socket.Io - Sockets, Duh
var io = require('socket.io');
//Mongo Abstraction Layer, Duh
var mongoose = require('mongoose');
// Twilio node library
var twilio = require("twilio");

//Instantiating the Servers and telling them to use the same HTTP server with a mega weird order of operations.
//This has to be set up first because the http constructor is going to expect my routing engine.
var expressServer = express();
//Create an HTTP server and tell Express to use it by passing express into the constructor.
var httpServer = http.createServer(expressServer);
//Create a socket server and tell it to use the HTTP server that I just set up.
//Socket IO is going to expect my http Server in the constructor.
var socketIOServer = io.listen(httpServer, {
	log : false
});

var config = require(_backend_root + '/config/config');

/** Mongoose */

fs.readdirSync(_backend_root + '/model').forEach(function(file) {
	if (file.substr(-3) == '.js') {
		require(_backend_root + '/model/' + file);
	}
});

mongoose.connect('mongodb://localhost/methodize');

/** Express Server */

// config
config.setupExpress(expressServer);

// controllers
fs.readdirSync(_backend_root + '/controller').forEach(function(file) {
	// if it ends in .js
	if (file.substr(-3) == '.js') {
		// require the file, which gives us access to it's public static methods
		// save that module to a variable so we can use it's public static methods
		var controller = require(_backend_root + '/controller/' + file);
		// pass the express server to the controller which will setup the route
		controller.route(expressServer);
	}
});

// 404 Error
expressServer.use(function(req, res, next) {

	var data = {};
	data.session = req.session;

	res.status(404).render('error/404', data);

});

/** Socket Server */

// config
config.setupSocketIO(socketIOServer);
// whenever a connection is made to the socket server, create a new socket in sockets - call it userSocket
socketIOServer.sockets.on('connection', function(userSocket) {
	//Read all of the listeners
	fs.readdirSync(_backend_root + '/listener').forEach(function(file) {
		//Check to make sure each file is a js file
		if (file.substr(-3) == '.js') {
			//Require each listener
			var listener = require(_backend_root + '/listener/' + file);
			//Give the listener the server and the new socket
			listener.setup(socketIOServer, userSocket);
		}
	});

});

/** HTTP Server */

httpServer.listen(expressServer.get('port'), function() {
	console.log('Express server listening on port ' + expressServer.get('port') + ' and process ' + process.pid);
});