// Dependencies
import got, { Got } from "got/dist/source";

// Simple wait function
function wait(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

// Interface
export interface IAudioUpload {
    audio: Buffer,
    name: string,
    description: string,
    filename: string,
    filetype: "mp3" | "ogg"
}

// Class
export class AudioSchedule {
    // Vars
    cookie: string = "";
    csrf: string = "";
    HttpClient: Got = got;

    // Initialiser
    async init(cookie: string){
        this.cookie = cookie;

        this.csrf = await this.getCSRF(this.cookie);
        console.log("Got CSRF: " + this.csrf)

        this.HttpClient = got.extend({
            prefixUrl: "https://publish.roblox.com/v1/",
            headers: {
                Cookie: `.ROBLOSECURITY=${cookie};`,
                "X-CSRF-TOKEN": this.csrf,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 OPR/72.0.3815.473"
            }
        });

        return this;
    }

    // Get CSRF
    async getCSRF(cookie: string){
        // Get Response
        const response = await got.post("https://auth.roblox.com/v2/logout", {
            throwHttpErrors: false,
            headers: {
                Cookie: `.ROBLOSECURITY=${cookie};`
            }
        });

        // Return CSRF
        if (response.headers["x-csrf-token"]){
            return response.headers["x-csrf-token"].toString();
        } else {
            throw("Invalid Cookie.");
        }
    }

    // Audio idk
    async audio(data: IAudioUpload){
        // Checking
        const canUpload = (await this.verify(data)).canAfford
        if (canUpload == false){
            throw("Cannot afford to upload this audio.")
        }

        // Config
        const config = {
            name: data.name,
            file: data.audio.toString("base64"),
            paymentSource: "User",
            estimatedFileSize: data.audio.length
        };

        // Response
        const response = await this.HttpClient.post("audio", {
            throwHttpErrors: false,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(config)
        });

        return JSON.parse(response.body);
    }
    
    // Verify
    async verify(data: IAudioUpload){
        // Config
        const config = {
            name: "string",
            file: "string",
            paymentSource: "User",
            fileSize: data.audio.length,
            duration: 4
        }

        // Response
        const response = await this.HttpClient.post("audio/verify", {
            throwHttpErrors: false,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(config)
        });

        return JSON.parse(response.body);
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
        const response = await this.audio(data);
        console.log(response);
    }
}