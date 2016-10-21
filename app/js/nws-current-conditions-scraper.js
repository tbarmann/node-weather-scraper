"use strict";
const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment-timezone');

module.exports = (stationRecord, callback) => {

  const stationId = stationRecord.stationId;
  const stationTzCity = getTimeZoneCity(stationRecord);

  const headers = [
    'date',
    'time',
    'wind',
    'visibility',
    'weather',
    'sky_condition',
    'temp_air',
    'temp_dew_point',
    'temp_6hr_max',
    'temp_6hr_min',
    'relative_humidity',
    'wind_chill',
    'head_index',
    'pressure_altimeter',
    'pressure_sea_level',
    'precip_1hr',
    'precip_3hr',
    'precip_6hr'
  ];

  const options = {
    url: `http://w1.weather.gov/data/obhistory/${stationId}.html`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
    }
  };

  const parseDate = (row) => {
    const now = new moment().tz(stationTzCity);
    const todayDay = now.get('date');
    const todayMonth = now.get('month') + 1; // convert to 1-12
    const todayYear = now.get('year');

    let year = todayYear;
    const day = parseInt(row.date, 10);
    const hour = parseInt(row.time.split(':')[0], 10);
    const minute = parseInt(row.time.split(':')[1], 10);

    let month = (day>todayDay) ? todayMonth -1 : todayMonth;
    if (month === -1) {
      month = 12;
      year--;
    }

    return moment.tz(`${month}/${day}/${year} ${hour}:${minute}`, 'M/D/YYYY H:m', stationTzCity);
  };

  function getTimeZoneCity(stationRecord) {
    const tz = stationRecord.timeZone;
    const dst = stationRecord.dayTimeSaving === "y";
    switch(tz) {
      case "M":
        return (dst) ? "America/Denver" : "America/Phoenix";
      case "P":
        return "America/Los_Angeles";
      case "C":
        return "America/Chicago";
      case "E":
      default:
        return "America/New_York";
    }
  }

  function scrapeHtml(html) {
    let result = {
      stationId,
      data: []
    };
    const data = [];
    const $ = cheerio.load(html);
    result.title = $('table:nth-child(2) tr:nth-child(2) > td.white1').text();
    result.url = options.url;
    const table = $('table:nth-child(4)');
    $('tr', table).each((key1,value1) => {
      if (key1 > 2) {
        let row = {};
        $('td', value1).each((key2, value2) => {
          row[headers[key2]] = $(value2).text();
        });
        if (Object.keys(row).length !== 0) {
          const parsedDateLocal = parseDate(row);
          row.parsedDateLocal = parsedDateLocal.format();
          row.parsedDateUTC = moment.utc(parsedDateLocal).format();
          data.push(row);
        }
      }
    });
    result.data = data;
    return result;
  }

  return request(options, (error, response, html) => {
    if (!error) {
      callback (scrapeHtml(html));
    }
  });
}
