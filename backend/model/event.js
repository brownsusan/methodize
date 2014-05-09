var async = require('async');
var uuid = require('node-uuid');
var mongoose = require('mongoose');
var mongoosePostFind = require('mongoose-post-find');
var CategoryModel = mongoose.model('Category');

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
	'category' : {
		'type' : String,
		'required' : true
	},
	'categoryObject' : Object,
	'important' : Boolean,
	'subtask' : [{
		'title' : String,
		'completed' : Boolean
	}],
	'note' : String,
	'modelType' : String
}, {
	'collection' : 'event',
	'versionKey' : false
});

Event.pre('save', function(next) {

	this.updated = new Date();

	next();

});

Event.plugin(mongoosePostFind, {
	find : function(results, next) {
		async.each(results, function(newEvent, nextEvent) {

			newEvent.modelType = 'typeEvent';

			CategoryModel.findOne({
				'id' : newEvent.category
			}, function(err, results) {
				if (results != null) {
					newEvent.categoryObject = {
						'title' : results.title,
						'color' : results.color
					};
					nextEvent();
				}
			});

		}, function(err) {
			next(null, results);
		});
	}
});

mongoose.model('Event', Event);
