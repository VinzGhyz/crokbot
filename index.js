var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: "xoxb-24729285108-fuzQgxZ0yK62PSvAFnzRef7S"
})
bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});