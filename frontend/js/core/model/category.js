db.categories = [];

//Create a 'complete' listener for the category creation
// create
_socketConnection.on('create_category_complete', function(data) {

	console.log('on create_category_complete');

	// check if an error occured
	if (data.error) {
		return;
	}

	_socketConnection.emit('read_categories');

});

// read
_socketConnection.on('read_categories_complete', function(data) {

	console.log('on read_categories_complete');

	// check if an error occured
	if (data.error) {
		return;
	}

	while (db.categories.length > 0) {
		db.categories.pop();
	}

	for (var i = 0, j = data.categories.length; i < j; i++) {
		db.categories.push(data.categories[i]);
	}

});

// update
_socketConnection.on('update_category_complete', function(data) {

	console.log('on update_category_complete');

	// check if an error occured
	if (data.error) {
		return;
	}

	_socketConnection.emit('read_categories');

});

// delete
_socketConnection.on('delete_category_complete', function(data) {

	console.log('on delete_category_complete');

	// check if an error occured
	if (data.error) {
		return;
	}

	_socketConnection.emit('read_categories');

});
