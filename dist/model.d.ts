import Utils from './utils';
import Container from './container';
import ModelUnit from './model-unit';
import { EventCallback, MakeModelOptions } from './types';
type KeysOfTypeStrict<T, U> = {
    [P in keyof T]: T[P] extends U ? (U extends T[P] ? P : never) : never;
}[keyof T];
type PickByTypeStrict<U, T> = Pick<T, KeysOfTypeStrict<T, U>>;
declare class Model {
    _model: ModelUnit;
    _container: Container;
    $self: {
        [key: string]: any;
    };
    constructor(model: ModelUnit);
    get $v(): Record<string, unknown>;
    get $o(): Record<string, unknown>;
    get $m(): Record<string, unknown>;
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
    $setAttr(data: Partial<Omit<PickByTypeStrict<number | boolean | string, this>, keyof Model>>): void;
    $keys(): string[];
    $reset(key?: keyof Omit<this, keyof Model>): void;
    $rules(name: keyof Omit<this, keyof Model>): import("./types").RuleCallback[];
    $commit(): void;
    $profile(): any;
    $export(): any;
    $reload(data: any): void;
    $generate(options?: MakeModelOptions): this;
    $generateFrom<T extends string>(target: T, options?: MakeModelOptions): any;
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
