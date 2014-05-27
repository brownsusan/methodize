test.task = {};

(function() {

	var categoryId;

	_socketConnection.on('read_categories_complete', function(data) {
		categoryId = data.categories[0].id;
	});

	_socketConnection.emit('read_categories');

	var task;

	// create
	(function() {

		function test() {

			_socketConnection.removeAllListeners();

			_socketConnection.on('create_task_complete', function(data) {
				console.log('create_task_complete');
				console.log(data);
				task = data.task;
			});

			_socketConnection.emit('create_task', {
				'category': categoryId,
				'title': 'Some Evenet',
				'dueDate': new Date(),
				'reminder': [],
				'important': false,
				'note': '',
				'subtask': ''
			});

		}

		window.test.task.create = test;

	})();

	// read
	(function() {

		function test() {

			_socketConnection.removeAllListeners();

			_socketConnection.on('read_tasks_complete', function(data) {
				console.log('read_tasks_complete');
				console.log(data);
			});

			_socketConnection.emit('read_tasks');

		}

		window.test.task.readAllBySession = test;

	})();

	(function() {

		function test(categoryId) {

			console.log(categoryId);

			_socketConnection.removeAllListeners();

			_socketConnection.on('read_tasks_by_category_complete', function(data) {
				console.log('read_tasks_by_category_complete');
				console.log(data);
			});

			_socketConnection.emit('read_tasks_by_category', {
				'categoryId': categoryId
			});

		}

		window.test.task.readAllByCategory = test;

	})();

	(function() {

		function test(taskId) {

			console.log(taskId);

			_socketConnection.removeAllListeners();

			_socketConnection.on('read_task_complete', function(data) {
				console.log('read_task_complete');
				console.log(data);
			});

			_socketConnection.emit('read_task', {
				'id': taskId
			});

		}

		window.test.task.readById = test;

	})();

	// update
	(function() {

		function test() {

			_socketConnection.removeAllListeners();

			_socketConnection.on('update_task_complete', function(data) {
				console.log('update_task_complete');
				console.log(data);
			});

			_socketConnection.emit('update_task', {
				'title': 'Some Testing Title'
			});

		}

		window.test.task.update = test;

	})();

	// delete
	(function() {

		function test() {

			_socketConnection.removeAllListeners();

			_socketConnection.on('delete_task_complete', function(data) {
				console.log('delete_task_complete');
				console.log(data);
			});

			_socketConnection.emit('', {
				'id': task.id
			});

		}

		window.test.task.delete = test;

	})();


})();