$(document).ready(function() {
	_socketConnection.emit('read_events');
	_socketConnection.emit('read_all_task_event_by_user');
	_socketConnection.emit('read_categories');
	// var categories = [];

	_socketConnection.on('read_all_task_event_by_user_complete', function(data) {
		var calendarData = [];
		console.log(data);
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
				openAdd();
				//Here is where I might close the event detail container
				if ($('.eventDetailEdit-container').css('right') == '-300px') {
					//THE DETAIL CONTAINER IS OPEN IN THIS CONDITIONAL
				}
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
				// if(calEvent.modelType === 'typeEvent'){
				//set fiels for detail and edit
				// close task details
				// 					open event details
				// }
				// if(calEvent.modelType === 'typeTask'){
				//set fields for detail and edit
				//close event details
				// 					open task details
				// }
				// TODO
				// NEED TO FORMAT THE EVENT OBJECTS TO MATCH THE SCHEMA IN ORDER TO DISPLAY THEM PROPERLY
				var id = calEvent.id;
				$('#eventDetail_id_input').val(id);
				$('#eventEdit_id_input').val(id);
				$('#eventDetail_title').html(calEvent.title);
				$('#eventEdit_title_input').val(calEvent.title);
				$('#eventDetail_startDate').html(calEvent.start);
				$('#eventEdit_startDate_input').val(calEvent.start);
				$('#eventDetail_endDate').html(calEvent.end);
				$('#eventEdit_endDate_input').val(calEvent.end);
				$('#eventDetail_allDay_input').attr("checked", calEvent.allDay);
				// TODO
				// show note
				// TODO
				// show reminders
				$('#eventDetail_reminders_container').empty();
				$('#eventEdit_reminders_container').empty();
				if (calEvent.reminder != undefined && calEvent.reminder.length != 0) {
					var reminders = calEvent.reminder;
					for (var i = 0, j = reminders.length; i < j; i++) {
						console.log(reminders[i]);
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
				$('#eventDetail_category').html(calEvent.category);
				// $('#taskEdit_category_select').empty();
				// for (var i = 0, j = categories.length; i < j; i++) {
				// var category = '<option value="' + categories[i].id + '">' + categories[i].title + '</option>';
				// $('#taskEdit_category_select').append(category);
				// }
				//
				// $('#taskEdit_important_input').attr('checked', task.important);
				//
				// // show subtasks
				// $('.subtasks').empty();
				// var subtasks = task.subtask;
				// for (var i = 0, j = subtasks.length; i < j; i++) {
				// var subtask = new EJS({
				// url : '/view/ui/subtask.ejs'
				// }).render(subtasks[i]);
				// $('.task-edit .subtasks').append(subtask);
				// }
				// show categories
				$('#taskEdit_category_select').empty();
				// for (var i = 0, j = categories.length; i < j; i++) {
					// var category = '<option value="' + categories[i].id + '">' + categories[i].title + '</option>';
					// $('#taskEdit_category_select').append(category);
				// }

				$('#taskEdit_important_input').attr('checked', calEvent.important);
				// TODO
				// show subtasks
				// $('.subtasks').empty();
				// var subtasks = calEvent.subtask;
				// for (var i = 0, j = subtasks.length; i < j; i++) {
				// var subtask = new EJS({
				// url : '/view/ui/subtask.ejs'
				// }).render(subtasks[i]);
				// $('.task-edit .subtasks').append(subtask);
				// }

				$('#eventDetail_note_textarea').html(calEvent.note);
				$('#eventEdit_note_textarea').html(calEvent.note);
				// TODO
				// Make this happen for task details too

				//If the event detail container is open - close it
				if ($('.eventDetailEdit-container').css('right') == '0px') {
					// Call the close function here
					closeDetails();
					//TODO
					// THIS ELSE NEEDS TO BE MOVED INTO SOME CLOSE BUTTON CLICK FUNCTION
					//If the event detail container is closed - open it
				} else {
					//Call the open function here
					openDetails();
				}
				//This is specific to the event click function
				// $('.addPanel-container').hide();
			}
		});
	});
});
//hide the detail container when closed
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
