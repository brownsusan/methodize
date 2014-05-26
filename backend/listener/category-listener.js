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

		// data must include
		// title

		console.log('socket create_category');
		console.log(data);

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
					'error': true
				});
				return;
			}

			socketServer.sockets.in(userId).emit('create_category_complete', {
				// Send error as part of data
				'error': false,
				'category': category
			});

		});

	});

	// read
	userSocket.on('read_categories', function(data) {

		// data must include
		// ---- nothing

		console.log('socket read_categories');
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		CategoryModel.find({
			'userId': userId
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('read_categories_complete', {
					// Send error as part of data
					'error': true
				});
				return;
			}

			userSocket.emit('read_categories_complete', {
				// Send error as part of data
				'error': false,
				'categories': results
			});

		});

	});

	// update
	userSocket.on('update_category', function(data) {

		// data must include
		// id
		// title

		console.log('socket update_category');
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var id = data.id;
		var title = data.title;

		CategoryModel.findOne({
			'id': id
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('update_category_complete', {
					// Send error as part of data
					'error': true
				});
				return;
			}

			results.title = title;
			results.save();

			socketServer.sockets.in(userId).emit('update_category_complete', {
				// Send error as part of data
				'error': false
			});

		});

	});

	// delete
	userSocket.on('delete_category', function(data) {

		// data must include
		// id

		console.log('socket delete_category');
		console.log(data);

		// check if user is logged in
		if (session.user === undefined) {
			return;
		}

		var userId = session.user.id;

		var id = data.id;

		CategoryModel.remove({
			'id': id,
			'userId': userId
		}, function(err, results) {

			if (err || !results) {
				logger.log(chalk.bgRed('ERROR'));
				userSocket.emit('delete_category_complete', {
					// Send error as part of data
					'error': true
				});
				return;
			}

			TaskModel.remove({
				'category': id,
				'userId': userId
			}, function(err, results) {

				if (err) {
					logger.log(chalk.bgRed('ERROR'));
					userSocket.emit('delete_category_complete', {
						// Send error as part of data
						'error': true
					});
					return;
				}

				if (!results) {
					logger.log(chalk.bgYellow('NO TASKS FOUND TO DELETE'));
					return;
				}

				socketServer.sockets.in(userId).emit('delete_category_complete', {
					// Send error as part of data
					'error': false
				});

			});

		});

	});
};