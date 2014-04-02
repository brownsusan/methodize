module.exports.route = function(app) {

	app.get('/calendar/week', function(req, res) {
		res.render('week');
	});

	app.get('/calendar/month', function(req, res) {
		res.render('month');
	});

};
