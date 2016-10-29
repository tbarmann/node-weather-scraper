"use strict";
const fetchWeatherData = require('./nws-current-conditions-scraper');
const moment = require('moment-timezone');
const _ = require('lodash');
const AsciiTable = require('ascii-table');

const MINUTES_TO_LIVE = 70;

class WeatherReportCache {
  constructor(myEmitter, minutesToLive = MINUTES_TO_LIVE) {

    this.minutesToLive = minutesToLive;
    this.myEmitter = myEmitter;
    this.cache = {};
    this.resetCache = this.resetCache.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getCacheInfo = this.getCacheInfo.bind(this);
    this.formatCacheMessage = this.formatCacheMessage.bind(this);
    this.getWeather = this.getWeather.bind(this);
  }

  update(record) {
    const stationId = record.stationId;
    const latestObservationTime = moment.utc(record.data[0].parsedDateUTC)
    const expiresUTC = latestObservationTime.add(this.minutesToLive, 'minutes');
    this.cache[stationId] = { expires: expiresUTC.format(), hits: 0, payload: record }
  }

  inCache(stationId) {
    return this.cache.hasOwnProperty(stationId);
  }

  isCacheEmpty() {
    return _.isEmpty(this.cache);
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

  resetCache() {
    this.cache = {};
  }

  getCacheInfo() {
    const title = 'Cache info';
    const heading = ['Station', 'Hits', 'Expires (UTC)'];
    const rows = [];
    _.each(this.cache, (value, key) => {
      rows.push([key, value.hits, value.expires]);
    });
    return { title, heading, rows };
  }

  formatCacheMessage() {
    if (this.isCacheEmpty()) {
      return '[Cache is empty]';
    }
    return new AsciiTable().fromJSON(this.getCacheInfo()).toString();
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
