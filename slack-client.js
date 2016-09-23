"use strict";
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const token = process.env.SLACK_API_TOKEN || '';
const getWeatherData = require('./nws-current-conditions-scraper');
const airports = require('./airports.json');
const _ = require('lodash');

let weatherBotId;
let weatherBotName;
const weatherBotDMChannel = 'D1VK6F805';

const rtm = new RtmClient(token, {
  logLevel: 'error',
  dataStore: new MemoryDataStore()
});

rtm.start();

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
	weatherBotId = rtmStartData.self.id; // U1VJTP4TS
  weatherBotName = rtmStartData.self.name;
	console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  if (message.subtype !== 'message_deleted' && messageContainsUserId(message,weatherBotId)) {
    const words = messageToWords(message);
    _.each(words, (w) => {
      const s = stationLookup(w);
      if (s !== null) {
        getWeatherReport(message.channel, station);
      }
    })
  	console.log('The message mentions me!');
  }
});

const getWeatherReport = (channelId, station) => {
	const url = `http://w1.weather.gov/data/obhistory/${station}.html`;
	getWeatherData(url, (data) => {
		rtm.sendMessage(constructWeatherMessage(data), channelId, () => {
			console.log('message sent.');
		});
	})
}

const messageToWords = (message) => {
  // get rid of any @user
  message = message.replace(/@[^\s.]+/g, '');
  message = message.replace(/[.,!$%\^&\*;:{}=\-_`~()\?]/g, ' ');
  message = message.replace(/\s{2,}/g,' ');
  const parts = message.split(' ');
  console.log(parts);
  return (_.filter(parts, (word) => word !== ''));
}

const stationLookup = (s) => {
  s = s.toUpperCase();
  const record = _.find(airports, (o) => o.airport === s );
  return (record) ? record.station : null
}

const constructWeatherMessage = (data) => {
  const latest = data.data[0];
  const items = [
  	`Current conditions for ${data.title}`,
  	`Weather: ${latest.weather}`,
  	`Temperature: ${latest.temp_air} degrees`,
  	`Humidity: ${latest.relative_humidity}`,
  	`Last updated: ${latest.parsedDate}`
  ];
  return items.join('\n  ');
}

const messageContainsUserId = (msg, userId) => {
	const pattern  = `<@${userId}>`;
  return (msg.text.indexOf(pattern) !== -1 || msg.channel === weatherBotDMChannel);
}

