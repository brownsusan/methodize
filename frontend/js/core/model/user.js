_socketConnection.on('update_user_complete', function(data) {
	// Reset fields
	// Fade this in/out
	console.log(data.message);
	$('#account_info_display').show();
	$('#account_info_edit').hide();
});
