//Create a 'complete' listener for the sign in

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
			category = $('#user-default-category').val();
			;
		}

		_socketConnection.emit('create_task', {
			'title' : title,
			'category' : category
		});
	}
});

$(document).on('click', '.task-item', function() {
	console.log('clicking');
	var id = $(this).find('.task-id').val();
	_socketConnection.emit('read_task_by_id', {
		'id' : id
	});
});

$(document).on('click', '#task-edit-button', function() {
	$('.task-details').hide();
	$('.task-edit').show();
});

$(document).on('click', '#task-edit-submit', function() {
	var id = $(this).closest('.task-id').val();
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

	var title = $('#task-submit-title').val();
	var dueDate = $('#task-submit-due-date').val();
	var category = $('#task-submit-category').val();
	var important = $('#task-submit-important').val();
	var note = $('#task-submit-note').val();

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