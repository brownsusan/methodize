_socketConnection.on('read_events_tasks_complete', function(data) {

	console.log('on read_events_tasks_complete');

	// check if an error occured
	if (data.error) {
		return;
	}

	$('#calendar').empty();

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
			};

			calendarData.push(newEvent);

		}

		if (data.calendarData[i].modelType == 'typeTask') {
			// var titleHtml = data.calendarData[i].title +'<div style="background:'+data.calendarData[i].categoryObject.color+'" class="round-color-rep"></div>';
			var newTask = {
				'id' : data.calendarData[i].id,
				'title' : data.calendarData[i].title,
				'start' : data.calendarData[i].dueDate,
				'end' : data.calendarData[i].dueDate,
				'color' : '#f7f8f9',
				'categoryColor' : data.calendarData[i].categoryObject.color,
				'category' : data.calendarData[i].categoryObject.title,
				'categoryId' : data.calendarData[i].category,
				'important' : data.calendarData[i].important,
				'allDay' : false,
				'reminder' : data.calendarData[i].reminder,
				'subtasks' : data.calendarData[i].subtask,
				'note' : data.calendarData[i].note,
				'modelType' : data.calendarData[i].modelType
			};

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
		weekMode : 'liquid',
		selectable : true,
		selectHelper : true,
		select : function(start, end, allDay) {
			if (start.toUTCString() != end.toUTCString()) {
				$('#addPanel_addTask_dueDate_input').val(start);
				$('#addPanel_addEvent_startDate_input').val(start);
				$('#addPanel_addEvent_endDate_input').val(end);
				openAdd();
			}
			if (start.toUTCString() == end.toUTCString()) {
			}
			calendar.fullCalendar('unselect');
		},
		editable : true,
		events : calendarData,
		eventRender : function(event, element) {
			if (event.modelType === 'typeTask') {
				element.find('.fc-event-title').append('<span class="round-color-rep" style="background:' + event.categoryColor + ';"></span>');
			}
		},
		eventClick : function(calEvent, jsEvent, view) {
			setFields(calEvent, jsEvent, view);
			openDetails(calEvent);
		},
		dayClick : function(date, allDay, jsEvent, view) {
			// If anything is open close it
			closeDetails();
			openAdd();
			// If nothing is open, open the add panel
		}
	});
});

$(document).ready(function() {
	_socketConnection.emit('read_events_tasks');
});

$(document).on('click', '#eventDetail_editEvent_button', function() {
	$('.eventDetail-container').fadeOut(500, function() {
		$('.eventEdit-container').fadeIn(500);
	});
});

$(document).on('click', '#eventEdit_updateEvent_button', function() {

	var id = $('#eventEdit_id_input').val();
	var title = $('#eventEdit_title_input').val();
	var startDate = $('#eventEdit_startDate_input').val();
	var endDate = $('#eventEdit_endDate_input').val();
	var category = $('#eventEdit_category_select').val();
	var important = $('#eventEdit_important_input').is(":checked");

	var reminders = [];
	
	$('#eventEdit_reminders_container .reminder').each(function() {
		
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
	$('.eventEdit-container .subtasks li').each(function() {

		var subtask = {
			title : $(this).find('.subtask-title').html(),
			completed : $(this).find('.subtask-completed').prop('checked')
		};

		subtasks.push(subtask);

	});

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

});

$(document).on('click', '#eventDetail_deleteEvent_button', function() {

	var id = $('#eventDetail_id_input').val();

	_socketConnection.emit('delete_event', {
		'id' : id
	});

	closeDetails();

});

