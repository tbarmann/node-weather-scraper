"use strict";

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const saySorry = () => {
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
module.exports = { getRandomInt, saySorry }