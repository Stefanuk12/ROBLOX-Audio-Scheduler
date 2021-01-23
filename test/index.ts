// Dependencies
import { AudioSchedule } from "../src"
import * as fs from "fs"

// Simple wait function
function wait(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

//
(async() => {
    // Vars
    const file = fs.readFileSync("./test/test.ogg");
    const cookie = "";
    const uploader = await new AudioSchedule().init(cookie);

    // Upload
    await uploader.scheduleAudio({
        audio: file,
        name: "test"
    }, new Date());
})();