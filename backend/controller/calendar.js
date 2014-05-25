module.exports.route = function(app) {

	app.get('/calendar', function(req, res) {

		// check if the user is logged in
		if (req.session.user === undefined) {
			res.redirect('/');
			return;
		}

		// create the data variable to be sent to the view
		var data = {};
		data.user = req.session.user;

		res.render('calendar', data);

	});

}; 