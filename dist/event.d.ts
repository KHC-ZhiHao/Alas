import Base from './base';
import * as Types from './types';
export declare class Event extends Base {
    type: string;
    channels: {
        [key: string]: Channel;
    };
    constructor(type: string);
    addChannel(name: string): void;
    getChannel(name: string): Channel;
    getOrCreate(name: string): Channel;
    on(name: string, callback: Types.EventCallback): string;
    once(channelName: string, callback: Types.EventCallback): string;
    off(channelName: string, target: Listener | string): void;
    emit(target: any, channelName: string, params?: Array<any>): void;
    trigger(channelName: string, target: any, params: Array<any>): Promise<void>;
}
export declare class Channel extends Base {
    listeners: {
        [key: string]: Listener;
    };
    constructor();
    checkListener(id: string): void;
    addListener(callback: (event: any, ...params: any) => void): string;
    removeListener(id: string): void;
    broadcast(target: any, params: Array<any>): void;
}
export declare class Listener extends Base {
    id: string;
    channel: Channel;
    callback: Types.EventCallback;
    constructor(channel: Channel, id: string, callback: Types.EventCallback);
    trigger(target: any, params: Array<any>): void;
}
export default Event;
