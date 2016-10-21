const WeatherReportCache = require('./cache');

const testCache = new WeatherReportCache();

const stationRecords = [
  {
    "stationId": "KPVD",
    "airportId": "PVD",
    "name": "T.F. Green State Airport",
    "city": "Providence",
    "state": "Rhode Island",
    "alternate_city": "Warwick",
    "state_abbr": "RI",
    "timeZone": "E",
    "dayTimeSaving": "y",
    "latitude": 41.73,
    "longitude": -71.43
  }
];

console.log(testCache.getWeather(stationRecords[0]));
// setTimeout( () => testCache.getWeather(stationRecords[0]), 6000);
// setTimeout( () => testCache.getWeather(stationRecords[0]), 9000);

// setTimeout( () => console.log(testCache.cache), 11000);


//getWeatherData(stationRecords[0], testCache.update)

// getWeatherData(stationRecords[0], (record) => {
//   testCache.update(record)
//   console.log(testCache.cache);
// });





