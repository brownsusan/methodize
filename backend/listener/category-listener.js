// Require Mongoose
var mongoose = require('mongoose');
// Get the appropriate db model
var CategoryModel = mongoose.model('Category');

module.exports.setup = function(socketServer, userSocket) {
	// Get the session
	var session = userSocket.handshake.session;
	// Set up an event listener
	userSocket.on('create_category', function(data) {
		console.log('emit');
		var category = new CategoryModel();
		category.userId = session.user.id;
		category.title = data.title;
		category.color = data.color;

		category.save(function(err, results) {

			if (err || !results) {
				userSocket.emit('create_category_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			userSocket.emit('create_category_complete', {
				// Send an error as part of data
				'error' : false
			});

		});
	});

	userSocket.on('read_categories', function(data) {
		if (session.user === undefined) {
			return;
		}
		var userId = session.user.id;
		CategoryModel.find({
			'userId' : userId
		}, function(err, results) {
			if (err || !results) {
				userSocket.emit('read_categories_complete', {
					// Send error as part of data
					'error' : true
				});
				return;
			}

			userSocket.emit('read_categories_complete', {
				// Send an error as part of data
				'error' : false,
				'categories' : results
			});

		});
	});

	userSocket.on('update_category', function(data) {
		if (session.user === undefined) {
			return;
		}
	});

	userSocket.on('delete_category', function(data) {
		if (session.user === undefined) {
			return;
		}
	});
};

