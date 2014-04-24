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
		'default' : function(){
			var colors = ['red', 'blue', 'orange', 'hotpink', 'green', 'purple', 'black', 'gold', 'deepskyblue'];
			var color = colors[~~(Math.random()*colors.length)];
			console.log(color);
			return color;
		},
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
