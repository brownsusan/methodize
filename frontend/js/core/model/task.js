db.tasks = [];

//Create a 'complete' listener for the sign in

// create
_socketConnection.on('create_task_complete', function(data) {

	console.log('on create_task_complete');

	// check if an error occured
	if (data.error) {
		return;
	}

	//TO DO : THIS CONDITIONAL NEEDS TO REPRESENT IF A TASK ALREADY EXISTS IN THE DATABASE OR NOT
	if (data.task.category) {
		_socketConnection.emit('read_tasks_by_category', {
			'categoryId' : data.task.category
		});
		// db.tasks.push(data.task);
	}

});

// read
_socketConnection.on('read_tasks_complete', function(data) {

	console.log('on read_tasks_complete');

	// check if an error occured
	if (data.error) {
		return;
	}

	while (db.tasks.length > 0) {
		db.tasks.pop();
	}

	for (var i = 0, j = data.tasks.length; i < j; i++) {
		db.tasks.push(data.tasks[i]);
	}

});

_socketConnection.on('read_task_by_id_complete', function(data) {

	console.log('on read_task_by_id_complete');

	// check if an error occured
	if (data.error) {
		return;
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

	console.log('on read_tasks_by_category_complete');

	// check if an error occured
	if (data.error) {
		return;
	}

	while (db.tasks.length > 0) {
		db.tasks.pop();
	}

	for (var i = 0, j = data.tasks.length; i < j; i++) {
		db.tasks.push(data.tasks[i]);
	}

});

// update
_socketConnection.on('update_task_complete', function(data) {

	console.log('on update_task_complete');

	// check if an error occured
	if (data.error) {
		return;
	}

	$('.taskEdit-container').fadeOut(500, function() {
		// TODO
		// update fields
		setFields(data.task);
		$('.taskDetail-container').fadeIn(500);
	});

	_socketConnection.emit('read_all_task_event_by_user', function(data) {
	});

	_.updateWhere(db.tasks, {
		id : data.task.id
	}, data.task);

});

_socketConnection.on('update_subtask_complete', function(data) {

	console.log('on update_subtask_complete');

	// check if an error occured
	if (data.error) {
		return;
	}

	_.updateWhere(db.tasks, {
		id : data.task.id
	}, data.task);

});

// delete
_socketConnection.on('delete_task_complete', function(data) {

	console.log('on delete_task_complete');

	// check if an error occured
	if (data.error) {
		return;
	}

	_.removeWhere(db.tasks, {
		id : data.id
	});

	$('.taskDetail-container').hide();
	$('.taskEdit-container').hide();

});
