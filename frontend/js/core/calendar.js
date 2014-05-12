$(document).ready(function() {
	_socketConnection.emit('read_events');
	_socketConnection.emit('read_all_task_event_by_user');
	// Read events by day
	// Read events by month
	//NEED UNDERSCORE REPS OF ALL DATA FOR CALENDAR
	// var tasks = [];
	var events = [];
	// var categories = [];

	_socketConnection.on('read_all_task_event_by_user_complete', function(data) {
		var calendarData = [];
		console.log(data);
		// format events and tasks by type
		for (var i = 0, j = data.calendarData.length; i < j; i++) {
			if (data.calendarData[i].modelType == 'typeEvent') {
				console.log('Its an event!');
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
					'note' : data.calendarData[i].notes
				}
				calendarData.push(newEvent);
			}
			if (data.calendarData[i].modelType == 'typeTask') {
				console.log('Its a task!');
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
					'note' : data.calendarData[i].notes
				}
				calendarData.push(newTask);
			}
		};
		console.log(calendarData);
		// push them into an array
		// initialize calendar
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

				if ($('.eventDetail-container').css('right') == '0px') {
					$('.eventDetail-container').animate({
						'right' : -300
					});
					//move out the add panel
					$('.addPanel-container').animate({
						'right' : 0
					});

					$('.addPanel-container').animate({
						'right' : 0
					});

				}

				$('.eventDetail-container').hide();
				$('.eventEdit-container').hide();
				$('.addPanel-container').show();
				calendar.fullCalendar('unselect');
			},
			editable : true,
			events : calendarData,
			eventClick : function(calEvent, jsEvent, view) {
				// TODO
				// EMPTY EVERYTHING
				// TODO
				// NEED TO FORMAT THE EVENT OBJECTS TO MATCH THE SCHEMA IN ORDER TO DISPLAY THEM PROPERT
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
				// show reminders
				// $('#eventDetail_reminders_container').empty();
				// $('#eventEdit_reminders_container').empty();
				console.log(calEvent.reminder);
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
				// show categories
				// $('#taskEdit_category_select').empty();
				// var categories = db.categories;
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
				//
				// $('#taskEdit_note_textarea').html(task.note);
				// TODO
				// Make this happen for task details too
				if ($('.eventDetail-container').css('right') == '0px') {
					$('.eventDetail-container').animate({
						'right' : -300
					});
					$('body').animate({
						'right' : 0
					});
					// THIS ELSE NEEDS TO BE MOVED INTO SOME CLOSE BUTTON CLICK FUNCTION
				} else {
					$('.eventDetail-container').animate({
						'right' : 0
					});
					$('body').animate({
						'right' : +300
					});
				}
				$('.eventDetail-container').show();
				$('.addPanel-container').hide();
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
	$('.eventDetail-container').hide();
	$('.eventEdit-container').show();
});

$(document).on('click', '#eventDetail_deleteEvent_button', function() {
	var id = $('#eventDetail_id_input').val();
	_socketConnection.emit('delete_event', {
		'id' : id
	});
	// $('.eventDetail-container').hide();
	// $('.eventEdit-container').show();
});