$(document).ready(function() {
	_socketConnection.emit('read_events');
	// Read events by day
	// Read events by month
});

var events = [];

_socketConnection.on('read_events_complete', function(data) {
	for (var i = 0, j = data.events.length; i < j; i++) {
		console.log(data.events[i]);
		//Formatting the data from the database to work with fullcalendar.
		//Eventually I want to have the schema match what full calendar needs.
		var newEvent = {
			'title' : data.events[i].title,
			'start' : data.events[i].startDate,
			'end' : data.events[i].endDate,
			'color' : data.events[i].categoryObject.color
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
			var title = prompt('Event Title:');
			if (title) {
				calendar.fullCalendar('renderEvent', {
					title : title,
					start : start,
					end : end,
					allDay : allDay
				}, true // make the event "stick"
				);
			}
			calendar.fullCalendar('unselect');
		},
		editable : true,
		events : events
	});

});
