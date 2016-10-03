"use strict";
const fs = require('fs');
const request = require('request');
const airports = require('./airports.json');
const stations = require('./stations.json');
const _ = require('lodash');

const newAirports = [];

_.each(airports, (thisStation) => {
  const stationRecord = _.find(stations, (o) => o.STID === thisStation.stationId);
  if (stationRecord) {
    thisStation.timeZone = stationRecord.TimeZone;
    thisStation.dayTimeSaving = stationRecord.DayTimeSaving;
    thisStation.latitude = stationRecord.Latitude;
    thisStation.longitude = stationRecord.Longitude;
  }
  else {
    console.log(`Not found: ${thisStation.stationId}`);
  }
    newAirports.push(thisStation);
});

fs.writeFile('./new-airports.json', JSON.stringify(newAirports, null, '  '));

