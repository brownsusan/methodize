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
	'userId' : {
		'type' : String,
		'required' : true
	},
	'title' : {
		'type' : String,
		'required' : true
	},
	'startDate' : {
		'type' : Date,
		'required' : true
	},
	'endDate' : {
		'type' : Date,
		'required' : true
	},
	'allDay' : Boolean,
	'reminder' : [{
		'start' : Date,
		'end' : Date,
		'frequency' : Number,
		'via' : {
			'type' : Array,
			'enum' : ['call', 'email', 'sms']
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
	'collection' : 'event',
	'versionKey' : false
});

Event.pre('save', function(next) {

	this.updated = new Date();

	next();

});

mongoose.model('Event', Event);
