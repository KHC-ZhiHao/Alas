import List from './list'
import Utils from './utils'
import Model from './model'
import ModelBase from './model-base'
import * as Types from './types'
import * as Loader from './loader'
import { GroupUnit, IGroup } from './group-base'

class ListUnit<T extends Model> extends GroupUnit implements IGroup {
    map: { [key: string]: T } = {}
    unit: List<T>
    items: Array<T> = []
    options: any
    originSize: number
    constructor(base: ModelBase, options: Types.MakeModelOptions) {
        super('List', base, options)
        this.options = Utils.verify(base.options.list, {
            key: [false, ['function', 'string'], '*'],
            write: [false, ['function'], null],
            writeAfter: [false, ['function'], null],
            views: [false, ['object'], {}],
            methods: [false, ['object'], {}],
            loaders: [false, ['object'], null]
        })
        this.unit = new List(this)
        this.views = new base.ListViews(this.unit)
        this.methods = new base.ListMethods(this.unit)
        this.originSize = 0
        this.loaders = Loader.create(this.unit, 'list', this.options.loaders)
    }

    getType() {
        return 'list'
    }

    toPKey(key: string) {
        return '$' + key
    }

    getKey(model: Model) {
        return this.options.key !== '*' ? this.options.key(model) : Utils.generateId()
    }

    getKeyIndex(key: string) {
        let target = this.get(key)
        if (target) {
            return this.items.findIndex(model => model === target)
        }
        throw this.$devError('getKeyIndex', `Key(${key}) not found.`)
    }

    forEach(callback: (model: T, index: number) => any) {
        let length = this.items.length
        let items = [...this.items]
        for (let index = 0; index < length; index++) {
            let result = callback(items[index], index)
            if (result === '_break') {
                break
            }
        }
    }

    isChange() {
        if (this.items.length !== this.originSize) {
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
        let length = this.items.length
        let result: Array<ReturnType<Model['$validate']>> = new Array(length)
        let success = true
        this.forEach((model, index) => {
            result[index] = model.$validate()
            if (result[index].success === false) {
                success = false
            }
        })
        return { success, result }
    }

    getBodys() {
        let length = this.items.length
        let output = new Array(length)
        this.forEach((model, index) => {
            output[index] = model.$body()
        })
        return output
    }

    getExports() {
        let length = this.items.length
        let output = new Array(length)
        this.forEach((model, index) => {
            output[index] = model.$export()
        })
        return output
    }

    put(key: string, model: T, insert?: number) {
        model._model.parent = this.parent
        if (this.has(key) === false) {
            if (insert != null) {
                this.items.splice(insert, 0, model)
            } else {
                this.items.push(model)
            }
        } else {
            this.items.splice(this.getKeyIndex(key), 1, model)
        }
        this.map[this.toPKey(key)] = model
    }

    has(key: string) {
        return !!this.get(key)
    }

    get(key: string) {
        return this.map[this.toPKey(key)]
    }

    write(source: any, options: Types.ListWriteOptions = {}) {
        let type = typeof source
        if (type !== 'object') {
            this.$devError('write', 'Source not a object.')
        }
        if (source == null) {
            this.$devError('write', 'Source is null.')
        }
        if (Array.isArray(source)) {
            this.$devError('write', 'Source is a array.')
        }
        let model = this.generateModel(source)
        let key = this.getKey(model)
        if (this.base.isUs(model) === false) {
            this.$devError('write', `Source not a ${this.base.name} model.`)
        }
        if (Utils.getType(key) !== 'string') {
            this.$devError('write', `Write key(${key}) not a string`)
        }
        let eventData = {
            key,
            model,
            source
        }
        let success = () => {
            this.put(key, model, options.insert)
            this.event.emit(this.unit, '$writeSuccess', [eventData])
            if (this.options.writeAfter) {
                this.options.writeAfter(this.unit, { key, model })
            }
        }
        this.status.dirty = true
        if (this.options.write) {
            this.options.write(this.unit, {
                key,
                model,
                success,
                reject: (message: any) => {
                    this.event.emit(this.unit, '$writeReject', [{ message, ...eventData }])
                }
            })
        } else {
            success()
        }
    }

    batchWrite(items: any[]) {
        if (Array.isArray(items) === false) {
            throw this.$devError('batchWrite', 'Data not a array.')
        }
        this.status.dirty = true
        for (let item of items) {
            this.write(item)
        }
    }

    batchWriteAsync(items: any[], ms: number, parallel: number) {
        this.status.dirty = true
        return new Promise((resolve) => {
            let interval = setInterval(() => {
                for (let i = 0; i < parallel; i++) {
                    let item = items.shift()
                    if (item) {
                        this.write(item)
                    } else {
                        clearInterval(interval)
                        resolve(true)
                        this.event.emit(this.unit, '$writeAsyncDone')
                        break
                    }
                }
            }, ms)
        })
    }

    fetch(key: string) {
        let model = this.get(key)
        if (model) {
            this.event.emit(this.unit, '$fetch', [model])
        } else {
            this.event.emit(this.unit, '$fetchFail', [key])
        }
        return model
    }

    clear() {
        this.map = {}
        this.items = []
        this.setDirty(false)
    }

    remove(key: string) {
        if (this.has(key)) {
            this.items.splice(this.getKeyIndex(key), 1)
            this.event.emit(this.unit, '$remove', [key])
            delete this.map[this.toPKey(key)]
        } else {
            throw this.$devError('remove', `Key(${key}) not found.`)
        }
    }

    removeByItem(data: any) {
        for (let key in this.map) {
            if (this.map[key] === data) {
                return this.remove(key.slice(1))
            }
        }
        throw this.$devError('removeByItem', `Data not found.`)
    }
}

export default ListUnit
