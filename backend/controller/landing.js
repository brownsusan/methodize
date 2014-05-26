module.exports.route = function(app) {

	app.get('/', function(req, res) {

		console.log(req.session);

		res.render('landing');
		
	});

};
