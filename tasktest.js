var twilio = require("twilio");

//TWILIO CONCEPT
// TODO
// Set the interval to check the tasks and events
var processing = false;

// This is the testing account info

// TODO
// Need a way to get the number for the user attached to the reminder
var accountSid = 'AC42333c57015730911c7cebcbb78c587d';
var authToken = 'ef9243210c35fb75d8053a1b1f8ffed2';
var twilioNumber = '+17343657844';

// TODO
// Set a message to send. "You have a reminder for the 'Event' or 'Task' called 'Title'. This item is due at this 'time' on this 'day'."
var client = new twilio.RestClient(accountSid, authToken);
client.sendSms({
	body : "Testing",
	to : "+18133104868",
	from : twilioNumber
}, function(error, message) {
	if (!error) {
		console.log('Success! The SID for this SMS message is:');
		console.log(message.sid);

		console.log('Message sent on:');
		console.log(message.dateCreated);
	} else {
		console.log('Oops! There was an error.');
		console.log('Error: ' + JSON.stringify(error));
	}
});

window.setInterval(function() {
	// Make a new date object
	var currentTime = new Date();
	// TODO
	// Format this date object with moment
	var data = [];
	// Query the database for all tasks and events
	EventModel.find({}, function(err, results) {

		if (err || !results) {
			return;
		}
		for (var i = 0, j = results.length; i < j; i++) {
			// push results[i] into an array
			data.push(results[i]);
		};
		TaskModel.find({}, function(err, results) {
			if (err || !results) {
				return;
			}
			for (var i = 0, j = results.length; i < j; i++) {
				// push results[i] into an array
				data.push(results[i]);
			};
		});
	});

	for (var i = 0, j = data.length; i < j; i++) {
		//Loop over the reminders for the current index
		var reminders = data[i].reminder;
		if (reminders != undefined && reminders.length != 0) {
			for (var i = 0, j = reminders.length; i < j; i++) {
				// Check the start time of the reminder against the current date
				var startDate = reminders[i].start;
				var via = reminders[i].via;
				var frequency = reminders[i].frequency;

				if (currentDate == startDate) {
					if (frequency == 0) {
						if (via.phone == true) {
							//Make a call
						}
						if (via.sms == true) {
							//Make an sms
						}
					} else {
						// Task the frequency and multiply it by 60000 (the amount of millisecons in a minute)
						var frequencyMs = frequency * 60000;
						window.setInterval(function() {
							if (via.phone == true) {
								//Make a call
							}
							if (via.sms == true) {
								//Make an sms
							}
						}, frequencyMs);
					}
				}
			}
			// Set timeout for reminder end date/time
			// console.log('Checking the events and tasks');)
		};
	};

}, 6000);
