var _ = require('lodash');
var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;

var MemoryDataStore = require('@slack/client').MemoryDataStore;

var config = require('./.config.json');
var token = config.SLACK_API_TOKEN;
var weatherBotId;
const getWeatherData = require('./nws-current-conditions-scraper');


//var token = process.env.SLACK_API_TOKEN || '';

var rtm = new RtmClient(token, {
  logLevel: 'error',
  dataStore: new MemoryDataStore()
});
rtm.start();


rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
	weatherBotId = rtmStartData.self.id;
	console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  if (message.subtype !== 'message_deleted' && isMessageToUserId(message.text,weatherBotId)) {
  	getWeatherReport(message.channel);
  	console.log('The message mentions me!');
  }
});

function getWeatherReport(channelId) {
	const url = 'http://w1.weather.gov/data/obhistory/KPVD.html';
	getWeatherData(url, (data) => {
		console.log(data[0].temp_air);
		rtm.sendMessage(data[0].temp_air, channelId, () => {
			console.log('message sent.');
 
		});
	})
}

function isMessageToUserId(msg, userId) {
	pattern  = '<@' + userId + '>';
	return (msg.indexOf(pattern) !== -1);
}
