//Create a 'complete' listener for the sign in
// triggers when the db.tasks updates
_.observe(db.tasks, function() {
	console.log('heyo');
	$('.task-task-list').empty();
	$('.task-completedTask-list').empty();

	for (var i = 0, j = db.tasks.length; i < j; i++) {
		if (db.tasks[i].completed === false) {
			var task = new EJS({
				url : '/view/ui/task-item.ejs'
			}).render(db.tasks[i]);
			$('.task-task-list').append(task);
		}
		if (db.tasks[i].completed === true) {
			var task = new EJS({
				url : '/view/ui/task-item.ejs'
			}).render(db.tasks[i]);
			$('.task-completedTask-list').append(task);
		}
	};

});

// triggers when adding a new task to a category
$('#task_taskAdd_input').keypress(function(event) {

	if (event.which == 13) {
		//Manipulate the data
		var title = $('#task_taskAdd_input').val();
		//Figure out how to determine category
		var category = $('#parent-category').val();

		if (!category) {
			//Find the actual inbox id here
			category = $('#user-default-category').val();
			;
		}

		_socketConnection.emit('create_task', {
			'title' : title,
			'category' : category
		});
	}
});

// triggers when clicking a task item to view it's details
$(document).on('click', '.task-item', function() {
	var id = $(this).find('.task-item-id').val();

	var tasks = _(db.tasks).where({
		'id' : id
	});

	var task = tasks[0];

	$('#taskDetail_id_input').attr("value", task.id);
	$('#taskDetail_title').html(task.title);
	$('#taskDetail_dueDate').html(task.dueDate);

	// show reminders
	$('#taskDetail_reminders_container').empty();
	var reminders = task.reminder;
	if (reminders === undefined) {
		console.log('ass');
	} else {
		for (var i = 0, j = reminders.length; i < j; i++) {
			reminders[i]
			var reminder = new EJS({
				url : '/view/ui/reminder-display.ejs'
			}).render(reminders[i]);
			$('#taskDetail_reminders_container').append(reminder);

		};
	}

	$('#taskDetail_important_input').attr("checked", task.important);

	// show subtasks
	$('.subtasks').empty();
	var subtasks = task.subtask;
	if (subtasks === undefined) {
		console.log('ass');
	} else {
		for (var i = 0, j = subtasks.length; i < j; i++) {
			subtasks[i]
			var subtask = new EJS({
				url : '/view/ui/subtask.ejs'
			}).render(subtasks[i]);
			$('.subtasks').append(subtask);
		};
	}
	$('#taskDetail_note_textarea').html(task.note);

	$('.taskDetail-container').toggle();
	$('.taskEdit-container').hide();

});

//When The Edit Button Is Clicked
$(document).on('click', '#taskDetail_editTask_button', function() {

	var id = $('#taskDetail_id_input').val();

	// get the task from the client side model
	var tasks = _(db.tasks).where({
		'id' : id
	});

	var task = tasks[0];

	$('#taskEdit_id_input').val(task.id);
	$('#taskEdit_title_input').val(task.title);
	// TODO
	// $('#taskEdit_dueDate_input').datetimepicker();

	// show reminders
	$('#taskEdit_reminders_container').empty();
	var reminders = task.reminder;
	for (var i = 0, j = reminders.length; i < j; i++) {
		var reminder = new EJS({
			url : '/view/ui/reminder-display.ejs'
		}).render(reminders[i]);
		$('#taskEdit_reminders_container').append(reminder);
	}

	// show categories
	$('#taskEdit_category_select').empty();
	var categories = db.categories;
	for (var i = 0, j = categories.length; i < j; i++) {
		var category = '<option value="' + categories[i].id + '">' + categories[i].title + '</option>';
		$('#taskEdit_category_select').append(category);
	}

	$('#taskEdit_important_input').attr('checked', task.important);

	// show subtasks
	$('.subtasks').empty();
	var subtasks = task.subtask;
	for (var i = 0, j = subtasks.length; i < j; i++) {
		var subtask = new EJS({
			url : '/view/ui/subtask.ejs'
		}).render(subtasks[i]);
		$('.task-edit .subtasks').append(subtask);
	}

	$('#taskEdit_note_textarea').html(task.note);

	$('.taskDetail-container').hide();
	$('.taskEdit-container').show();

});

//When The Save Button Is Clicked
$(document).on('click', '#taskEdit_updateTask_button', function() {

	var id = $('#taskEdit_id_input').val();

	var reminders = [];

	$('.taskEdit-container .reminder').each(function() {

		var via = [];

		if ($(this).find('.via-email-input').is(":checked")) {
			via.push('email');
		}

		if ($(this).find('.via-call-input').is(":checked")) {
			via.push('call');
		}

		if ($(this).find('.via-sms-input').is(":checked")) {
			via.push('sms');
		}

		var reminder = {
			startDate : $('.reminder-startTime-input').val(),
			endDate : $('.reminder-endTime-input').val(),
			frequency : $('.reminder-frequency-select').val(),
			via : via
		};

		reminders.push(reminder);

	});

	var subtasks = [];

	$('#addPanel_addTask .subtasks li').each(function() {
		var subtask = {
			title : $(this).find('.subtask-title').html(),
			completed : $(this).find('.subtask-completed').prop('checked')
		};
		subtasks.push(subtask);
	});

	var title = $('#taskEdit_title_input').val();
	var dueDate = $('#taskEdit_dueDate_input').val();
	var category = $('#taskEdit_category_select').val();
	var important = $('#taskEdit_important_input').val();
	var note = $('#taskEdit_note_textarea').html();

	//Validation

	_socketConnection.emit('update_task', {
		'id' : id,
		'title' : title,
		'dueDate' : dueDate,
		'reminder' : reminders,
		'category' : category,
		'important' : important,
		'subtask' : subtasks,
		'note' : note
	});

});
// When an item is deleted
$(document).on('click', '.task-item-delete', function(event) {
	var id = $(this).closest('.task-item').find('.task-item-id').val();
	_socketConnection.emit('delete_task', {
		'id' : id
	});
});

// When a task is checked off
$(document).on('click', 'input[type=checkbox]', function(event) {
	var id = $(this).closest('.task-item').find('.task-item-id').val();
	var completed = $(this).is(":checked");
	console.log(completed);
	_socketConnection.emit('update_task', {
		'id' : id,
		'completed' : completed
	});
});
