module.exports.route = function(app) {

	app.get('/test/session_delete', function(req, res) {
		req.session.destroy();
		res.end();
	});

	app.get('/test/session', function(req, res) {
		console.log(req.session);
		res.end();
	});

};
