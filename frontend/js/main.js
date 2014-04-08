$(document).ready(function() {
	$('#tab-container').easytabs();
});

$('.my-nav-slide').click(function() {
	$('#my-nav').animate({
		width : 'toggle'
	});
});