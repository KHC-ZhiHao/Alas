import Utils, { privateProperty } from './utils'
import Container from './container'
import ModelUnit from './model-unit'
import { EventCallback, MakeModelOptions } from './types'

class Model {
    _model: ModelUnit
    _container!: Container
    $self: { [key: string]: any } = {}
    constructor(model: ModelUnit) {
        this._model = model
        privateProperty(this, '_container', model.base.container)
    }

    get $v() {
        return this._model.views as {}
    }

    get $o() {
        return this._model.loaders._items as {}
    }

    get $m() {
        return this._model.methods as {}
    }

    get $loader() {
        return this._model.loaders
    }

    get $config() {
        return this._container.getConfig()
    }

    get $utils() {
        return Utils
    }

    get $ready() {
        return this._model.status.ready
    }

    get $error() {
        return this._model.getErrorMessage()
    }

    get $parent() {
        return this._model.parent
    }

    $on(channelName: string, callback: EventCallback) {
        return this._model.event.on(channelName, callback)
    }

    $once(channelName: string, callback: EventCallback) {
        return this._model.event.once(channelName, callback)
    }

    $off(channelName: string, id: string) {
        return this._model.event.off(channelName, id)
    }

    $emit(channelName: string, ...params: any) {
        return this._model.event.emit(this, channelName, params)
    }

    $raw() {
        return this._model.getRawdata()
    }

    $meg(name: string, value?: { [key: string]: string }): string {
        return this._container.getMessage(name, value)
    }

    $init(data?: any) {
        this._model.init(data)
        return this
    }

    $copy(options?: MakeModelOptions) {
        return this._model.copy(options).unit as this
    }

    $body() {
        return this._model.getBody()
    }

    $keys() {
        return this._model.getKeys()
    }

    $reset(key?: keyof Omit<this, keyof Model>) {
        return this._model.reset(key as string)
    }

    $rules(name: keyof Omit<this, keyof Model>) {
        return this._model.getRules(name as string)
    }

    $commit() {
        return this._model.commit()
    }

    $profile() {
        return this._model.profile()
    }

    $export() {
        return this._model.export()
    }

    $reload(data: any) {
        return this._model.reload(data)
    }

    $generate(options?: MakeModelOptions): this {
        return this._container.core.main.make(this._container.name , this._model.base.name, options) as this
    }

    $isChange(key?: keyof Omit<this, keyof Model>): boolean {
        return this._model.isChange(key as string)
    }

    $validate() {
        return this._model.validateAll()
    }

    $validateBy(key: keyof Omit<this, keyof Model>) {
        if (Object.prototype.hasOwnProperty.call(this._model.body, key) === false) {
            throw this._model.$devError('$validateBy', `Property name(${key}) not in the body.`)
        }
        let self: any = this
        return this._model.validate(self[key], key as string)
    }

    $setError(data?: any) {
        return this._model.setError(data)
    }
}

export default Model
