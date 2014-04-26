db.tasks = [];

//Create a 'complete' listener for the sign in
_socketConnection.on('create_task_complete', function(data) {
	console.log('create_task_complete');
	if (!data.error) {
	}

	db.tasks.push(data.task);

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
	console.log(data.tasks);
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
	console.log('update_task_complete');
	if (!data.error) {
	}
	
	console.log(data);
	
	_.updateWhere(db.tasks, {
		id : data.id
	}, data.task);
});

_socketConnection.on('delete_task_complete', function(data) {
	console.log('delete_task_complete');
	if (!data.error) {
	}

	_.removeWhere(db.tasks, {
		id : data.id
	});
});
