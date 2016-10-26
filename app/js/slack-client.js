"use strict";
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const token = process.env.SLACK_API_TOKEN || '';
const airports = require('../data/airports.json');
const saySorry = require('./helpers').saySorry;
const _ = require('lodash');
const WeatherReportCache = require('./cache');
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
const myCache = new WeatherReportCache(myEmitter);
const moment = require('moment-timezone');

let weatherBotId;
let weatherBotName;
const weatherBotDMChannel = 'D1VK6F805';

const rtm = new RtmClient(token, {
  logLevel: 'error',
  dataStore: new MemoryDataStore()
});

rtm.start();

rtm.sendMessageAsCode = (code, channelId) => {
  rtm.sendMessage('```' + code + '```', channelId);
}

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
  if (_.startsWith(message.text,'-') || _.startsWith(message.text.toLowerCase(),'help')) {
    handleCommandMessage(message);
  }
  else {
    handleWeatherMessage(message);
  }
}

const handleWeatherMessage = (message) => {
  const words = message.text.split(' ');
  const stationRecords = stationLookup(airports, words);
  if (stationRecords.length === 0) {
    rtm.sendMessage(`I don't have any information about '${message.text}'. ${saySorry()}.`, message.channel);
  }
  else if (stationRecords.length > 1) {
    sendNeedsMoreInfoMessage(message.channel, stationRecords);
  }
  else {
    sendWeatherReport(message.channel, _.first(stationRecords));
  }
}

const handleCommandMessage = (message) => {
  rtm.sendMessage(JSON.stringify(myCache.getCacheInfo()), message.channel);
}

const sendNeedsMoreInfoMessage = (channelId, stationRecords) => {
  const reply = ['Multiple records found.'];
  _.each(stationRecords, (stationRecord) => {
    reply.push(`If you meant ${stationRecord.name}, use ${stationRecord.airportId}`);
  })
  rtm.sendMessage(reply.join('\n'), channelId);
}

const sendWeatherReport = (channelId, stationRecord) => {
  myEmitter.once('fetch_done', (data) => {
    rtm.sendMessage(constructWeatherMessage(data, stationRecord), channelId, () => {
      console.log('message sent.');
    });
  });
  myCache.getWeather(stationRecord);
}

const cleanMessage = (message) => {
  // get rid of any @user
  message = message.replace(/<@[^\s.]+/g, '');
  message = message.replace(/[!$%\^&\*;:{}=_`~()\?]/g, ' ');
  message = message.replace(/\s{2,}/g,' ');
  return message.trim();
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

  if (records.length > 0 && words.length > 0) {
    records = stationLookup(records, words);
  }
  return records;
}

const constructWeatherMessage = (data, stationRecord) => {
  const latest = _.first(data.data);
  const displayFormat = 'ddd, MMM D, YYYY h:mm A';
  const items = [
  	`${stationRecord.name}, ${stationRecord.city}, ${stationRecord.state}`,
  	`${latest.weather}, ${latest.temp_air} degrees`,
    `Source: ${data.url}`,
  	`Last updated ${moment(latest.parsedDateUTC).fromNow()}`
  ];
  return items.join('\n');
}

const messageContainsUserId = (msg, userId) => {
	const pattern  = `<@${userId}>`;
  return (msg.text !== undefined && (msg.text.indexOf(pattern) !== -1 || msg.channel === weatherBotDMChannel));
}
