// Dependencies
import * as fs from "fs"
import * as Discord from 'discord.js';
import { Commands } from './Commands/command';
import { config } from './config';

// Client
export const client = new Discord.Client();

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

    // This is needed because args?.shift()?. does not want to work
    if (args != undefined){
        const shiftedArgs = args.shift();
        if (shiftedArgs){
            const command = shiftedArgs.toLowerCase();
            if (command) {
                // Resolving the command
                const resolvedCommand = commands.resolve(command);
        
                // Execute command
                if (resolvedCommand){
                    resolvedCommand.execute(message, args);
                };
            } 
        }
    }
});

// Login
client.login(config.BotToken);