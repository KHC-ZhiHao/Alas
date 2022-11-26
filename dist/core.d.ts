import Base from './base';
import Main from './main';
import Rule from './rule';
import List from './list';
import Model from './model';
import Message from './message';
import Container from './container';
import Dictionary from './dictionary';
import * as Types from './types';
import { IContainerOptions, IPackage } from './interfaces';
declare class Core extends Base {
    main: Main;
    rule: Rule;
    message: Message;
    containers: {
        [key: string]: Container;
    };
    systemModel: Model;
    constructor(main: Main);
    get locale(): string;
    getPrefix(name: string): string;
    addPackage(optinos: IPackage): void;
    addContainer(name: string, container: IContainerOptions): Container;
    getRules(array: Types.RuleArray): Types.RuleCallback[];
    setLocale(locale: string): void;
    parseKey(key: string): {
        name: string;
        container: string;
    };
    instanceof(key: string, target: any): boolean;
    make(target: string, options?: Types.MakeModelOptions): Model;
    makeList(target: string, options?: Types.MakeModelOptions): List<Model>;
    makeDictionary(target: string, options?: Types.MakeModelOptions): Dictionary<Model>;
}
export default Core;
