//Create a 'complete' listener for the sign in
_socketConnection.on('create_task_complete', function(data) {
	if (!data.error) {
		_socketConnection.emit('read_tasks');
	}

});

$('#task-add-input').keypress(function(event) {

	if (event.which == 13) {
		//Manipulate the data
		var title = $('#task-add-input').val();
		//Figure out how to determine category
		var category = $('#parent-category').val();
		
		if (!category) {
			//Find the actual inbox id here
			category = 'inboxid';
		}

		_socketConnection.emit('create_task', {
			'title' : title,
			'category' : category
		});
	}
});
