interface KeyMap {
    [key: string]: any;
}
declare class Utils {
    static isModel(target: any): boolean;
    static isList(target: any): boolean;
    static isDictionary(target: any): boolean;
    static jpjs(target: any): any;
    static getType(target: any): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "empty" | "array" | "NaN" | "regexp" | "promise" | "buffer" | "error";
    static verify(data?: any, validates?: any): any;
    static generateId(): string;
    static peel(target: any, path: string, def?: any): any;
    static mapping(keyMap: KeyMap, target: any, reverse?: boolean): any;
    static valueTo<T extends {
        [key: string]: any;
    }, K>(target: T, trans: (key: string) => K): { [key in keyof T]: K; };
}
export declare const privateProperty: (target: any, key: string, value: any) => any;
export default Utils;
