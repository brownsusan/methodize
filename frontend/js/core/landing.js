//Create a 'complete' listener for the sign up
_socketConnection.on('signup_user_complete', function(data) {

	console.log('on signup_user_complete');

	if (data.error) {
		alert('You filled it out wrong');
	}

	window.location.href = '/calendar';

});

//Create a 'complete' listener for the sign in
_socketConnection.on('signin_user_complete', function(data) {

	console.log('on signin_user_complete');

	if (data.error) {
		alert('You used the wrong info');
		return;
	}

	window.location.href = '/calendar';

});

$('#landing_login_submit_button').click(function() {

	console.log('LOGIN SUBMIT CLICKED');

	//Get the data
	var email = $('#landing_login_email_input').val();
	var pass = $('#landing_login_password_input').val();
	// Emit an event - name it - create an object to emit

	_socketConnection.emit('signin_user', {
		'email' : email,
		'password' : pass
	});

});

$('#landing_signUp_submit_button').click(function() {

	// Get the data
	var email = $('#landing_signUp_email').val();
	var phone = $('#landing_signUp_phone').val();
	var pass = $('#landing_signUp_password').val();
	var confirmPass = $('#landing_signUp_confirmPassword').val();

	var regex_email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	var regex_pass = /^[a-zA-Z]\w{3,14}$/;

	//Validate
	valid = true;

	if (!regex_email.test(email)) {
		valid = false;
	}

	if (!regex_pass.test(pass)) {
		valid = false;
	}

	if (confirmPass != pass) {
		valid = false;
	}

	if (email.length === 0 || phone.length === 0 || pass.length === 0 || confirmPass === 0) {
		valid = false;
	}

	if (valid == false) {
		var errorHtml = '<span>Please fill out the form completely and correctly. Be sure the check the hints in each field!<span></br>';
		$('#landing-error').html(errorHtml);
		return;
	}

	//Emit an event
	_socketConnection.emit('signup_user', {
		'email' : email,
		'phone' : phone,
		'password' : pass
	});

});
