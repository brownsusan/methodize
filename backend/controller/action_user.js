// Require needed libraries
var blueimpMd5 = require('blueimp-md5');
var mongoose = require('mongoose');

var md5 = blueimpMd5.md5;

module.exports.route = function(app) {

	app.get('/action/signout', function(req, res) {
		req.session.destroy();
		res.redirect('/');
	});

};
