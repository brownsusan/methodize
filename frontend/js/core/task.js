//Create a 'complete' listener for the sign in
_socketConnection.on('create_task_complete', function(data) {
	if (!data.error) {
		console.log('no errors mama');
	}

});

$('#task-add-input').keypress(function() {

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

$('#task-submit').click(function() {
	var reminders = [];
	$('.reminder').each(function() {
		var via = [];
		if ($('.via-email').attr("checked")) {
			via.push('email');
		}
		if ($('.via-call').attr("checked")) {
			via.push('call');
		}
		if ($('.via-sms').attr("checked")) {
			via.push('sms');
		}
		var reminder = {};
		reminder.startDate = $('.reminder-start-time').val();
		reminder.endDate = $('.reminder-end-time').val();
		reminder.frequency = $('.reminder-frequency').val();
		reminder.via = [];
		reminders.push(reminder);
	});

	var subtasks = [];
	$('.subtasks li').each(function() {
		var subtask = {};
		subtask.title = $('.subtask-title').val();
		subtask.open = $('.subtask-open').val();
		subtasks.push(subtask);
	});

	var title = $('#task-submit-title').val();
	var dueDate = $('#task-submit-due-date').val();
	var category = $('#task-submit-category').val();
	var important = $('#task-submit-important').val();
	var note = $('#task-submit-note').val();

	//Validation

	_socketConnection.emit('create_task', {
		'title' : title,
		'dueDate' : dueDate,
		'reminder' : reminders,
		'category' : category,
		'important' : important,
		'subtask' : subtasks,
		'note' : note
	});
});
