import Utils from './utils'
import List from './list'
import Main from './main'
import Model from './model'
import Status from './status'
import Loader from './loader'
import Dictionary from './dictionary'
import { EventCallback } from './types'

type GetEvent<T> =
    T extends Model ? T['$on'] : (
        T extends List<any> ? T['on'] : (
            T extends Dictionary<any> ? T['on'] : (
                T extends Main ? T['on'] : (
                    T extends Status<any> ? T['on'] : (
                        T extends Loader<any> ? T['on'] : () => void
                    )
                )
            )
        )
    )

class ListenerGroup {
    private listeners: Array<{
        id: string
        target: any
        channel: any
    }> = []

    add<
        T extends Model | List<any> | Dictionary<any> | Main | Status<any> | Loader<any>,
        S extends Parameters<GetEvent<T>>[0]
    >(target: T, channel: S, callback: EventCallback) {
        let id = null
        if (Utils.isModel(target)) {
            // @ts-ignore
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
