_socketConnection.on('create_event_complete', function(data) {
	console.log('create_event_complete');
	if (!data.error) {
	}
	//TODO : THIS CONDITIONAL NEEDS TO REPRESENT IF A TASK ALREADY EXISTS IN THE DATABASE OR NOT
	// if (data.task.category) {
		// _socketConnection.emit('read_tasks_by_category', {
			// 'categoryId' : data.task.category
		// });
		// // db.tasks.push(data.task);
	// }
}); 