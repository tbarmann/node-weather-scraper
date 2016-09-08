const getWeatherData = require('./nws-current-conditions-scraper');

const url = 'http://w1.weather.gov/data/obhistory/KPVD.html';
const data = getWeatherData(url, console.log);


