$(document).ready(function() {
	$('#tab-container').easytabs();
	$('#task-submit-due-date').datetimepicker();
	$('#event-submit-start-date').datetimepicker();
	$('#event-submit-end-date').datetimepicker();
	$('.reminder-start-time').datetimepicker({
		datepicker : false
	});
	$('.reminder-end-time').datetimepicker({
		datepicker : false
	});
});

$('.my-nav-slide').click(function() {
	$('#my-nav').animate({
		width : 'toggle'
	});
	// $('#nav-placeholder').animate({
	// width : 'toggle'
	// });
});

$('#test-add').click(function() {
	$('.add-update').toggle();
});

//CATEGORY JS STUFF
$('#category-add-input').keypress(function() {
	if (event.which == 13) {
		//Add The Cat to the DB
		console.log('cat');

		var title = $('#category-add-input').val();

	}
});

//TASK JS STUFF
$('#task-add-input').keypress(function() {

	if (event.which == 13) {
		//Validation Here
		//Manipulate the data
		var title = $('#task-add-input').val();
		//Figure out how to determine category
		var category = 'inbox';

		$.ajax({
			url : "/action/create-task",
			type : "post",
			dataType : "json",
			data : {
				'title' : title,
				'category' : category
			},
			success : function(response) {
				if (!response.error) {

				}
			}
		});
	}
});
