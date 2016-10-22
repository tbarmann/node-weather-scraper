"use strict";
const fetchWeatherData = require('./nws-current-conditions-scraper');
const MINUTES_TO_LIVE = 70;

class WeatherReportCache {
  constructor(myEmitter) {
    this.myEmitter = myEmitter;
    this.cache = {};
    this.update = this.update.bind(this);
    this.getWeather = this.getWeather.bind(this);
  }

  update(record) {
    const stationId = record.stationId;
    const latestObservationTime = record.data[0].parsedDateUTC
    const expires = latestObservationTime
    this.cache[stationId] = {expires, hits: 0, payload: record}
  }

  inCache(stationId) {
    return this.cache.hasOwnProperty(stationId);
  }

  hasExpired(stationId) {
    return false
  }

  delete(stationId) {

  }

  getWeather(station) {
    const stationId = station.stationId;
    if (!this.inCache(stationId) || this.hasExpired(stationId)) {
      fetchWeatherData(station, (record) => {
        this.update(record);
        this.myEmitter.emit('fetch_done', this.cache[stationId].payload);
      });
    }
    else {
      console.log("Cache Hit!");
      this.cache[stationId].hits += 1;
      this.myEmitter.emit('fetch_done', this.cache[stationId].payload);
    }
  }
}

module.exports = WeatherReportCache;
