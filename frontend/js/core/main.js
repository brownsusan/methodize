// Turn off caching
EJS.config({
	cache : false
});

_socketConnection.on('update_event_complete', function(data) {
	if (data.error) {
		alert(data.message);
		return;
	}
	if (!data.error) {
		var id = data.updatedEvent.id;
		if (id) {
			_socketConnection.emit('read_event', {
				'id' : id
			});
		}

		_socketConnection.on('read_event_complete', function(data) {
			console.log(data.error);
			console.log(data.readEvent[0]);
			var calEvent = {
				'id' : data.readEvent[0].id,
				'title' : data.readEvent[0].title,
				'start' : data.readEvent[0].startDate,
				'end' : data.readEvent[0].endDate,
				'color' : data.readEvent[0].categoryObject.color,
				'category' : data.readEvent[0].categoryObject.title,
				'categoryId' : data.readEvent[0].category,
				'important' : data.readEvent[0].important,
				'allDay' : data.readEvent[0].allDay,
				'reminder' : data.readEvent[0].reminder,
				'subtasks' : data.readEvent[0].subtask,
				'note' : data.readEvent[0].note,
				'modelType' : data.readEvent[0].modelType
			};

			$('.eventEdit-container').fadeOut(500, function() {
				$('.eventDetail-container').fadeIn(500);
				setFields(calEvent);
			});
		});

		_socketConnection.emit('read_all_task_event_by_user');
	}
});

_socketConnection.on('update_user_complete', function(data) {
	$('#account_info_edit').fadeOut(500, function() {
		// TODO
		// Reset fields with jquery selector
		$('#account_info_display').fadeIn();
	});
});

$(document).ready(function() {
	$('#tab-container').easytabs();
	$('.datetimepicker').datetimepicker();
	var defaultCategory = $('#user-default-category').val();
	$('.task-pageHeading').html('Inbox');
	_socketConnection.emit('read_tasks_by_category', {
		'categoryId' : defaultCategory
	});

	_socketConnection.emit('read_categories');
});

var db = {};
$('#nav_container').click(function(event) {
	// if nav is open - close it
	if ($('#nav_container').css('left') == '0px') {
		closeNav();
	}
	// if nav if closed - open it
	else {
		closeAdd();
		closeDetails();
		openNav();
	}
}).children().children().children('.nav-account-link').click(function(e) {
	return false;
});

$(document).on('click', '.category', function(event) {
	closeDetails();
	var parentCategoryId = $(this).find('.category-id').val();
	$('#parent-category').val(parentCategoryId);
	$('.task-pageHeading').html($(this).find('.category-title').html());
	_socketConnection.emit('read_tasks_by_category', {
		'categoryId' : parentCategoryId
	});
});

$('#addPanel_addTask_addReminder_button').click(function() {
	var reminder = new EJS({
		url : '/view/ui/reminder.ejs'
	}).render();
	$('#addPanel_addTask_reminders_container').append(reminder);
	$('.reminder-startTime-input').datetimepicker();
	$('.reminder-endTime-input').datetimepicker();
});

$('#addPanel_addEvent_addReminder_button').click(function() {
	var reminder = new EJS({
		url : '/view/ui/reminder.ejs'
	}).render();
	$('#addPanel_addEvent_reminders_container').append(reminder);
	$('.reminder-startTime-input').datetimepicker();
	$('.reminder-endTime-input').datetimepicker();
});

$('#taskEdit_addReminder_button').click(function() {
	var reminder = new EJS({
		url : '/view/ui/reminder.ejs'
	}).render();
	$('#taskEdit_reminders_container').append(reminder);
	$('.reminder-startTime-input').datetimepicker();
	$('.reminder-endTime-input').datetimepicker();
});

$('#eventEdit_addReminder_button').click(function() {
	var reminder = new EJS({
		url : '/view/ui/reminder.ejs'
	}).render();
	$('#eventEdit_reminders_container').append(reminder);
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

$('#addPanel_addEvent_submit_button').click(function() {
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

$(document).on('keypress', '.addSubtask-input', function(event) {
	if (event.which == 13) {
		console.log('hit enter');
		var data = {
			'id' : uuid.v4(),
			'title' : $(this).val(),
			'open' : true
		}
		console.log(data);
		var subtask = new EJS({
			url : '/view/ui/subtask.ejs'
		}).render(data);

		$(this).next('.subtasks').append(subtask);
	}
});

$('.nav-account-link').click(function() {
	$('#account_container').slideToggle();
}).children('#account_container').click(function(e) {
	return false;
});

$('#account_edit_button').click(function() {
	$('#account_info_display').fadeOut(400, function() {
		$('#account_info_edit').fadeIn(500);
	});
});

$('#account_update_button').click(function() {
	var userData = {};
	userData.userId = $('#nav_userId').val();
	userData.phone = $('.account-update-phone').val();
	userData.email = $('.account-update-email').val();
	var newPassword = $('.account-update-newPass').val();
	var confirmNewPassword = $('.account-update-confirmNewPass').val();
	if (newPassword.length != 0 && confirmNewPassword.length != 0 && newPassword === confirmNewPassword) {
		userData.password = newPassword;
	}
	if (newPassword !== confirmNewPassword) {
		alert('Those passwords did not match. Please try again');
	}
	if (userData.phone.length == 0 || userData.email.length == 0) {
		alert('There was an issue submitting your changes. Please make sure you have entered a phone number and an email address, and a valid password');
	} else {
		_socketConnection.emit('update_user', userData);
	}
});

// 	 ####  #####  ###### #    #         #      ####  #       ####   ####  ######
// 	#    # #    # #      ##   #        #      #    # #      #    # #      #
// 	#    # #    # #####  # #  #       #       #      #      #    #  ####  #####
// 	#    # #####  #      #  # #      #        #      #      #    #      # #
// 	#    # #      #      #   ##     #         #    # #      #    # #    # #
// 	 ####  #      ###### #    #    #           ####  ######  ####   ####  ######

var openNav = function() {
	$('#nav_container').animate({
		'left' : 0
	});

	$('body').animate({
		'left' : +180
	});
};

var closeNav = function() {
	if ($('#nav_container').css('left') == '0px') {
		$('#nav_container').animate({
			'left' : -180
		});

		$('body').animate({
			'left' : 0
		}, function() {
			$('body').css('left', 'auto');
			$('body').css('right', 'auto');
		});
	}
};

var openDetails = function(calEvent) {
	// TODO
	// make the fades work
	if (calEvent.modelType === 'typeTask') {
		$('.taskDetailEdit-container').show();
		$('.taskDetail-container').show();
		$('.taskEdit-container').hide();
		$('.eventDetailEdit-container').hide();
		$('.eventDetail-container').hide();
	}

	if (calEvent.modelType === 'typeEvent') {
		$('.eventDetailEdit-container').show();
		$('.eventDetail-container').show();
		$('.eventEdit-container').hide();
		$('.taskDetailEdit-container').hide();
		$('.taskDetail-container').hide();
	}

	//make sure nav is closed
	closeNav();
	closeAdd();

	//Show the detail edit panel
	$('#detailEdit_container').show();
	//Move the body
	$('body').animate({
		'left' : -360
	});
	//Move the container
	$('#detailEdit_container').animate({
		'right' : 0
	});
};

var closeDetails = function(callback) {
	//If the container is open - close it
	if ($('#detailEdit_container').css('right') == '0px') {
		//HIDE DETAILS AND EVENTS
		$('#detailEdit_container').animate({
			'right' : -360
		});

		$('body').animate({
			'right' : 0
		}, function() {
			$('body').css('left', 'auto');
			$('body').css('right', 'auto');
			$('.taskDetailEdit-container').hide();
			$('.taskDetail-container').hide();
			$('.taskEdit-container').hide();
			$('.eventDetailEdit-container').hide();
			$('.eventDetail-container').hide();
			$('.eventEdit-container').hide();
		});
	}
};
// Open Add Panel
var openAdd = function() {
	//Needs a conditional to see if the event detail container is open - if it is then close it
	closeNav();
	closeDetails();
	$('.addPanel-container').show();

	//move out the add panel
	$('.addPanel-container').animate({
		'right' : 0
	});

	$('body').animate({
		'right' : +360
	});
};
// Close Add Panel
var closeAdd = function() {
	//HIDE DETAILS AND EVENTS
	if ($('.addPanel-container').css('right') == '0px') {
		$('.addPanel-container').animate({
			'right' : -360
		});

		$('body').animate({
			'right' : 0
		}, function() {
			$('body').css('left', 'auto');
			$('body').css('right', 'auto');
			$('.addPanel-container').hide();
		});
	}
};

$(document).on('click', '#taskDetail_editTask_button', function() {
	$('.taskDetail-container').fadeOut(500, function() {
		$('.taskEdit-container').fadeIn(500);
	});

});
//
//
//
//
//
//
// ######  ######## ########    ######## #### ######## ##       ########   ######
//##    ## ##          ##       ##        ##  ##       ##       ##     ## ##    ##
//##       ##          ##       ##        ##  ##       ##       ##     ## ##
// ######  ######      ##       ######    ##  ######   ##       ##     ##  ######
//      ## ##          ##       ##        ##  ##       ##       ##     ##       ##
//##    ## ##          ##       ##        ##  ##       ##       ##     ## ##    ##
// ######  ########    ##       ##       #### ######## ######## ########   ######
//
//
var setFields = function(calEvent, jsEvent, view) {
	var id = calEvent.id;

	//CALENDAR EVENT
	if (calEvent.modelType === 'typeEvent') {
		$('#eventDetail_id_input').val(calEvent.id);
		$('#eventEdit_id_input').val(calEvent.id);
		$('#eventDetail_title').html('Title: ' + calEvent.title);
		$('#eventEdit_title_input').val(calEvent.title);

		if (calEvent.start) {
			$('#eventDetail_startDate').html(calEvent.start.toUTCString());
			$('#eventEdit_startDate_input').val(calEvent.start.toUTCString());
		}
		if (calEvent.end) {
			$('#eventDetail_endDate').html(calEvent.end.toUTCString());
			$('#eventEdit_endDate_input').val(calEvent.end.toUTCString());
		}

		if (calEvent.allDay === true) {
			$('#eventDetail_allDay_input').attr("checked", calEvent.allDay);
			$('#eventEdit_allDay_input').attr("checked", calEvent.allDay);
		} else {
			$('#eventDetail_allDay_input').removeAttr("checked");
			$('#eventEdit_allDay_input').removeAttr("checked");
		}
		if (calEvent.important === true) {
			$('#eventDetail_important_input').attr('checked', calEvent.important);
			$('#eventEdit_important_input').attr('checked', calEvent.important);
		} else {
			$('#eventDetail_important_input').removeAttr("checked");
			$('#eventEdit_important_input').removeAttr("checked");
		}

		$('#eventDetail_category').html('Category: ' + calEvent.category);
		$('#eventEdit_category_select').find('option').each(function() {
			if ($(this).val() == calEvent.categoryId) {
				$(this).attr("selected", "selected");
			} else {
				$(this).removeAttr("selected");
			}
		});

		$('#eventDetail_note_textarea').html(calEvent.note);
		$('#eventEdit_note_textarea').html(calEvent.note);
		// TODO
		// show reminders
		$('#eventDetail_reminders_container').empty();
		$('#eventEdit_reminders_container').empty();
		if (calEvent.reminder != undefined && calEvent.reminder.length != 0) {
			var reminders = calEvent.reminder;
			//TODO these conditionals are a temporay fix, all of this information is to be required from the user.
			// need to get info showing by default
			for (var i = 0, j = reminders.length; i < j; i++) {
				var currentReminder = reminders[i];
				if (!currentReminder.start) {
					currentReminder.start = '';
				}
				if (!currentReminder.end) {
					currentReminder.end = '';
				}
				if (!currentReminder.frequency) {
					currentReminder.frequency = '';
				}
				if (!currentReminder.via) {
					currentReminder.via = [];
				}
				var reminderDisplay = new EJS({
					url : '/view/ui/reminder-display.ejs'
				}).render(currentReminder);

				var reminder = new EJS({
					url : '/view/ui/reminder.ejs'
				}).render(currentReminder);

				$('#eventDetail_reminders_container').append(reminderDisplay);
				$('#eventEdit_reminders_container').append(reminder);
				// TODO
				// The reminders are not getting populated with data.
				$('.reminder-startTime-input').val(currentReminder.start);
				$('.reminder-endTime-input').val(currentReminder.end);

				// TODO
				// Loop over via array and check off the right inputs
				if (currentReminder.via != undefined && currentReminder.via.length != 0) {
					for (var i = 0, j = currentReminder.via.length; i < j; i++) {
						if (currentReminder.via[i] === "email") {
							$('.via-email-input').attr("checked", "checked");
						}
						if (currentReminder.via[i] === "call") {
							$('.via-call-input').attr("checked", "checked");
						}
						if (currentReminder.via[i] === "sms") {
							$('.via-sms-input').attr("checked", "checked");
						}
					}
				}
				// TODO
				// Set frequency select
			}
		}
		// TODO
		// show subtasks
		$('.eventEdit-container').find('.subtasks').empty();
		$('.eventDetail-container').find('.subtasks').empty();
		if (calEvent.subtasks != undefined && calEvent.subtasks.length != 0) {
			for (var i = 0, j = calEvent.subtasks.length; i < j; i++) {
				var subtask = new EJS({
					url : '/view/ui/subtask.ejs'
				}).render(calEvent.subtasks[i]);
				$('.eventEdit-container').find('.subtasks').append(subtask);
				$('.eventDetail-container').find('.subtasks').append(subtask);
			}
		}
	}
	//CALENDAR TASK
	if (calEvent.modelType === 'typeTask') {
		//set fields for detail and edit
		$('#taskDetail_id_input').val(calEvent.id);
		$('#taskEdit_id_input').val(calEvent.id);
		$('#taskDetail_title').html(calEvent.title);
		$('#taskEdit_title_input').val(calEvent.title);
		$('#taskDetail_dueDate').html(calEvent.start);
		$('#taskEdit_dueDate_input').val(calEvent.start);
		$('#taskDetail_category').html('Category: ' + calEvent.category);
		$('#taskEdit_category_select').find('option').each(function() {
			if ($(this).val() == calEvent.categoryId) {
				$(this).attr("selected", "selected");
			} else {
				$(this).removeAttr("selected");
			}
		});
		//TODO
		// Remove any defaults for the category select options
		// Select option of current category should be chosen by default

		if (calEvent.allDay === true) {
			$('#taskDetail_allDay_input').attr("checked", calEvent.allDay);
			$('#taskEdit_allDay_input').attr("checked", calEvent.allDay);
		} else {
			$('#taskDetail_allDay_input').removeAttr("checked");
			$('#taskEdit_allDay_input').removeAttr("checked");
		}
		if (calEvent.important === true) {
			$('#taskDetail_important_input').attr('checked', calEvent.important);
			$('#taskEdit_important_input').attr('checked', calEvent.important);
		} else {
			$('#taskDetail_important_input').removeAttr("checked");
			$('#taskEdit_important_input').removeAttr("checked");
		}
		$('#taskDetail_note_textarea').html(calEvent.note);
		$('#taskEdit_note_textarea').html(calEvent.note);
		// TODO
		// show reminders
		$('#taskDetail_reminders_container').empty();
		$('#taskEdit_reminders_container').empty();
		if (calEvent.reminder != undefined && calEvent.reminder.length != 0) {
			for (var i = 0, j = calEvent.reminder.length; i < j; i++) {
				var reminderDisplay = new EJS({
					url : '/view/ui/reminder-display.ejs'
				}).render(calEvent.reminder[i]);
				var reminder = new EJS({
					url : '/view/ui/reminder.ejs'
				}).render(calEvent.reminder[i]);

				$('#taskDetail_reminders_container').append(reminderDisplay);
				$('#taskEdit_reminders_container').append(reminder);
				// TODO
				// The reminders are not getting populated with data.
				$('.reminder-startTime-input').val(calEvent.reminder[i].start);
				$('.reminder-endTime-input').val(calEvent.reminder[i].end);
				// TODO
				// Loop over via array and check off the right inputs
				// TODO
				// Set frequency select
			}
		}
		//TODO
		// SHOW SUBTASKS
		$('.taskEdit-container').find('.subtasks').empty();
		$('.taskDetail-container').find('.subtasks').empty();
		if (calEvent.subtasks != undefined && calEvent.subtasks.length != 0) {
			for (var i = 0, j = calEvent.subtasks.length; i < j; i++) {
				var subtask = new EJS({
					url : '/view/ui/subtask.ejs'
				}).render(calEvent.subtasks[i]);
				$('.taskEdit-container').find('.subtasks').append(subtask);
				$('.taskDetail-container').find('.subtasks').append(subtask);
			}
		}
	}
}
//
//
//
//
//##     ## ########  ########     ###    ######## ########    ########    ###     ######  ##    ##
//##     ## ##     ## ##     ##   ## ##      ##    ##             ##      ## ##   ##    ## ##   ##
//##     ## ##     ## ##     ##  ##   ##     ##    ##             ##     ##   ##  ##       ##  ##
//##     ## ########  ##     ## ##     ##    ##    ######         ##    ##     ##  ######  #####
//##     ## ##        ##     ## #########    ##    ##             ##    #########       ## ##  ##
//##     ## ##        ##     ## ##     ##    ##    ##             ##    ##     ## ##    ## ##   ##
// #######  ##        ########  ##     ##    ##    ########       ##    ##     ##  ######  ##    ##
$(document).on('click', '#taskEdit_updateTask_button', function() {
	var id = $('#taskEdit_id_input').val();
	var task = _(db.tasks).where({
		'id' : id
	});
	var clickedTask = task[0];
	var title = $('#taskEdit_title_input').val();
	var dueDate = $('#taskEdit_dueDate_input').val();
	var category = $('#taskEdit_category_select').val();
	var important = $('#taskEdit_important_input').is(":checked");
	var note = $('#taskEdit_note_textarea').html();
	var reminders = [];

	$(this).closest('.taskEdit-container').find('.reminder').each(function() {

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
			start : $(this).find('.reminder-startTime-input').val(),
			end : $(this).find('.reminder-endTime-input').val(),
			frequency : $(this).find('.reminder-frequency-select').val(),
			via : via
		};

		reminders.push(reminder);

	});

	var subtasks = [];

	$('.taskEdit-container').find('.subtasks').find('li').each(function() {
		var subtask = {
			'title' : $(this).find('.subtask-title').html(),
			'completed' : $(this).find('.subtask-completed').prop('checked')
		};
		subtasks.push(subtask);
	});

	// console.log(
	// 'id' + id + ' ' +
	// 'title' + title + ' ' +
	// 'dueDate' + dueDate + ' ' +
	// 'reminder' + reminders + ' ' +
	// 'category' + category + ' ' +
	// 'important' + important + ' ' +
	// 'subtask' + subtasks + ' ' +
	// 'note' + note
	// );

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

_socketConnection.on('update_task_complete', function(data) {
	// console.log('ERROR: ' + data.error);
	// console.log('MESSAGE: ' + data.message);
	// console.log('TASK FRONT END MODEL: ' + data.task);
	// console.log('update_task_complete');
	// console.log(data.error);
	var task = data.task;
	task.modelType = 'typeTask';
	if (!data.error) {
	}
	$('.taskEdit-container').fadeOut(500, function() {
		setFields(task);
		$('.taskDetail-container').fadeIn(500);
	});
	_.updateWhere(db.tasks, {
		id : data.task.id
	}, data.task);
});

//
//
//
//
//########  ######## ##       ######## ######## ########    ########    ###     ######  ##    ##
//##     ## ##       ##       ##          ##    ##             ##      ## ##   ##    ## ##   ##
//##     ## ##       ##       ##          ##    ##             ##     ##   ##  ##       ##  ##
//##     ## ######   ##       ######      ##    ######         ##    ##     ##  ######  #####
//##     ## ##       ##       ##          ##    ##             ##    #########       ## ##  ##
//##     ## ##       ##       ##          ##    ##             ##    ##     ## ##    ## ##   ##
//########  ######## ######## ########    ##    ########       ##    ##     ##  ######  ##    ##
$(document).on('click', '#taskDetail_deleteTask_button', function() {
	var id = $('#taskDetail_id_input').val();
	_socketConnection.emit('delete_task', {
		'id' : id
	});
	closeDetails();
});

$('.detailEdit-closeDetailEdit-button').click(function() {
	closeDetails();
});

$('#account_update_changePass_button').click(function() {
	$('#account_update_changePass').toggleClass('core-hidden');
});
