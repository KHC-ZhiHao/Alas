import Model from './model'
import DictionaryUnit from './dictionary-unit'
import { Group } from './group-base'

class Dictionary<T extends Model> extends Group {
    _unit: DictionaryUnit<T>
    constructor(unit: DictionaryUnit<T>) {
        super(unit)
        this._unit = unit
    }

    get map() {
        return this._unit.map
    }

    get size() {
        return this._unit.map.size
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
        return this._unit.map.has(key)
    }

    get(key: string) {
        return this._unit.map.get(key)
    }

    write(data: { [key: string]: any }) {
        return this._unit.write(data)
    }

    remove(key: string) {
        return this._unit.map.delete(key)
    }

    clear() {
        return this._unit.clear()
    }
}

export default Dictionary
