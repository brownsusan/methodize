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
			var colors = ['#FF4343', '#FF8C3E', '#FFD13E', '#92C472', '#13A566', '#65C2CE', '#9A69F9', '#955BA5', '#FF6E8D'];
			var color = colors[~~(Math.random()*colors.length)];
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
