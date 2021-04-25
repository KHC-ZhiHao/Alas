import Base from './base'
import Event from './event'
import Utils from './utils'
import GetSet from './get-set'
import { LoaderDone } from './index'
import { EventCallback } from './types'
import * as Loader from './loader'

type StatusLoader = (
    self: Status<any, any>,
    done: LoaderDone<any>,
    fail: (error: any) => void,
    params: any
) => any

export type StatusOptions = {
    states: {
        [key: string]: () => { [key: string]: any } | Array<any>
    },
    loaders?: {
        [key: string]: StatusLoader
    }
}

type Channels = {
    fetch: [{
        name: string
        result: any
    }]
    reset: [{
        name: string
    }]
}

class Status <
    O extends StatusOptions,
    T extends O['loaders'] extends undefined ? { [key: string]: any } : O['loaders'] = O['loaders'] extends undefined ? { [key: string]: any } : O['loaders']
> extends Base {
    readonly _id = Utils.generateId()
    readonly _name: string
    readonly _states: any = {}
    readonly _loaders: any
    private _options: O
    private _event = new Event('status')

    constructor(name: string, options: O) {
        super('Status')
        this._name = name
        this._options = options
        this._loaders = Loader.create(this, 'status', options.loaders || {})
        for (let key in options.states) {
            let item = options.states[key]()
            if (item == null || typeof item !== 'object') {
                throw this.$devError('init', `Alas Status ${key} state must be a object.`)
            }
            this._states[key] = item
        }
    }

    get loaders() {
        return this._loaders._items as {
            [key in keyof T]: Loader.default<
                Parameters<Parameters<T[key]>[1] extends LoaderDone<any> ? Parameters<T[key]>[1] : any>[0],
                Parameters<T[key]>[3] extends undefined ? void : Parameters<T[key]>[3]
            >
        }
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

    set<N extends keyof O['states']>(name: N, value: ReturnType<O['states'][N]>) {
        let item = this._options.states[name.toString()]
        if (item == null) {
            throw new Error('State not found')
        }
        this._event.emit(this, 'set', [{ name, value }])
        this._states[name] = value
    }

    fetch<N extends keyof O['states']>(name: N): ReturnType<O['states'][N]> {
        if (this._states[name] == null) {
            throw this.$devError('fetch', `State ${name} not found`)
        }
        let result = GetSet(this._states[name], {
            get: (target, key) => {
                let output = this._states[name][key]
                return typeof output === 'function' ? output.bind(target) : output
            },
            set: (target, key, value) => {
                this._states[name][key] = value
                return true
            }
        })
        this._event.emit(this, 'fetch', [
            {
                name,
                result
            }
        ])
        return result
    }

    reset<N extends keyof O['states']>(name: N) {
        let item = this._options.states[name.toString()]
        if (item == null) {
            throw this.$devError('reset', `State ${name} not found`)
        }
        this._states[name] = item()
        this._event.emit(this, 'reset', [{ name }])
    }

    resetAll() {
        let keys = Object.keys(this._options.states)
        for (let key of keys) {
            this.reset(key)
        }
    }
}

export default Status
