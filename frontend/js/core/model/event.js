_socketConnection.on('create_event_complete', function(data) {
	console.log('create_event_complete');
	if (!data.error) {
	}
	_socketConnection.emit('read_task_and_events', function(data){
		
	});
});

