db.tasks = [];

//Create a 'complete' listener for the sign in
_socketConnection.on('create_task_complete', function(data) {
	console.log('create_task_complete');
	if (!data.error) {
	}
	//TO DO : THIS CONDITIONAL NEEDS TO REPRESENT IF A TASK ALREADY EXISTS IN THE DATABASE OR NOT
	if (data.task.category) {
		_socketConnection.emit('read_tasks_by_category', {
			'categoryId' : data.task.category
		});
		// db.tasks.push(data.task);
	}
});

_socketConnection.on('read_tasks_complete', function(data) {
	console.log('read_tasks_complete');
	if (!data.error) {
	}

	while (db.tasks.length > 0) {
		db.tasks.pop();
	}

	for (var i = 0, j = data.tasks.length; i < j; i++) {
		db.tasks.push(data.tasks[i]);
	}

});

_socketConnection.on('read_task_by_id_complete', function(data) {
	console.log('read_task_by_id_complete');
	if (!data.error) {
	}

	_.where(db.tasks, {
		id : data.id
	});
	var taskDetail = new EJS({
		url : '/view/ui/taskDetail.ejs'
	}).render(data.task);
	$('.task-taskDetails').append(taskDetail);
});

_socketConnection.on('read_tasks_by_category_complete', function(data) {
	console.log('read_tasks_by_category_complete');
	if (!data.error) {
	}

	while (db.tasks.length > 0) {
		db.tasks.pop();
	}

	for (var i = 0, j = data.tasks.length; i < j; i++) {
		db.tasks.push(data.tasks[i]);
	}

});

_socketConnection.on('update_task_complete', function(data) {
	console.log('ERROR: ' + data.error);
	console.log('MESSAGE: ' + data.message);
	console.log('TASK FRONT END MODEL: ' + data.task);
	console.log('update_task_complete');
	console.log(data.error);
	if (!data.error) {
	}

	_.updateWhere(db.tasks, {
		id : data.task.id
	}, data.task);
});

_socketConnection.on('update_subtask_complete', function(data) {
	console.log('update_subtask_complete');

	if (!data.error) {
	}

	_.updateWhere(db.tasks, {
		id : data.task.id
	}, data.task);

});

_socketConnection.on('delete_task_complete', function(data) {
	console.log('delete_task_complete');
	if (!data.error) {
	}

	_.removeWhere(db.tasks, {
		id : data.id
	});
	
	$('.taskDetail-container').hide();
	$('.taskEdit-container').hide();
});
