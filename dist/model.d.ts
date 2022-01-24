import Utils from './utils';
import Container from './container';
import ModelUnit from './model-unit';
import { EventCallback, MakeModelOptions } from './types';
declare class Model {
    _model: ModelUnit;
    _container: Container;
    $self: {
        [key: string]: any;
    };
    constructor(model: ModelUnit);
    get $v(): {};
    get $o(): {};
    get $m(): {};
    get $loader(): import("./loader").LoaderCase<any>;
    get $config(): any;
    get $utils(): typeof Utils;
    get $ready(): boolean;
    get $error(): any;
    get $parent(): any;
    $on(channelName: string, callback: EventCallback): string;
    $once(channelName: string, callback: EventCallback): string;
    $off(channelName: string, id: string): void;
    $emit(channelName: string, ...params: any): void;
    $raw(): any;
    $meg(name: string, value?: {
        [key: string]: string;
    }): string;
    $init(data?: any): this;
    $copy(options?: MakeModelOptions): this;
    $body(): any;
    $keys(): string[];
    $reset(key?: keyof Omit<this, keyof Model>): void;
    $rules(name: keyof Omit<this, keyof Model>): import("./types").RuleCallback[];
    $commit(): void;
    $profile(): any;
    $export(): any;
    $reload(data: any): void;
    $generate(options?: MakeModelOptions): this;
    $isChange(key?: keyof Omit<this, keyof Model>): boolean;
    $validate(): {
        result: {
            [key: string]: any;
        };
        success: boolean;
    };
    $validateBy(key: keyof Omit<this, keyof Model>): string | true;
    $setError(data?: any): void;
}
export default Model;
