"use strict";
const fs = require('fs');
const request = require('request');
const airports = require('./airports.json');
const states_hash = require('./states.json');
const _ = require('lodash');

const newAirports = [];


_.each(airports, (thisStation) => {
  thisStation.state_abbr = states_hash[thisStation.state];
  newAirports.push(thisStation);
});

fs.writeFile('./new-airports.json', JSON.stringify(newAirports, null, '  '));

