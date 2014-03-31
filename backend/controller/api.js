module.exports.route = function(app) {

	app.get('/api', function(req, res) {
		res.send('/api');
	});

};
