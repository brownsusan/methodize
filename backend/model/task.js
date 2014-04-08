var uuid = require('node-uuid');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Task = new Schema({
	'id' : {
		'type' : String,
		'default' : function() {
			return uuid.v4();
		}
	},
	'title' : String,
	'dueDate' : Date,
	'reminder' : [{
		'start' : Date,
		'end' : Date,
		'frequency' : Number,
		'via' : {
			'type':Array,
			'enum': ['call', 'email', 'sms']
		}
	}],
	'category' : String,
	'important' : Boolean,
	'subtask' : [{
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

mongoose.model('Task', Task); 