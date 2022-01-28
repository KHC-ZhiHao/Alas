import MainBase from './main';
import ListBase from './list';
import ModelBase from './model';
import DictionaryBase from './dictionary';
import * as Types from './types';
import * as Loader from './loader';
declare type Rule = (self: ModelBase, value: any, params: {
    [key: string]: string;
}) => string | true;
declare type RuleObject = {
    required: Boolean;
    handler: Rule;
};
declare type Rules = {
    [key: string]: Rule | RuleObject;
};
declare type Locales = {
    [key in string]?: {
        [key: string]: string;
    };
};
declare type writeContext<M> = {
    key: string;
    model: M;
    reject: (message: any) => any;
    success: () => any;
};
declare type writeAfter<M> = {
    key: string;
    model: M;
};
declare type RefString<T> = T extends ListBase<any> ? `[${string}]` : T extends DictionaryBase<any> ? `{${string}}` : string;
export declare type BodyRules = '#ms.required' | '#ms.alphanumeric' | '#ms.email' | '#ms.in|of:key1,key2' | '#ms.range|max:?|min:?|same:?' | '#ms.length|max:?|min:?|same:?' | '#ms.type|is:?' | '#ms.strongType|is:?' | '#ms.number' | '#ms.hhmm' | '#ms.mmdd' | '#ms.yyyymm' | '#ms.yyyymmdd' | String;
declare type ValuesOfType<T, V> = {
    [P in keyof T as T[P] extends V ? P : never]: T[P];
};
export interface IModelOptions<M extends ModelBase, L extends ListBase<M> = ListBase<M>, D extends DictionaryBase<M> = DictionaryBase<M>, A = Omit<M, keyof ModelBase>, R = ValuesOfType<A, ModelBase | ListBase<any> | DictionaryBase<any>>, B = Omit<A, keyof R>> {
    self?: (self: M, params?: M['$init'] extends undefined ? any : Parameters<M['$init']>[0]) => M['$self'];
    init?: (self: M, params?: M['$init'] extends undefined ? any : Parameters<M['$init']>[0]) => Omit<{
        [key in keyof M]?: M[key] extends ModelBase ? Record<string, any> : M[key] extends ListBase<any> ? any[] : M[key] extends DictionaryBase<any> ? Record<string, any> : M[key];
    }, keyof ModelBase>;
    export?: (self: M) => M['$init'] extends undefined ? any : Parameters<M['$init']>[0];
    inited?: (self: M) => void;
    defaultView?: (self: M, key: string) => any;
    errorMessage?: (self: M, message?: any) => any;
    body?: {
        [key in keyof B]: BodyRules[];
    };
    defs?: {
        [key in keyof B]?: (self: M) => B[key];
    };
    refs?: {
        [key in keyof R]: RefString<R[key]>;
    };
    watch?: {
        [key in keyof B]?: (self: M, value: B[key]) => void;
    };
    views?: {
        [key in keyof M['$v']]: (self: M) => M['$v'][key];
    };
    methods?: {
        [key in keyof M['$m']]: M['$m'][key] extends (...params: any) => any ? (self: M, ...parmas: Parameters<M['$m'][key]>) => ReturnType<M['$m'][key]> : never;
    };
    loaders?: {
        [key in keyof M['$o']]: M['$o'][key] extends Loader.default<any, any> ? Loader.LoaderMethod<M, M['$o'], M['$o'][key]['_result'], M['$o'][key]['_params']> : never;
    };
    list?: {
        key?: (model: M) => string;
        write?: (list: L, context: writeContext<M>) => any;
        writeAfter?: (list: L, context: writeAfter<M>) => any;
        views?: {
            [key in keyof L['v']]: (list: L) => L['v'][key];
        };
        methods?: {
            [key in keyof L['m']]: L['m'][key] extends (...params: any) => any ? (list: L, ...parmas: Parameters<L['m'][key]>) => ReturnType<L['m'][key]> : never;
        };
        loaders?: {
            [key in keyof L['o']]: L['o'][key] extends Loader.default<any, any> ? Loader.LoaderMethod<L, L['o'], L['o'][key]['_result'], L['o'][key]['_params']> : never;
        };
    };
    dictionary?: {
        views?: {
            [key in keyof D['v']]: (self: D) => any;
        };
        methods?: {
            [key in keyof D['m']]: D['m'][key] extends (...params: any) => any ? (self: D, ...parmas: Parameters<D['m'][key]>) => ReturnType<D['m'][key]> : never;
        };
        loaders?: {
            [key in keyof D['o']]: D['o'][key] extends Loader.default<any, any> ? Loader.LoaderMethod<D, D['o'], D['o'][key]['_result'], D['o'][key]['_params']> : never;
        };
    };
}
export interface IContainer {
    models: {
        [key: string]: {
            list: ListBase<any>;
            model: ModelBase;
            dictionary: DictionaryBase<any>;
        };
    };
}
export interface IContainerOptions<T extends IContainer = IContainer> {
    models: {
        [key in keyof T['models']]: IModelOptions<T['models'][key]['model'], T['models'][key]['list'], T['models'][key]['dictionary']>;
    };
    config?: {
        [key: string]: any;
    };
    rules?: Rules;
    locales?: Locales;
    install?: (self: MainBase, config: any, options: any) => any;
    interface?: Types.ContainerInterface;
}
export interface IPackage {
    name: string;
    rules?: Rules;
    locales?: Locales;
}
export {};
