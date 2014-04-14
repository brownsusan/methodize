//Create a 'complete' listener for the category creation
db.categories = [];

_socketConnection.on('read_categories_complete', function(data) {

	while (db.categories.length > 0) {
		db.categories.pop();
	}

	for (var i = 0, j = data.categories.length; i < j; i++) {
		db.categories.push(data.categories[i]);
	}

});

_socketConnection.on('create_category_complete', function(data) {
	if (!data.error) {
	}
});
