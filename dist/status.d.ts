import Base from './base';
import { LoaderDone } from './index';
import { EventCallback } from './types';
import * as Loader from './loader';
type StatusLoader = (self: Status<any, any>, done: LoaderDone<any>, fail: (error: any) => void, params: any) => any;
type StateHandler = () => {
    [key: string]: any;
} | Array<any>;
export type StatusOptions<T extends Record<string, StateHandler>> = {
    states: T;
    loaders?: {
        [key: string]: StatusLoader;
    };
};
type Channels = {
    fetch: [
        {
            name: string;
            result: any;
        }
    ];
    reset: [
        {
            name: string;
        }
    ];
};
declare class Status<O extends StatusOptions<any>, T extends O['loaders'] extends undefined ? {
    [key: string]: any;
} : O['loaders'] = O['loaders'] extends undefined ? {
    [key: string]: any;
} : O['loaders']> extends Base {
    readonly _id: string;
    readonly _name: string;
    readonly _states: any;
    readonly _loaders: Loader.LoaderCase<any>;
    private _options;
    private _event;
    constructor(name: string, options: O);
    get loaders(): { [key in keyof T]: ((params: Parameters<T[key]>[3] extends undefined ? void : Parameters<T[key]>[3]) => Promise<Parameters<Parameters<T[key]>[1] extends LoaderDone<any> ? Parameters<T[key]>[1] : any>[0]>) & import("./loader").default<Parameters<Parameters<T[key]>[1] extends LoaderDone<any> ? Parameters<T[key]>[1] : any>[0], Parameters<T[key]>[3] extends undefined ? void : Parameters<T[key]>[3]>; };
    on<T extends keyof Channels>(channelName: T, callback: EventCallback<Channels[T]>): string;
    once<T extends keyof Channels>(channelName: T, callback: EventCallback<Channels[T]>): string;
    off<T extends keyof Channels>(channelName: T, id: string): void;
    set<N extends keyof O['states']>(name: N, value: ReturnType<O['states'][N]>): void;
    fetch<N extends keyof O['states']>(name: N): ReturnType<O['states'][N]>;
    reset<N extends keyof O['states']>(name: N): void;
    resetAll(params?: {
        withLoader: boolean;
    }): void;
}
export default Status;
