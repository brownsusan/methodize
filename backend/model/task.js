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
	'categoryObject' : Object,
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

Task.plugin(mongoosePostFind, {

	'find' : function(results, next) {

		async.each(results, function(task, nextTask) {

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

		CategoryModel.findOne({
			'id' : task.category
		}, function(err, results) {

			task.modelType = 'typeTask';

			if (results != null) {

				task.categoryObject = {
					'title' : results.title,
					'color' : results.color
				};

				next();

			} else {

				task.categoryObject = {
					'title' : '',
					'color' : ''
				};

				next();

			}

		});

	}
});

mongoose.model('Task', Task);
