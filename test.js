require('dotenv').config();
const Discord = require('discord.js');

const {prefix} = require('./config.json');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("the clock", {type: 'WATCHING'});
  client.users.cache.get('439927131267530752').send("I'm ready!");
});

client.on('message', msg => {
  if (msg.content === `${prefix}ping`) {
    msg.channel.send('pong');
    msg.author.send('pong!');
  } else if (msg.content.startsWith(`${prefix}when `)){
    var parseThis = msg.content.replace(`${prefix}when `,``).toUpperCase().trim();
    if(parseThis.includes('-')||parseThis.includes('/')){
      msg.channel.send("there is a date");
    } else {
      msg.channel.send("there is no date");
    }

    msg.channel.send(parseThis);
    var hour = parseThis.substr(0, parseThis.indexOf(':'));
    msg.channel.send(hour);
    var minutes = parseThis.substr(parseThis.indexOf(':')+1, 2);
    msg.channel.send(minutes);
    var amPM = parseThis.includes("AM")? "AM": "PM"
    msg.channel.send(amPM);
    var timeZone = parseThis.substr(parseThis.length-4, 4).trim();
    msg.channel.send(timeZone);
  } else if (msg.content == `${prefix}help`){
    msg.channel.send("Hello friend!");
    msg.channel.send(`To allow me to better assist you please use "${prefix}when " followed by the time you want to know how long until`);
    msg.channel.send(`So if you want to know when is noon MST, type ${prefix}when 12:00PM MST`);
  }
});



client.login(process.env.discordbot);

