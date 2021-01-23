"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioSchedule = void 0;
// Dependencies
const source_1 = __importDefault(require("got/dist/source"));
// Simple wait function
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Class
class AudioSchedule {
    constructor() {
        // Vars
        this.cookie = "";
        this.csrf = "";
        this.HttpClient = source_1.default;
    }
    // Initialiser
    init(cookie) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cookie = cookie;
            this.csrf = yield this.getCSRF(this.cookie);
            this.HttpClient = source_1.default.extend({
                prefixUrl: "https://publish.roblox.com/v1/",
                headers: {
                    Cookie: `.ROBLOSECURITY=${cookie};`,
                    "X-CSRF-TOKEN": this.csrf,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 OPR/72.0.3815.473"
                }
            });
            return this;
        });
    }
    // Get CSRF
    getCSRF(cookie) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get Response
            const response = yield source_1.default.post("https://auth.roblox.com/v2/logout", {
                throwHttpErrors: false,
                headers: {
                    Cookie: `.ROBLOSECURITY=${cookie};`
                }
            });
            // Return CSRF
            if (response.headers["x-csrf-token"]) {
                return response.headers["x-csrf-token"].toString();
            }
            else {
                throw ("Invalid Cookie.");
            }
        });
    }
    // Audio idk
    audio(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Checking
            const canUpload = (yield this.verify(data)).canAfford;
            if (canUpload == false) {
                throw ("Cannot afford to upload this audio.");
            }
            // Config
            const config = {
                name: data.name,
                file: data.audio.toString("base64"),
                paymentSource: "User",
                estimatedFileSize: data.audio.length
            };
            // Response
            const response = yield this.HttpClient.post("audio", {
                throwHttpErrors: false,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(config)
            });
            return JSON.parse(response.body);
        });
    }
    // Verify
    verify(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Config
            const config = {
                name: "string",
                file: "string",
                paymentSource: "User",
                fileSize: data.audio.length,
                duration: 4
            };
            // Response
            const response = yield this.HttpClient.post("audio/verify", {
                throwHttpErrors: false,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(config)
            });
            return JSON.parse(response.body);
        });
    }
    // Schedule audio
    scheduleAudio(data, time) {
        return __awaiter(this, void 0, void 0, function* () {
            // Checking
            if (this.csrf == "") {
                throw ("Make sure your cookie is valid!");
            }
            // Calculating how long to wait then waiting
            const waitTime = time.getTime() - Date.now();
            yield wait(waitTime);
            // Uploading audio
            const response = yield this.audio(data);
            // Return
            return response;
        });
    }
}
exports.AudioSchedule = AudioSchedule;
//# sourceMappingURL=index.js.map