// Dependencies
import { Command } from "./command";
import { Message, MessageEmbed } from "discord.js";

// Create Command
export const command = new Command(
    "help",
    async function(message: Message, args: Object){
        if (message.channel.type != "dm"){
            return;
        };

        // Check if everything was provided
        const messageEmbed = new MessageEmbed()
            .setColor('#aec6cf')
            .setTitle('Schedule audio - Help')
            .addFields(
                {name: "upload", value: `Uploads an audio to ROBLOX.\n\n**Arguments**: "name" "time in seconds epoch" "cookie" - **Requires a file attachment to be uploaded too**.\n\n**Example**: \`u!upload "test" "1611439243064" "cookie here"\`\n\n**Extra info**: You can use "now" for the time as well.`},
                {name: "valid", value: `Verifies if a cookie is valid.\n\n**Arguments**: "cookie"\n\n**Example**: u!valid "cookie"`},
                {name: "robux", value: `Shows how much robux an account has.\n\n**Arguments** "cookie"\n\n**Example**: u!robux "cookie"`}
            )
            .setTimestamp()
            .setFooter("Audio Scheduler - by Stefanuk12");

        message.channel.send(messageEmbed);

        return;
    }
);