import Model from './model';
import ModelBase from './model-base';
import Dictionary from './dictionary';
import { GroupUnit, IGroup } from './group-base';
declare class DictionaryUnit<T extends Model> extends GroupUnit implements IGroup {
    map: Map<string, T>;
    unit: Dictionary<T>;
    options: any;
    originSize: number;
    constructor(base: ModelBase, options: any);
    getType(): string;
    write(data: {
        [key: string]: any;
    }): void;
    forEach(callback: (model: Model, index: string) => any): void;
    isChange(): boolean;
    validateAll(): {
        success: boolean;
        result: any;
    };
    getBodys(): {
        [key: string]: any;
    };
    getExports(): {
        [key: string]: any;
    };
    clear(): void;
}
export default DictionaryUnit;
