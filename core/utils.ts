import List from './list'
import Model from './model'
import Dictionary from './dictionary'

interface KeyMap {
    [key: string]: any
}

class Utils {

    static isModel(target: any) {
        return target instanceof Model
    }

    static isList(target: any) {
        return target instanceof List
    }

    static isDictionary(target: any) {
        return target instanceof Dictionary
    }

    static jpjs(target: any) {
        return JSON.parse(JSON.stringify(target))
    }

    static getType(target: any) {
        let type = typeof target
        if (target == null) {
            return 'empty'
        }
        if (Array.isArray(target)) {
            return 'array'
        }
        if (type === 'number' && isNaN(target)) {
            return 'NaN'
        }
        if (target instanceof RegExp) {
            return 'regexp'
        }
        if (target instanceof Promise) {
            return 'promise'
        }
        if (typeof Buffer !== 'undefined' && Buffer.isBuffer(target)) {
            return 'buffer'
        }
        if (target instanceof Error) {
            return 'error'
        }
        return type
    }

    static verify(data: any = {}, validates: any = {}): any {
        let newData: any = {}
        let keys = [...new Set(Object.keys(validates).concat(Object.keys(data)))]
        for (let key of keys) {
            let target = data[key]
            let validate = validates[key]
            if (validate == null) {
                newData[key] = target
                continue
            }
            let type = Utils.getType(target)
            let [required, types, defaultValue] = validate
            if (typeof required !== 'boolean') {
                throw new Error('Utils::verify => Required must be a boolean')
            }
            if (Array.isArray(types) !== true) {
                throw new Error('Utils::verify => Types must be a array')
            }
            if (required && target == null) {
                throw new Error(`Utils::verify => Key(${key}) is required`)
            }
            if (types && target != null && !types.includes(type)) {
                throw new Error(`Utils::verify => Type(${key}::${type}) error, must be a ${types.join(' or ')}`)
            }
            newData[key] = target === undefined ? defaultValue : target
        }
        return newData
    }

    static generateId() {
        let now = Date.now()
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = (now + Math.random() * 16) % 16 | 0
            now = Math.floor(now / 16)
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
        })
    }

    static peel(target: any, path: string, def?: any) {
        let reduce = (obj: any, key: any) => obj && obj[key] !== 'undefined' ? obj[key] : undefined
        let output = path.split(/[.[\]'"]/g).filter(s => s !== '').reduce(reduce, target)
        if (def) {
            return output == null ? def : output
        }
        return output
    }

    static mapping<
        M extends KeyMap,
        T extends Record<string, any>,
        R extends boolean
    >(keyMap: M, target: T, reverse?: R) {
        let output: any = {}
        for (let [key, value] of Object.entries(keyMap)) {
            let name = reverse ? value : key
            let data = reverse ? target[key] : target[value]
            if (Utils.isList(data)) {
                output[name] = data.exports()
            } else if (Utils.isModel(data)) {
                output[name] = data.$export()
            } else {
                output[name] = data
            }
        }
        return output as (typeof reverse) extends true ? Record<string, any> : {
            [key in keyof M]: any
        }
    }

    static valueTo<T extends { [key: string]: any }, K>(target: T, trans: (key: string) => K) {
        let output: any = {}
        for (let key in target) {
            output[key] = trans(key)
        }
        return output as { [key in keyof T]: ReturnType<typeof trans> }
    }
}

export const privateProperty = (target: any, key: string, value: any) => {
    return Object.defineProperty(target, key, {
        value,
        writable: true,
        configurable: true,
        enumerable: false
    })
}

export default Utils
