var taskId;

//Create a 'complete' listener for the sign in
// triggers when the db.tasks updates
_.observe(db.tasks, function() {

	$('.task-task-list').empty();
	$('.task-completedTask-list').empty();

	for (var i = 0, j = db.tasks.length; i < j; i++) {

		if (db.tasks[i].completed === false) {
			var task = new EJS({
				url : '/view/ui/task-item.ejs'
			}).render(db.tasks[i]);
			$('.task-task-list').append(task);
		}

		if (db.tasks[i].completed === true) {
			var task = new EJS({
				url : '/view/ui/task-item.ejs'
			}).render(db.tasks[i]);
			$('.task-completedTask-list').append(task);
		}
	}

});

// triggers when adding a new task to a category
$('#task_taskAdd_input').keypress(function(event) {

	if (event.which == 13) {
		//Manipulate the data
		var title = $('#task_taskAdd_input').val();
		//Figure out how to determine category
		var category = $('#parent-category').val();

		if (!category) {
			//Find the actual inbox id here
			category = $('#user-default-category').val();
			;
		}

		_socketConnection.emit('create_task', {
			'title' : title,
			'category' : category
		});
	}
});

// triggers when clicking a task item to view it's details
$(document).on('click', '.task-item', function(event) {
	$('.active-task').removeClass('active-task');
	$(this).addClass('active-task');

	var clickedTaskId = $(this).find('.task-item-id').val();

	var task = _(db.tasks).where({
		'id' : clickedTaskId
	});

	var clickedTask = task[0];
	var title = clickedTask.title;
	var dueDate = clickedTask.dueDate;
	var categoryId = clickedTask.category;
	var important = clickedTask.important;
	var reminder = clickedTask.reminder;
	var subtask = clickedTask.subtask;
	var note = clickedTask.note;
	var categoryObject = clickedTask.categoryObject;

	var calEvent = {
		'id' : clickedTaskId,
		'title' : title,
		'start' : dueDate,
		'end' : dueDate,
		'categoryId' : categoryId,
		'category' : categoryObject.title,
		'color' : '#f7f8f9',
		'categoryColor' : categoryObject.color,
		'important' : important,
		'allDay' : true,
		'reminder' : reminder,
		'subtasks' : subtask,
		'note' : note,
		'modelType' : 'typeTask'
	};

	// console.log(calEvent);
	setFields(calEvent);
	openDetails(calEvent);

});

// When an item is deleted
$(document).on('click', '.task-item-delete', function(event) {
	var id = $(this).closest('.task-item').find('.task-item-id').val();
	_socketConnection.emit('delete_task', {
		'id' : id
	});
});

// When a task is checked off
$(document).on('click', '.task-item input[type=checkbox]', function(event) {

	var id = $(this).closest('.task-item').find('.task-item-id').val();

	var completed = $(this).is(':checked');

	console.log(id);
	console.log(completed);

	_socketConnection.emit('update_task', {
		'id' : id,
		'completed' : completed
	});

});
