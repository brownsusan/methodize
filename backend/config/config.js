var cookie = require('cookie');
var connect = require('connect');
var express = require('express');
var path = require('path');
var socketIOSession = require('socket.io-session');

// var MongoStore = require('connect-mongo')(express);
// 
var sessionSecret = 'testing';
// var sessionStore = new MongoStore({
	// 'db' : '',
	// 'auto_reconnect' : true
// });

var cookieParser = express.cookieParser(sessionSecret);

module.exports.setupExpress = function(server) {

	server.configure(function() {

		server.set('port', process.env.PORT || 3000);
		server.set('views', path.join(_backend_root, '/view'));
		server.set('view engine', 'ejs');
		server.use(express.bodyParser());
		server.use(express.logger('dev'));
		server.use(express.json());
		server.use(express.urlencoded());
		server.use(express.methodOverride());
		server.use(cookieParser);
		// server.use(express.session({
			// 'secret' : sessionSecret,
			// 'store' : sessionStore
		// }));
		server.use(server.router);
		server.use(express.static(path.join(_frontend_root)));

	});

};

module.exports.setupSocketIO = function(server) {

	server.configure(function() {

		// server.set('authorization', socketIOSession(cookieParser, sessionStore));

	});

};