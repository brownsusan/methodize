test.category = {};

(function() {

	var category;

	// create
	(function() {

		function test() {

			_socketConnection.removeAllListeners();

			_socketConnection.on('create_category_complete', function(data) {
				console.log('create_category_complete');
				console.log(data);
				category = data.category;
			});

			_socketConnection.emit('create_category', {
				'title': 'Some Category'
			});

		}

		window.test.category.create = test;

	})();

	// read
	(function() {

		function test() {

			_socketConnection.removeAllListeners();

			_socketConnection.on('read_categories_complete', function(data) {
				console.log('read_categories_complete');
				console.log(data);
			});

			_socketConnection.emit('read_categories');

		}

		window.test.category.read = test;

	})();

	// update
	(function() {

		function test() {

			_socketConnection.removeAllListeners();

			_socketConnection.on('update_category_complete', function(data) {
				console.log('update_category_complete');
				console.log(data);
			});

			_socketConnection.emit('update_category', {
				'id': category.id,
				'title': 'Some Category Update'
			});

		}

		window.test.category.update = test;

	})();

	// delete
	(function() {

		function test() {

			_socketConnection.removeAllListeners();

			_socketConnection.on('delete_category_complete', function(data) {
				console.log('delete_category_complete');
				console.log(data);
			});

			_socketConnection.emit('delete_category', {
				'id': category.id
			});

		}

		window.test.category.delete = test;

	})();

})();