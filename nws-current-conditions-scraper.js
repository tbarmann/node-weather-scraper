"use strict";
const request = require('request');
const cheerio = require('cheerio');

module.exports = (stationRecord, callback) => {

  const stationId = stationRecord.stationId;

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
    const now = new Date();
    const todayDay = now.getDate();
    const todayMonth = now.getMonth();
    const todayYear = now.getFullYear();

    let year = todayYear;
    const day = parseInt(row.date,10);
    const hour = parseInt(row.time.split(':')[0]);
    const minute = parseInt(row.time.split(':')[1]);

    let month = (day>todayDay) ? todayMonth -1 : todayMonth;
    if (month === -1) {
      month = 11;
      year--;
    }

    return new Date(year, month, day, hour, minute);
  };

  return request(options, (error, response, html) => {
    let result = {
      stationId,
      data: []
    };
    if (!error) {
      const $ = cheerio.load(html);
      result.title = $('table:nth-child(2) tr:nth-child(2) > td.white1').text();
      result.url = options.url;
      console.log("Result title: ", result.title);
      const data = [];
      const table = $('table:nth-child(4)');
      $('tr', table).each((key1,value1) => {
        if (key1 > 2) {
          let row = {};
          $('td', value1).each((key2, value2) => {
            row[headers[key2]] = $(value2).text();
          });
          if (Object.keys(row).length !== 0) {
            row.parsedDate = parseDate(row);
            data.push(row);
          }
        }
      });
      result.data = data;
    }
    callback(result);
  });
}
