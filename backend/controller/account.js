module.exports.route = function(app) {

	app.get('/account', function(req, res) {
		res.render('account');
	});

};
