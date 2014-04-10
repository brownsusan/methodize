// Require Libraries
var cookie = require('cookie');
var connect = require('connect');
var express = require('express');
var path = require('path');
var socketIOSession = require('socket.io-session');

var MongoStore = require('connect-mongo')(express);
//'Password' that protects the user session
var sessionSecret = 'testing';
// Set up session var (equivalent of $_SESSION in php)
var sessionStore = new MongoStore({
	'db' : 'methodize',
	'auto_reconnect' : true
});

var cookieParser = express.cookieParser(sessionSecret);

module.exports.setupExpress = function(expressServer) {

	expressServer.configure(function() {
		//Give express server everything that it will need
		expressServer.set('port', process.env.PORT || 3000);
		expressServer.set('views', path.join(_backend_root, '/view'));
		expressServer.set('view engine', 'ejs');
		expressServer.use(express.bodyParser());
		expressServer.use(express.logger('dev'));
		expressServer.use(express.json());
		expressServer.use(express.urlencoded());
		expressServer.use(express.methodOverride());
		expressServer.use(cookieParser);
		expressServer.use(express.session({
			'secret' : sessionSecret,
			'store' : sessionStore
		}));
		expressServer.use(expressServer.router);
		expressServer.use(express.static(path.join(_frontend_root)));

	});

};

module.exports.setupSocketIO = function(socketIOServer) {
	
	socketIOServer.configure(function() {
	// Give the socket IO server eveything that it will need
		socketIOServer.set('authorization', socketIOSession(cookieParser, sessionStore));

	});

}; 