// Require needed libraries
var async = require('async');
var uuid = require('node-uuid');
var mongoose = require('mongoose');
var mongoosePostFind = require('mongoose-post-find');
var CategoryModel = mongoose.model('Category');

var Schema = mongoose.Schema;

var Task = new Schema({
	// userId is a foriegn key to the user collection's id property
	'userId' : {
		'type' : String,
		'required' : true
	},
	// category is a foriegn key to the category collection's id property
	'category' : {
		'type' : String,
		'required' : true
	},
	'categoryObject' : Object,
	'id' : {
		'type' : String,
		'default' : function() {
			return uuid.v4();
		}
	},
	'title' : {
		'type' : String,
		'required' : true
	},
	'dueDate' : Date,
	'reminder' : [{
		'id' : {
			'type' : String,
			'default' : function() {
				return uuid.v4();
			}
		},
		'start' : Date,
		'end' : Date,
		'frequency' : Number,
		'via' : {
			'type' : Array,
			'enum' : ['call', 'email', 'sms']
		}
	}],
	'completed' : {
		'type' : Boolean,
		'default' : false
	},
	'important' : Boolean,

	'note' : String,
	'modelType' : String,
	'subtask' : [{
		'id' : {
			'type' : String,
			'default' : function() {
				return uuid.v4();
			}
		},
		'title' : String,
		'completed' : Boolean
	}]
}, {
	'collection' : 'task',
	'versionKey' : false
});

Task.pre('save', function(next) {

	this.updated = new Date();

	next();

});

// custom methods
// this acts simular to a post save but allows control flow
Task.methods = {
	'store' : function(instance, next) {

		instance.save(function(err, result) {

			if (err || !result) {
				next(err, result);
				return;
			}

			var task = result;

			CategoryModel.findOne({
				'id' : task.category
			}, function(err, results) {

				task.modelType = 'typeTask';

				if (results != null) {

					task.categoryObject = {
						'title' : results.title,
						'color' : results.color
					};

					next(null, task);

				} else {

					task.categoryObject = {
						'title' : '',
						'color' : ''
					};

					next(null, task);

				}

			});

		});

	}
};

Task.plugin(mongoosePostFind, {

	'find' : function(results, next) {

		var tasks = results;

		// if no tasks were found
		if (!tasks) {
			next(null, []);
			return;
		}

		async.each(tasks, function(task, nextTask) {

			CategoryModel.findOne({
				'id' : task.category
			}, function(err, results) {

				task.modelType = 'typeTask';

				if (results != null) {

					task.categoryObject = {
						'title' : results.title,
						'color' : results.color
					};

					nextTask();

				} else {

					task.categoryObject = {
						'title' : '',
						'color' : ''
					};

					nextTask();

				}

			});

		}, function(err) {
			next(null, results);
		});

	},

	'findOne' : function(result, next) {

		var task = result;

		// if no task was found
		if (!task) {
			next(null, null);
			return;
		}

		task.modelType = 'typeTask';

		CategoryModel.findOne({
			'id' : task.category
		}, function(err, results) {

			if (results != null) {

				task.categoryObject = {
					'title' : results.title,
					'color' : results.color
				};

				next(null, task);

			} else {

				task.categoryObject = {
					'title' : '',
					'color' : ''
				};

				next(null, task);

			}

		});

	}
});

mongoose.model('Task', Task); 