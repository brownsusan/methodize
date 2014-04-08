var blueimpMd5 = require('blueimp-md5');
var uuid = require('node-uuid');
var mongoose = require('mongoose');

var md5 = blueimpMd5.md5;
var Schema = mongoose.Schema;

// this setter to lowercase the email
function setEmail(value) {
	return value.toLowerCase();
}

var User = new Schema({
	'id' : {
		'type' : String,
		'default' : function() {
			return uuid.v4();
		}
	},
	'firstName' : String,
	'lastName' : String,
	'email' : {
		'type' : String,
		'required' : true,
		'set' : setEmail
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
