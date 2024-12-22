const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config()
module.exports = (() => {
    const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.DirectMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildMessageReactions,
          GatewayIntentBits.GuildInvites,
          GatewayIntentBits.GuildVoiceStates,
        ],
      });

    client.login(process.env.TOKEN);
  
    return client;
})();
