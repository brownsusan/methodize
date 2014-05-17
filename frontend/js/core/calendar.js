$(document).ready(function() {
	_socketConnection.emit('read_events');
	_socketConnection.emit('read_all_task_event_by_user');
	_socketConnection.emit('read_categories');
});
// var categories = [];

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
				'subtasks' : data.calendarData[i].subtasks,
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
				'subtasks' : data.calendarData[i].subtasks,
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
			console.log(start, end, allDay);
			$('#addPanel_addTask_dueDate_input').val(start);
			$('#addPanel_addEvent_startDate_input').val(start);
			$('#addPanel_addEvent_endDate_input').val(end);

			//Open the event detail container when a day is selected
			//If the details is open - close it
			//If the nav is open - close it
			openAdd();
			// THESE ARE SPECIFIC TO THE SELECT OF FULLCALENDAR
			$('.eventDetailEdit-container').hide();
			$('.eventEdit-container').hide();
			calendar.fullCalendar('unselect');
		},
		editable : false,
		events : calendarData,
		eventClick : function(calEvent, jsEvent, view) {
			// TODO
			// handle events vs task depending on modelType
			var id = calEvent.id;
			if (calEvent.modelType === 'typeEvent') {
				$('#eventDetail_id_input').val(id);
				$('#eventEdit_id_input').val(id);
				$('#eventDetail_title').html(calEvent.title);
				$('#eventEdit_title_input').val(calEvent.title);
				$('#eventDetail_startDate').html(calEvent.start);
				$('#eventEdit_startDate_input').val(calEvent.start);
				$('#eventDetail_endDate').html(calEvent.end);
				$('#eventEdit_endDate_input').val(calEvent.end);
				$('#eventDetail_allDay_input').attr("checked", calEvent.allDay);
				$('#eventDetail_category').html(calEvent.category);
				$('#eventDetail_important_input').attr('checked', calEvent.important);
				$('#eventEdit_important_input').attr('checked', calEvent.important);
				$('#eventDetail_note_textarea').html(calEvent.note);
				$('#eventEdit_note_textarea').html(calEvent.note);
				// TODO
				// show note
				// TODO
				// show reminders
				$('#eventDetail_reminders_container').empty();
				$('#eventEdit_reminders_container').empty();
				if (calEvent.reminder != undefined && calEvent.reminder.length != 0) {
					var reminders = calEvent.reminder;
					for (var i = 0, j = reminders.length; i < j; i++) {
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
				$('.subtasks').empty();
				if (calEvent.subtask != undefined && calEvent.subtask.length != 0) {
					for (var i = 0, j = subtasks.length; i < j; i++) {
						var subtask = new EJS({
							url : '/view/ui/subtask.ejs'
						}).render(subtasks[i]);
						$('.task-edit .subtasks').append(subtask);
					}
				}
			}

			if (calEvent.modelType === 'typeTask') {
				//set fields for detail and edit
				$('#taskDetail_id_input').val(id);
				$('#taskEdit_id_input').val(id);
				$('#taskDetail_title').html(calEvent.title);
				$('#taskEdit_title_input').val(calEvent.title);
				$('#taskDetail_startDate').html(calEvent.start);
				$('#taskEdit_startDate_input').val(calEvent.start);
				$('#taskDetail_endDate').html(calEvent.end);
				$('#taskEdit_endDate_input').val(calEvent.end);
				$('#taskDetail_category').html(calEvent.category);
				$('#taskDetail_allDay_input').attr("checked", calEvent.allDay);
				// TODO
				// show note
				// TODO
				// show reminders
				$('#taskDetail_reminders_container').empty();
				$('#taskEdit_reminders_container').empty();
				if (calEvent.reminder != undefined && calEvent.reminder.length != 0) {
					var reminders = calEvent.reminder;
					for (var i = 0, j = reminders.length; i < j; i++) {
						var reminderDisplay = new EJS({
							url : '/view/ui/reminder-display.ejs'
						}).render(reminders[i]);

						var reminder = new EJS({
							url : '/view/ui/reminder.ejs'
						}).render(reminders[i]);

						$('#taskDetail_reminders_container').append(reminderDisplay);
						$('#taskEdit_reminders_container').append(reminder);
					}
				}
				//TODO
				// Select option of current category should be chosen by default
				$('#taskDetail_important_input').attr('checked', calEvent.important);
				$('#taskEdit_important_input').attr('checked', calEvent.important);
				// TODO
				// show subtasks
				$('.subtasks').empty();
				if (calEvent.subtask != undefined && calEvent.subtask.length != 0) {
					for (var i = 0, j = subtasks.length; i < j; i++) {
						var subtask = new EJS({
							url : '/view/ui/subtask.ejs'
						}).render(subtasks[i]);
						$('.task-edit .subtasks').append(subtask);
					}
				}
				$('#taskDetail_note_textarea').html(calEvent.note);
				$('#taskEdit_note_textarea').html(calEvent.note);
			}
			//If the event detail container is open - close it
			if ($('#detailEdit_container').css('right') == '0px') {
				// Call the close function here
				closeDetails();
				//TODO
				// THIS ELSE NEEDS TO BE MOVED INTO SOME CLOSE BUTTON CLICK FUNCTION
				//If the event detail container is closed - open it
			} else {
				//Call the open function here
				openDetails(calEvent);
			}
			// TODO
			// NEED TO FORMAT THE EVENT OBJECTS TO MATCH THE SCHEMA IN ORDER TO DISPLAY THEM PROPERLY

			// TODO
			// Make this happen for task details too
			//This is specific to the event click function
			// $('.addPanel-container').hide();
		}
	});
});

$(document).on('click', '#eventDetail_editEvent_button', function() {
	$('.eventDetail-container').hide();
	$('.eventEdit-container').show();
});

$(document).on('click', '#eventEdit_updateEvent_button', function() {
	var id = $('#eventEdit_id_input').val();
	var title = $('#eventEdit_title_input').val();
	_socketConnection.emit('update_event', {
		'id' : id,
		'title' : title
	});
	$('.eventDetail-container').show();
	$('.eventEdit-container').hide();
});

$(document).on('click', '#eventDetail_deleteEvent_button', function() {
	var id = $('#eventDetail_id_input').val();
	_socketConnection.emit('delete_event', {
		'id' : id
	});
	// $('.eventDetail-container').hide();
	// $('.eventEdit-container').show();
});
