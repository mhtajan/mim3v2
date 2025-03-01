const { REST, Routes } = require('discord.js');
require('dotenv').config()
const clientId = process.env.CLIENT_ID
const token = process.env.TOKEN
const fs = require('node:fs');
const path = require('node:path');

const commands = [
    {
        name: 'play',
        description: 'Play a song from youtube',
        options: [
            {
                name: 'song',
                type: 3,
                description: 'The song you want to play',
                required: true,
            },
        ],
    },
    {
        name: 'pause',
        description: 'Pause the current song',
    },
    {
        name: 'resume',
        description: 'Resume the current song',
    },
    {
        name: 'skip',
        description: 'Skip the current song',
    },
    {
        name: 'queue',
        description: 'Show the current queue',
    },
    {
        name: 'stop',
        description: 'Stop the current song',
    },
    {
        name: 'volume',
        description: 'Change the volume',
        options: [
            {
                name: 'volume',
                type: 4,
                description: 'The volume you want to set',
            }
        ]
    },
    {
        name: 'autoplay',
        description: 'Toggle autoplay',
    },
    {
        name: 'non-stop',
        description: 'Toggle non-stop mode',
    },
    {
        name: 'clear-queue',
        description: 'Clear the queue',
    },
    {
        name: 'lyrics',
        description: 'Get the lyrics of the current song',
    }
];


// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

//and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
