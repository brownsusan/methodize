$(document).ready(function() {
	$('#tab-container').easytabs();
});

$('.my-nav-slide').click(function() {
	$('#my-nav').animate({
		width : 'toggle'
	});
});

$('#login-submit').click(function() {

	var email = $('#login-email').val();
	var pass = $('#login-pass').val();

	$.ajax({
		url : "/action/signin_user",
		type : "post",
		dataType : "json",
		data : {
			'email' : email,
			'password' : pass
		},
		success : function(response) {
			console.log('success');
		}
	});

});

$('#sign-up-submit').click(function() {
	var email = $('#sign-up-email').val();
	var phone = $('#sign-up-phone').val();
	var pass = $('#sign-up-pass').val();
	var confirmPass = $('#sign-up-confirmPass').val();

	var regex_email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	var regex_pass = /^[a-zA-Z]\w{3,14}$/;

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

	//Ajax call - create doc
	$.ajax({
		url : "/action/create_user",
		type : "post",
		dataType : "json",
		data : {
			'email' : email,
			'phone' : phone,
			'password' : pass
		},
		success : function(response) {
			console.log('success');
			// if (response.document_id) {
			// console.log("end");
			// console.log(response.document_id);
			// window.location = '/document/' + response.document_id;
			// }
		}
	});

});
