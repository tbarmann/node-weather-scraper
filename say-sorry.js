"use strict";
const getRandomInt = require('./get-random-int.js');

module.exports = () => {
  const variations = [
    'I\'m sorry',
    'Sorry \'bout that',
    'I\'m embarrassed',
    'Whoops',
    'My bad',
    'Sorry, bro',
    'My fault, bro',
    'My mistake',
    'It\'s the programmer\'s fault',
    'I owe you an apology',
    'Forgive me dude'
  ];
  return variations[getRandomInt(0,variations.length)];
}
