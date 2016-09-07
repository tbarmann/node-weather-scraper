"use strict";
const request = require('request');
const cheerio = require('cheerio');

function getWeatherData(url, callback) {

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

  request(options, (error, response, html) => {
    if (!error) {
      const $ = cheerio.load(html);
      let result = {}
      result.title = $('table:nth-child(2) tr:nth-child(2) > td.white1').text();
      const data = [];
      const table = $('table:nth-child(4)');
      $('tr', table).each(function(k1,v1){
        if (k1 > 2) {
          let row = {};
          $('td', this).each((k2, v2) => {
            row[headers[k2]] = $(v2).text();
          });
          if (Object.keys(row).length !== 0) {
            data.push(row);
          }
        }
      });
      result.data = data;
      callback(result.data[0]);
    }
  });
}

const url = 'http://w1.weather.gov/data/obhistory/KPVD.html';
const data = getWeatherData(url, console.log);

