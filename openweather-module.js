"use strict";

const stations = require('./us-city-list.json');
const querystring = require('querystring');
const http = require('http');
const host = 'api.openweathermap.org';
const _ = require('lodash');
const apiKey = '8ffcd4db8c3692fc149d2964ea96eae6';


module.exports = (cityDirty, callback) => {

  const found = _.find(stations, (o) => o.city === cityDirty);
  if (!found) {
    return "Sorry, I can't find the city " + cityDirty;
  }

  const endpoint = '/data/2.5/forecast/city';
  const params = {
    q: found.city,
    units: 'imperial',
    APPID: apiKey
  };


  const performRequest = (endpoint, method, data, success) => {
    const dataString = JSON.stringify(data);
    let headers = {};

    if (method == 'GET') {
      endpoint += '?' + querystring.stringify(data);
    }
    else {
      headers = {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length
      };
    }

    const options = {
      host: host,
      path: endpoint,
      method: method,
      headers: headers
    };

    const req = http.request(options, function(res) {
      res.setEncoding('utf-8');

      let responseString = '';

      res.on('data', function(data) {
        responseString += data;
      });

      res.on('end', function() {
        console.log(responseString);
        const responseObject = JSON.parse(responseString);
        success(responseObject);
      });
    });

    req.write(dataString);
    req.end();
  }

  return performRequest(endpoint, 'GET', params, function(){
    console.log('request complete');
  });
}
