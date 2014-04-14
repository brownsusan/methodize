console.log('task model');

db.tasks = [];

//Create a 'complete' listener for the sign in
_socketConnection.on('create_task_complete', function(data) {
	if (!data.error) {
	}

});

_socketConnection.on('read_tasks_complete', function(data) {

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
	if (!data.error) {
	}
	_.where(db.tasks, {
		id : data.id
	});
});

_socketConnection.on('read_tasks_by_category_complete', function(data) {
	if (!data.error) {
	}
	// db.tasks = array(data.tasks);
});

_socketConnection.on('update_task_complete', function(data) {
	if (!data.error) {
	}
	_.updateWhere(db.tasks, {
		id : data.id
	}, data.task);
});

_socketConnection.on('delete_task_complete', function(data) {
	if (!data.error) {
	}
	_.removeWhere(db.tasks, {
		id : data.id
	});
});
