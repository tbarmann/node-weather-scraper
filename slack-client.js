var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var MemoryDataStore = require('@slack/client').MemoryDataStore;

var config = require('./.config.json');
var token = config.SLACK_API_TOKEN;


//var token = process.env.SLACK_API_TOKEN || '';

var rtm = new RtmClient(token, {
  logLevel: 'error',
  dataStore: new MemoryDataStore()
});
rtm.start();


rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  console.log(
    'User "%s" posted a message in channel: "%s"',
    rtm.dataStore.getUserById(message.user).name,
    rtm.dataStore.getChannelGroupOrDMById(message.channel).name
  );
});

