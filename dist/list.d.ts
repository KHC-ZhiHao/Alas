import Model from './model';
import ListUnit from './list-unit';
import { Group } from './group-base';
declare class List<T extends Model> extends Group {
    _unit: ListUnit<T>;
    constructor(unit: ListUnit<T>);
    get size(): number;
    get items(): T[];
    forEach(callback: (model: T, index: number) => any): void;
    isChange(): boolean;
    validate(): {
        success: boolean;
        result: {
            result: {
                [key: string]: any;
            };
            success: boolean;
        }[];
    };
    bodys(): any[];
    exports(): any[];
    has(key: string): boolean;
    fetch(key: string): T;
    write(data: any, options?: {
        insert?: number;
    }): void;
    batchWrite(data: Array<any>): void;
    batchWriteAsync(items: Array<any>, ms?: number, parallel?: number): Promise<unknown>;
    remove(key: string): void;
    removeByItem(data: any): void;
    clear(): void;
}
export default List;
