// Dependencies
import { Command } from "./command";
import { Message, MessageEmbed } from "discord.js";
import { AudioSchedule } from "roblox-audio-scheduler";

// Create Command
export const command = new Command(
    "robux",
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
                .setTitle('Robux Checker')
                .setDescription("Invalid arguments.")
                .setTimestamp()
                .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        }

        // Vars + Cookie check
        var Uploader
        try {
            Uploader = await new AudioSchedule().init(matches[0]);
        } catch (err){
            const messageEmbed = new MessageEmbed()
                .setColor('#ff6961')
                .setTitle('Robux Checker')
                .setDescription("Invalid cookie.")
                .setTimestamp()
                .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        }

        // Verify
        const balance = (await Uploader.verify({audio: Buffer.from(" "), name: "test"})).balance

        // Output
        const messageEmbed = new MessageEmbed()
            .setColor('#77dd77')
            .setTitle('Robux Checker')
            .setDescription(`Current ROBUX balance: ${balance}`)
            .setTimestamp()
            .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

         return;
    }
);