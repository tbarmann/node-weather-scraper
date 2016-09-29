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
    const words = messageToWords(message.text);
    _.each(words, (w) => {
      const stationRecord = stationLookup(w);
      if (stationRecord !== null) {
        getWeatherReport(message.channel, stationRecord);
      }
    })
  	console.log('The message mentions me!');
  }
});

const getWeatherReport = (channelId, stationRecord) => {
  console.log(stationRecord);
	getWeatherData(stationRecord, (data) => {
		rtm.sendMessage(constructWeatherMessage(data), channelId, () => {
			console.log('message sent.');
		});
	})
}

const messageToWords = (message) => {
  // break up message into parts that are delimited by commas
  // get rid of any @user

  message = message.replace(/<@[^\s.]+/g, '');
  message = message.replace(/[.!$%\^&\*;:{}=\-_`~()\?]/g, ' ');
  message = message.replace(/\s{2,}/g,' ');
  let parts = message.split(',');
  parts = _.map(parts, (part) => part.trim());
  console.log(parts);
  return (_.filter(parts, (word) => word !== ''));
}

const stationLookup = (target) => {
  const airport = target.toUpperCase();
  let record = _.find(airports, (o) => o.airportId === airport );
  if (!record) {
    record = _.find(airports, (o) => o.city.toLowerCase().indexOf(target.toLowerCase()) !== -1);
  }
  return (record) ? record : null
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

