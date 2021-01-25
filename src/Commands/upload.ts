// Dependencies
import { Command } from "./command";
import { Message, MessageEmbed } from "discord.js";
import got from "got";
import { AudioSchedule } from "roblox-audio-scheduler";
import { client } from "..";

// Scheduler
export interface ScheduledUpload {
    audio: Buffer,
    name: string,
    time: Date;
    discordId: string;
    cookie: string;
}

export class Scheduler {
    static queue: Array<ScheduledUpload> = []

    // Add an audio to the queue
    async add(data: ScheduledUpload){
        Scheduler.queue.push(data);
    }

    // Remove an audio from the queue
    async remove(data: ScheduledUpload){
        for (var i = 1; i < Scheduler.queue.length; i++){
            if (Scheduler.queue[i] == data){
                Scheduler.queue.splice(i, 1);
            }
        }
    }
    
    // Function to run all of the due audios in the queue
    async run(){
        const now = new Date();

        // Loop through queue
        for (var i = 0; i < Scheduler.queue.length; i++){
            const data = Scheduler.queue[i];
            const user = client.users.cache.get(data.discordId);

            if (user){
                // Check if there are any pending audios
                if (now.getTime() >= data.time.getTime()){
                    try {
                        // Upload the audio and remove audio from queue + Verify if their cookie is valid
                        const Uploader = await (new AudioSchedule()).init(data.cookie);

                        // Upload
                        const uploadedAudio = await Uploader.audio({audio: data.audio, name: data.name});

                        // Remove from queue
                        Scheduler.queue.splice(i, 1);

                        // Notify User
                        const messageEmbed = new MessageEmbed()
                            .setColor('#77dd77')
                            .setTitle('Schedule audio')
                            .setDescription(`Audio successfully uploaded! URL: https://www.roblox.com/library/${uploadedAudio.Id}/${uploadedAudio.Name}`)
                            .setTimestamp()
                            .setFooter("Audio Scheduler - by Stefanuk12");

                        user.send(messageEmbed);

                        return;
                    } catch (err){
                        // Alert the user
                        const messageEmbed = new MessageEmbed()
                            .setColor('#ff6961')
                            .setTitle('Schedule audio')
                            .setDescription(`Something went wrong with your audio schedule!`)
                            .addFields(
                                    {name: "Error Details", value: err},
                                    {name: "Audio Object", value: `Name: ${data.name}\nTime: ${data.time.toString()}`}
                            )
                            .setTimestamp()
                            .setFooter("Audio Scheduler - by Stefanuk12");

                        user.send(messageEmbed);

                        return;
                    }
                }
            }
        }
    }
}

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

        // Check if everything was provided
        if (matches.length != 3){
            const messageEmbed = new MessageEmbed()
            .setColor('#ff6961')
            .setTitle('Schedule audio')
            .setDescription(`Missing arguments!`)
            .setTimestamp()
            .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        }

        // Checking if the provided time was a number
        if (!parseInt(matches[1]) && matches[1] != "now"){
            const messageEmbed = new MessageEmbed()
            .setColor('#ff6961')
            .setTitle('Schedule audio')
            .setDescription(`Invalid time, please provide the epoch time correctly.`)
            .setTimestamp()
            .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        }

        // Checking if the time was provided
        const now = new Date();
        const time = (matches[1] == "now" && now || new Date(parseInt(matches[1])));

        // Check if it is an invalid date
        if (time.toString() == "Invalid Date"){
            const messageEmbed = new MessageEmbed()
            .setColor('#ff6961')
            .setTitle('Schedule audio')
            .setDescription(`Invalid time, please provide the epoch time correctly.`)
            .setTimestamp()
            .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        } else {
            // Check if it is a past date
            if (now > time){
                const messageEmbed = new MessageEmbed()
                .setColor('#ff6961')
                .setTitle('Schedule audio')
                .setDescription(`The provided time was in the past, please provide the epoch/unix time correctly.`)
                .setTimestamp()
                .setFooter("Audio Scheduler - by Stefanuk12");

                message.channel.send(messageEmbed);

                return;
            }

            // Check if it was over 3 days in advance
            if (time.getTime() > now.getTime() + 259200000){
                const messageEmbed = new MessageEmbed()
                .setColor('#ff6961')
                .setTitle('Schedule audio')
                .setDescription(`The provided time was too far in the future (over 3 days), please provide the epoch/unix time correctly.`)
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
                .setDescription(`You did not provide a valid cookie.`)
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
                .setDescription(`You did not provide a valid cookie.`)
                .setTimestamp()
                .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        }

        // Check if a file was provided
        const attachments = message.attachments.array();
        if (attachments.length < 1){
            const messageEmbed = new MessageEmbed()
            .setColor('#ff6961')
            .setTitle('Schedule audio')
            .setDescription(`You did not provide a file to upload.`)
            .setTimestamp()
            .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        }

        // Download file
        const url = attachments[0].url;
        const response = got.get(url);
        const file = await response.buffer();

        // Check if file was too big
        if (file.length > 9999999){
            const messageEmbed = new MessageEmbed()
            .setColor('#ff6961')
            .setTitle('Schedule audio')
            .setDescription(`File size too large.`)
            .setTimestamp()
            .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        }

        // Check file type
        const fileType = url.indexOf("mp3", url.length - 3) == -1 || url.indexOf("ogg", url.length - 3) == -1;
        if (!fileType){
            const messageEmbed = new MessageEmbed()
            .setColor('#ff6961')
            .setTitle('Schedule audio')
            .setDescription(`File type is invalid. Only .ogg and .mp3 are accepted.`)
            .setTimestamp()
            .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        }

        // Check if they can even afford to upload
        const verifyData = await Uploader.verify({audio: file, name: matches[0]})
        if (verifyData && verifyData.canAfford == false){
            const messageEmbed = new MessageEmbed()
            .setColor('#ff6961')
            .setTitle('Schedule audio')
            .setDescription(`You cannot afford this audio. You need ${verifyData.price - verifyData.balance} more robux.`)
            .setTimestamp()
            .setFooter("Audio Scheduler - by Stefanuk12");

            message.channel.send(messageEmbed);

            return;
        }

        // Add to scheduler
        await scheduler.add({
            audio: file,
            name: matches[0],
            time: time,
            discordId: message.author.id,
            cookie: matches[2]
        })

        const messageEmbed = new MessageEmbed()
            .setColor('#77dd77')
            .setTitle('Schedule audio')
            .setDescription(`Added audio to upload queue.`)
            .setTimestamp()
            .setFooter("Audio Scheduler - by Stefanuk12");

        message.channel.send(messageEmbed);

        return;
    }
);

// Scheduler
const scheduler = new Scheduler();

// Scheduler Loop
(async () => {
    while (true){
        // Repeat every second
        await (new Promise(resolve => setTimeout(resolve, 1000)));
        await scheduler.run();
    }
})();