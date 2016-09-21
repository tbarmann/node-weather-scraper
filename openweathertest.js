const openWeather = require('./openweather-module.js');

const city = 'Providence';
const data = openWeather(city, console.log);
// console.log(data);
