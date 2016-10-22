"use strict";
const WeatherReportCache = require('./cache');
const EventEmitter = require('events');

const myEmitter = new EventEmitter();
const myCache = new WeatherReportCache(myEmitter);

const stationRecords = [
  {
    "stationId": "KPVD",
    "airportId": "PVD",
    "name": "T.F. Green State Airport",
    "city": "Providence",
    "state": "Rhode Island",
    "alternate_city": "Warwick",
    "state_abbr": "RI",
    "timeZone": "E",
    "dayTimeSaving": "y",
    "latitude": 41.73,
    "longitude": -71.43
  }
];

myEmitter.on('fetch_done', (payload) => console.log(payload));



myCache.getWeather(stationRecords[0]);
setTimeout( () => myCache.getWeather(stationRecords[0]), 3000);
setTimeout( () => myCache.getWeather(stationRecords[0]), 6000);
setTimeout( () => myCache.getWeather(stationRecords[0]), 9000);


//getWeatherData(stationRecords[0], myCache.update)

// getWeatherData(stationRecords[0], (record) => {
//   myCache.update(record)
//   console.log(myCache.cache);
// });





