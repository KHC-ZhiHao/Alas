import Base from './base'
import Event from './event'
import Model from './model'
import Utils, { privateProperty } from './utils'
import ModelBase from './model-base'
import GetSet from './get-set'
import { LoaderCase } from './loader'
import * as Types from './types'

class ModelUnit extends Base {
    body: { [key: string]: any } = {}
    refs: { [key: string]: any } = {}
    base!: ModelBase
    unit!: Model
    views!: Types.Views
    event: Event = new Event('unit')
    parent: any = null
    loaders!: LoaderCase<any>
    options: any
    rawBody: string | null = ''
    rawData: any = null
    methods: { [key: string]: (...params: any) => any } = {}
    customOptions: any
    status = {
        initd: false,
        error: null,
        ready: false
    }
    constructor(base: ModelBase, options: any) {
        super('Model Unit')
        privateProperty(this, 'base', base)
        this.options = base.options
        this.setCustomOptions(options)
        this.install()
    }

    emit(name: string, args?: Array<any>) {
        this.event.emit(this.unit, name, args)
    }

    setCustomOptions(options: Types.MakeModelOptions) {
        this.customOptions = Utils.verify(options || {}, {
            save: [false, ['boolean'], true]
        })
    }

    dataParse(data: any = ''): any {
        return JSON.parse(data)
    }

    dataStringify(data: any): string | null {
        if (this.customOptions.save === false) {
            return null
        }
        return JSON.stringify(data)
    }

    getBody() {
        let output = Utils.jpjs(this.body)
        this.eachRefs((target, key, type) => {
            if (type === 'model') {
                output[key] = target.getBody()
            } else {
                output[key] = target.getBodys()
            }
        })
        return output
    }

    getKeys() {
        return this.base.modelKeys
    }

    getErrorMessage() {
        if (this.base.options.errorMessage) {
            return this.base.options.errorMessage(this.unit, this.status.error)
        } else {
            return this.status.error
        }
    }

    getProperty(name: string) {
        if (this.base.propertyNames.includes(name)) {
            // @ts-ignore
            return this.unit[name]
        } else {
            throw this.$devError('getProperty', `Property name(${name}) not found.`)
        }
    }

    isReady() {
        return !!this.status.ready
    }

    isError() {
        return !!this.status.error
    }

    isInited() {
        return !!this.status.initd
    }

    isChange(key?: string) {
        if (this.customOptions.save === false) {
            throw this.$devError('isChange', 'Options save is false, so not cache rawdata.')
        }
        if (key && this.getProperty(key)) {
            // @ts-ignore
            let target = this.unit[key]
            if (Utils.isModel(target)) {
                return target.isChange()
            } else {
                return target !== this.dataParse(this.rawBody)[key]
            }
        } else {
            let change = this.rawBody !== this.dataStringify(this.body)
            if (change) {
                return true
            }
            this.eachRefs(target => {
                change = target.isChange()
                if (change) {
                    return '_break'
                }
            })
            return change
        }
    }

    export() {
        if (this.options.export) {
            return this.options.export(this.unit)
        } else {
            return this.getBody()
        }
    }

    reload(data: any) {
        if (this.isReady() === false) {
            throw this.$devError('reload', 'This model no ready.')
        }
        this.status.error = null
        this.status.ready = false
        this.status.initd = false
        this.install()
        this.init(data)
    }

    copy(options?: Types.MakeModelOptions) {
        if (this.isReady() === false) {
            throw this.$devError('copy', 'Model not ready.')
        }
        let target = this.base.create(options || this.customOptions).init(this.getBody(), true)
        return target
    }

    reset(key?: string) {
        if (this.customOptions.save === false) {
            throw this.$devError('reset', 'Options save is false, so not cache rawdata.')
        }
        if (key) {
            if (this.getProperty(key)) {
                // @ts-ignore
                this.unit[key] = this.dataParse(this.rawBody)[key]
            } else {
                throw this.$devError('reset', `Property(${key}) name not fonud.`)
            }
        } else {
            this.setBody(this.dataParse(this.rawBody), this.dataParse(this.rawData))
            this.loaders.reset()
        }
    }

    initBody() {
        this.body = {}
        for (let key of this.base.propertyNames) {
            this.body[key] = null
        }
    }

    setBody(data: any = {}, source: any, raw = false) {
        for (let key of this.base.propertyNames) {
            if (typeof data[key] === 'function') {
                throw this.$devError('set', 'Body data not allow function.')
            }
            if (raw || data[key] != null) {
                this.body[key] = data[key]
            } else {
                this.body[key] = this.options.defs[key] ? this.options.defs[key](this.unit) : null
            }
        }
        this.eachRefs((target, key, type) => {
            if (type === 'model') {
                target.isReady() ? target.setBody(data[key], data[key], raw) : target.init(data[key], raw)
            } else if (type === 'list') {
                target.clear()
                if (data[key]) {
                    target.batchWrite(data[key], raw)
                    target.originSize = data[key].length
                }
            } else {
                target.clear()
                if (data[key]) {
                    target.write(data[key], raw)
                    target.originSize = Object.keys(data[key]).length
                }
            }
        })
        if (this.base.options.self) {
            this.unit.$self = this.base.options.self(this.unit, source)
        } else {
            this.unit.$self = {}
        }
    }

    setError(data: any) {
        this.status.error = data || 'Unknown error'
        this.emit('$error', [data])
    }

    eachRefs(callback: (target: any, key: string, type: Types.Modes) => any) {
        for (let key in this.options.refs) {
            let type = this.refs[key] instanceof ModelUnit ? 'model' : this.refs[key].getType()
            let result = callback(this.refs[key], key, type)
            if (result === '_break') {
                break
            }
        }
    }

    // raw 不經過 init 轉譯
    init(data: any, raw = false) {
        if (this.isReady()) {
            throw this.$devError('init', 'Model already inited.')
        }
        if (this.options.init && raw === false) {
            this.setBody(this.options.init(this.unit, data), data, raw)
        } else {
            this.setBody(data, data, raw)
        }
        this.rawBody = this.dataStringify(this.body)
        this.rawData = this.dataStringify(data)
        if (this.base.options.inited) {
            this.base.options.inited(this.unit)
        }
        this.status.ready = true
        this.emit('$ready')
        return this
    }

    commit() {
        if (this.customOptions.save === false) {
            throw this.$devError('commit', 'Options save is false, so not cache rawdata.')
        }
        this.rawBody = this.dataStringify(this.body)
    }

    profile() {
        let object = this.getBody()
        object.$self = {}
        object.$views = {}
        object.$status = Utils.jpjs(this.status)
        object.$options = Utils.jpjs(this.customOptions)
        object.$profile = {
            baseName: this.base.name,
            containerName: this.base.container.name
        }
        for (let key in this.unit.$self) {
            object.$self[key] = this.unit.$self[key]
        }
        for (let key in this.base.options.views) {
            object.$views[key] = this.views[key]
        }
        return object
    }

    install() {
        this.initBody()
        this.initUnit()
        this.initRefs()
        this.rawBody = this.dataStringify(this.body)
        this.rawData = null
        this.status.initd = true
    }

    initUnit() {
        this.unit = this.base.getBaseUnit(this)
        this.loaders = this.base.getLoaders(this.unit)
        this.methods = this.base.getMethods(this.unit)
        if (this.base.options.defaultView) {
            let defaultView = this.base.options.defaultView
            this.views = GetSet(this.base.getViews(this.unit), {
                set: () => '',
                get: (target, key) => {
                    let value = null
                    if (target[key] != null) {
                        value = target[key]
                    }
                    if (value == null) {
                        value = defaultView(this.unit, key)
                    }
                    return value
                }
            })
        } else {
            this.views = this.base.getViews(this.unit)
        }
    }

    initRefs() {
        let refs = this.options.refs
        for (let key in refs) {
            let name = refs[key]
            if (name[0] === '{') {
                this.refs[key] = this.base.container.makeDictionary(name.slice(1, -1), this.customOptions)
            } else if (name[0] === '[') {
                this.refs[key] = this.base.container.makeList(name.slice(1, -1), this.customOptions)
            } else {
                this.refs[key] = this.base.container.make(name, this.customOptions)
            }
            this.refs[key].parent = this.unit
        }
    }

    getRules(name: string) {
        let rules = this.options.body[name]
        if (rules == null) {
            throw this.$devError('getRules', `Rule name(${name}) not found.`)
        }
        return this.base.container.getRules(this.unit, rules)
    }

    getRawdata() {
        if (this.customOptions.save === false) {
            throw this.$devError('getRawdata', 'Options save is false, so not cache rawdata.')
        }
        return this.dataParse(this.rawData)
    }

    validate(value: any, name: string) {
        let rules = this.options.body[name]
        return this.base.container.validate(this.unit, value, rules)
    }

    validateAll() {
        let keys = Object.keys(this.options.body)
        let result: { [key: string]: any } = {}
        let success = true
        for (let name of keys) {
            // @ts-ignore
            let value = this.unit[name]
            let check = this.validate(value, name)
            if (check !== true) {
                result[name] = check
                success = false
            }
        }
        this.eachRefs((target, key) => {
            result[key] = target.validateAll()
            if (result[key].success === false) {
                success = false
            }
        })
        return { result, success }
    }
}

export default ModelUnit
