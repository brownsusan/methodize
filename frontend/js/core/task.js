//Create a 'complete' listener for the sign in
// triggers when the db.tasks updates
_.observe(db.tasks, function() {

	$('.task-list').empty();

	for (var i = 0, j = db.tasks.length; i < j; i++) {
		var task = new EJS({
			url : '/view/ui/task-item.ejs'
		}).render(db.tasks[i]);
		$('.task-list').append(task);
	};

});

// triggers when adding a new task to a category
$('#task-add-input').keypress(function(event) {

	if (event.which == 13) {
		//Manipulate the data
		var title = $('#task-add-input').val();
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
	var id = $(this).find('.task-id').val();

	var tasks = _(db.tasks).where({
		'id' : id
	});

	var task = tasks[0];

	$('#task-detail-id').attr("value", task.id);
	$('#task-detail-title').html(task.title);
	$('#task-detail-due-date').html(task.dueDate);

	// show reminders
	$('#task-detail-reminders').empty();
	var reminders = task.reminder;
	if (reminders === undefined) {
		console.log('ass');
	} else {
		for (var i = 0, j = reminders.length; i < j; i++) {
			reminders[i]
			var reminder = new EJS({
				url : '/view/ui/reminder-display.ejs'
			}).render(reminders[i]);
			$('#task-detail-reminders').append(reminder);

		};
	}

	$('#task-detail-important').attr("checked", task.important);

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
	$('#task-detail-notes').html(task.note);

	$('.task-details').toggle();
	$('.task-edit').hide();

});

//When The Edit Button Is Clicked
$(document).on('click', '#task-edit-button', function() {

	var id = $('#task-detail-id').val();

	// get the task from the client side model
	var tasks = _(db.tasks).where({
		'id' : id
	});

	var task = tasks[0];

	$('#task-edit-id').val(task.id);
	$('#task-edit-title').val(task.title);
	// TODO
	// $('#task-edit-due-date').datetimepicker();

	// show reminders
	$('#task-edit-reminders').empty();
	var reminders = task.reminder;
	for (var i = 0, j = reminders.length; i < j; i++) {
		var reminder = new EJS({
			url : '/view/ui/reminder-display.ejs'
		}).render(reminders[i]);
		$('#task-edit-reminders').append(reminder);
	}

	// show categories
	$('#task-edit-category').empty();
	var categories = db.categories;
	for (var i = 0, j = categories.length; i < j; i++) {
		var category = '<option value="' + categories[i].id + '">' + categories[i].title + '</option>';
		$('#task-edit-category').append(category);
	}

	$('#task-edit-important').attr('checked', task.important);

	// show subtasks
	$('.subtasks').empty();
	var subtasks = task.subtask;
	for (var i = 0, j = subtasks.length; i < j; i++) {
		var subtask = new EJS({
			url : '/view/ui/subtask.ejs'
		}).render(subtasks[i]);
		$('.task-edit .subtasks').append(subtask);
	}

	$('#task-edit-notes').html(task.note);

	$('.task-details').hide();
	$('.task-edit').show();

});

//When The Save Button Is Clicked
$(document).on('click', '#task-edit-submit', function() {

	var id = $('#task-edit-id').val();

	var reminders = [];

	$('.task-edit .reminder').each(function() {

		var via = [];

		if ($(this).find('.via-email').is(":checked")) {
			via.push('email');
		}

		if ($(this).find('.via-call').is(":checked")) {
			via.push('call');
		}

		if ($(this).find('.via-sms').is(":checked")) {
			via.push('sms');
		}

		var reminder = {
			startDate : $('.reminder-start-time').val(),
			endDate : $('.reminder-end-time').val(),
			frequency : $('.reminder-frequency').val(),
			via : via
		};

		reminders.push(reminder);

	});

	var subtasks = [];

	$('#task-add-update .subtasks li').each(function() {
		var subtask = {
			title : $(this).find('.subtask-title').html(),
			completed : $(this).find('.subtask-completed').prop('checked')
		};
		subtasks.push(subtask);
	});

	var title = $('#task-edit-title').val();
	var dueDate = $('#task-edit-due-date').val();
	var category = $('#task-edit-category').val();
	var important = $('#task-edit-important').val();
	var note = $('#task-edit-notes').html();

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

$(document).on('click', '.task-delete', function(event) {
	console.log('click dick');
	var id = $(this).closest('.task-item').find('.task-id').val();
	_socketConnection.emit('delete_task', {
		'id' : id
	});
});
