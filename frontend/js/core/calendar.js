$(document).ready(function() {
	_socketConnection.emit('read_events');
	_socketConnection.emit('read_all_task_event_by_user');
});


// 
// 
// 
// 
// 
// 
// 
// 
// 
//
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
			setFields(calEvent, jsEvent, view);
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
	var id = $('#eventEdit_id_input').val();
	console.log('Calendar JS: ' + id);
	var title = $('#eventEdit_title_input').val();
	var startDate = $('#eventEdit_startDate_input').val();
	var endDate = $('#eventEdit_endDate_input').val();
	var category = $('#eventEdit_category_select').val();
	var important = $('#eventEdit_important_input').is(":checked");

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

