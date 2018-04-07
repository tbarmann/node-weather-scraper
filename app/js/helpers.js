

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

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
  return variations[getRandomInt(0, variations.length)];
};

const cleanMessage = (message) => {
  // get rid of any @user
  message = message.replace(/<@[^\s.]+/g, '');
  message = message.replace(/[!$%\^&\*;:{}=_`~()\?]/g, ' ');
  message = message.replace(/\s{2,}/g, ' ');
  return message.trim();
};

module.exports = { getRandomInt, saySorry, cleanMessage };
