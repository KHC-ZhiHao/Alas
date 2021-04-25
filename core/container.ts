import Base from './base'
import Core from './core'
import Utils from './utils'
import ModelBase from './model-base'
import * as Types from './types'

class Container extends Base {
    core: Core
    name: string
    prefix: string
    options: any
    interface: any
    modelBases: { [key: string]: ModelBase } = {}
    readonly id = Utils.generateId()
    constructor(core: Core, name: string, options = {}) {
        super('Container')
        this.core = core
        this.name = name
        this.prefix = '$' + this.name + '.'
        this.options = Utils.verify(options, {
            rules: [false, ['object'], {}],
            models: [false, ['object'], {}],
            config: [false, ['object'], {}],
            locales: [false, ['object'], {}],
            install: [false, ['function'], null],
            interface: [false, ['object'], {}]
        })
        this.init()
    }

    init() {
        this.initRules()
        this.initInterface()
        this.initModels()
        this.initMessage()
    }

    initRules() {
        this.core.rule.addMultiple(this.options.rules, this.prefix)
    }

    initModels() {
        for (let key in this.options.models) {
            this.addModel(key, this.options.models[key])
        }
    }

    initMessage() {
        this.core.message.add(this.options.locales, this.prefix)
    }

    initInterface() {
        this.interface = Utils.verify(this.options.interface, {
            body: [false, ['array'], []],
            views: [false, ['array'], []],
            methods: [false, ['array'], []],
            loaders: [false, ['array'], []]
        })
    }

    addModel(name: string, options: any) {
        let checkInterface = this.checkInterface(options)
        if (checkInterface !== true) {
            throw this.$devError('initModels', checkInterface)
        }
        if (this.modelBases[name] == null) {
            this.modelBases[name] = new ModelBase(this, name, options)
        } else {
            throw this.$devError('addModel', 'Model already exists.')
        }
    }

    checkInterface(options: Types.ContainerInterface) {
        let body = this.verifyInterface('body', options)
        let views = this.verifyInterface('views', options)
        let methods = this.verifyInterface('methods', options)
        let loaders = this.verifyInterface('loaders', options)
        if ((body.length + views.length + methods.length + loaders.length) === 0) {
            return true
        }
        let message = 'Interface error for : '
        if (body.length !== 0) {
            message += `\nbody[${views.join()}]`
        }
        if (views.length !== 0) {
            message += `\nviews[${views.join()}]`
        }
        if (methods.length !== 0) {
            message += `\nmethods[${methods.join()}]`
        }
        if (loaders.length !== 0) {
            message += `\nloaders[${loaders.join()}]`
        }
        return message
    }

    verifyInterface(name: Types.InterfaceSuppotrs, options: Types.ContainerInterface) {
        let target = options[name] || {}
        let output = []
        for (let key of this.interface[name]) {
            // @ts-ignore
            if (target[key] == null) {
                output.push(key)
            }
        }
        return output
    }

    getRules(target: any, array: any[]) {
        return this.core.rule.getMore(target, this.getNames(array))
    }

    getConfig() {
        return this.options.config
    }

    getMessage(name: string, values?: any) {
        return this.core.message.get(this.getName(name), values)
    }

    getName(name: string) {
        return name[0] === '#' ? name : this.prefix + name
    }

    getNames(array: string[]) {
        let data = array.slice()
        for (let i = 0; i < array.length; i++) {
            data[i] = this.getName(array[i])
        }
        return data
    }

    validate(target: any, value: any, array: string[]) {
        return this.core.rule.validate(target, value, this.getNames(array))
    }

    make(baseName: string, options?: Types.MakeModelOptions) {
        let base = this.modelBases[baseName]
        if (base == null) {
            throw this.$devError('make', `Model ${baseName} not found.`)
        }
        return base.create(options)
    }

    makeList(baseName: string, options?: Types.MakeModelOptions) {
        let base = this.modelBases[baseName]
        if (base == null) {
            throw this.$devError('makeList', `Model ${baseName} not found.`)
        }
        return base.createList(options)
    }

    makeDictionary(baseName: string, options?: Types.MakeModelOptions) {
        let base = this.modelBases[baseName]
        if (base == null) {
            throw this.$devError('makeDictionary', `Model ${baseName} not found.`)
        }
        return base.createDictionary(options)
    }

}

export default Container
