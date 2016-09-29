const getWeatherData = require('./nws-current-conditions-scraper');

const airport = 'kpvd';
const data = getWeatherData(airport, console.log);


