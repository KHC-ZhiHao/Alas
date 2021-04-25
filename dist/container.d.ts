import Base from './base';
import Core from './core';
import ModelBase from './model-base';
import * as Types from './types';
declare class Container extends Base {
    core: Core;
    name: string;
    prefix: string;
    options: any;
    interface: any;
    modelBases: {
        [key: string]: ModelBase;
    };
    readonly id: string;
    constructor(core: Core, name: string, options?: {});
    init(): void;
    initRules(): void;
    initModels(): void;
    initMessage(): void;
    initInterface(): void;
    addModel(name: string, options: any): void;
    checkInterface(options: Types.ContainerInterface): string | true;
    verifyInterface(name: Types.InterfaceSuppotrs, options: Types.ContainerInterface): any[];
    getRules(target: any, array: any[]): Types.RuleCallback[];
    getConfig(): any;
    getMessage(name: string, values?: any): string;
    getName(name: string): string;
    getNames(array: string[]): string[];
    validate(target: any, value: any, array: string[]): string | true;
    make(baseName: string, options?: Types.MakeModelOptions): import("./model-unit").default;
    makeList(baseName: string, options?: Types.MakeModelOptions): import("./list-unit").default<import("./model").default>;
    makeDictionary(baseName: string, options?: Types.MakeModelOptions): import("./dictionary-unit").default<import("./model").default>;
}
export default Container;
