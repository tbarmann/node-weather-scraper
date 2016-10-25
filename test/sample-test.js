"use strict";
const WeatherReportCache = require('../app/js/cache');
const expect = require('chai').expect;
const sinon = require('sinon');
const EventEmitter = require('events').EventEmitter;


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
  },
  {
    "stationId": "KDEN",
    "airportId": "DEN",
    "name": "Denver International Airport",
    "city": "Denver",
    "state": "Colorado",
    "alternate_city": "Boulder",
    "state_abbr": "CO",
    "timeZone": "M",
    "dayTimeSaving": "y",
    "latitude": 39.87,
    "longitude": -104.67
  },
  {
    "stationId": "KLAX",
    "airportId": "LAX",
    "name": "Los Angeles International Airport",
    "city": "Los Angeles",
    "state": "California",
    "alternate_city": "",
    "state_abbr": "CA",
    "timeZone": "P",
    "dayTimeSaving": "y",
    "latitude": 33.94,
    "longitude": -118.4
  },
  {
    "stationId": "KORD",
    "airportId": "ORD",
    "name": "O'Hare International Airport",
    "city": "Chicago",
    "state": "Illinois",
    "alternate_city": "",
    "state_abbr": "IL",
    "timeZone": "C",
    "dayTimeSaving": "y",
    "latitude": 41.98,
    "longitude": -87.9
  },
  {
    "stationId": "KIWA",
    "airportId": "IWA",
    "name": "Phoenix-Mesa Gateway Airport",
    "city": "Mesa",
    "state": "Arizona",
    "alternate_city": "",
    "state_abbr": "AZ",
    "timeZone": "M",
    "dayTimeSaving": "n",
    "latitude": 33.3,
    "longitude": -111.67
  }
];

const spy = sinon.spy();
const emitter = new EventEmitter;
const myCache = new WeatherReportCache(emitter);

describe('A basic test', () => {
  it('should pass when everything is set up correctly', () => {
    expect(true).to.be.true;
  });
});

describe('EventEmitter', () => {
  beforeEach( (done) => {
    spy.reset();
    emitter.on('fetch_done', () => {
      spy();
      done();
    });
    myCache.getWeather(stationRecords[0]);
  })

  // it('should invoke the callback', () => {
  //   sinon.assert.calledOnce(spy);
  // })

  it('should have 1 item in cache', () => {
    expect(Object.keys(myCache.cache).length).to.equal(1);
  })
})
