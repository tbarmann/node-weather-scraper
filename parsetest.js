"use strict";
const _ = require('lodash');
const airports = require('./airports.json');

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

const message = "@dude hows the weather in PVD and BOS?";
const words = messageToWords(message);

const stations = [];
_.each(words, (w) => {
  const s = stationLookup(w);
  if (s !== null) {
    stations.push(s);
  }
})

console.log(stations);
