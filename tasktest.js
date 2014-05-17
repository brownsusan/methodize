//When The Edit Button Is Clicked
$(document).on('click', '#taskDetail_editTask_button', function() {

	var id = $('#taskDetail_id_input').val();

	// get the task from the client side model
	var tasks = _(db.tasks).where({
		'id' : id
	});

	var task = tasks[0];

	$('#taskEdit_id_input').val(task.id);
	$('#taskEdit_title_input').val(task.title);
	// TODO
	// $('#taskEdit_dueDate_input').datetimepicker();

	// show reminders
	$('#taskEdit_reminders_container').empty();
	var reminders = task.reminder;
	for (var i = 0, j = reminders.length; i < j; i++) {
		var reminder = new EJS({
			url : '/view/ui/reminder-display.ejs'
		}).render(reminders[i]);
		$('#taskEdit_reminders_container').append(reminder);
	}

	// show categories
	$('#taskEdit_category_select').empty();
	var categories = db.categories;
	for (var i = 0, j = categories.length; i < j; i++) {
		var category = '<option value="' + categories[i].id + '">' + categories[i].title + '</option>';
		$('#taskEdit_category_select').append(category);
	}

	$('#taskEdit_important_input').attr('checked', task.important);

	// show subtasks
	$('.subtasks').empty();
	var subtasks = task.subtask;
	for (var i = 0, j = subtasks.length; i < j; i++) {
		var subtask = new EJS({
			url : '/view/ui/subtask.ejs'
		}).render(subtasks[i]);
		$('.task-edit .subtasks').append(subtask);
	}

	$('.taskDetail-container').hide();
	$('.taskEdit-container').show();

});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// $('#taskDetail_id_input').val(clickedTask.id);
// $('#taskEdit_id_input').val(clickedTask.id);
// $('#taskDetail_title').html(clickedTask.title);
// $('#taskEdit_title_input').val(clickedTask.title);
// $('.task-pageHeading-task').html(' : ' + clickedTask.title);
// $('#taskDetail_dueDate').html(clickedTask.dueDate);
// $('#taskDetail_note_textarea').html(task.note);
// $('#taskEdit_note_textarea').html(task.note);
//
// // show reminders
// $('#taskDetail_reminders_container').empty();
// var reminders = clickedTask.reminder;
// if (reminders === undefined) {
// } else {
// for (var i = 0, j = reminders.length; i < j; i++) {
// reminders[i]
// var reminder = new EJS({
// url : '/view/ui/reminder-display.ejs'
// }).render(reminders[i]);
// $('#taskDetail_reminders_container').append(reminder);
//
// };
// }
//
// $('#taskDetail_important_input').attr("checked", clickedTask.important);
//
// // show subtasks
// $('.subtasks').empty();
// var subtasks = clickedTask.subtask;
// if (subtasks === undefined) {
// } else {
// for (var i = 0, j = subtasks.length; i < j; i++) {
// subtasks[i]
// var subtask = new EJS({
// url : '/view/ui/subtask.ejs'
// }).render(subtasks[i]);
// $('.subtasks').append(subtask);
// };
// }
// $('#taskDetail_note_textarea').html(task.note);