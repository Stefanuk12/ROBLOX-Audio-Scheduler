/// <reference types="node" />
import { Got } from "got/dist/source";
export interface IAudioUpload {
    audio: Buffer;
    name: string;
}
export interface IAudioUpload2 {
    audio: Buffer;
    name: string;
    filetype: "mp3" | "ogg";
}
export declare class AudioSchedule {
    cookie: string;
    csrf: string;
    HttpClient: Got;
    init(cookie: string): Promise<this>;
    getRequestVerificationToken(cookie: string): Promise<string | undefined>;
    getCSRF(cookie: string): Promise<string>;
    audioNew(data: IAudioUpload2): Promise<string | undefined>;
    audio(data: IAudioUpload): Promise<any>;
    verify(data: IAudioUpload): Promise<any>;
    scheduleAudio(data: IAudioUpload, time: Date): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map