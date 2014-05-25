_socketConnection.on('create_event_complete', function(data) {

	console.log('on create_event_complete');

	if (!data.error) {

	}

	// TODO
	// emit sends objects, not functions
	_socketConnection.emit('read_task_and_events', function(data) {

	});

});

