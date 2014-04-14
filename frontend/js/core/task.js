//Create a 'complete' listener for the sign in
_socketConnection.on('create_task_complete', function(data) {
	if (!data.error) {
		_socketConnection.emit('read_tasks');
	}

});

_.observe(db.tasks, function() {

	$('.task-list').empty();
	
	for (var i = 0, j = db.tasks.length; i < j; i++) {
		var task = new EJS({
			url : '/view/ui/task-item.ejs'
		}).render(db.tasks[i]);
		$('.task-list').append(task);
	};
	
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
