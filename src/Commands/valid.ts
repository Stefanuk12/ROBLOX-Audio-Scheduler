// Dependencies
import { Command } from "./command";
import { Message, MessageEmbed } from "discord.js";
import { AudioSchedule } from "roblox-audio-scheduler";

// Create Command
export const command = new Command(
    "valid",
    async function(message: Message, args: Object){
        if (message.channel.type != "dm"){
            return;
        };

        // Vars
        const matches = Array.from(message.content.matchAll(/"(.*?)"/gm), m => m[1]);

        // Check if a cookie was inputted
        if (matches.length != 1){
            const messageEmbed = new MessageEmbed()
                .setColor('#ff6961')
                .setTitle('Verify Cookie')
                .setDescription("Invalid arguments.")
                .setTimestamp()
                .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        }

        // Vars
        const Uploader = new AudioSchedule()
        
        //
        try {
            await Uploader.getCSRF(matches[0])

            const messageEmbed = new MessageEmbed()
                .setColor('#77dd77')
                .setTitle('Verify Cookie')
                .setDescription("Valid cookie.")
                .setTimestamp()
                .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        } catch (err){
            const messageEmbed = new MessageEmbed()
                .setColor('#ff6961')
                .setTitle('Verify Cookie')
                .setDescription("Invalid cookie.")
                .setTimestamp()
                .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        }
    }
);