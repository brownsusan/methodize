//Create a 'complete' listener for the category creation
db.categories = [];

_socketConnection.on('read_categories_complete', function(data) {
	console.log('read_categories_complete');
	while (db.categories.length > 0) {
		db.categories.pop();
	}

	for (var i = 0, j = data.categories.length; i < j; i++) {
		db.categories.push(data.categories[i]);
	}
	
	// for (var i = 0, j = db.categories.length; i < j; i++) {
		// $('#task-submit-category').append('<option value="' + db.categories[i].id + '">' + db.categories[i].title + '</option>');
	// };

});

_socketConnection.on('create_category_complete', function(data) {
	console.log('create_category_complete');
	if (!data.error) {
		_socketConnection.emit('read_categories');
	}
});

_socketConnection.on('update_category_complete', function(data) {
	console.log('update_category_complete');
	if (!data.error) {
	}

	_socketConnection.emit('read_categories');
});

_socketConnection.on('delete_category_complete', function(data) {
	console.log('delete_category_complete');
	_socketConnection.emit('read_categories');
}); 