module.exports.route = function(app) {

	app.get('/calendar/week', function(req, res) {
		res.send('/calendar/week');
	});

	app.get('/calendar/month', function(req, res) {
		res.send('/calendar/month');
	});

};
