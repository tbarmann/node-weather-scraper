

const airports = require('../data/airports.json');
const _ = require('lodash');

const messageToWords = message => message.split(' ');
const stationSearch = (message) => {
  const words = messageToWords(message);
  return stationLookup(airports, words);
};

const stationLookup = (airports, words) => {
  const target = words.shift();
  const targetLower = target.toLowerCase();
  let records = [];

  if (target.length === 3) {
    records = _.filter(airports, o => o.airportId === target.toUpperCase());
  }
  if (records.length === 0) {
    records = _.filter(airports, o => o.city.toLowerCase().indexOf(targetLower) !== -1);
  }
  if (records.length === 0) {
    records = _.filter(airports, o => o.alternate_city.toLowerCase().indexOf(targetLower) !== -1);
  }
  if (records.length === 0) {
    records = _.filter(airports, o => o.name.toLowerCase().indexOf(targetLower) !== -1);
  }
  if (records.length === 0) {
    records = _.filter(airports, o => o.state.toLowerCase().indexOf(targetLower) !== -1);
  }

  if (records.length > 0 && words.length > 0) {
    records = stationLookup(records, words);
  }
  return records;
};

module.exports = stationSearch;
