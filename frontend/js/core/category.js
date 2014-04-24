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

$('#category-add-input').keypress(function(event) {
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

$(document).on('dblclick', '.category', function(event) {
	console.log('dbl');
	$(this).find('.category-title').hide();
	$(this).find('.pill-color-rep').hide();
	$(this).find('.category-title-edit').show();
});

$(document).on('keypress', '.category-title-edit', (function(event) {
	if (event.which == 13) {
		//Manipulate the data
		var title = $(this).closest('.category').find('.category-title-edit').val();
		var id = $(this).closest('.category').find('.category-id').val();
		//Figure out how to determine color
		_socketConnection.emit('update_category', {
			'id' : id,
			'title' : title
		});
	}
}));

$(document).on('click', '.category-delete', function(event) {
	console.log('click');
	var id = $(this).closest('.category').find('.category-id').val();
	_socketConnection.emit('delete_category', {
		'id' : id
	});
});
