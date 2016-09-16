"use strict";
const _ = require('lodash');
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const config = require('./.config.json');
const token = config.SLACK_API_TOKEN;
const getWeatherData = require('./nws-current-conditions-scraper');
let weatherBotId;

const rtm = new RtmClient(token, {
  logLevel: 'error',
  dataStore: new MemoryDataStore()
});

rtm.start();

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
	weatherBotId = rtmStartData.self.id;
	console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  if (message.subtype !== 'message_deleted' && messageContainsUserId(message.text,weatherBotId)) {
  	getWeatherReport(message.channel);
  	console.log('The message mentions me!');
  }
});

const getWeatherReport = (channelId) => {
	const url = 'http://w1.weather.gov/data/obhistory/KPVD.html';
	getWeatherData(url, (data) => {
    const currentTemp = data.data[0].temp_air;
		console.log(currentTemp);
		rtm.sendMessage("The current temperature is " + currentTemp, channelId, () => {
			console.log('message sent.');

		});
	})
}

const messageContainsUserId = (msg, userId) => {
	const pattern  = '<@' + userId + '>';
	return (msg.indexOf(pattern) !== -1);
}
