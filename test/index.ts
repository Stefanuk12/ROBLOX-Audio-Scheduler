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
    await uploader.audioNew({
        audio: file,
        name: "test_1",
        filetype: "ogg"
    });
})();