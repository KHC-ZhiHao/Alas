import Base from './base'
import Event from './event'
import Utils, { privateProperty } from './utils'
import ModelBase from './model-base'
import { LoaderCase } from './loader'
import * as Types from './types'

export interface IGroup {
    getType: () => string
    forEach: (...args: any) => any
    isChange: () => boolean
    getBodys: () => any
    getExports: () => any
    validateAll: () => {
        success: boolean
        result: any
    }
}

export class GroupUnit extends Base {
    base!: ModelBase
    event: Event
    views!: Types.Views
    parent: any
    methods: { [key: string]: (...parmas: any) => any } = {}
    loaders!: LoaderCase<any>
    customOptions: any
    status = {
        dirty: false
    }
    constructor(modelName: string, base: ModelBase, options: Types.MakeModelOptions) {
        super(modelName)
        privateProperty(this, 'base', base)
        this.event = new Event('group')
        this.parent = null
        this.customOptions = options
    }

    setDirty(status = true) {
        this.status.dirty = !!status
    }

    generateModel(source: any, raw = false) {
        return Utils.isModel(source) ? source : this.base.create(this.customOptions).init(source, raw).unit
    }
}

export class Group {
    _unit: GroupUnit
    constructor(unit: GroupUnit) {
        this._unit = unit
    }

    get dirty() {
        return this._unit.status.dirty
    }

    get v() {
        return this._unit.views as Record<string, unknown>
    }

    get m() {
        return this._unit.methods as Record<string, unknown>
    }

    get o() {
        return this._unit.loaders._items as Record<string, unknown>
    }

    get loader() {
        return this._unit.loaders
    }

    get config() {
        return this._unit.base.container.getConfig()
    }

    get utils() {
        return Utils
    }

    get parent() {
        return this._unit.parent
    }

    setDirty(status?: boolean) {
        return this._unit.setDirty(status)
    }

    on(channelName: string, handler: Types.EventCallback) {
        return this._unit.event.on(channelName, handler)
    }

    once(channelName: string, handler: Types.EventCallback) {
        return this._unit.event.once(channelName, handler)
    }

    off(channelName: string, id: string) {
        return this._unit.event.off(channelName, id)
    }

    emit(channelName: string, ...params: any) {
        return this._unit.event.emit(this, channelName, params)
    }
}
