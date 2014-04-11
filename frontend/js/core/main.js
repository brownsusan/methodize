$(document).ready(function() {
	$('#tab-container').easytabs();
	$('#task-submit-due-date').datetimepicker();
	$('#event-submit-start-date').datetimepicker();
	$('#event-submit-end-date').datetimepicker();
});

$('.my-nav-slide').click(function() {
	$('#my-nav').animate({
		width : 'toggle'
	});
});

$('#test-add').click(function() {
	$('.add-update').toggle();
});

$('.category').click(function() {
	var parentCategoryId = $(this).children('.category-id').val();
	$('#parent-category').val(parentCategoryId);
});

var reminder = new EJS({
	url : '/view/ui/reminder.ejs'
}).render();

$('#task-add-reminder').click(function() {
	$('#reminders').append(reminder);
	$('.reminder-start-time').datetimepicker();
	$('.reminder-end-time').datetimepicker();
});

$('#task-submit').click(function() {
	console.log('ass');
	var reminders = [];
	$('#task-add-update .reminder').each(function() {
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

$('#task-submit-subtask').keypress(function() {
	if (event.which == 13) {
		var data = {
			'title' : $(this).val(),
			'open' : true
		}

		var subtask = new EJS({
			url : '/view/ui/subtask.ejs'
		}).render(data);

		$('#task-add-update .subtasks').append(subtask);

	}
});
