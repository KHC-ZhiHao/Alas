import Utils from './utils'
import List from './list'
import Main from './main'
import Model from './model'
import Status from './status'
import Loader from './loader'
import Dictionary from './list'
import { EventCallback } from './types'

class ListenerGroup {
    private listeners: Array<{
        id: string
        target: any
        channel: any
    }> = []

    on<
        T extends Model | List<any> | Dictionary<any> | Main | Status<any> | Loader<any>
    >(target: T, channel: string, callback: EventCallback) {
        let id = null
        if (target instanceof Model) {
            id = target.$on(channel, callback)
        } else {
            // @ts-ignore
            id = target.on(channel, callback)
        }
        this.listeners.push({
            id,
            target,
            channel
        })
        return id
    }
    close() {
        for (let listener of this.listeners) {
            if (Utils.isModel(listener.target)) {
                listener.target.$off(listener.channel, listener.id)
            } else {
                listener.target.off(listener.channel, listener.id)
            }
        }
    }
}

export default ListenerGroup
