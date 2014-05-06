$(document).ready(function() {
	_socketConnection.emit('read_events');
	// Read events by day
	// Read events by month
	//NEED UNDERSCORE REPS OF ALL DATA FOR CALENDAR
	// var tasks = [];
	var events = [];
	// var categories = [];

	_socketConnection.on('read_events_complete', function(data) {
		console.log(data.events);
		for (var i = 0, j = data.events.length; i < j; i++) {
			//Formatting the data from the database to work with fullcalendar.
			//Eventually I want to have the schema match what full calendar needs.
			var newEvent = {
				'id' : data.events[i].id,
				'title' : data.events[i].title,
				'start' : data.events[i].startDate,
				'end' : data.events[i].endDate,
				'color' : data.events[i].categoryObject.color,
				'category' : data.events[i].categoryObject.title,
				'categoryId' : data.events[i].category,
				'important' : data.events[i].important,
				'allDay' : data.events[i].allDay,
				'reminder' : data.events[i].reminder,
				'subtasks' : data.events[i].subtasks,
				'note' : data.events[i].notes
			}
			events.push(newEvent);
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
				$('.eventDetail-container').hide();
				$('.eventEdit-container').hide();
				$('.addPanel-container').show();
				calendar.fullCalendar('unselect');
			},
			editable : true,
			events : events,
			eventClick : function(calEvent, jsEvent, view) {
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
	// $('.eventDetail-container').hide();
	// $('.eventEdit-container').show();
});
//delete in modal
