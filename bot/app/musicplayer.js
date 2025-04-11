const { Manager, PlayerManager } = require("moonlink.js");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fetch = require("isomorphic-unfetch");
const { getData, getPreview, getTracks, getDetails } =
  require("spotify-url-info")(fetch);
const client = require("../bot.js");
const { Events, ActivityType } = require("discord.js");
const axios = require("axios");
// Setting up the Moonlink.js manager with Lavalink nodes
client.moonlink = new Manager({
  nodes: [
    {
      identifier: "node_1",
      host: process.env.LAVALINK_HOST,
      password: "youshallnotpass",
      port: 2333,
      secure: false,
    },
  ],
  options: {},
  sendPayload: (guildId, payload) => {
    const guild = client.guilds.cache.get(guildId);
    if (guild) guild.shard.send(JSON.parse(payload));
  },
});

// Moonlink.js Events
client.moonlink.on("nodeCreate", (node) => {
  console.log(`${node.host} was connected`);
});

const playerEmbeds = new Map(); // memory cache for player embeds

client.moonlink.on("trackStart", async (player, track) => {
  const textChannel = client.channels.cache.get(player.textChannelId);
  if (!textChannel) return;

  const playerEmbed = new EmbedBuilder()
    .setTitle(`${track.title}`)
    .setURL(track.url)
    .setImage(track.artworkUrl)
    .setTimestamp()
    .setFooter({ text: "Now Playing 🎵" });

  // Delete the old embed if it exists
  if (playerEmbeds.has(player.textChannelId)) {
    const messageId = playerEmbeds.get(player.textChannelId);
    try {
      const oldMessage = await textChannel.messages.fetch(messageId);
      await oldMessage
        .delete()
        .catch((err) => console.log("Failed to delete old embed.", err));
    } catch (err) {
      console.error("Error fetching/deleting old embed:", err);
    }
  }

  // Send new embed and store the message ID
  const newMessage = await textChannel.send({ embeds: [playerEmbed] });
  playerEmbeds.set(player.textChannelId, newMessage.id);

  client.user.setPresence({
    status: "online",
    activities: [
      { name: track.title, type: ActivityType.Watching, url: track.url },
    ],
  });
});

client.moonlink.on("trackEnd", async (player, track, payload) => {
  client.user.setPresence({
    status: "online",
  });
});

// Client Events
client.on("ready", () => {
  client.moonlink.init(client.user.id);
  console.log(`${client.user.tag} is ready!`);
});

client.on("raw", (data) => {
  client.moonlink.packetUpdate(data);
});

// Utility function to check voice channel membership
function checkVoiceChannel(interaction) {
  if (!interaction.member.voice.channel) {
    interaction.reply({
      content: `Error: You must be in a voice channel to execute this command.`,
      ephemeral: true,
    });
    return false;
  }
  return true;
}

// Utility function to get the player
function getPlayer(interaction) {
  const player = client.moonlink.players.cache.get(interaction.guild.id);
  if (!player) {
    interaction.reply("Mim3 is not currently playing");
    return null;
  }
  return player;
}

function getQueue(interaction) {
  const player = getPlayer(interaction);
  if (!player) return null;

  const queue = player.queue;
  if (!queue || queue.tracks.length === 0) {
    interaction.reply({
      content: "The queue is currently empty.",
      fetchReply: true,
    });
    setTimeout(() => interaction.deleteReply(), 10000);
    return null;
  }
  return queue;
}

// Command Functions

async function play(interaction) {
  if (!checkVoiceChannel(interaction)) return;

  const query = interaction.options.getString("song");
  const player = client.moonlink.createPlayer({
    guildId: interaction.guild.id,
    voiceChannelId: interaction.member.voice.channel.id,
    textChannelId: interaction.channel.id,
    autoPlay: true,
    volume: 10,
  });

  if (!player.connected) {
    player.connect({ setDeaf: true });
  }
  qr = query.toString();
  function isSpotifyLink(str) {
    const regex = /^(https:\/\/(www\.)?spotify\.com\/(?:track|album|artist|playlist)\/[a-zA-Z0-9]{22})$/;
    return regex.test(str);
}
const source = 'youtube';
if(isSpotifyLink(qr)) {
  source = 'spotify';
}
const res = await client.moonlink.search({
  query,
  source: source,
  requester: interaction.user.id,
});
    
    if (res.loadType === "loadfailed") {
      return interaction.reply({
        content: `Error: Failed to load the requested track.`,
        ephemeral: true,
      });
    } else if (res.loadType === "empty") {
      return interaction.reply({
        content: `Error: No results found for the query.`,
        ephemeral: true,
      });
    }
    if (res.loadType === "error") {
      return interaction.reply({
        content: `${res.error.message}`,
        ephemeral: true,
      });
    }
    if (res.loadType === "playlist") {
      interaction.reply({
        content: `Playlist ${res.playlistInfo.name} has been added to the queue.`,
      });
      res.tracks.forEach((track) => player.queue.add(track));
    } else {
      player.queue.add(res.tracks[0]);
      interaction.reply({
        content: `Track added to the queue: ${res.tracks[0].title}`,
      });
    }
  setTimeout(() => interaction.deleteReply(), 10000);
  if (!player.playing) player.play();
}

async function pause(interaction) {
  if (!checkVoiceChannel(interaction)) return;

  const player = getPlayer(interaction);
  if (!player) return;

  player.pause();
  interaction.reply("Playback paused.");
}

async function resume(interaction) {
  if (!checkVoiceChannel(interaction)) return;

  const player = getPlayer(interaction);
  if (!player) return;

  player.resume();
  interaction.reply("Playback resumed.");
}

async function autoplay(interaction) {
  if (!checkVoiceChannel(interaction)) return;

  const player = getPlayer(interaction);
  if (!player) return;

  player.autoPlay = !player.autoPlay;
  interaction.reply(
    `Autoplay is now **${player.autoPlay ? "enabled" : "disabled"}**`
  );
}
async function skip(interaction) {
  if (!checkVoiceChannel(interaction)) return;

  const player = getPlayer(interaction);
  if (!player) return;
  if (!player.queue) return;
  player.skip();
  interaction.reply("Track skipped.");
}
async function queue(interaction) {
  const queue = getQueue(interaction);
  if (!queue) return;
  const queueList = queue.tracks
    .map((track, index) => `${index + 1}. ${track.title}`)
    .join("\n");
  interaction.reply(`Current queue:\n${queueList}`);
  setTimeout(() => interaction.deleteReply(), 10000);
}
async function stop(interaction) {
  if (!checkVoiceChannel(interaction)) return;

  const player = getPlayer(interaction);
  if (!player) return;

  player.destroy();
  interaction.reply("Playback stopped.");
}
async function volume(interaction) {
  if (!checkVoiceChannel(interaction)) return;

  const player = getPlayer(interaction);
  if (!player) return;

  const volume = interaction.options.getInteger("volume");
  player.setVolume(volume);
  interaction.reply(`Volume set to ${volume}`);
}
async function nonStop(interaction) {
  if (!checkVoiceChannel(interaction)) return;

  const player = getPlayer(interaction);
  if (!player) return;

  player.autoLeave = false;
  player.autoPlay = true;
  interaction.reply(
    `Non-stop mode is now **${player.autoLeave ? "enabled" : "disabled"}**`
  );
}
async function clearQueue(interaction) {
  player = getPlayer(interaction);
  if (!player) return;
  player.queue.clear();
  interaction.reply("Queue cleared.");
  setTimeout(() => interaction.deleteReply(), 10000);
}
async function lyrics(interaction) {
  if (!checkVoiceChannel(interaction)) return;
  const player = getPlayer(interaction);
  // Basic usage

}
async function stat(interaction){
  const node = client.moonlink.nodes.get('default');
  const stats = node.getSystemStats();
  const totalSeconds = Math.floor(process.uptime());
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        const memoryMB = (stats.memoryUsage / 1024 / 1024).toFixed(2); // Convert to MB
        const cpuPercent = (stats.cpuLoad * 100).toFixed(2); // Convert to %\
        const embed = new EmbedBuilder()
            .setColor(0x00ff99)
            .setTitle('📊 Bot Statistics')
            .addFields(
                { name: '🟢 Uptime', value: `\`${uptime}\``},
                { name: '💾 Memory Usage', value: `\`${memoryMB} MB\``},
                { name: '🧠 CPU Load', value: `\`${cpuPercent}%\``}
            )
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.client.user.avatarURL()})
            .setTimestamp();
        interaction.reply({ embeds: [embed] });
  
}
async function restart(interaction) {
  interaction.reply(
  'restarting...'
  );
  console.log("Triggering app restart...");
  process.exit(1);
}
async function shuffle(interaction) {
  if (!checkVoiceChannel(interaction)) return;
  const player = getPlayer(interaction);
  if (!player) return;
  player.queue.shuffle();
  interaction.reply("Queue shuffled.");
  setTimeout(() => interaction.deleteReply(), 10000);
}
// Interaction Handler
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand) {
    const { commandName } = interaction;
    if (commandName === "play") await play(interaction);
    else if (commandName === "pause") await pause(interaction);
    else if (commandName === "resume") await resume(interaction);
    else if (commandName === "autoplay") await autoplay(interaction);
    else if (commandName === "skip") await skip(interaction);
    else if (commandName === "queue") await queue(interaction);
    else if (commandName === "stop") await stop(interaction);
    else if (commandName === "volume") await volume(interaction);
    else if (commandName === "non-stop") await nonStop(interaction);
    else if (commandName === "clear-queue") await clearQueue(interaction);
    else if (commandName === "lyrics") await lyrics(interaction);
    else if (commandName === "stat") await stat(interaction);
    else if (commandName === "restart") await restart(interaction);
    else if (commandName === "shuffle") await shuffle(interaction);
  }
});
