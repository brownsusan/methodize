var uuid = require('node-uuid');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Event = new Schema({
	'id' : {
		'type' : String,
		'default' : function() {
			return uuid.v4();
		}
	},
	'title' : String,
	'startDate' : Date,
	'endDate' : Date,
	'allDay' : Boolean,
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

Event.pre('save', function(next) {

	this.updated = new Date();

	next();

});

mongoose.model('Event', Event); 