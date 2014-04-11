//Create a 'complete' listener for the category creation
$(document).ready(function() {
	_socketConnection.emit('read_categories');
});

_socketConnection.on('read_categories_complete', function(data) {
	$('.category-list').empty();
	for (var i = 0, j = data.categories.length; i < j; i++) {
		var category = new EJS({
			url : '/view/ui/category.ejs'
		}).render(data.categories[i]);
		$('.category-list').append(category);
	};
});

_socketConnection.on('create_category_complete', function(data) {
	if (!data.error) {
		_socketConnection.emit('read_categories');
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
