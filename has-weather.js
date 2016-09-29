"use strict";
const fs = require('fs');
const request = require('request');
const airports = require('./airports.json');
const _ = require('lodash');

const thisStation = airports[0];
const newAirports = [];

const options = {
  url: `http://w1.weather.gov/data/obhistory/${thisStation.stationId}.html`,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
  }
};


const getStatusCode = (options, thisStation, callback) => {
  request(options, (error, response, html) => {
    callback(response.statusCode, thisStation);
  });
}

const outputUpdatedRecord = (statusCode, thisStation) => {
  thisStation.hasWeather = (statusCode === 200);
  newAirports.push(thisStation);
  const output = JSON.stringify(newAirports, null, '  ');
  fs.writeFile('new-airports.json', output);
}

getStatusCode(options, thisStation, outputUpdatedRecord);
