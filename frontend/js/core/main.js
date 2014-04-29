// Turn off caching
EJS.config({
	cache : false
});

$(document).ready(function() {
	$('#tab-container').easytabs();
	$('.datetimepicker').datetimepicker();
	var defaultCategory = $('#user-default-category').val();
	_socketConnection.emit('read_tasks_by_category', {'categoryId' : defaultCategory});
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

$('#addSubtask_input').keypress(function() {
	if (event.which == 13) {
		var data = {
			'id' : uuid.v4(),
			'title' : $(this).val(),
			'open' : true
		}

		var subtask = new EJS({
			url : '/view/ui/subtask.ejs'
		}).render(data);

		$('#addPanel_addTask .subtasks').append(subtask);

	}
});