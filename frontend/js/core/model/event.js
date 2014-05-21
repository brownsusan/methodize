_socketConnection.on('create_event_complete', function(data) {
	console.log('create_event_complete');
	if (!data.error) {
	}
	_socketConnection.emit('read_task_and_events', function(data){
		
	});
}); 

// _socketConnection.on('update_event_complete', function(data) {
	// if (!data.error) {
	// }
	// $('.eventEdit-container').fadeOut(500, function() {
		// setFields(data.updatedEvent);
		// $('.eventDetail-container').fadeIn(500);
	// });
	// _socketConnection.emit('read_task_and_events', function(data){
// 		
	// });
// });