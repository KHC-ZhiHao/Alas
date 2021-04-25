
import List from './list'
import Model from './model'
import Dictionary from './dictionary'

type Params = {
    get: (...params: any) => any,
    set: (...params: any) => any
}

export default function(target: any, params: Params, useProxy = true) {
    if (useProxy && typeof Proxy !== 'undefined') {
        return new Proxy(target, {
            get: params.get,
            set: params.set
        })
    } else {
        let output: any = {}
        for (let key in target) {
            Object.defineProperty(output, key, {
                enumerable: true,
                get() {
                    return params.get(target, key)
                },
                set(value) {
                    params.set(target, key, value)
                    return true
                }
            })
        }
        if (target instanceof List || target instanceof Dictionary || target instanceof Model) {
            let keys: any[] = []
            // @ts-ignore
            if (target.__proto__.__proto__) {
                // @ts-ignore
                keys = Object.getOwnPropertyNames(target.__proto__.__proto__)
            }
            // @ts-ignore
            if (target.__proto__) {
                // @ts-ignore
                keys = keys.concat(Object.getOwnPropertyNames(target.__proto__))
            }
            for (let key of keys) {
                // @ts-ignore
                if (key !== 'constructor' && output[key] == null) {
                    try {
                        Object.defineProperty(output, key, {
                            enumerable: true,
                            get() {
                                return params.get(target, key)
                            },
                            set(value) {
                                params.set(target, key, value)
                                return true
                            }
                        })
                    } catch (error) {
                        console.log('If you look this message, means the browser is too old.')
                        console.log(error)
                    }
                }
            }
        }
        return output
    }
}
