var twilio = require("twilio");

//TWILIO CONCEPT
// TODO
// Set the interval to check the tasks and events
// window.setInterval(function() {checkEventsAndTasks()},3000);

// TODO
// Check the events and tasks
// var checkEventsAndTasks = function() {
	// TODO
	// Read all tasks and events in the database for EVERY USER
	// Loop over the returned events and tasks
		// Check to see if any reminders exists
		// If so, loop over the reminders
			// In the loop - Check and store the reminder start date
			// In the loop - Check and store the via array
			// If the reminder start date is within 30 seconds of the current time and the frequency is once
				// If via.phone is true
				// Send out a call
				// If via.sms is true
				// Send out an sms
			// If the reminder start date is within 30 seconds and the frquency is not once
				// Set another interval dependant on the frequency field
				// if via.phone is true
				// Send out a call
				// if via.sms is true
				// Send out an sms
				// Set timeout for reminder end date/time	
// console.log('Checking the events and tasks');
// }



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
	to : "+12488803127",
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