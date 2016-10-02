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
    handleMessage(message);
  }
});

const handleMessage = (message) => {
  message.text = cleanMessage(message.text);
  const words = messageToWords(message.text);
  const stationRecords = stationLookup(airports, words);
  if (stationRecords.length === 0) {
    rtm.sendMessage(`I don't have any information about '${message.text}'. ${saySorry()}.`, message.channel);
  }
  else if (stationRecords.length > 1) {
    sendNeedsMoreInfoMessage(message.channel, stationRecords);
  }
  else {
//    const stationRecord = stationRecords.shift();
    sendWeatherReport(message.channel, stationRecords.shift());
  }
}

const sendNeedsMoreInfoMessage = (channelId, stationRecords) => {
  const reply = ['Multiple records found.'];
  _.each(stationRecords, (stationRecord) => {
    reply.push(`If you meant ${stationRecord.name}, use ${stationRecord.airportId}`);
  })
  rtm.sendMessage(reply.join('\n'), channelId);
}


const sendWeatherReport = (channelId, stationRecord) => {
  console.log(stationRecord);
	getWeatherData(stationRecord, (data) => {
		rtm.sendMessage(constructWeatherMessage(data, stationRecord), channelId, () => {
			console.log('message sent.');
		});
	})
}

const cleanMessage = (message) => {
  // get rid of any @user
  message = message.replace(/<@[^\s.]+/g, '');
  message = message.replace(/[!$%\^&\*;:{}=\-_`~()\?]/g, ' ');
  message = message.replace(/\s{2,}/g,' ');
  return message.trim();
}

const messageToWords = (message) => {
  // break up message into parts that are delimited by spaces
  let parts = message.split(' ');
  return _.concat([message], parts);
}

const stationLookup = (airports, words) => {
  const target = words.shift();
  const targetLower = target.toLowerCase();
  let records = [];

  if (target.length === 3) {
    records = _.filter(airports, (o) => o.airportId === target.toUpperCase() );
  }
  if (records.length === 0) {
    records = _.filter(airports, (o) => o.city.toLowerCase().indexOf(targetLower) !== -1);
  }
  if (records.length === 0) {
    records = _.filter(airports, (o) => o.alternate_city.toLowerCase().indexOf(targetLower) !== -1);
  }
  if (records.length === 0) {
    records = _.filter(airports, (o) => o.name.toLowerCase().indexOf(targetLower) !== -1);
  }
  if (records.length === 0) {
    records = _.filter(airports, (o) => o.state.toLowerCase().indexOf(targetLower) !== -1);
  }

  console.log(records);

  if (records.length > 0 && words.length > 0) {
    records = stationLookup(records, words);
  }
  return records;
}

const constructWeatherMessage = (data, stationRecord) => {
  const latest = data.data[0];
  const items = [
  	`${stationRecord.name}, ${stationRecord.city}, ${stationRecord.state}`,
  	`${latest.weather}, ${latest.temp_air} degrees`,
    `Source: ${data.url}`,
  	`Last updated: ${latest.parsedDate}`
  ];
  return items.join('\n');
}

const messageContainsUserId = (msg, userId) => {
	const pattern  = `<@${userId}>`;
  return (msg.text.indexOf(pattern) !== -1 || msg.channel === weatherBotDMChannel);
}

const saySorry = () => {
  const variations = [
    'I\m sorry',
    'Sorry bout that',
    'I\m embarrassed',
    'Whoops',
    'My bad',
    'Sorry, bro',
    'My fault, bro',
    'My mistake',
    'It\s the programmer\'s fault',
    'I owe you an apology',
    'Forgive me'
  ];
  return variations[getRandomInt(0,variations.length)];
}

// Returns a random integer between min (included) and max (excluded)
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
