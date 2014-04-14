//Create a 'complete' listener for the category creation
_.observe(db.categories, function() {
	
	$('#task-submit-category').empty();
	
	for (var i = 0, j = db.categories.length; i < j; i++) {
		$('#task-submit-category').append('<option value="' + db.categories[i].id + '">' + db.categories[i].title + '</option>');
	};

	$('.category-list').empty();
	
	for (var i = 0, j = db.categories.length; i < j; i++) {
		var category = new EJS({
			url : '/view/ui/category.ejs'
		}).render(db.categories[i]);
		$('.category-list').append(category);
	}
	
});

_socketConnection.on('create_category_complete', function(data) {
	if (!data.error) {
	}

});

$('#category-add-input').keypress(function() {
	if (event.which == 13) {
		//Validation Here
		//Manipulate the data
		var title = $('#category-add-input').val();
		//Figure out how to determine color
		var color = 'red';

		_socketConnection.emit('create_category', {
			'title' : title,
			'color' : color
		});
	}
});
