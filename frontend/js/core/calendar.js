$(document).ready(function() {
	_socketConnection.emit('read_events');
	_socketConnection.emit('read_all_task_event_by_user');
});

_socketConnection.on('read_all_task_event_by_user_complete', function(data) {
	var calendarData = [];
	// format events and tasks by type
	for (var i = 0, j = data.calendarData.length; i < j; i++) {
		if (data.calendarData[i].modelType == 'typeEvent') {
			var newEvent = {
				'id' : data.calendarData[i].id,
				'title' : data.calendarData[i].title,
				'start' : data.calendarData[i].startDate,
				'end' : data.calendarData[i].endDate,
				'color' : data.calendarData[i].categoryObject.color,
				'category' : data.calendarData[i].categoryObject.title,
				'categoryId' : data.calendarData[i].category,
				'important' : data.calendarData[i].important,
				'allDay' : data.calendarData[i].allDay,
				'reminder' : data.calendarData[i].reminder,
				'subtasks' : data.calendarData[i].subtask,
				'note' : data.calendarData[i].note,
				'modelType' : data.calendarData[i].modelType
			}
			calendarData.push(newEvent);
		}
		if (data.calendarData[i].modelType == 'typeTask') {
			var newTask = {
				'id' : data.calendarData[i].id,
				'title' : data.calendarData[i].title,
				'start' : data.calendarData[i].dueDate,
				'end' : data.calendarData[i].dueDate,
				'color' : data.calendarData[i].categoryObject.color,
				'category' : data.calendarData[i].categoryObject.title,
				'categoryId' : data.calendarData[i].category,
				'important' : data.calendarData[i].important,
				'allDay' : false,
				'reminder' : data.calendarData[i].reminder,
				'subtasks' : data.calendarData[i].subtask,
				'note' : data.calendarData[i].note,
				'modelType' : data.calendarData[i].modelType
			}
			calendarData.push(newTask);
		}
	};
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();

	var calendar = $('#calendar').fullCalendar({
		header : {
			left : 'prev,next today',
			center : 'title',
			right : 'month,agendaWeek,agendaDay'
		},
		defaultView : 'month',
		selectable : true,
		selectHelper : true,
		select : function(start, end, allDay) {
			//If start and end date are the same prevent default
			if (start.toUTCString() != end.toUTCString()) {
				$('#addPanel_addTask_dueDate_input').val(start);
				$('#addPanel_addEvent_startDate_input').val(start);
				$('#addPanel_addEvent_endDate_input').val(end);
				openAdd();
				// THESE ARE SPECIFIC TO THE SELECT OF FULLCALENDAR
			}
			if (start.toUTCString() == end.toUTCString()) {
				console.log('DONT DO THE OPEN THING');
			}
			calendar.fullCalendar('unselect');
		},
		editable : true,
		events : calendarData,
		eventClick : function(calEvent, jsEvent, view) {
			// TODO
			// handle events vs task depending on modelType
			var id = calEvent.id;
			if (calEvent.modelType === 'typeEvent') {
				$('#eventDetail_id_input').val(id);
				$('#eventEdit_id_input').val(id);
				$('#eventDetail_title').html('Title: ' + calEvent.title);
				$('#eventEdit_title_input').val(calEvent.title);
				$('#eventDetail_startDate').html('Start Date: ' + calEvent.start);
				$('#eventEdit_startDate_input').val(calEvent.start);
				$('#eventDetail_endDate').html('End Date: ' + calEvent.end);
				$('#eventEdit_endDate_input').val(calEvent.end);
				console.log(calEvent.allDay, calEvent.important)
				// TODO
				// THIS SHIT DOESNT WORK - EVERYTHING IS ALWAYS CHECKED FOE EVENTS AND TASKS ALL DAY AND IMPORTANT
				if (calEvent.allDay === true) {
					$('#eventDetail_allDay_input').attr("checked");
					$('#eventEdit_allDay_input').attr("checked");
				}
				if (calEvent.important === true) {
					$('#eventDetail_important_input').attr('checked', calEvent.important);
					$('#eventEdit_important_input').attr('checked', calEvent.important);
				}
				$('#eventDetail_category').html('Category: ' + calEvent.category);
				// TODO
				// $('option').val(calEvent.categoryId).attr('selected="selected"');

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
						if (!reminders[i].start) {
							reminders[i].start = '';
						}
						if (!reminders[i].end) {
							reminders[i].end = '';
						}
						if (!reminders[i].frequency) {
							reminders[i].frequency = '';
						}
						if (!reminders[i].via) {
							reminders[i].via = [];
						}
						var reminderDisplay = new EJS({
							url : '/view/ui/reminder-display.ejs'
						}).render(reminders[i]);

						var reminder = new EJS({
							url : '/view/ui/reminder.ejs'
						}).render(reminders[i]);

						$('#eventDetail_reminders_container').append(reminderDisplay);
						$('#eventEdit_reminders_container').append(reminder);
					}
				}
				//TODO
				// Select option of current category should be chosen by default
				// TODO
				// show subtasks
				$('.eventEdit-container').find('.subtasks').empty();
				$('.eventDetail-container').find('.subtasks').empty();
				if (calEvent.subtask != undefined && calEvent.subtask.length != 0) {
					for (var i = 0, j = calEvent.subtasks.length; i < j; i++) {
						var subtask = new EJS({
							url : '/view/ui/subtask.ejs'
						}).render(subtasks[i]);
						$('.eventEdit-container .subtasks').append(subtask);
						$('.eventDetail-container .subtasks').append(subtask);
					}
				}
			}

			if (calEvent.modelType === 'typeTask') {
				//set fields for detail and edit
				$('#taskDetail_id_input').val(id);
				$('#taskEdit_id_input').val(id);
				$('#taskDetail_title').html(calEvent.title);
				$('#taskEdit_title_input').val(calEvent.title);
				$('#taskDetail_dueDate').html(calEvent.start);
				$('#taskEdit_dueDate_input').val(calEvent.start);
				$('#taskDetail_category').html('Category: ' + calEvent.category);
				if (calEvent.important === true) {
					$('#taskDetail_important_input').attr('checked', calEvent.important);
					$('#taskEdit_important_input').attr('checked', calEvent.important);
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
						// TODO
						// The reminders are not getting populated with data. If I do this in the template it causes an error when I try ot use the same template for fresh reminders
						// $('.reminder-startTime-input').val(calEvent.reminder[i].start);
						$('#taskDetail_reminders_container').append(reminderDisplay);
						$('#taskEdit_reminders_container').append(reminder);
					}
				}
				//TODO
				// Select option of current category should be chosen by default
				//TODO
				// SHOW SUBTASKS
				$('.taskEdit-container').find('.subtasks').empty();
				$('.taskDetail-container').find('.subtasks').empty();
				console.log(calEvent.subtasks);
				if (calEvent.subtasks != undefined && calEvent.subtasks.length != 0) {
					console.log('conditional met');
					for (var i = 0, j = calEvent.subtasks.length; i < j; i++) {
						var subtask = new EJS({
							url : '/view/ui/subtask.ejs'
						}).render(calEvent.subtasks[i]);
						$('.taskEdit-container').find('.subtasks').append(subtask);
						$('.taskDetail-container').find('.subtasks').append(subtask);
					}
				}
			}
			openDetails(calEvent);
			// setFields(calEvent, jsEvent, view);
			// // closeDetails();
		},
		dayClick : function() {
			closeDetails();
		}
	});
});

$(document).on('click', 'td', function() {
	console.log('something happened');
	// openAdd();
})

$(document).on('click', '#eventDetail_editEvent_button', function() {
	$('.eventDetail-container').fadeOut(500, function() {
		$('.eventEdit-container').fadeIn(500);
	});

});

$(document).on('click', '#eventEdit_updateEvent_button', function() {
	var reminders = [];
	$('.eventEdit-container .reminder').each(function() {
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
	$('.eventEdit-container .subtasks li').each(function() {
		var subtask = {
			title : $(this).find('.subtask-title').html(),
			completed : $(this).find('.subtask-completed').prop('checked')
		};
		subtasks.push(subtask);
	});
	var id = $('#eventEdit_id_input').val();
	var title = $('#eventEdit_title_input').val();
	var startDate = $('#eventEdit_startDate_input').val();
	var endDate = $('#eventEdit_endDate_input').val();
	var category = $('#eventEdit_category_select').val();
	var important = $('#eventEdit_important_input').is(":checked");
	//TODO ALWAYS CHECKED ATTR
	var allDay = $('#eventEdit_allDay_input').is(":checked");
	var note = $('#eventEdit_note_textarea').html();

	_socketConnection.emit('update_event', {
		'id' : id,
		'title' : title,
		'startDate' : startDate,
		'endDate' : endDate,
		'reminder' : reminders,
		'category' : category,
		'important' : important,
		'allDay' : allDay,
		'subtask' : subtasks,
		'note' : note
	});

	$('.eventEdit-container').fadeOut(500, function() {
		$('.eventDetail-container').fadeIn(500);
	});
});

$(document).on('click', '#eventDetail_deleteEvent_button', function() {
	var id = $('#eventDetail_id_input').val();
	_socketConnection.emit('delete_event', {
		'id' : id
	});
	closeDetails();
});

