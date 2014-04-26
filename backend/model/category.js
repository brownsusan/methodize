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
			var colors = ['#E32727', '#2D95BF', '#F27D28', '#FF5F7D', '#4EBA6F', '#955BA5', '#089943', '#F0C62C', '#4D32FF'];
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
