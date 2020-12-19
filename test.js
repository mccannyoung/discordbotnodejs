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

  //channel.send('Discord bot ready');
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

    // msg.channel.send(parseThis);
    // var  = parseThis.substr(0, parseThis.indexOf(':'));
    // msg.channel.send("hour" + hour);
    // var minutes = parseThis.substr(parseThis.indexOf(':')+1, 2);
    // msg.channel.send("minutes" + minutes);
    // var amPM = parseThis.includes("AM")? "AM": "PM"
    // msg.channel.send(amPM);
    //var timeZone = parseThis.substr(parseThis.length-4, 4).trim();
    var timeZone = findTimeZone(parseThis);
    //console.log("returned TZ = "+ timeZone);
    //msg.channel.send("What timezone? " + timeZone);
    // if(amPM === 'PM' && hour !== '12') {
    //   hour = hour + 12;
    //   msg.channel.send("new hour" + hour);
    // }
    parseThis = parseThis.replace(timeZone, '').trim();
    //console.log("time without timezone: " + parseThis);

    // var d = new Date();
    // var time = parseThis.match( /(\d+)(?::(\d\d))?\s*(P?)/ );
    // console.log("time array: "+ time.toString());
    // console.log(`${time[1]} + (${time[3]} ? 12:0)`);
    // d.setHours( parseInt( time[1], 10) + (time[3] ? 12 : 0) );
    // console.log("hours? " + d.getHours());
    // d.setMinutes( parseInt( time[2]) || 0 );
    // console.log("minutes? " + d.getMinutes());
    var inputTime = parseTime(parseThis);
    //var inputTime = d;
    //console.log("date object made " + inputTime);
    //msg.channel.send(inputTime);
    var time = convertTime2UTC(inputTime.getHours(),inputTime.getMinutes(),timeZone);
    msg.channel.send("UTC time: "+ time);
    var currentTime = new Date();
    var seconds = (time.getTime() - currentTime.getTime()) / 1000;
    console.log(" the difference is " + seconds);
    
    msg.channel.send("It will be that time in "+ seconds.toString());
    msg.channel.send("let's see how this looks " + new Date(seconds * 1000).toISOString().substr(11, 8))
    rHours = Math.floor(seconds / 3600);
    seconds %= 3600;
    rMinutes = Math.floor(seconds / 60);
    rSeconds = Math.round(seconds % 60);
    msg.channel.send("or " + rHours + " hours "+ rMinutes + " minutes and "+ rSeconds + " seconds");
    if (seconds < 0){
      seconds = Math.abs(seconds);
      rHours = Math.floor(seconds / 3600);
    seconds %= 3600;
    rMinutes = Math.floor(seconds / 60);
    rSeconds = Math.round(seconds % 60);
    msg.channel.send("or " + rHours + " hours "+ rMinutes + " minutes and "+ rSeconds + " seconds ago");
    }
  } else if (msg.content == `${prefix}help`){
    msg.channel.send("Hello friend!");
    msg.channel.send(`To allow me to better assist you please use "${prefix}when " followed by the time you want to know how long until`);
    msg.channel.send('For example if you want to know how much longer until 2 pm MST, type in $when 2:00 MST');
    msg.channel.send('Here is a list of the available timezones:\n'+ printTimeZones());
    //msg.channel.send(`If you want to know how much longer until an event is on January 1st 2025 1 pm MST, type ${prefix}when 01/01/2025 1:00PM MST`);
  } else if (msg.content.startsWith(`${prefix}`)){
    msg.channel.send("I'm sorry, I don't understand what you're looking for. Try $help for instructions");
  }
});

function parseTime( t ) {
  var d = new Date();
  var time = t.match( /(\d+)(?::(\d\d))?\s*(P?)/ );
  d.setHours( parseInt( time[1], 10) + (time[3] ? 12 : 0) );
  d.setMinutes( parseInt( time[2]) || 0 );
  return d;
}

function findTimeZone(s) {
  var zone = '';
  for(const[key,value] of Object.entries(timeZones)) {
    if(s.includes(key)){
      // pick the longest one that is matched. 
      if (zone.length < key.length){
        zone = key;
        console.log("Found time zone! "+ key);
      }
    }
  }
  return zone;
}

function convertTime2UTC(hours,minutes, timeZone) {
  var now = new Date();
  var zone = timeZones[timeZone];
  console.log("is this a timezone obj? " + zone);
  if (zone === null || zone.offset === null) {
    return now;
  }
  console.log("timezone: " + timeZone.toString());
  //var offset = timeZones[timeZone].offset;
  var offset = parseInt(zone.offset);
  var offsetType = "-";
  if (offset >= 0)
    offsetType = '+';
  offset = Math.abs(offset);
  offsetMinutes = "00";
  if (!Number.isInteger(offset)){
    offset = offset-0.5;
    offsetMinutes="30";
  }
  console.log(`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}T${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:00.000${offsetType}${("0"+offset).slice(-2)}:${offsetMinutes}`);
  var time = new Date(`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}T${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:00.000${offsetType}${("0"+offset).slice(-2)}:${offsetMinutes}`);
  console.log(`Going to return ${time}`);
  if((time.getTime() - now.getTime()) < 0){
    time.setDate(now.getDate() + 1);
  }
  return time;
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
