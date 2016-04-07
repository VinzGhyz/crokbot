/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

  Read all about it here:

    -> http://howdy.ai/botkit

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

    var Botkit = require('./lib/Botkit.js');
    var os = require('os');
    var request = require('request');

    var controller = Botkit.slackbot({
      debug: false,
    });

    var bot = controller.spawn({
      token: "xoxb-24729285108-fuzQgxZ0yK62PSvAFnzRef7S"
    }).startRTM();

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    Example actions

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

controller.hears(['hello','hi', 'hey'],'direct_message,direct_mention,mention',function(bot, message) {

  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'robot_face',
  },function(err, res) {
    if (err) {
      bot.botkit.log('Failed to add emoji reaction :(',err);
    }
  });


  controller.storage.users.get(message.user,function(err, user) {
    if (user && user.name) {
      bot.reply(message,'Hello ' + user.name + '!!');
    } else {
      bot.reply(message,'Hello.');
    }
  });
});

controller.hears(['call me (.*)'],'direct_message,direct_mention,mention',function(bot, message) {
  var matches = message.text.match(/call me (.*)/i);
  var name = matches[1];
  controller.storage.users.get(message.user,function(err, user) {
    if (!user) {
      user = {
        id: message.user,
      };
    }
    user.name = name;
    controller.storage.users.save(user,function(err, id) {
      bot.reply(message,'Got it. I will call you ' + user.name + ' from now on.');
    });
  });
});

controller.hears(['what is my name','who am i'],'direct_message,direct_mention,mention',function(bot, message) {

  controller.storage.users.get(message.user,function(err, user) {
    if (user && user.name) {
      bot.reply(message,'Your name is ' + user.name);
    } else {
      bot.reply(message,'I don\'t know yet!');
    }
  });
});


controller.hears(['shutdown'],'direct_message,direct_mention,mention',function(bot, message) {

  bot.startConversation(message,function(err, convo) {

    convo.ask('Are you sure you want me to shutdown?',[
    {
      pattern: bot.utterances.yes,
      callback: function(response, convo) {
        convo.say('Bye!');
        convo.next();
        setTimeout(function() {
          process.exit();
        },3000);
      }
    },
    {
      pattern: bot.utterances.no,
      default: true,
      callback: function(response, convo) {
        convo.say('*Phew!*');
        convo.next();
      }
    }
    ]);
  });
});


controller.hears(['uptime','identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {

  var hostname = os.hostname();
  var uptime = formatUptime(process.uptime());

  bot.reply(message,':robot_face: I am a bot named <@' + bot.identity.name + '>. I have been running for ' + uptime + ' on ' + hostname + '.');

});

function formatUptime(uptime) {
  var unit = 'second';
  if (uptime > 60) {
    uptime = uptime / 60;
    unit = 'minute';
  }
  if (uptime > 60) {
    uptime = uptime / 60;
    unit = 'hour';
  }
  if (uptime != 1) {
    unit = unit + 's';
  }

  uptime = uptime + ' ' + unit;
  return uptime;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      Custom actions

      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

controller.hears(['qui a les plus grosses maracas'],'direct_message,direct_mention,mention',function(bot, message) {
  bot.reply(message,'Celui qui a les plus grosses maracas, c\'est bien toi !');
});

controller.hears(['qui est là', 'qui est au crokot', 'qui est à l\'appart'],'direct_message,direct_mention,mention,ambient',function(bot, message) {

 bot.reply(message, 'Laisse moi une ou deux minutes, je regarde.');

 var output = 'Ont répondu présent à l\'appel:',
 emptyCrokot = true;

 var exec = require('child_process').exec;
 var child = exec('sudo nmap -PO 192.168.1.1/24 --exclude 192.168.1.1', function(error, stdout, stderr) {
  var lines = stdout.split('\n');

  for (var i=0, line, device; i<lines.length; i++) {
        // we've hit a device if it has a name in the report (thus, the ip address is further than position 21)
        line = lines[i];

        if (line.indexOf('Nmap scan report for') != -1) {
          device = line.substr(21).split('.lan')[0];
          console.log(device);

          if (['raspberrypi', 'Linux', 'TG589BvacXtream-AP-49B2FE', '192.168.1.65'].indexOf(device) == -1) {
            output += '\n' + device;
            emptyCrokot = false;
          }
        }
      }

      if (emptyCrokot) { output = 'Il semble bien que personne ne soit là pour le moment !'; }

      bot.reply(message, output);
    });
});

controller.hears(['villo'],'direct_message,direct_mention,mention',function(bot, message) {

  bot.reply(message, 'Hmm, on est d\'humeur sportive je vois? :wink:');

  var JCDecauxAPIKey = '7a230ed7811b8d369890b92eb2d21e9d5e1d2f79',
  stationGermoir = 106;
  stationBaucq = 184;

  request('https://api.jcdecaux.com/vls/v1/stations/'+stationBaucq+'?contract=Bruxelles-Capitale&apiKey='+JCDecauxAPIKey, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var infos = JSON.parse(body);

      var filling = Math.floor(infos.available_bikes / infos.bike_stands * 100);

      if (filling == 0) {
        bot.reply(message, ':poop: Scheisse, la station *Philippe Baucq* est vide!');
      } else if (filling <= 25) {
        bot.reply(message, 'Il reste moins d\'un quart des villos disponibles ('+ infos.available_bikes +' sur '+ infos.bike_stands +') à *Philippe Baucq*, bouge-toi!');
      } else {
        bot.reply(message, 'On est large, il y a toujours '+ infos.available_bikes +' villos disponibles à *Philippe Baucq* –soit '+ filling+'% pour ceux qui comptent :nerd_face:. Bonne balade :bicyclist: !');
      }
    } else {
      bot.reply(message, 'Y a comme qui dirait une couille dans le pâté Jack, réessaie plus tard peut-être.');
    }
  });

  request('https://api.jcdecaux.com/vls/v1/stations/'+stationGermoir+'?contract=Bruxelles-Capitale&apiKey='+JCDecauxAPIKey, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var infos = JSON.parse(body);

      var filling = Math.floor(infos.available_bikes / infos.bike_stands * 100);

      if (filling == 0) {
        bot.reply(message, ':poop: Scheisse, la station *Germoir* est vide!');
      } else if (filling <= 25) {
        bot.reply(message, 'Il reste moins d\'un quart des villos disponibles ('+ infos.available_bikes +' sur '+ infos.bike_stands +') à *Germoir*, bouge-toi!');
      } else {
        bot.reply(message, 'On est large, il y a toujours '+ infos.available_bikes +' villos disponibles à *Germoir* –soit '+ filling+'% pour ceux qui comptent :nerd_face:. Bonne balade :bicyclist: !');
      }
    } else {
      bot.reply(message, 'Y a comme qui dirait une couille dans le pâté Jack, réessaie plus tard peut-être.');
    }
  });

});

controller.hears(['adresse ip'],'direct_message',function(bot, message) {
  
  request('http://icanhazip.com', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      bot.reply(message,'Mon adresse IP sur le réseau internet global est *'+ body +'* :sunglasses:');
    } else {
      bot.reply(message,'Y a une couille dans le pâté boss, j\'ai pas su choper l\'adresse IP :poop:');
    }
  });
  
});

// Heroku needs a webserver otherwise it quits the process
// controller.setupWebserver(process.env.PORT,function(err,express_webserver) {
//  controller.createWebhookEndpoints(express_webserver)
// });
