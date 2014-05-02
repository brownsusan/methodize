$(document).ready(function() {
	_socketConnection.emit('read_events');
});

var events = [];

_socketConnection.on('read_events_complete', function(data) {
	console.log(data.events);
	for (var i = 0, j = data.events.length; i < j; i++) {
		var newEvent = {
			'title' : data.events[i].title,
			'start' : data.events[i].startDate,
			'end' : data.events[i].endDate
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
