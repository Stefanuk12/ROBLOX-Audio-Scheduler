// Dependencies
import { AudioSchedule } from "../src"
import * as fs from "fs"

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