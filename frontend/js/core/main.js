// Turn off caching
EJS.config({
	cache : false
});

// window.setInterval(function() {checkEventsAndTasks()},3000);

var checkEventsAndTasks = function() {
	console.log('Checking the events and tasks');
}

$(document).ready(function() {
	$('#tab-container').easytabs();
	$('.datetimepicker').datetimepicker();
	var defaultCategory = $('#user-default-category').val();
	_socketConnection.emit('read_tasks_by_category', {
		'categoryId' : defaultCategory
	});
	_socketConnection.emit('read_categories');
});

var db = {};

$('#nav_slider').click(function() {
	$('nav').animate({
		width : 'toggle'
	});
});

$('#test-add').click(function() {
	$('.addPanel-container').toggle();
});

$(document).on('click', '.category', function() {

	var parentCategoryId = $(this).find('.category-id').val();
	$('#parent-category').val(parentCategoryId);

	_socketConnection.emit('read_tasks_by_category', {
		'categoryId' : parentCategoryId
	});

});

var reminder = new EJS({
	url : '/view/ui/reminder.ejs'
}).render();

$('#addPanel_addTask_addReminder_button').click(function() {
	$('#addPanel_addTask_reminders_container').append(reminder);
	$('.reminder-startTime-input').datetimepicker();
	$('.reminder-endTime-input').datetimepicker();
});

$('#addPanel_addTask_submit_button').click(function() {
	var reminders = [];
	$('#addPanel_addTask .reminder').each(function() {
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
			start : $('.reminder-startTime-input').val(),
			end : $('.reminder-endTime-input').val(),
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

	var title = $('#addPanel_addTask_title_input').val();
	var dueDate = $('#addPanel_addTask_dueDate_input').val();
	var category = $('#addPanel_addTask_category_select').val();
	var important = $('#addPanel_addTask_important_input').val();
	var frequency = $('#addPanel_addTask').find('.reminder-frequency-select').val();
	var note = $('#addPanel_addTask_note_textarea').val();

	//Validation

	_socketConnection.emit('create_task', {
		'title' : title,
		'dueDate' : dueDate,
		'reminder' : reminders,
		'category' : category,
		'important' : important,
		'subtask' : subtasks,
		'frequency' : frequency,
		'note' : note
	});
});

$('#addPanel_addEvent_addReminder_button').click(function() {
	console.log('Add a Reminder to an Event');
	$('#addPanel_addEvent_reminders_container').append(reminder);
	$('.reminder-startTime-input').datetimepicker();
	$('.reminder-endTime-input').datetimepicker();
});

$('#addPanel_addEvent_submit_button').click(function() {
	console.log('Add Event From Panel');
	var reminders = [];
	$('#addPanel_addEvent .reminder').each(function() {
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
			start : $('.reminder-startTime-input').val(),
			end : $('.reminder-endTime-input').val(),
			frequency : $('.reminder-frequency-select').val(),
			via : via
		};
		reminders.push(reminder);
	});

	var subtasks = [];
	$('#addPanel_addEvent .subtasks li').each(function() {
		var subtask = {
			title : $(this).find('.subtask-title').html(),
			completed : $(this).find('.subtask-completed').prop('checked')
		};
		subtasks.push(subtask);
	});

	var title = $('#addPanel_addEvent_title_input').val();
	var startDate = $('#addPanel_addEvent_startDate_input').val();
	var endDate = $('#addPanel_addEvent_endDate_input').val();
	var allDay = $('#addPanel_addEvent_allDay_input').is(":checked");
	var category = $('#addPanel_addEvent_category_select').val();
	var important = $('#addPanel_addEvent_important_input').is(":checked");
	var frequency = $('#addPanel_addEvent').find('.reminder-frequency-select').val();
	var note = $('#addPanel_addEvent_note_textarea').val();

	//Validation
	_socketConnection.emit('create_event', {
		'title' : title,
		'startDate' : startDate,
		'endDate' : endDate,
		'allDay' : allDay,
		'reminder' : reminders,
		'category' : category,
		'important' : important,
		'subtask' : subtasks,
		'frequency' : frequency,
		'note' : note
	});

});

$(document).on('keypress', '.addSubtask_input', function(event) {
	if (event.which == 13) {
		var data = {
			'id' : uuid.v4(),
			'title' : $(this).val(),
			'open' : true
		}

		var subtask = new EJS({
			url : '/view/ui/subtask.ejs'
		}).render(data);

		$(this).next('.subtasks').append(subtask);
	}
});
