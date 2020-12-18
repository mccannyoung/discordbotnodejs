require('dotenv').config();
const Discord = require('discord.js');
var timeZones = new Map();
const {prefix} = require('./config.json');

const client = new Discord.Client();

client.on('ready', () => {
  //console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("the clock", {type: 'WATCHING'});
  //NORAM time zones
  timeZones["AST"] = { offset: -4, name: 'Atlantic Standard Time'};
  timeZones["ADT"] = { offset: -3, name: 'Atlantic Daylight Time'};
  timeZones["EST"] = { offset: -5, name: 'Eastern Standard Time'};
  timeZones["EDT"] = { offset: -4, name: 'Eastern Daylight Time'};
  timeZones["CST"] = { offset: -6, name: 'Central Standard Time'};
  timeZones["CDT"] = { offset: -5, name: 'Central Daylight Time'};
  timeZones["MST"] = { offset: -7, name: 'Mountain Standard Time'};
  timeZones["MDT"] = { offset: -6, name: 'Mountain Daylight Time'};
  timeZones["PST"]  ={ offset:  -8, name: 'Pacific Standard Time'};
  timeZones["PDT"] = { offset: -7, name: 'Pacific Daylight Time'};
  timeZones["AKST"] = { offset: -9, name: 'Alaska Standard Time'};
  timeZones["AKDT"] = { offset: -8, name: 'Alaska Daylight Time'};
  timeZones["HST"] = { offset: -10, name: 'Hawaii Standard Time'};
  // AU time zones
  timeZones["AWT"] = { offset:8, name: 'Australia Western Standard Time'};
  timeZones["AWST"] = { offset:9, name: 'Australia Western Summer Time'};
  timeZones["ACST"] = { offset:9.5, name: 'Australia Central Summer Time'};
  timeZones["ACT"] = { offset:10.5, name: 'Australia Central Standard Time'};
  timeZones["AEST"] = { offset:10, name: 'Australia Eastern Summer Time'};;
  timeZones["AET"] = { offset:11, name: 'Australia Eastern Standard Time'};
  // EME
  timeZones["GMT"] = { offset:0, name:'Greenwich Mean Time' };
  timeZones["BST"] = { offset:1, name: 'British Summer Time' };
  timeZones["CET"] = { offset:1, name: 'Central European Time' };
  timeZones["CEST"] = { offset:2, name: 'Central European Summer Time' };
  timeZones["EET"] = { offset:2, name: 'Eastern European Time' };
  timeZones["EEST"]= { offset:3, name: 'Eastern European Summer Time'};
  timeZones["C"] = { offset:3, name: 'Charlie Time (Middle East)'};
  timeZones["D"] = { offset:4, name: 'Delta Time (Middle East)'};

  channel.send('Discord bot ready');
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
    var hour = parseThis.substr(parseThis.indexOf(':')-2, parseThis.indexOf(':'));
    msg.channel.send(hour);
    var minutes = parseThis.substr(parseThis.indexOf(':')+1, 2);
    msg.channel.send(minutes);
    var amPM = parseThis.includes("AM")? "AM": "PM"
    msg.channel.send(amPM);
    var timeZone = parseThis.substr(parseThis.length-4, 4).trim();
    msg.channel.send(timeZone);
    if(amPM === 'PM' && hour !== '12') {
      hour = hour + 12;
      msg.channel.send(hour);
    }
    var time = convertTime2UTC(hour+":"+minutes+ timeZones);
    var howLong = time = Date.now();
    msg.channel.send(howLong);
  } else if (msg.content == `${prefix}help`){
    msg.channel.send("Hello friend!");
    msg.channel.send(`To allow me to better assist you please use "${prefix}when " followed by the time you want to know how long until`);
    msg.channel.send('Here is a list of the available timezones '+ printTimeZones());
    //msg.channel.send(`If you want to know how much longer until an event is on January 1st 2025 1 pm MST, type ${prefix}when 01/01/2025 1:00PM MST`);
  }
});

function convertTime2UTC(timeStr) {
  var time = new Date.now();
  var now = new Date.now();

  time = new Date(`${now.year}-${now.month}-${now.day}T`)
  return now;
}

client.login(process.env.discordbot);

function printTimeZones() {
  var timeZoneList = '';
  for (const [key, value] of Object.entries(timeZones)) {
    timeZoneList += `${key}:  ${value.name} UTC ${value.offset}
    `;
  }

  return timeZoneList;

}
