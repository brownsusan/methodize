test.event = {};

(function() {

	var categoryId;

	_socketConnection.on('read_categories_complete', function(data) {
		categoryId = data.categories[0].id;		
	});

	_socketConnection.emit('read_categories');

	var event;

	// create
	(function() {

		function test() {

			_socketConnection.removeAllListeners();

			_socketConnection.on('create_event_complete', function(data) {
				console.log('create_event_complete');
				console.log(data);
				event = data.event;
			});

			_socketConnection.emit('create_event', {
				'category': categoryId,
				'title': 'Some Event',
				'startDate': new Date(),
				'endDate': new Date(),
				'allDay': false,
				'reminder': [],
				'important': false,
				'note': '',
				'subtask': ''
			});

		}

		window.test.event.create = test;

	})();

	// read
	(function() {

		function test() {

			_socketConnection.removeAllListeners();

			_socketConnection.on('read_events_complete', function(data) {
				console.log('read_events_complete');
				console.log(data);
			});

			_socketConnection.emit('read_events');

		}

		window.test.event.readAllBySession = test;

	})();

	(function() {

		function test(eventId) {

			console.log(eventId);

			_socketConnection.removeAllListeners();

			_socketConnection.on('read_event_complete', function(data) {
				console.log('read_event_complete');
				console.log(data);
			});

			_socketConnection.emit('read_event', {
				'id': eventId
			});

		}

		window.test.event.readById = test;

	})();

	// update
	(function() {

		function test() {

			_socketConnection.removeAllListeners();

			_socketConnection.on('update_event_complete', function(data) {
				console.log('update_event_complete');
				console.log(data);
			});

			_socketConnection.emit('update_event', {
				'id': event.id,
				'category': categoryId,
				'title': 'Some Event Update',
				'startDate': new Date(),
				'endDate': new Date(),
				'allDay': false,
				'reminder': [],
				'important': false,
				'note': '',
				'subtask': ''
			});

		}

		window.test.event.update = test;

	})();

	// delete
	(function() {

		function test() {

			_socketConnection.removeAllListeners();

			_socketConnection.on('delete_event_complete', function(data) {
				console.log('delete_event_complete');
				console.log(data);
			});

			_socketConnection.emit('delete_event', {
				'id': event.id
			});

		}

		window.test.event.delete = test;

	})();


})();