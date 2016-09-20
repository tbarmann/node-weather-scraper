var querystring = require('querystring');
var http = require('http');

var host = 'api.openweathermap.org';
var apiKey = '8ffcd4db8c3692fc149d2964ea96eae6';

function performRequest(endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};

  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }

  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = http.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}

var endpoint = '/data/2.5/forecast/city';
var params = {
  q: 'Providence',
  units: 'imperial',
  APPID: apiKey
};

performRequest(endpoint, 'GET', params, function(){
  console.log('request complete');
});
