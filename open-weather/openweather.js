"use strict";
const querystring = require('querystring');
const http = require('http');
const host = 'api.openweathermap.org';
const apiKey = '8ffcd4db8c3692fc149d2964ea96eae6';

function performRequest(endpoint, method, data, success) {
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

const endpoint = '/data/2.5/forecast/city';
const params = {
  q: 'Providence',
  units: 'imperial',
  APPID: apiKey
};

performRequest(endpoint, 'GET', params, function(){
  console.log('request complete');
});
