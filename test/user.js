test.user = {};

(function() {

	// create
	(function() {

		function test() {

			_socketConnection.removeAllListeners();

			_socketConnection.on('signup_user_complete', function(data) {
				console.log('signup_user_complete');
				console.log(data);
			});

			_socketConnection.emit('signup_user', {
				'email': 'test@test.com',
				'password': 'testtest',
				'phone': '5555555'
			});

		}

		window.test.user.signup = test;

	})();

	// read
	(function() {

		function test() {

			_socketConnection.removeAllListeners();

			_socketConnection.on('signin_user_complete', function(data) {
				console.log('signin_user_complete');
				console.log(data);
			});

			_socketConnection.emit('signin_user', {
				'email': 'test@test.com',
				'password': 'testtest'
			});

		}

		window.test.user.signin = test;

	})();

	// update
	(function() {

		function test() {

			_socketConnection.removeAllListeners();

			_socketConnection.on('update_user_complete', function(data) {
				console.log('update_user_complete');
				console.log(data);
			});

			_socketConnection.emit('update_user', {
				'email': 'test2@test.com',
				'password': 'testtest2',
				'phone': '5551234'
			});

		}

		window.test.user.update = test;

	})();

})();