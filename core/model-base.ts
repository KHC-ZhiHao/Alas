import Base from './base'
import Utils from './utils'
import Model from './model'
import Container from './container'
import ModelUnit from './model-unit'
import ListUnit from './list-unit'
import DictionaryUnit from './dictionary-unit'
import * as Loader from './loader'

class ModelBase extends Base {
    // 動態建立prototype
    Views: any
    Methods: any
    BaseUnit: any
    ListViews: any
    ListMethods: any
    DictionaryViews: any
    DictionaryMethods: any
    options: any
    container: Container
    modelKeys: Array<string>
    propertyNames: Array<string>
    readonly id = Utils.generateId()
    readonly name: string
    constructor(container: Container, name: string, options: any = {}) {
        super('ModelBase')
        this.name = name
        this.container = container
        this.options = Utils.verify(options, {
            body: [false, ['object'], {}],
            defs: [false, ['object'], {}],
            refs: [false, ['object'], {}],
            self: [false, ['function'], null],
            init: [false, ['function'], null],
            list: [false, ['object'], {}],
            views: [false, ['object'], {}],
            watch: [false, ['object'], {}],
            export: [false, ['function'], null],
            methods: [false, ['object'], {}],
            loaders: [false, ['object'], null],
            inited: [false, ['function'], null],
            dictionary: [false, ['function'], {}],
            defaultView: [false, ['function'], null],
            errorMessage: [false, ['function'], null]
        })
        this.init()
        this.checkBody()
        this.propertyNames = Object.keys(this.options.body)
        this.modelKeys = this.propertyNames.concat(Object.keys(this.options.refs))
    }

    init() {
        this.initViews()
        this.initMethods()
        this.initBaseUnit()
        this.initListViews()
        this.initListMethods()
        this.initDictionaryViews()
        this.initDictionaryMethods()
    }

    initViews() {
        let views = this.options.views
        this.Views = function(unit: any) {
            // @ts-ignore
            this._views = views
            // @ts-ignore
            this._target = unit
        }
        for (let key in views) {
            Object.defineProperty(this.Views.prototype, key, {
                enumerable: true,
                get: function() {
                    return this._views[key](this._target)
                }
            })
        }
    }

    initMethods() {
        let methods = this.options.methods
        this.Methods = function(unit: any) {
            // @ts-ignore
            this._target = unit
            // @ts-ignore
            this._methods = methods
        }
        for (let key in methods) {
            this.Methods.prototype[key] = function(...args: any[]) {
                return this._methods[key](this._target, ...Array.from(args))
            }
        }
    }

    initListViews() {
        let views = this.options.list.views || {}
        this.ListViews = function(unit: any) {
            // @ts-ignore
            this._views = views
            // @ts-ignore
            this._target = unit
        }
        for (let key in views) {
            Object.defineProperty(this.ListViews.prototype, key, {
                enumerable: true,
                get: function() {
                    return this._views[key](this._target)
                }
            })
        }
    }

    initListMethods() {
        let methods = this.options.list.methods || {}
        this.ListMethods = function(unit: any) {
            // @ts-ignore
            this._target = unit
            // @ts-ignore
            this._methods = methods
        }
        for (let key in methods) {
            this.ListMethods.prototype[key] = function(...args: any[]) {
                return this._methods[key](this._target, ...Array.from(args))
            }
        }
    }

    initDictionaryViews() {
        let views = this.options.dictionary.views || {}
        this.DictionaryViews = function(unit: any) {
            // @ts-ignore
            this._views = views
            // @ts-ignore
            this._target = unit
        }
        for (let key in views) {
            Object.defineProperty(this.DictionaryViews.prototype, key, {
                enumerable: true,
                get: function() {
                    return this._views[key](this._target)
                }
            })
        }
    }

    initDictionaryMethods() {
        let methods = this.options.dictionary.methods || {}
        this.DictionaryMethods = function(unit: any) {
            // @ts-ignore
            this._target = unit
            // @ts-ignore
            this._methods = methods
        }
        for (let key in methods) {
            this.DictionaryMethods.prototype[key] = function(...args: any[]) {
                return this._methods[key](this._target, ...Array.from(args))
            }
        }
    }

    initBaseUnit() {
        let refs = this.options.refs
        let body = this.options.body
        let Unit = class extends Model {}
        for (let key in body) {
            Object.defineProperty(Unit.prototype, key, {
                enumerable: true,
                get: this.getDefineProperty('body', key),
                set: this.setDefineProperty(key, false)
            })
        }
        for (let key in refs) {
            Object.defineProperty(Unit.prototype, key, {
                enumerable: true,
                get: this.getDefineProperty('refs', key),
                set: this.setDefineProperty(key, true)
            })
        }
        this.BaseUnit = Unit
    }

    getDefineProperty(name: string, key: string) {
        if (name === 'refs') {
            return function() {
                // @ts-ignore
                return this._model.refs[key].unit
            }
        } else {
            return function() {
                // @ts-ignore
                return this._model.body[key]
            }
        }
    }

    setDefineProperty(key: string, protect: boolean) {
        if (protect) {
            return function() {
                // @ts-ignore
                throw this._model.$devError('set', `This property(${key}) is protect.`)
            }
        }
        return function(value: any) {
            if (typeof value === 'function') {
                // @ts-ignore
                throw this._model.$devError('set', 'Body data not allow function.')
            }
            // @ts-ignore
            if (this._model.options.watch[key] && this[key] !== value) {
                // @ts-ignore
                this._model.options.watch[key](this, value)
            }
            // @ts-ignore
            this._model.body[key] = value
        }
    }

    checkBody() {
        for (let key in this.options.body) {
            if (key[0] === '$' || key[0] === '_') {
                throw this.$devError('checkBody', `Body ${key} has system symbol $ and _.`)
            }
        }
    }

    isUs(model: Model) {
        return model._model.base.id === this.id
    }

    getViews(unit: any) {
        return new this.Views(unit)
    }

    getMethods(unit: any) {
        return new this.Methods(unit)
    }

    getLoaders(unit: any) {
        return Loader.create(unit, 'model', this.options.loaders)
    }

    getBaseUnit(model: any) {
        return new this.BaseUnit(model)
    }

    create(options: any) {
        return new ModelUnit(this, options)
    }

    createList(options: any) {
        return new ListUnit(this, options)
    }

    createDictionary(options: any) {
        return new DictionaryUnit(this, options)
    }
}

export default ModelBase
