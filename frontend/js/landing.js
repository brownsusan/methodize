//Create a 'complete' listener for the sign in
_socketConnection.on('signin_user_complete', function(data) {
	if (!data.error) {
		window.location.href = "/calendar/day";
	}

});

$('#login-submit').click(function() {
	//Get the data
	var email = $('#login-email').val();
	var pass = $('#login-pass').val();
	// Emit an event - name it - create an object to emit
	_socketConnection.emit('signin_user', {
		'email' : email,
		'password' : pass
	});
});

//Create a 'complete' listener for the sign up
_socketConnection.on('signup_user_complete', function(data) {
	console.log(data);
	if (!data.error) {
		window.location.href = "/calendar/day";
	}

});

$('#sign-up-submit').click(function() {
	// Get the data
	var email = $('#sign-up-email').val();
	var phone = $('#sign-up-phone').val();
	var pass = $('#sign-up-pass').val();
	var confirmPass = $('#sign-up-confirmPass').val();

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
		valid = false
	}

	if (email.length === 0 || phone.length === 0 || pass.length === 0 || confirmPass === 0) {
		valid = false;
	}

	if (valid == false) {
		console.log("invalid");
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
