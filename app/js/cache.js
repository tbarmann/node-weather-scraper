"use strict";
const fetchWeatherData = require('./nws-current-conditions-scraper');
const moment = require('moment-timezone');
const _ = require('lodash');
const MINUTES_TO_LIVE = 70;

class WeatherReportCache {
  constructor(myEmitter) {
    this.myEmitter = myEmitter;
    this.cache = {};
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getCacheInfo = this.getCacheInfo.bind(this);
    this.getWeather = this.getWeather.bind(this);
  }

  update(record) {
    const stationId = record.stationId;
    const latestObservationTime = moment.utc(record.data[0].parsedDateUTC)
    const expiresUTC = latestObservationTime.add(MINUTES_TO_LIVE, 'minutes');
    this.cache[stationId] = { expires: expiresUTC.format(), hits: 0, payload: record }
  }

  inCache(stationId) {
    return this.cache.hasOwnProperty(stationId);
  }

  hasExpired(stationId) {
    const nowUTC = new moment.utc();
    const expiresUTC = moment.utc(this.cache[stationId].expires);
    return nowUTC.isAfter(expiresUTC);
  }

  delete(stationId) {
    if (this.inCache(stationId)) {
      delete this.cache[stationId];
    }
  }

  getCacheInfo() {
    let headers = []
    _.each(this.cache, (value, key) => {
      headers.push({stationId: key, hits: value.hits, expires: value.expires});
    });
    return headers;
  }

  getWeather(station) {
    const stationId = station.stationId;
    if (!this.inCache(stationId) || this.hasExpired(stationId)) {
      fetchWeatherData(station, (record) => {
        this.update(record);
        this.myEmitter.emit('fetch_done', this.cache[stationId]);
      });
    }
    else {
      console.log("Cache Hit!");
      this.cache[stationId].hits += 1;
      this.myEmitter.emit('fetch_done', this.cache[stationId]);
    }
  }
}

module.exports = WeatherReportCache;
