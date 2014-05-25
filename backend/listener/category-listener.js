// dev libraries
var chalk = require('chalk');
var logger = require('tracer').console();

// Require needed libraries
var mongoose = require('mongoose');

// Get the appropriate db model
var CategoryModel = mongoose.model('Category');
var TaskModel = mongoose.model('Task');

module.exports.setup = function(socketServer, userSocket) {

	// Get the session
	var session = userSocket.handshake.session;

	// create
	userSocket.on('create_category', function(data) {

		console.log('socket create_category');

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var title = data.title;

		var category = new CategoryModel();
		category.userId = userId;
		category.title = title;

		category.save(function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('create_category_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			userSocket.emit('create_category_complete', {
				// Send error as part of data
				'error' : false
			});

		});

	});

	// read
	userSocket.on('read_categories', function(data) {

		console.log('socket read_categories');

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		CategoryModel.find({
			'userId' : userId
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('read_categories_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			userSocket.emit('read_categories_complete', {
				// Send error as part of data
				'error' : false,
				'categories' : results
			});

		});

	});

	// update
	userSocket.on('update_category', function(data) {

		console.log('socket update_category');

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var id = data.id;
		var title = data.title;

		CategoryModel.findOne({
			'id' : id
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('update_category_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			results.title = title;
			results.save();

			userSocket.emit('update_category_complete', {
				// Send error as part of data
				'error' : false
			});

		});

	});

	// delete
	userSocket.on('delete_category', function(data) {

		console.log('socket delete_category');

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var id = data.id;

		CategoryModel.remove({
			'id' : id,
			'userId' : userId
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('delete_category_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			TaskModel.remove({
				'category' : id,
				'userId' : userId
			}, function(err, results) {

				if (err || !results) {
					logger.log(chalk.bgRed('ERROR'));
					userSocket.emit('delete_category_complete', {
						// Send error as part of data
						'error' : true
					});
					return;
				}

				userSocket.emit('delete_category_complete', {
					// Send error as part of data
					'error' : false
				});

			});

		});

	});
};

