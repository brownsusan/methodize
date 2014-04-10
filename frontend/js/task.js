//Create a 'complete' listener for the sign in
_socketConnection.on('create_task_complete', function(data) {
	if (!data.error) {
		console.log('no errors mama');
	}

});

$('#task-add-input').keypress(function() {

	if (event.which == 13) {
		//Validation Here
		//Manipulate the data
		var title = $('#task-add-input').val();
		//Figure out how to determine category
		var category = 'inbox';

		_socketConnection.emit('create_task', {
			'title' : title,
			'category' : category
		});
	}
});

// //Create a 'complete' listener for the sign up
// _socketConnection.on('update_task_complete', function(data) {
	// console.log(data);
	// if (!data.error) {
		// window.location.href = "/calendar/day";
	// }
// 
// });
// 
// $('#sign-up-submit').click(function() {
// 
	// //Emit an event
	// _socketConnection.emit('signup_user', {
		// 'email' : email,
		// 'phone' : phone,
		// 'password' : pass
	// });
// 
// });
