$(document).ready(function() {
	$('#tab-container').easytabs();
	$('#task-submit-due-date').datetimepicker();
	$('#event-submit-start-date').datetimepicker();
	$('#event-submit-end-date').datetimepicker();
});

$('.my-nav-slide').click(function() {
	$('#my-nav').animate({
		width : 'toggle'
	});
});