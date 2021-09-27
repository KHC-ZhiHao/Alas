import Base from './base';
import Event from './event';
import { Modes, EventCallback } from './types';
declare type LoaderHandler = (...params: any) => void;
declare type Channels = {
    setMessage: [string];
    success: [any];
    error: [any];
    start: [];
};
declare class LoaderCore extends Base {
    name: string;
    type: Modes;
    done: boolean;
    error: any;
    event: Event;
    loader: Loader<any, any>;
    target: any;
    called: boolean;
    result: any;
    message: string;
    loading: boolean;
    handler: LoaderHandler;
    starting: any;
    constructor(loader: Loader<any, any>, type: Modes, target: any, name: string, handler: LoaderHandler);
    setMessage(message: string): void;
    resetAll(): void;
    close(error?: null): void;
    reset(): void;
    start(options: any): Promise<any>;
}
declare class Loader<T, P = any> {
    _core: LoaderCore;
    _result?: T;
    _params?: P;
    constructor(type: Modes, target: any, name: string, handler: LoaderHandler);
    get called(): boolean;
    get done(): boolean;
    get error(): any;
    get loading(): boolean;
    get message(): string;
    get result(): T | null;
    setMessage(message: string): void;
    on<T extends keyof Channels>(channelName: T, callback: EventCallback<Channels[T]>): string;
    once<T extends keyof Channels>(channelName: T, callback: EventCallback<Channels[T]>): string;
    off(channelName: string, id: string): void;
    start(params: P): Promise<T>;
    seek(params: P): Promise<T>;
    reset(): void;
}
export declare class LoaderCase<T> {
    _items: {
        [key: string]: Loader<T, any>;
    };
    get error(): {
        key: string;
        value: any;
    } | null;
    get loading(): {
        key: string;
        value: boolean;
    } | null;
    _copyStatus(loaders: LoaderCase<any>): void;
    reset(): void;
}
declare type LoaderSimplifyCallback<T, D, R> = (self: T, data: D) => Promise<R>;
export declare type LoaderSimplifyResponse<T, S, R> = (self: T, done: (result: R) => void, fail: (error: any) => void, params: S) => Promise<any>;
export declare const loaderSimplify: <T, D, R>(callback: LoaderSimplifyCallback<T, D, R>) => LoaderSimplifyResponse<T, D, R>;
export declare type LoaderMethod<T, K, R, P> = K extends LoaderSimplifyResponse<any, any, any> ? LoaderSimplifyResponse<T, P, R> : (target: T, done: (result: R) => void, fail: (error: any) => void, params: P) => any;
export declare function create(target: any, type: Modes, options?: {
    [key: string]: LoaderHandler;
}): LoaderCase<any>;
/**
 * 這是給外部比較彈性的 loader，例如不需要 model 的加載
 */
export declare function generateSimplifyLoader<D, R, T extends LoaderSimplifyCallback<{}, D, R>>(handler: T): Loader<R, D> & ((params: D) => Promise<R>);
export default Loader;
