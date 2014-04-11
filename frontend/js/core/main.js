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

$('#test-add').click(function() {
	$('.add-update').toggle();
});

$('.category').click(function() {
	var parentCategoryId = $(this).children('.category-id').val();
	$('#parent-category').val(parentCategoryId);
});

var reminder = new EJS({
	url : '/view/ui/reminder.ejs'
}).render();

$('#task-add-reminder').click(function() {
	$('#reminders').append(reminder);
	$('.reminder-start-time').datetimepicker();
	$('.reminder-end-time').datetimepicker();
});
