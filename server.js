var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

  var headers = [
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


  var options = {
    url: 'http://w1.weather.gov/data/obhistory/KPVD.html',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
    }
  };

  request(options, function(error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);
      var table = $('table:nth-child(4)');
      $('tr', table).each(function(k,v){
        if (k > 3) {
          console.log("Row: " + k);
          $('td', this).each(function(){
            console.log($(this).text());
          });
        }
      });
    }
  });

