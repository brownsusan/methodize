var async = require('async');
var uuid = require('node-uuid');
var mongoose = require('mongoose');
var mongoosePostFind = require('mongoose-post-find');
var CategoryModel = mongoose.model('Category');

var Schema = mongoose.Schema;

var Task = new Schema({
	'id' : {
		'type' : String,
		'default' : function() {
			return uuid.v4();
		}
	},
	'userId' : {
		'type' : String,
		'required' : true
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
	'category' : {
		'type' : String,
		'required' : true
	},
	'categoryObject' : Object,
	'completed' : {
		'type' : Boolean,
		'default' : false
	},
	'important' : Boolean,
	'subtask' : [{
		'id' : {
			'type' : String,
			'default' : function() {
				return uuid.v4();
			}
		},
		'title' : String,
		'completed' : Boolean
	}],
	'note' : String,
}, {
	'collection' : 'task',
	'versionKey' : false
});

Task.pre('save', function(next) {

	this.updated = new Date();

	next();

});

Task.plugin(mongoosePostFind, {
	find : function(results, next) {
		async.each(results, function(task, nextTask) {
			CategoryModel.findOne({
				'id' : task.category
			}, function(err, results) {
				if (results != null) {
					task.categoryObject = {
						'title' : results.title,
						'color' : results.color
					};
					nextTask();
				}
			});

		}, function(err) {
			next(null, results);
		});
	}
});

mongoose.model('Task', Task);
