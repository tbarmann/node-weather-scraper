const airports = require('./airports.json');
const _ = require('lodash');

multis = _.filter(airports, (o) => o.city.indexOf(' ') !== -1);
_.each(multis, (m) => console.log(m.city));
