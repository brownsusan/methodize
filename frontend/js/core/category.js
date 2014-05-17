//Create a 'complete' listener for the category creation
_.observe(db.categories, function() {

	$('#addPanel_addTask_category_select').empty();
	$('#addPanel_addEvent_category_select').empty();
	$('#eventEdit_category_select').empty();
	$('#taskEdit_category_select').empty();

	for (var i = 0, j = db.categories.length; i < j; i++) {
		$('#addPanel_addTask_category_select, #addPanel_addEvent_category_select, #eventEdit_category_select, #taskEdit_category_select').append('<option value="' + db.categories[i].id + '">' + db.categories[i].title + '</option>');
		// $('#addPanel_addEvent_category_select').append('<option value="' + db.categories[i].id + '">' + db.categories[i].title + '</option>');
	};

	$('.task-category-list').empty();

	for (var i = 0, j = db.categories.length; i < j; i++) {
		var category = new EJS({
			url : '/view/ui/category.ejs'
		}).render(db.categories[i]);
		$('.task-category-list').append(category);
	}

});

_socketConnection.on('create_category_complete', function(data) {
	if (!data.error) {
	}
});

$('#task_categoryAdd_input').keypress(function(event) {
	if (event.which == 13) {
		//Validation Here
		//Manipulate the data
		var title = $('#task_categoryAdd_input').val();

		_socketConnection.emit('create_category', {
			'title' : title
		});
	}
});

$(document).on('dblclick', '.category', function(event) {
	if ($(this).find('.category-id').val() != $('#user-default-category').val()) {
		$(this).find('.category-title').hide();
		$(this).find('.category-title-edit').show();
	}
	// TODO
	// alert("You can't edit that bitch");
});

$(document).on('keypress', '.category-title-edit', (function(event) {
	if (event.which == 13 && $(this).closest().find('.category-id').val() != $('#user-default-category').val()) {
		//Manipulate the data
		var title = $(this).closest('.category').find('.category-title-edit').val();
		var id = $(this).closest('.category').find('.category-id').val();
		//Figure out how to determine color
		_socketConnection.emit('update_category', {
			'id' : id,
			'title' : title
		});
	}
	// TODO
	// alert("You can't edit that bitch");
}));

$(document).on('click', '.category-delete', function(event) {
	var id = $(this).closest('.category').find('.category-id').val();
	_socketConnection.emit('delete_category', {
		'id' : id
	});
});
