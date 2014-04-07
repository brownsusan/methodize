module.exports.route = function(app) {

	app.get('/test/session', function(req, res) {
		console.log(req.session);
		res.end();
	});

};
