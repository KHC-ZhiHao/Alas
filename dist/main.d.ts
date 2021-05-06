import Base from './base';
import Core from './core';
import List from './list';
import Utils from './utils';
import Model from './model';
import Event from './event';
import Container from './container';
import Dictionary from './dictionary';
import ListenerGroup from './listener-group';
import Status, { StatusOptions } from './status';
import { MakeModelOptions, EventCallback, RuleArray } from './types';
import { Containers, ContainerOptions, PackageOptions, ModelOptions } from './index';
declare type Params<C extends Containers> = {
    name?: string;
    containers?: {
        [key in keyof C]: ContainerOptions<C[key]> | [ContainerOptions<C[key]>, any];
    };
    packages?: Array<PackageOptions>;
};
declare type Channels = {
    makedModel: [Model];
    makedList: [List<Model>];
    makedDictionary: [Dictionary<Model>];
    registeredStatus: [Status<any, any>];
};
declare class Main<T extends Containers = Containers> extends Base {
    readonly _name: string;
    readonly _core: Core;
    readonly _event: Event;
    readonly _statuses: Status<any, any>[];
    readonly _globalContainer: Container;
    constructor(params?: Params<T>);
    static get Vue2Plugin(): {
        install(Vue: any, { alas }: {
            alas: Main<Containers>;
        }): void;
    };
    static get Vue3Plugin(): {
        install(app: any, { alas, reactive }: {
            alas: Main<Containers>;
            reactive: any;
        }): void;
    };
    static get utils(): typeof Utils;
    static get Model(): typeof Model;
    static get List(): typeof List;
    static get Dictionary(): typeof Dictionary;
    static get MsPackage(): import("./interfaces").IPackage;
    static get ListenerGroup(): typeof ListenerGroup;
    get utils(): typeof Utils;
    get name(): string;
    get locale(): string;
    on<T extends keyof Channels>(channelName: T, callback: EventCallback<Channels[T]>): string;
    once<T extends keyof Channels>(channelName: T, callback: EventCallback<Channels[T]>): string;
    off<T extends keyof Channels>(channelName: T, id: string): void;
    meg(name: string, value?: any): string;
    make<K extends keyof T, N extends keyof T[K]['models']>(containerName: K, modelName: N, options?: MakeModelOptions): T[K]['models'][N]['model'];
    makeList<K extends keyof T, N extends keyof T[K]['models']>(containerName: K, modelName: N, options?: MakeModelOptions): T[K]['models'][N]['list'];
    makeDictionary<K extends keyof T, N extends keyof T[K]['models']>(containerName: K, modelName: N, options?: MakeModelOptions): T[K]['models'][N]['dictionary'];
    addModel(name: string, data: ModelOptions<any>): void;
    addPackage(data: PackageOptions): void;
    addContainer(name: string, data: ContainerOptions<any>, options?: any): any;
    rules(data: RuleArray): Array<(...params: any) => boolean | string>;
    setLocale(locale: string): void;
    instanceof<K extends keyof T, N extends keyof T[K]['models']>(container: K, model: N, source: any): Boolean;
    registerStatus<T extends StatusOptions>(name: string, options: T): Status<T, T["loaders"] extends undefined ? {
        [key: string]: any;
    } : T["loaders"]>;
}
export default Main;
