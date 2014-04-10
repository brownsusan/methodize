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
		var color = 'red';

		$.ajax({
			url : "/action/create-category",
			type : "post",
			dataType : "json",
			data : {
				'title' : title,
				'color' : color
			},
			success : function(response) {
				if (!response.error) {
					
				}
			}
		});

	}
});