const { Manager } = require("moonlink.js");
const fetch = require('isomorphic-unfetch')
const { getData, getPreview, getTracks, getDetails } =
  require('spotify-url-info')(fetch)
const client = require("../bot.js");
const { Events , ActivityType } = require("discord.js");
// Setting up the Moonlink.js manager with Lavalink nodes
client.moonlink = new Manager({
    nodes: [
        {
            identifier: "node_1",
            host: "localhost",
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
client.moonlink.on("nodeCreate", node => {
    console.log(`${node.host} was connected`);
});

client.moonlink.on("trackStart", async (player, track) => {
    client.channels.cache
        .get(player.textChannelId)
        .send(`Now playing: ${track.title}`);
    client.user.setPresence({
        status: 'online',
        activities: [{
            name: track.title,
            type: ActivityType.Listening
        }]
    }
    )
});
// needs fixing 
// client.moonlink.on("trackEnd", async (player, track) => {
//     client.channels.cache
//         .get(player.textChannelId)
//         .send(`Track ended: ${track.title}`);
// });

// Client Events
client.on("ready", () => {
    client.moonlink.init(client.user.id);
    console.log(`${client.user.tag} is ready!`);
});

client.on("raw", data => {
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
        interaction.reply("The queue is currently empty.");
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
    });

    if (!player.connected) {
        player.connect({ setDeaf: true });
    }
    //if link is spotify
    qr = query.toString();
    if (qr.includes("https://open.spotify.com") || qr.includes("https://spoti.fi") || qr.includes("spotify")) {
        try {
            const data = await getTracks(query);
            const trackLoad = []
            interaction.reply('Loading spotify link');
            for (const track of data) {
                const query = `${track.name} ${track.artist}`;
                const res = await client.moonlink.search({
                    query,
                    source: "youtube",
                    requester: interaction.user.id,
                });
            
                if (res.loadType === "loadfailed") {
                    
                } else if (res.loadType === "empty") {
                    return interaction.reply({
                        content: `Error: No results found for the query.`,
                        ephemeral: true,
                    });
                }
    
                if (res.loadType === "error") {
                }
    
                if (res.loadType === "playlist") {
                } else {
                    player.queue.add(res.tracks[0]);
                    trackLoad.push(res.tracks[0]);
                }
            }
                const trackAdded = trackLoad
                .map((tr, ix) => `${ix + 1}. ${tr.title}`)
                .join("\n")
                interaction.editReply(`Tracks added:\n${trackAdded}`)

        } catch (error) {
            interaction.reply({
                content: `An error occurred: ${error.message}`,
                ephemeral: true,
            });
        }
    }
    
    else {
        const res = await client.moonlink.search({
            query,
            source: "youtube",
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
        if(res.loadType === "error") {
            qr = res.query.toString();
            if(qr.includes("spotify")){
                return interaction.reply({
                    content: `Spotify links are not supported at the moment.`,
                    ephemeral: true,
                });
            }
            return interaction.reply({
                content: `${res.error.message}`,
                ephemeral: true,
            });
        }
        if (res.loadType === "playlist") {
            interaction.reply({
                content: `Playlist ${res.playlistInfo.name} has been added to the queue.`,
            });
            res.tracks.forEach(track => player.queue.add(track));
        } else {
            player.queue.add(res.tracks[0]);
            interaction.reply({
                content: `Track added to the queue: ${res.tracks[0].title}`,
            });
        }
    }

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
// Interaction Handler
client.on(Events.InteractionCreate, async interaction => {
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
    }
});
