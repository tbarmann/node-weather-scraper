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

// $this_hour_data = array();

//   $today_day = date("j");
//   $today_month = date("n");
//   $today_year = date("Y");

//   $year = $today_year;
//   $day = intval($cells[0]->innertext);
//   $hour = intval(substr($cells[1]->innertext,0,2));
//   $minute = intval(substr($cells[1]->innertext,3,2));
//   $month = ($day>$today_day)? $today_month - 1 : $today_month;

//   if ($month === 0) {
//     $month = 12;
//     $year--;

//   }


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
            row.parsedDate = parseDate(row);
            data.push(row);
          }
        }
      });
      result.data = data;
      callback(result);
    }
  });
}
