import Base from './base'
import Event from './event'
import { Modes, EventCallback } from './types'

type LoaderHandler = (...params: any) => void

type Channels = {
    setMessage: [string]
    success: [any]
    error: [any]
    start: []
}

class LoaderCore extends Base {
    name: string
    type: Modes
    done = false
    error: any = null
    event: Event = new Event('Loader')
    loader: Loader<any, any>
    target: any
    called = false
    result: any = null
    message = ''
    loading = false
    handler: LoaderHandler
    starting: any = null
    constructor(loader: Loader<any, any>, type: Modes, target: any, name: string, handler: LoaderHandler) {
        super('Loader')
        this.name = name
        this.type = type
        this.loader = loader
        this.target = target
        this.handler = handler
        this.starting = null
    }

    setMessage(message: string) {
        if (typeof message !== 'string') {
            throw this.$devError('setMessage', 'Message must be a string.')
        }
        this.message = message
        this.event.emit(this.loader, 'setMessage', [message])
    }

    resetAll() {
        this.reset()
        this.called = false
    }

    close(error = null) {
        this.done = true
        this.loading = false
        if (error) {
            this.error = error
        }
        this.event.emit(this.loader, '$done')
    }

    reset() {
        this.done = false
        this.error = null
        this.loading = false
        this.starting = null
        this.event.emit(this.loader, '$reset')
    }

    start(options: any): Promise<any> {
        this.reset()
        this.called = true
        this.loading = true
        this.starting = new Promise((resolve, reject) => {
            let success = (result?: any) => {
                this.close()
                this.result = result
                this.event.emit(this.loader, 'success', [result])
                resolve(result)
            }
            let error = (err: any = 'Unknown error.') => {
                this.close(err)
                this.event.emit(this.loader, 'error', [err])
                reject(err)
            }
            this.handler(this.target, success, error, options)
            this.event.emit(this.loader, 'start')
        })
        return this.starting
    }
}

class Loader<T, P = any> {
    _core: LoaderCore
    _result!: T
    _params!: P
    constructor(type: Modes, target: any, name: string, handler: LoaderHandler) {
        this._core = new LoaderCore(this, type, target, name, handler)
    }

    get called() {
        return this._core.called
    }

    get done() {
        return this._core.done
    }

    get error() {
        return this._core.error
    }

    get loading() {
        return this._core.loading
    }

    get message() {
        return this._core.message
    }

    get result() {
        return this._core.result as T | null
    }

    setMessage(message: string) {
        return this._core.setMessage(message)
    }

    on<T extends keyof Channels>(channelName: T, callback: EventCallback<Channels[T]>) {
        return this._core.event.on(channelName, callback)
    }

    once<T extends keyof Channels>(channelName: T, callback: EventCallback<Channels[T]>) {
        return this._core.event.once(channelName, callback)
    }

    off(channelName: string, id: string) {
        return this._core.event.off(channelName, id)
    }

    start(params: P): Promise<T> {
        return this._core.start(params)
    }

    seek(params: P): Promise<T> {
        return new Promise((resolve, reject) => {
            if (this.done) {
                if (this.error) {
                    reject(this.error)
                } else {
                    resolve(this._core.result)
                }
            } else {
                if (this.called) {
                    this._core.starting.then(resolve).catch(reject)
                } else {
                    this.start(params).then(resolve).catch(reject)
                }
            }
        })
    }

    reset() {
        return this._core.resetAll()
    }
}

export class LoaderCase<T> {
    _items: { [key: string]: Loader<T, any> } = {}

    get error() {
        for (let key in this._items) {
            if (this._items[key].error) {
                return {
                    key,
                    value: this._items[key].error
                }
            }
        }
        return null
    }

    get loading() {
        for (let key in this._items) {
            if (this._items[key].loading) {
                return {
                    key,
                    value: this._items[key].loading
                }
            }
        }
        return null
    }

    _copyStatus(loaders: LoaderCase<any>) {
        for (let key in this._items) {
            let source = this._items[key]._core
            let target = loaders._items[key]._core
            target.done = source.done
            target.error = source.error
            target.called = source.called
            target.result = source.result
        }
    }

    reset() {
        for (let key in this._items) {
            this._items[key].reset()
        }
    }
}

type LoaderSimplifyCallback<T, D, R> = (self: T, data: D) => Promise<R>

export type LoaderSimplifyResponse<T, S, R> = (self: T, done: (result: R) => void, fail: (error: any) => void, params: S) => Promise<any>

export const loaderSimplify = <T, D, R>(callback: LoaderSimplifyCallback<T, D, R>) => {
    let response = async(self: T, done: any, fail: any, params: D) => {
        try {
            let result = await callback(self, params)
            done(result)
        } catch (error) {
            fail(error)
        }
    }
    return response as LoaderSimplifyResponse<T, D, R>
}

export type LoaderMethod<T, K, R, P> = K extends LoaderSimplifyResponse<any, any, any> ? LoaderSimplifyResponse<T, P, R> : (
    target: T,
    done: (result: R) => void,
    fail: (error: any) => void,
    params: P
) => any

export function create(target: any, type: Modes, options: { [key: string]: LoaderHandler } = {}): LoaderCase<any> {
    let loaders = new LoaderCase()
    for (let key in options) {
        loaders._items[key] = new Loader(type, target, key, options[key])
    }
    return loaders
}

/**
 * 這是給外部比較彈性的 loader，例如不需要 model 的加載
 */

export function generateSimplifyLoader<
    D,
    R,
    T extends LoaderSimplifyCallback<Record<string, unknown>, D, R>
>(handler: T) {
    return new Loader('any', {}, handler.name, loaderSimplify(handler)) as Loader<R, D> & Loader<R, D>['start']
}

export default Loader
