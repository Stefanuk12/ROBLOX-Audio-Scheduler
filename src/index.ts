// Dependencies
import got from "got/dist/source";
import * as fs from "fs";
const FormData = require("form-data")

// Simple wait function
function wait(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

// Interface
export interface IAudioUpload {
    audio: fs.ReadStream,
    name: string,
    description: string,
    filename: string,
    filetype: "mp3" | "ogg"
}

// Class
export class AudioSchedule {
    // Vars
    cookie: string;
    csrf: string = "";

    // Constructor
    constructor(cookie: string){
        this.cookie = cookie;
        this.init();
    }

    // Initialiser
    async init(){
        this.csrf = await this.getCSRF(this.cookie);
    }

    // Get CSRF
    async getCSRF(cookie: string){
        // Get Response
        const response = await got.post("https://catalog.roblox.com/v1/catalog/items/details", {
            throwHttpErrors: false,
            headers: {
                cookie: ".ROBLOSECURITY=" + cookie
            }
        });

        // Return CSRF
        if (response.headers["x-csrf-token"]){
            return response.headers["x-csrf-token"].toString();
        } else {
            throw("Invalid Cookie.");
        }
    }

    // Upload Audio
    async uploadAudio(data: IAudioUpload){
        // Checking
        if (this.csrf == ""){
            throw("Make sure your cookie is valid!");
        }

        // Config
        const config = {
            apple: [{
                type: "Audio",
                name: data.name,
                description: data.description
            }]
        };

        // Form Data
        const form = new FormData();
        form.append("Content-Disposition: form-data; name=\"uploadAssetRequest.files\"; filename=\"" + data.filename + "." + data.filetype + "Content-Type: audio/" + (data.filetype == "mp3" && "mpeg" || "ogg"), data.audio.toString());
        form.append("config.json", JSON.stringify(config));

        // Uploading
        const response = got.post("https://publish.roblox.com/v1/assets/upload", {
            headers: {
                Cookie: ".ROBLOSECURITY=" + this.cookie + ";",
                "X-CSRF-TOKEN": this.csrf,
                "Content-Type": "multipart/form-data",
                "Accept": "application/json"
            },
            body: form,
        });

        return response;
    }

    // Schedule audio
    async scheduleAudio(data: IAudioUpload, time: Date){
        // Checking
        if (this.csrf == ""){
            throw("Make sure your cookie is valid!");
        }

        // Calculating how long to wait then waiting
        const waitTime = time.getTime() - Date.now();
        await wait(waitTime);

        // Uploading audio
        const response = await this.uploadAudio(data);
        console.log(response.body);
    }
}