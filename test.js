require('dotenv').config();
const Discord = require('discord.js');
console.log(`using token: ${process.env.discordbot}`);
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log('using token: ${process.env.discordbot}');
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.channel.send('pong');
  }
});

client.login(process.env.discordbot);

