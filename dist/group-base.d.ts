import Base from './base';
import Event from './event';
import Utils from './utils';
import ModelBase from './model-base';
import { LoaderCase } from './loader';
import * as Types from './types';
export interface IGroup {
    getType: () => string;
    forEach: (...args: any) => any;
    isChange: () => boolean;
    getBodys: () => any;
    getExports: () => any;
    validateAll: () => {
        success: boolean;
        result: any;
    };
}
export declare class GroupUnit extends Base {
    base: ModelBase;
    event: Event;
    views: Types.Views;
    parent: any;
    methods: {
        [key: string]: (...parmas: any) => any;
    };
    loaders: LoaderCase<any>;
    customOptions: any;
    status: {
        dirty: boolean;
    };
    constructor(modelName: string, base: ModelBase, options: Types.MakeModelOptions);
    setDirty(status?: boolean): void;
    generateModel(source: any, raw?: boolean): any;
}
export declare class Group {
    _unit: GroupUnit;
    constructor(unit: GroupUnit);
    get dirty(): boolean;
    get v(): {};
    get m(): {};
    get o(): {};
    get loader(): LoaderCase<any>;
    get config(): any;
    get utils(): typeof Utils;
    get parent(): any;
    setDirty(status?: boolean): void;
    on(channelName: string, handler: Types.EventCallback): string;
    once(channelName: string, handler: Types.EventCallback): string;
    off(channelName: string, id: string): void;
    emit(channelName: string, ...params: any): void;
}
