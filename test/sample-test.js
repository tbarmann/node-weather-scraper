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
  }
];

describe('A basic test', function(){
	it('should pass when everything is set up correctly', function(){
    expect(true).to.be.true;
  });
});

describe('EventEmitter', function(){
  describe('#emit()', function(){
    it('should invoke the callback', function(){
      const emitter = new EventEmitter;
      const myCache = new WeatherReportCache(emitter);
      const spy = sinon.spy();

      emitter.on('fetch_done', spy);
      myCache.getWeather(stationRecords[0]);
  //    spy.called.should.equal.true;
      sinon.assert.calledOnce(spy);
    })
  })
})