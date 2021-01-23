/// <reference types="node" />
import { Got } from "got/dist/source";
export interface IAudioUpload {
    audio: Buffer;
    name: string;
}
export declare class AudioSchedule {
    cookie: string;
    csrf: string;
    HttpClient: Got;
    init(cookie: string): Promise<this>;
    getCSRF(cookie: string): Promise<string>;
    audio(data: IAudioUpload): Promise<any>;
    verify(data: IAudioUpload): Promise<any>;
    scheduleAudio(data: IAudioUpload, time: Date): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map