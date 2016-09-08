"use strict";
const request = require('request');
const cheerio = require('cheerio');

module.exports = (url, callback) => {
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
    url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
    }
  };
  return request(options, (error, response, html) => {
    if (!error) {
      const $ = cheerio.load(html);
      let result = {}
      result.title = $('table:nth-child(2) tr:nth-child(2) > td.white1').text();
      const data = [];
      const table = $('table:nth-child(4)');
      $('tr', table).each((key1,value1) => {
        if (key1 > 2) {
          let row = {};
          $('td', value1).each((key2, value2) => {
            row[headers[key2]] = $(value2).text();
          });
          if (Object.keys(row).length !== 0) {
            data.push(row);
          }
        }
      });
      result.data = data;
      callback(result);
    }
  });
}
