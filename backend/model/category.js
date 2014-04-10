var uuid = require('node-uuid');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Category = new Schema({
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
	'color' : {
		'type' : String,
		'required' : true
	}
}, {
	'collection' : 'category',
	'versionKey' : false
});

Category.pre('save', function(next) {

	this.updated = new Date();

	next();

});

mongoose.model('Category', Category);
