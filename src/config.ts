import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/../env' });

export const config = {
    BotToken: process.env.BotToken, // you can just replace that with your token
    BotPrefix: "u!",
}