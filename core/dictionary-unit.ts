import Utils from './utils'
import Model from './model'
import ModelBase from './model-base'
import Dictionary from './dictionary'
import * as Loader from './loader'
import { GroupUnit, IGroup } from './group-base'

class DictionaryUnit<T extends Model> extends GroupUnit implements IGroup {
    map: Map<string, T> = new Map()
    unit: Dictionary<T>
    options: any
    originSize: number
    constructor(base: ModelBase, options: any) {
        super('Dictionary', base, options)
        this.options = Utils.verify(base.options.dictionary, {
            views: [false, ['object'], {}],
            methods: [false, ['object'], {}],
            loaders: [false, ['object'], null]
        })
        this.originSize = 0
        this.unit = new Dictionary(this)
        this.views = new base.DictionaryViews(this.unit)
        this.methods = new base.DictionaryMethods(this.unit)
        this.parent = null
        this.customOptions = options
        this.loaders = Loader.create(this.unit, 'dictionary', this.options.loaders)
    }

    getType() {
        return 'dictionary'
    }

    write(data: { [key: string]: any }, raw = false) {
        this.setDirty(true)
        for (let key in data) {
            this.map.set(key, this.generateModel(data[key], raw))
        }
    }

    forEach(callback: (model: Model, index: string) => any) {
        for (let [key, value] of this.map.entries()) {
            let result = callback(value, key)
            if (result === '_break') {
                break
            }
        }
    }

    isChange() {
        if (this.map.size !== this.originSize) {
            return true
        }
        let changed = false
        this.forEach(model => {
            if (model.$isChange()) {
                changed = true
                return '_break'
            }
        })
        return changed
    }

    validateAll() {
        let result: any = {}
        let success = true
        this.forEach((model, key) => {
            result[key] = model.$validate()
            if (result[key].success === false) {
                success = false
            }
        })
        return { success, result }
    }

    getBodys(): { [key: string]: any } {
        let output: any = {}
        this.forEach((model, key) => {
            output[key] = model.$body()
        })
        return output
    }

    getExports(): { [key: string]: any } {
        let output: any = {}
        this.forEach((model, key) => {
            output[key] = model.$export()
        })
        return output
    }

    clear() {
        this.map.clear()
        this.setDirty(false)
        this.event.emit(this.unit, '$clear', [])
    }
}

export default DictionaryUnit
