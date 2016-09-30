"use strict";
const fs = require('fs');
const request = require('request');
const airports = require('./old-airports.json');
const _ = require('lodash');

const newAirports = [];


_.each(airports, (thisStation) => {
  thisStation.alternate_city = '';
  if (thisStation.city.indexOf('/') !== -1) {
    const parts = thisStation.city.split('/');
    thisStation.city = parts.shift().trim();
    thisStation.alternate_city = _.map(parts, (p) => p.trim()).join(', ');
  }
  newAirports.push(thisStation);
});

fs.writeFile('new-airports.json', JSON.stringify(newAirports, null, '  '));

