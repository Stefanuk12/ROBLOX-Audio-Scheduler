// Dependencies
import { Command } from "./command";
import { Message, MessageEmbed } from "discord.js";
import got from "got";
import { AudioSchedule } from "roblox-audio-scheduler";

// Create Command
export const command = new Command(
    "upload",
    async function(message: Message, args: Object){
        if (message.channel.type != "dm"){
            return;
        };

        // Vars
        var Uploader: AudioSchedule;
        const matches = Array.from(message.content.matchAll(/"(.*?)"/gm), m => m[1]);
        const time = new Date(0);

        // Check if everything was provided
        if (matches.length != 3){
            const messageEmbed = new MessageEmbed()
            .setColor('#ff6961')
            .setTitle('Schedule audio')
            .setDescription(`Missing arguments! Argument format: "FileName" "Time" "Cookie"`)
            .setTimestamp()
            .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        }

        // Checking if the time was provided
        const now = new Date()
        const epochTime = matches[1] == "now" && now.getTime() || parseInt(matches[1])

        if (!epochTime){
            const messageEmbed = new MessageEmbed()
            .setColor('#ff6961')
            .setTitle('Schedule audio')
            .setDescription(`Invalid time, please provide the epoch/unix time correctly. Argument format: "FileName" "Time" "Cookie"`)
            .setTimestamp()
            .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        } else {
            time.setUTCSeconds(parseInt(matches[1]))
    
            // Check if it is a future date
            if (now.getTime() > epochTime){
                const messageEmbed = new MessageEmbed()
                .setColor('#ff6961')
                .setTitle('Schedule audio')
                .setDescription(`The provided time was in the past, please provide the epoch/unix time correctly. Argument format: "FileName" "Time" "Cookie"`)
                .setTimestamp()
                .setFooter("Audio Scheduler - by Stefanuk12");

                message.channel.send(messageEmbed);

                return;
            }
        }

        // Checking if a cookie was provided
        if (matches[2].substring(0, 116) != "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_"){
            const messageEmbed = new MessageEmbed()
                .setColor('#ff6961')
                .setTitle('Schedule audio')
                .setDescription(`You did not provide a valid cookie. Argument format: "FileName" "Time" "Cookie"`)
                .setTimestamp()
                .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        }

        // Checking if the cookie is valid
        try {
            Uploader = await (new AudioSchedule()).init(matches[2])
        } catch (err) {
            const messageEmbed = new MessageEmbed()
                .setColor('#ff6961')
                .setTitle('Schedule audio')
                .setDescription(`You did not provide a valid cookie. Argument format: "FileName" "Time" "Cookie"`)
                .setTimestamp()
                .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        }

        // Check if a file was provided
        const attachments = message.attachments.array()
        if (!attachments[0]){
            const messageEmbed = new MessageEmbed()
            .setColor('#ff6961')
            .setTitle('Schedule audio')
            .setDescription(`You did not provide a file to upload. Argument format: "FileName" "Time" "Cookie"`)
            .setTimestamp()
            .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        }

        // Download file
        const response = got.get(attachments[0].url);
        const file = await response.buffer();

        // Upload
        const uploadedAudio = await Uploader.scheduleAudio({
            audio: file,
            name: matches[0]
        }, time);

        // Notify
        if (uploadedAudio.errors && uploadedAudio.errors[0]){
            const messageEmbed = new MessageEmbed()
            .setColor('#ff6961')
            .setTitle('Schedule audio')
            .setDescription(`Error: ${uploadedAudio.errors[0].message}`)
            .setTimestamp()
            .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        };

        const messageEmbed = new MessageEmbed()
            .setColor('#77dd77')
            .setTitle('Schedule audio')
            .setDescription(`Audio successfully uploaded! URL: https://www.roblox.com/library/${uploadedAudio.Id}/${uploadedAudio.Name}`)
            .setTimestamp()
            .setFooter("Audio Scheduler - by Stefanuk12");

        message.channel.send(messageEmbed);

        return;
    }
);