//Create a 'complete' listener for the category creation
_socketConnection.on('create_category_complete', function(data) {
	if (!data.error) {
		console.log('no errors mama');
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