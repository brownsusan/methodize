// Require needed libraries
var blueimpMd5 = require('blueimp-md5');
var uuid = require('node-uuid');
var mongoose = require('mongoose');

var md5 = blueimpMd5.md5;
var Schema = mongoose.Schema;

var User = new Schema({
	'id' : {
		'type' : String,
		'default' : function() {
			return uuid.v4();
		}
	},
	'email' : {
		'type' : String,
		'required' : true,
		'lowercase' : true,
		'trim' : true,
		'unique': true,
		'validate': function(val) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(val);
		}
	},
	'password' : {
		'type' : String,
		'required' : true,
		'set' : function(value) {
			return md5(value + this.salt);
		}
	},
	'salt' : {
		'type' : String,
		'default' : function() {
			return uuid.v4();
		}
	},
	'phoneNumber' : String,
	'created' : {
		'type' : Date,
		'default' : new Date()
	},
	'updated' : Date,
}, {
	'collection' : 'user',
	'versionKey' : false
});

User.pre('save', function(next) {

	this.updated = new Date();

	next();

});

mongoose.model('User', User);
