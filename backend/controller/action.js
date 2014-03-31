module.exports.route = function(app) {

	app.get('/action', function(req, res) {
		res.send('/action');
	});

};
