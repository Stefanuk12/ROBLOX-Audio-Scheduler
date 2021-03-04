// Dependencies
import got, { Got, OptionsOfTextResponseBody } from "got/dist/source";
import FormData from "form-data"
import https from "https"

// Simple wait function
function wait(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

// Interface
export interface IAudioUploadConfig {
    name: string,
    file: string,
    groupId?: number,
    paymentSource: string,
    estimatedFileSize?: number,
    estimatedDuration?: number
}
export interface IAudioUploadData {
    audio: Buffer,
    name: string,
    groupId?: number
}
export interface IAudioUploadData2 {
    audio: Buffer,
    name: string,
    filetype: "mp3" | "ogg",
    groupId?: string
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

    // Get __RequestVerificationToken
    async getRequestVerificationToken(cookie: string){
        // Get Response
        const response = await got.get("https://roblox.com/build/upload", {
            ignoreInvalidCookies: false,
            headers: {
                "Host": "www.roblox.com",
                Cookie: `.ROBLOSECURITY=${cookie};`,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 OPR/72.0.3815.473"
            }
        });

        // Match the token and return it
        const result = response.body.match(/<input name=__RequestVerificationToken type=hidden value=(.+?)>/)
        
        if (result){
            return result[1]
        }
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

    // Upload Audio via ROBLOX website
    async audioNew(data: IAudioUploadData2){ // this is a bit broken and idk how to fix it
        // Checking
        const canUpload = (await this.verify({
            audio: data.audio,
            name: data.name
        })).canAfford
        if (canUpload == false){
            throw("Cannot afford to upload this audio.")
        }

        // Get verification token
        const RequestVerificationToken = await this.getRequestVerificationToken(this.cookie)

        // Form Data
        const form = new FormData()
        form.append("__RequestVerificationToken", RequestVerificationToken)
        form.append("assetTypeId", "3")
        form.append("isOggUploadEnabled", "True")
        form.append("groupId", data.groupId || "")
        form.append("onVerificationPage", "False")
        form.append("captchaEnabled", "False")
        form.append("captchaToken", "")
        form.append("captchaProvider", "")
        form.append("file", data.audio, {
            filename: `${data.name}.${data.filetype}`,
            contentType: `audio/${data.filetype == "ogg" && "ogg" || "mpeg"}`,
        })
        form.append("name", data.name)

        // Body
        const body = form.getBuffer().toString("base64")

        // Options
        const options: OptionsOfTextResponseBody = {
            protocol: "https:",
            port: "43",
            method: "POST",
            host: "www.roblox.com",
            path: "/build/upload",

            headers: {
                "content-type": `multipart/form-data; boundary=${form.getBoundary()}`,
                cookie: `.ROBLOSECURITY=${this.cookie}; __RequestVerificationToken=${RequestVerificationToken}`
            },
            body: body,
            
            followRedirect: false
        }

        // Sending request
        const response = await got.post("https://www.roblox.com/build/upload", options)
    
        // Getting the redirect URL + SoundId
        const url = response.body.match(/<a href="(.+?)">here</) || ["Error", "Error"]
        const soundId = response.body.match(/uploadedId=(.+?)">here</) || ["Error", "Error"]
        
        console.log(url[1])
        console.log(soundId[1])

        // Returning SoundId
        return soundId[1]
    }

    // Upload Audio
    async audio(data: IAudioUploadData){
        // Checking
        const canUpload = (await this.verify(data)).canAfford
        if (canUpload == false){
            throw("Cannot afford to upload this audio.")
        }

        // Config
        var config: IAudioUploadConfig = {
            name: data.name,
            file: data.audio.toString("base64"),
            paymentSource: "User",
            estimatedFileSize: data.audio.length
        };
        
        if (data.groupId){
            config.groupId = data.groupId
        }

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
    async verify(data: IAudioUploadData){
        // Config
        const config = {
            name: "string",
            file: "string",
            paymentSource: "User",
            fileSize: data.audio.length
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
    async scheduleAudio(data: IAudioUploadData, time: Date){
        // Checking
        if (this.csrf == ""){
            throw("Make sure your cookie is valid!");
        }

        // Calculating how long to wait then waiting
        const waitTime = time.getTime() - Date.now();
        await wait(waitTime);

        // Uploading audio
        const response = await this.audio(data);
        
        // Return
        return response
    }
}