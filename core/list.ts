import Model from './model'
import ListUnit from './list-unit'
import { Group } from './group-base'

class List<T extends Model> extends Group {
    _unit: ListUnit<T>
    constructor(unit: ListUnit<T>) {
        super(unit)
        this._unit = unit
    }

    get size() {
        return this._unit.items.length
    }

    get items() {
        return this._unit.items
    }

    forEach(callback: (model: T, index: number) => any) {
        return this._unit.forEach(callback)
    }

    isChange() {
        return this._unit.isChange()
    }

    validate() {
        return this._unit.validateAll()
    }

    bodys() {
        return this._unit.getBodys()
    }

    exports() {
        return this._unit.getExports()
    }

    has(key: string) {
        return this._unit.has(key)
    }

    fetch(key: string) {
        return this._unit.fetch(key)
    }

    write(data: any, options: { insert?: number } = {}) {
        return this._unit.write(data, {
            insert: options.insert
        })
    }

    batchWrite(data: Array<any>) {
        return this._unit.batchWrite(data)
    }

    batchWriteAsync(items: Array<any>, ms: number = 2, parallel: number = 1) {
        return this._unit.batchWriteAsync(items, ms, parallel)
    }

    remove(key: string) {
        return this._unit.remove(key)
    }

    removeByItem(data: any) {
        return this._unit.removeByItem(data)
    }

    clear() {
        return this._unit.clear()
    }
}

export default List
