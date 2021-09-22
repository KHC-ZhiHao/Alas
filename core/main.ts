import Base from './base'
import Core from './core'
import List from './list'
import Utils from './utils'
import Model from './model'
import Event from './event'
import Container from './container'
import Dictionary from './dictionary'
import ListenerGroup from './listener-group'
import Status, { StatusOptions } from './status'
import { MsPackage } from './ms-package'
import { MakeModelOptions, EventCallback, RuleArray } from './types'
import { Containers, ContainerOptions, PackageOptions, ModelOptions } from './index'
import { Vue2Plugin, Vue3Plugin } from './vue'
import { loaderSimplify } from './loader'

type Params<C extends Containers> = {
    name?: string
    containers?: {
        [key in keyof C]: ContainerOptions<C[key]> | [ContainerOptions<C[key]>, any]
    },
    packages?: Array<PackageOptions>
}

type Channels = {
    makedModel: [Model]
    makedList: [List<Model>]
    makedDictionary: [Dictionary<Model>]
    registeredStatus: [Status<any, any>]
}

class Main<T extends Containers = Containers> extends Base {
    readonly _name: string
    readonly _core: Core
    readonly _event: Event = new Event('Main')
    readonly _statuses: Status<any, any>[] = []
    readonly _globalContainer: Container
    constructor(params: Params<T> = {}) {
        super('Main')
        this._name = params.name || 'No Name'
        this._core = new Core(this)
        this._globalContainer = this._core.addContainer('*', { models: {} })
        this.addPackage(MsPackage)
        if (params.packages) {
            for (let myPackage of params.packages) {
                this.addPackage(myPackage)
            }
        }
        if (params.containers) {
            for (let key in params.containers) {
                let container = params.containers[key]
                if (Array.isArray(container)) {
                    this.addContainer(key, container[0], container[1])
                } else {
                    this.addContainer(key, container as ContainerOptions)
                }
            }
        }
    }

    static get Vue2Plugin() {
        return Vue2Plugin
    }

    static get Vue3Plugin() {
        return Vue3Plugin
    }

    static get utils() {
        return Utils
    }

    static get Model() {
        return Model
    }

    static get List() {
        return List
    }

    static get Dictionary() {
        return Dictionary
    }

    static get MsPackage() {
        return MsPackage
    }

    static get ListenerGroup() {
        return ListenerGroup
    }

    get loaderSimplify() {
        return loaderSimplify
    }

    get utils() {
        return Utils
    }

    get name() {
        return this._name
    }

    get locale() {
        return this._core.locale
    }

    on<T extends keyof Channels>(channelName: T, callback: EventCallback<Channels[T]>) {
        return this._event.on(channelName, callback)
    }

    once<T extends keyof Channels>(channelName: T, callback: EventCallback<Channels[T]>) {
        return this._event.once(channelName, callback)
    }

    off<T extends keyof Channels>(channelName: T, id: string) {
        return this._event.off(channelName, id)
    }

    meg(name: string, value?: any) {
        return this._core.message.get(name, value)
    }

    make<
        K extends keyof T,
        N extends keyof T[K]['models']
    >(containerName: K, modelName: N, options?: MakeModelOptions): T[K]['models'][N]['model'] {
        let model = this._core.make(containerName + '/' + modelName, options) as T[K]['models'][N]['model']
        this._event.emit(this, 'makedModel', [model])
        return model
    }

    makeList<
        K extends keyof T,
        N extends keyof T[K]['models']
    >(containerName: K, modelName: N, options?: MakeModelOptions): T[K]['models'][N]['list'] {
        let list = this._core.makeList(containerName + '/' + modelName, options) as T[K]['models'][N]['list']
        this._event.emit(this, 'makedList', [list])
        return list
    }

    makeDictionary<
        K extends keyof T,
        N extends keyof T[K]['models']
    >(containerName: K, modelName: N, options?: MakeModelOptions): T[K]['models'][N]['dictionary'] {
        let dictionary = this._core.makeDictionary(containerName + '/' + modelName, options) as T[K]['models'][N]['dictionary']
        this._event.emit(this, 'makedDictionary', [dictionary])
        return dictionary
    }

    addModel(name: string, data: ModelOptions<any>) {
        this._globalContainer.addModel(name, data)
    }

    addPackage(data: PackageOptions) {
        return this._core.addPackage(data)
    }

    addContainer(name: string, data: ContainerOptions<any>, options?: any) {
        let container = this._core.addContainer(name, data)
        if (container.options.install) {
            let config = container.options.config
            return container.options.install(this, config, options)
        } else {
            return null
        }
    }

    rules(data: RuleArray): Array<(...params: any) => boolean | string> {
        return this._core.getRules(data)
    }

    setLocale(locale: string) {
        return this._core.setLocale(locale)
    }

    instanceof<
        K extends keyof T,
        N extends keyof T[K]['models']
    >(container: K, model: N, source: any) {
        return this._core.instanceof(container + '/' + model, source)
    }

    registerStatus<T extends StatusOptions<any>>(name: string, options: T) {
        let already = this._statuses.find(s => s._name === name)
        if (already) {
            throw this.$devError('registerStatus', `Status Name ${name} already exist.`)
        }
        let status = new Status<T>(name, options)
        this._statuses.push(status)
        this._event.emit(this, 'registeredStatus', [status])
        return status
    }
}

Main.onDevError = Base.onDevError

export default Main
