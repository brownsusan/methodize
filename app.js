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

// // TODO
// // Set the interval to check the tasks and events
// var processing = false;
// // TODO
// // Need a way to get the number for the user attached to the reminder
// var accountSid = 'AC42333c57015730911c7cebcbb78c587d';
// var authToken = 'ef9243210c35fb75d8053a1b1f8ffed2';
// var twilioNumber = '+17343657844';
// 
// // TODO
// // Set a message to send. "You have a reminder for the 'Event' or 'Task' called 'Title'. This item is due at this 'time' on this 'day'."
// var sendReminderSms = function() {
	// var client = new twilio.RestClient(accountSid, authToken);
	// client.sendSms({
		// body : "Testing",
		// to : "+12488803127",
		// from : twilioNumber
	// }, function(error, message) {
		// if (!error) {
			// console.log('Success! The SID for this SMS message is:');
			// console.log(message.sid);
// 
			// console.log('Message sent on:');
			// console.log(message.dateCreated);
		// } else {
			// console.log('Oops! There was an error.');
			// console.log('Error: ' + JSON.stringify(error));
		// }
	// });
// }
// var sendReminderCall = function() {
	// var client = new twilio.RestClient(accountSid, authToken);
	// client.makeCall({
		// body : "Testing",
		// to : "+12488803127",
		// from : twilioNumber
	// }, function(error, message) {
		// if (!error) {
			// console.log('Success! The SID for this SMS message is:');
			// console.log(message.sid);
// 
			// console.log('Message sent on:');
			// console.log(message.dateCreated);
		// } else {
			// console.log('Oops! There was an error.');
			// console.log('Error: ' + JSON.stringify(error));
		// }
	// });
// }
// setInterval(function() {
	// console.log('Set Interval');
	// // Make a new date object
	// var currentDate = new Date();
	// // TODO
	// // Format this date object with moment
	// var data = [];
	// // Query the database for all tasks and events
	// mongoose.model('Event').find({}, function(err, results) {
		// if (err || !results) {
			// return;
		// }
		// for (var i = 0, j = results.length; i < j; i++) {
			// // push results[i] into an array
			// data.push(results[i]);
		// };
		// mongoose.model('Task').find({}, function(err, results) {
			// if (err || !results) {
				// return;
			// }
			// for (var i = 0, j = results.length; i < j; i++) {
				// // push results[i] into an array
				// data.push(results[i]);
			// };
		// });
	// });
	// console.log('DATA: ' + data.length);
	// //TODO - this loop does not actually loop through results - just works with one result each time the timer runs
	// for (var i = 0, j = data.length; i < j; i++) {
		// //Loop over the reminders for the current index
		// var reminders = data[i].reminder;
		// console.log('DATA LENGTH: ' + data.length);
		// // console.log('Data[i]: ' + data[i]);
		// // console.log('Reminders' + reminders);
		// if (reminders != undefined && reminders.length != 0) {
			// for (var i = 0, j = reminders.length; i < j; i++) {
				// console.log(reminders[i]);
				// // Check the start time of the reminder against the current date
				// var startDate = reminders[i].start;
				// var via = reminders[i].via;
				// var frequency = reminders[i].frequency;
// 
				// if (currentDate == startDate) {
					// if (frequency == 0) {
						// if (via.phone == true) {
							// console.log('Make a phone call');
						// }
						// if (via.sms == true) {
							// console.log('Make an sms');
						// }
					// } else {
						// // Task the frequency and multiply it by 60000 (the amount of millisecons in a minute)
						// var frequencyMs = frequency * 60000;
						// window.setInterval(function() {
							// if (via.phone == true) {
								// console.log('Make a phone call');
							// }
							// if (via.sms == true) {
								// console.log('Make an sms');
							// }
						// }, frequencyMs);
					// }
				// }
			// }
			// // Set timeout for reminder end date/time
			// // console.log('Checking the events and tasks');)
		// };
	// };
// }, 6000);
