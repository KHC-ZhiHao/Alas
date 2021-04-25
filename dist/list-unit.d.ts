import List from './list';
import Model from './model';
import ModelBase from './model-base';
import * as Types from './types';
import { GroupUnit, IGroup } from './group-base';
declare class ListUnit<T extends Model> extends GroupUnit implements IGroup {
    map: {
        [key: string]: T;
    };
    unit: List<T>;
    items: Array<T>;
    options: any;
    originSize: number;
    constructor(base: ModelBase, options: Types.MakeModelOptions);
    getType(): string;
    toPKey(key: string): string;
    getKey(model: Model): any;
    getKeyIndex(key: string): number;
    forEach(callback: (model: T, index: number) => any): void;
    isChange(): boolean;
    validateAll(): {
        success: boolean;
        result: {
            result: {
                [key: string]: any;
            };
            success: boolean;
        }[];
    };
    getBodys(): any[];
    getExports(): any[];
    put(key: string, model: T, insert?: number): void;
    has(key: string): boolean;
    get(key: string): T;
    write(source: any, options?: Types.ListWriteOptions): void;
    batchWrite(items: any[]): void;
    batchWriteAsync(items: any[], ms: number, parallel: number): Promise<unknown>;
    fetch(key: string): T;
    clear(): void;
    remove(key: string): void;
    removeByItem(data: any): void;
}
export default ListUnit;
