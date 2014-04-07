module.exports.route = function(app) {

	app.get('/landing', function(req, res) {
		res.render('landing');
	});

};
