// Dependencies
import * as fs from "fs"
import * as Discord from 'discord.js';
import { Commands } from './Commands/command';
import { config } from './config';

// Client
const client = new Discord.Client();

// Commands
export const commands: Commands = new Commands();
for (const file of fs.readdirSync('./src/Commands')) {
    require(`./Commands/${file}`);
};

// On Ready
client.once('ready', () => {
	console.log('Ready!');
});

// On message
client.on('message', (message) => {
    // Failsafe
    if (!message.content.startsWith(config.BotPrefix) || message.author.bot) return;

    // Vars
    const args = message.content.slice(config.BotPrefix.length).trim().split(/ +/);
    const command = args?.shift()?.toLowerCase();
    if (command) {
        const resolvedCommand = commands.resolve(command);

        // Execute command
        if (resolvedCommand){
            resolvedCommand.execute(message, args);
        };
    } 
});

// Login
client.login(config.BotToken);