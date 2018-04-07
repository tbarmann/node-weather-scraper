

const WeatherReportCache = require('./cache');
const EventEmitter = require('events');

const myEmitter = new EventEmitter();
const myCache = new WeatherReportCache(myEmitter);

const stationRecords = [
  {
    stationId: 'KPVD',
    airportId: 'PVD',
    name: 'T.F. Green State Airport',
    city: 'Providence',
    state: 'Rhode Island',
    alternate_city: 'Warwick',
    state_abbr: 'RI',
    timeZone: 'E',
    dayTimeSaving: 'y',
    latitude: 41.73,
    longitude: -71.43
  },
  {
    stationId: 'KDEN',
    airportId: 'DEN',
    name: 'Denver International Airport',
    city: 'Denver',
    state: 'Colorado',
    alternate_city: 'Boulder',
    state_abbr: 'CO',
    timeZone: 'M',
    dayTimeSaving: 'y',
    latitude: 39.87,
    longitude: -104.67
  },
  {
    stationId: 'KLAX',
    airportId: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    state: 'California',
    alternate_city: '',
    state_abbr: 'CA',
    timeZone: 'P',
    dayTimeSaving: 'y',
    latitude: 33.94,
    longitude: -118.4
  },
  {
    stationId: 'KORD',
    airportId: 'ORD',
    name: "O'Hare International Airport",
    city: 'Chicago',
    state: 'Illinois',
    alternate_city: '',
    state_abbr: 'IL',
    timeZone: 'C',
    dayTimeSaving: 'y',
    latitude: 41.98,
    longitude: -87.9
  },
  {
    stationId: 'KIWA',
    airportId: 'IWA',
    name: 'Phoenix-Mesa Gateway Airport',
    city: 'Mesa',
    state: 'Arizona',
    alternate_city: '',
    state_abbr: 'AZ',
    timeZone: 'M',
    dayTimeSaving: 'n',
    latitude: 33.3,
    longitude: -111.67
  }
];

myEmitter.on('fetch_done', () => console.log(myCache.getCacheInfo()));


setTimeout(() => myCache.getWeather(stationRecords[0]), 0);
setTimeout(() => myCache.getWeather(stationRecords[0]), 3000);
setTimeout(() => myCache.getWeather(stationRecords[0]), 6000);
setTimeout(() => myCache.getWeather(stationRecords[0]), 9000);

