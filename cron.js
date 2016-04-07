/*
 * Utility-helper functions
 */

var sendSlackMessage = function(message) {
	var request = require('request');

	request.post({
		headers: {'content-type' : 'application/x-www-form-urlencoded'},
		url: 'https://hooks.slack.com/services/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',
		body: JSON.stringify({text: message})
	});
};

/*
 * Check if there is a need to take out the trash, and if so, what kind of trash
 * do we have to get out today. Send a message to #general with the relevant info
 */

var checkPoubelles = function() {
	// Idéalement on irait chercher ça via une API..
	var calendar = [
		{date: '01/03/2016', content: 'blanches et carton'},
		{date: '02/03/2016', content: 'organiques'},
		{date: '04/03/2016', content: 'blanches'},
		{date: '08/03/2016', content: 'blanches et bleues'},
		{date: '09/03/2016', content: 'organiques'},
		{date: '11/03/2016', content: 'blanches'},
		{date: '15/03/2016', content: 'blanches et carton'},
		{date: '16/03/2016', content: 'organiques'},
		{date: '18/03/2016', content: 'blanches'},
		{date: '22/03/2016', content: 'blanches et bleues'},
		{date: '22/03/2016', content: 'organiques'},
		{date: '25/03/2016', content: 'blanches'},
		{date: '29/03/2016', content: 'blanches et carton'},
		{date: '30/03/2016', content: 'organiques'},
		{date: '01/04/2016', content: 'blanches'},
		{date: '05/04/2016', content: 'blanches et bleues'},
		{date: '06/04/2016', content: 'organiques'},
		{date: '08/04/2016', content: 'blanches'},
		{date: '12/04/2016', content: 'blanches et carton'},
		{date: '13/04/2016', content: 'organiques'},
		{date: '15/04/2016', content: 'blanches'},
		{date: '19/04/2016', content: 'blanches et bleues'},
		{date: '20/04/2016', content: 'organiques'},
		{date: '22/04/2016', content: 'blanches'},
		{date: '26/04/2016', content: 'blanches et carton'},
		{date: '27/04/2016', content: 'organiques'},
		{date: '29/04/2016', content: 'blanches'},
		{date: '03/05/2016', content: 'blanches et bleues'},
		{date: '04/05/2016', content: 'organiques'},
		{date: '06/05/2016', content: 'blanches'},
		{date: '10/05/2016', content: 'blanches et carton'},
		{date: '11/05/2016', content: 'organiques'},
		{date: '13/05/2016', content: 'blanches'},
		{date: '17/05/2016', content: 'blanches et bleues'},
		{date: '18/05/2016', content: 'organiques'},
		{date: '20/05/2016', content: 'blanches'},
		{date: '24/05/2016', content: 'blanches et carton'},
		{date: '25/05/2016', content: 'organiques'},
		{date: '27/05/2016', content: 'blanches'},
		{date: '31/05/2016', content: 'blanches et bleues'},
		{date: '01/06/2016', content: 'organiques'},
		{date: '03/06/2016', content: 'blanches'},
		{date: '07/06/2016', content: 'blanches et carton'},
		{date: '08/06/2016', content: 'organiques'},
		{date: '10/06/2016', content: 'blanches'},
		{date: '14/06/2016', content: 'blanches et bleues'},
		{date: '15/06/2016', content: 'organiques'},
		{date: '17/06/2016', content: 'blanches'},
		{date: '21/06/2016', content: 'blanches et carton'},
		{date: '22/06/2016', content: 'organiques'},
		{date: '24/06/2016', content: 'blanches'},
		{date: '28/06/2016', content: 'blanches et bleues'},
		{date: '29/06/2016', content: 'organiques'},
		{date: '01/07/2016', content: 'blanches'},
		{date: '05/07/2016', content: 'blanches et carton'},
		{date: '06/07/2016', content: 'organiques'},
		{date: '08/07/2016', content: 'blanches'},
		{date: '12/07/2016', content: 'blanches et bleues'},
		{date: '13/07/2016', content: 'organiques'},
		{date: '15/07/2016', content: 'blanches'},
		{date: '19/07/2016', content: 'blanches et carton'},
		{date: '20/07/2016', content: 'organiques'},
		{date: '22/07/2016', content: 'blanches'},
		{date: '26/07/2016', content: 'blanches et bleues'},
		{date: '27/07/2016', content: 'organiques'},
		{date: '29/07/2016', content: 'blanches'},
		{date: '02/08/2016', content: 'blanches et carton'},
		{date: '03/08/2016', content: 'organiques'},
		{date: '05/08/2016', content: 'blanches'},
		{date: '09/08/2016', content: 'blanches et bleues'},
		{date: '10/08/2016', content: 'organiques'},
		{date: '12/08/2016', content: 'blanches'},
		{date: '16/08/2016', content: 'blanches et carton'},
		{date: '17/08/2016', content: 'organiques'},
		{date: '19/08/2016', content: 'blanches'},
		{date: '23/08/2016', content: 'blanches et bleues'},
		{date: '24/08/2016', content: 'organiques'},
		{date: '26/08/2016', content: 'blanches'},
		{date: '30/08/2016', content: 'blanches et carton'},
		{date: '31/08/2016', content: 'organiques'}
	],
		moment = require('moment'),
		messageSent = false;

	console.log('Looking through the calendar to see if today we should take the trash out');

	for (var i = calendar.length - 1, tomorrow = moment().add(1, 'days').format('DD/MM/YYYY'), cal; i >= 0; i--) {
		cal = calendar[i];
		
		if (tomorrow == cal['date']) {
			sendSlackMessage('Hey les keks, oubliez pas de sortir les poubelles *'+cal['content']+'* !\nGenre demain avant 6h pour bien faire :wink:');

			messageSent = true;
			console.log('Found something! Notified the team via Slack');
		}
	}

	if (!messageSent) sendSlackMessage("Hey les gars, je pense que mon calendrier des poubelles n'est plus à jour :thinking_face:");
};



var remindRent = function() {
	sendSlackMessage('Yo les boys, on est déjà le 8 faut déjà repenser au loyer qui va tomber bientôt.. :money_with_wings::money_with_wings::money_with_wings:\nPour rappel, les loyers sont respectivement de *477*€ et *517*€.');
};


/*
 * Execute the different actions depending on the --action argument
 * sent when launching the script
 */

var argv = require('minimist')(process.argv.slice(2));

switch(argv['action']) {
	case 'poubelles':
		console.log('Je lance la routine pour savoir quelles sont les poubelles à sortir ce soir');
		checkPoubelles();
		break;

	case 'rent':
		console.log('Je m\'apprête à leur rappeler gentiment que le loyer approche');
		remindRent();
		break;

	default:
		console.log('Il est nécessaire de spécifier une action à réaliser jeune kek!');
}