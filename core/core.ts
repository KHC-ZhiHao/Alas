import Base from './base'
import Main from './main'
import Rule from './rule'
import List from './list'
import Utils from './utils'
import Model from './model'
import Message from './message'
import Container from './container'
import Dictionary from './dictionary'
import * as Types from './types'
import { IContainerOptions, IPackage } from './interfaces'

class Core extends Base {
    main: Main
    rule: Rule = new Rule()
    message: Message = new Message()
    containers: { [key: string]: Container }
    systemModel: Model
    constructor(main: Main) {
        super('Core')
        this.main = main
        this.containers = {}
        this.addContainer('__system__', {
            models: {
                __system__: {}
            }
        })
        this.systemModel = this.make('__system__/__system__')
    }

    get locale() {
        return this.message.locale
    }

    getPrefix(name: string) {
        if (name === '') {
            this.$devError('getPrefix', `This name(${name}) is empty.`)
        }
        return '#' + name + '.'
    }

    addPackage(optinos: IPackage) {
        let pack = Utils.verify(optinos, {
            name: [true, ['string']],
            rules: [false, ['object'], {}],
            locales: [false, ['object'], {}]
        })
        let prefix = this.getPrefix(pack.name)
        this.rule.addMultiple(pack.rules, prefix)
        this.message.add(pack.locales, prefix)
    }

    addContainer(name: string, container: IContainerOptions): Container {
        if (this.containers[name]) {
            throw this.$devError('addContainer', `Name(${name}) already exists.`)
        }
        this.containers[name] = new Container(this, name, container)
        return this.containers[name]
    }

    getRules(array: Types.RuleArray) {
        return this.rule.getMore(this.systemModel, array)
    }

    setLocale(locale: string) {
        this.message.setLocale(locale)
    }

    parseKey(key: string) {
        let [ container, name ] = key.split('/')
        if (name == null) {
            name = container
            container = '__system__'
        }
        return {
            name,
            container
        }
    }

    instanceof(key: string, target: any): boolean {
        if (Utils.isModel(target) === false && Utils.isList(target) === false && Utils.isDictionary(target) === false) {
            throw this.$devError('instanceof', 'Target not a model, list or dictionary.')
        }
        let isGroup = Utils.isModel(target) === false
        let modelBase = null
        let container = null
        let aims = this.parseKey(key)
        if (isGroup) {
            container = target._unit.base.container
            modelBase = target._unit.base
        } else {
            container = target._container
            modelBase = target._model.base
        }
        let targetContainer = this.containers[aims.container]
        if (targetContainer == null) {
            this.$devError('instanceof', `Container(${aims.container}) not found`)
        }
        let targetModelBase = targetContainer.modelBases[aims.name]
        if (targetModelBase == null) {
            this.$devError('instanceof', `Model(${aims.name}) not found`)
        }
        return container.id === targetContainer.id && modelBase.id === targetModelBase.id
    }

    make(target: string, options?: Types.MakeModelOptions) {
        let aims = this.parseKey(target)
        let container = this.containers[aims.container]
        if (container == null) {
            throw this.$devError('make', `Container name(${aims.container}) not found.`)
        }
        return container.make(aims.name, options).unit
    }

    makeList(target: string, options?: Types.MakeModelOptions): List<Model> {
        let aims = this.parseKey(target)
        let container = this.containers[aims.container]
        if (container == null) {
            throw this.$devError('makeList', `Container name(${aims.container}) not found.`)
        }
        return container.makeList(aims.name, options).unit
    }

    makeDictionary(target: string, options?: Types.MakeModelOptions): Dictionary<Model> {
        let aims = this.parseKey(target)
        let container = this.containers[aims.container]
        if (container == null) {
            throw this.$devError('makeDictionary', `Container name(${aims.container}) not found.`)
        }
        return container.makeDictionary(aims.name, options).unit
    }
}

export default Core
