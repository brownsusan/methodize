module.exports.route = function(app) {

	app.get('/task', function(req, res) {
		res.render('task');
	});

};
