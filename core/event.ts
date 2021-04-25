import Base from './base'
import Utils from './utils'
import * as Types from './types'

class Event extends Base {
    type: string
    channels: { [key: string]: Channel } = {}
    constructor(type: string) {
        super('Event')
        this.type = type
    }

    addChannel(name: string) {
        this.channels[name] = new Channel()
    }

    getChannel(name: string) {
        return this.channels[name]
    }

    getOrCreate(name: string) {
        if (this.channels[name] == null) {
            this.addChannel(name)
        }
        return this.channels[name]
    }

    on(name: string, callback: Types.EventCallback) {
        return this.getOrCreate(name).addListener(callback)
    }

    once(channelName: string, callback: Types.EventCallback) {
        let self = this
        return this.on(channelName, (target, context, ...args) => {
            callback(target, context, ...args)
            self.off(channelName, context.id)
        })
    }

    off(channelName: string, target: Listener | string) {
        let event = typeof target === 'string' ? target : target.id
        this.getOrCreate(channelName).removeListener(event)
    }

    emit(target: any, channelName: string, params: Array<any> = []) {
        this.trigger(channelName, target, params)
    }

    async trigger(channelName: string, target: any, params: Array<any>) {
        let channel = this.getChannel(channelName)
        if (channel) {
            channel.broadcast(target, params)
        }
    }
}

class Channel extends Base {
    listeners: { [key: string]: Listener } = {}
    constructor() {
        super('Channel')
    }

    checkListener(id: string) {
        if (this.listeners[id] == null) {
            this.$devError('checkListener', `Listener id(${id}) not found.`)
        }
    }

    addListener(callback: (event: any, ...params: any) => void) {
        if (typeof callback !== 'function') {
            this.$devError('addListener', 'Callback must be a function')
        }
        let id = Utils.generateId()
        this.listeners[id] = new Listener(this, id, callback)
        return id
    }

    removeListener(id: string) {
        this.checkListener(id)
        delete this.listeners[id]
    }

    broadcast(target: any, params: Array<any>) {
        for (let listener of Object.values(this.listeners)) {
            listener.trigger(target, params)
        }
    }
}

class Listener extends Base {
    id: string
    channel: Channel
    callback: Types.EventCallback
    constructor(channel: Channel, id: string, callback: Types.EventCallback) {
        super('Listener')
        this.id = id
        this.channel = channel
        this.callback = callback
    }

    trigger(target: any, params: Array<any>) {
        let callbackContext: Types.EventContext = {
            id: this.id
        }
        if (params.length === 0) {
            this.callback(target, callbackContext)
        } else {
            this.callback(target, callbackContext, ...params)
        }
    }
}

export default Event
