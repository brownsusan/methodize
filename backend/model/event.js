// Require needed libraries
var async = require('async');
var uuid = require('node-uuid');
var mongoose = require('mongoose');
var mongoosePostFind = require('mongoose-post-find');
var CategoryModel = mongoose.model('Category');

var Schema = mongoose.Schema;

var Event = new Schema({
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
	'collection' : 'event',
	'versionKey' : false
});

Event.pre('save', function(next) {

	this.updated = new Date();

	next();

});

// custom methods
// this acts simular to a post save but allows control flow
Event.methods = {
	'save': function(next) {

		var newEvent = this;

		newEvent.modelType = 'typeEvent';

		CategoryModel.findOne({
			'id' : newEvent.category
		}, function(err, results) {

			if (results != null) {

				newEvent.categoryObject = {
					'title' : results.title,
					'color' : results.color
				};

				next(null, newEvent);

			}

		});

	}
};

Event.plugin(mongoosePostFind, {

	'find' : function(results, next) {

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

	},
	'findOne' : function(result, next) {

		var newEvent = result;

		newEvent.modelType = 'typeEvent';

		CategoryModel.findOne({
			'id' : newEvent.category
		}, function(err, results) {

			if (results != null) {

				newEvent.categoryObject = {
					'title' : results.title,
					'color' : results.color
				};

				next(null, newEvent);

			}

		});

	}
});

mongoose.model('Event', Event);
