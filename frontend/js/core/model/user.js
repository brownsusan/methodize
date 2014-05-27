_socketConnection.on('update_user_complete', function(data) {
	
	console.log('on update_user_complete');
	
	// Reset fields
	// Fade this in/out
	
	$('#account_info_display').show();
	$('#account_info_edit').hide();
	
});
