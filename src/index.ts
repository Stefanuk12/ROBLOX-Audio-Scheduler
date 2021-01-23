// Dependencies
import got from "got/dist/source";
import * as fs from "fs";
import FormData from "form-data";

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

        // Form Data
        const form = new FormData();
        form.append("__RequestVerificationToken", "_Fva1hxkC29aH4m6xWoBZ5RLJTR627TdZCvSvj1iTD4TjMqSGh0mL7diVImyf2eRh67AphJxWeBZVgliA5djeDDTMzNzyka1EYK_XZ9e08y5E2uP0")
        form.append("assetTypeId", 3)
        form.append("isOggUploadEnabled", (data.filetype == "ogg" && "True" || "False"))
        form.append("groupId", " ")
        form.append("onVerificationPage", "False")
        form.append("captchaEnabled", "False")
        form.append("captchaToken", " ")
        form.append("captchaProvider", " ")
        const formFileName = `Content-Disposition: form-data; name="file"; filename="${data.filename}.${data.filetype}"\nContent-Type: audio/${(data.filetype == "ogg" && "ogg" || "mpeg")}`
        form.append(formFileName, data.audio)
        form.append("name", data.name)

        const options = {
            host: "www.roblox.com",
            path: "/build/upload",
            headers: {Cookie: ".ROBLOSECURITY=" + this.cookie}
        }

        form.submit(options, function(err, res) {
            if (err) throw err;
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
        });
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

    }
}