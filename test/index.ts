// Dependencies
import { AudioSchedule } from "../src"
import * as fs from "fs"

// Simple wait function
function wait(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

//
(async() => {
    const file = fs.readFileSync("./test/file.ogg");
    const cookie = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_E33A6C63393DBC08E1F85D85E995E7FC1B6B492B5941EA4879DC9D4C499DBF6B561B8B7C936243E44E15A8E55B3294D69D4B867A17422BC365E9FAA2E18ACB85F34E3F2851500D5665153534E393DE73D9B6E2197ACA48658977E8711EC710D519ABEDA940D5ABDBC4D8CBC00B84C373D583AE0FC469C6A728FC68DBB86F7340DA90E67551EC958990C05379275FC4D8CECB2585DAAE5E4508FB69408D71511F189C3F33E013125BA59D95D86AEBD046346D3D91F2A5A96D723D21754B4047E36B71A7DEF73B8461E083331292FF6719918138479F795F88B3EFFB62A0C2659FFD58A3BE0E433DAC63F7AA5ABD8CFADCC3F73C870A13518940BBD943C54A65FD1598E23409F04912C01D460C5C3910F7BB2FCC1672DC60FEEDE4BE307D15B6E94CF7D1AB9B12BC017B0F1AFE05A8A043343E533C";
    const uploader = new AudioSchedule(cookie);
    await wait(1000)
    await uploader.scheduleAudio({
        audio: file,
        name: "test",
        description: "",
        filename: "test",
        filetype: "ogg"
    }, new Date());
})();