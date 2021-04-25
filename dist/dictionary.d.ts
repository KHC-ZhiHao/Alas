import Model from './model';
import DictionaryUnit from './dictionary-unit';
import { Group } from './group-base';
declare class Dictionary<T extends Model> extends Group {
    _unit: DictionaryUnit<T>;
    constructor(unit: DictionaryUnit<T>);
    get map(): Map<string, T>;
    get size(): number;
    isChange(): boolean;
    validate(): {
        success: boolean;
        result: any;
    };
    bodys(): {
        [key: string]: any;
    };
    exports(): {
        [key: string]: any;
    };
    has(key: string): boolean;
    get(key: string): T | undefined;
    write(data: {
        [key: string]: any;
    }): void;
    remove(key: string): boolean;
    clear(): void;
}
export default Dictionary;
