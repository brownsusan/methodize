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
	};

});

_socketConnection.on('update_subtask_complete', function(data) {
	$('.subtasks').empty();
	var subtasks = data.task.subtask;
	if (subtasks === undefined) {
	} else {
		for (var i = 0, j = subtasks.length; i < j; i++) {
			var subtask = new EJS({
				url : '/view/ui/subtask.ejs'
			}).render(subtasks[i]);
			$('.subtasks').append(subtask);
		};
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
	// Here I could construct a calEvent object and use the public functions
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
	console.log(clickedTask);
	// var color = clickedTask.id;
	// var category = clickedTask.category;
	// console.log(' title ' + title + ' due ' + dueDate +
	// 'categoryId' + categoryId + 'important' + important +
	// ' reminders ' + reminders + ' subtasks ' + subtasks + ' note ' + note);
	var calEvent = {
		'id' : clickedTaskId,
		'title' : title,
		'dueDate' : dueDate,
		'categoryId' : categoryId,
		'category' : categoryObject.title,
		'color' : categoryObject.color,
		'important' : important,
		'reminder' : reminder,
		'subtasks' : subtask,
		'note' : note,
		'modelType' : 'typeTask'
	}
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
$(document).on('click', 'input[type=checkbox]', function(event) {
	var id = $(this).closest('.task-item').find('.task-item-id').val();
	var completed = $(this).is(":checked");
	_socketConnection.emit('update_task', {
		'id' : id,
		'completed' : completed
	});
});

$(document).on('click', '.subtasks li', function(event) {
	$(this).find('.subtask-title').addClass('core-hidden');
	$(this).find('.subtask-title-edit').removeClass('core-hidden');
});

$(document).on('keypress', '.subtask-title-edit', function(event) {
	if (event.which === 13) {
		var subtaskId = $(this).closest('.subtasks li').find('.subtask-id').val();
		var title = $(this).closest('.subtasks li').find('.subtask-title-edit').val();
		_socketConnection.emit('update_subtask', {
			'taskId' : taskId,
			'subtaskId' : subtaskId,
			'title' : title
		});
	}
});

