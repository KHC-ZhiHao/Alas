import Base from './base';
import Event from './event';
import Model from './model';
import ModelBase from './model-base';
import { LoaderCase } from './loader';
import * as Types from './types';
declare class ModelUnit extends Base {
    body: {
        [key: string]: any;
    };
    refs: {
        [key: string]: any;
    };
    base: ModelBase;
    unit: Model;
    views: Types.Views;
    event: Event;
    parent: any;
    loaders: LoaderCase<any>;
    options: any;
    rawBody: string | null;
    rawData: any;
    methods: {
        [key: string]: (...params: any) => any;
    };
    customOptions: any;
    status: {
        initd: boolean;
        error: null;
        ready: boolean;
    };
    constructor(base: ModelBase, options: any);
    emit(name: string, args?: Array<any>): void;
    setCustomOptions(options: Types.MakeModelOptions): void;
    dataParse(data?: any): any;
    dataStringify(data: any): string | null;
    getBody(): any;
    getKeys(): string[];
    getErrorMessage(): any;
    getProperty(name: string): any;
    isReady(): boolean;
    isError(): boolean;
    isInited(): boolean;
    isChange(key?: string): any;
    export(): any;
    reload(data: any): void;
    copy(options?: Types.MakeModelOptions): ModelUnit;
    reset(key?: string): void;
    initBody(): void;
    setBody(data: any, source: any, raw?: boolean): void;
    setError(data: any): void;
    eachRefs(callback: (target: any, key: string, type: Types.Modes) => any): void;
    init(data: any, raw?: boolean): this;
    commit(): void;
    profile(): any;
    install(): void;
    initUnit(): void;
    initRefs(): void;
    getRules(name: string): Types.RuleCallback[];
    getRawdata(): any;
    validate(value: any, name: string): string | true;
    validateAll(): {
        result: {
            [key: string]: any;
        };
        success: boolean;
    };
}
export default ModelUnit;
