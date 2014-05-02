module.exports.route = function(app) {

	app.get('/calendar/day', function(req, res) {
		res.render('day');
	});

	app.get('/calendar/month', function(req, res) {
		res.render('month');
	});
	
	app.get('/calendar', function(req, res) {
		res.render('calendar');
	});

};
