import Base from './base'

export class Store extends Base {
    items: {[key: string]: string} = {}
    constructor() {
        super('MessageStore')
    }

    add(key: string, value: string): void {
        this.items[key] = value
    }

    get(key: string): string | null {
        return this.items[key] || null
    }
}

export class Message extends Base {
    store: { [key: string]: Store }
    locale!: string
    default: Store
    messages: Store = new Store()
    constructor() {
        super('Locale')
        this.store = {
            'en-us': new Store()
        }
        this.default = this.store['en-us']
        this.setLocale('en-us')
    }

    setLocale(locale: string) {
        if (typeof locale !== 'string') {
            return this.$devError('setLocale', `Locale(${locale}) not be string.`)
        }
        this.messages = this.getStore(locale)
        this.locale = locale
    }

    getStore(locale: string) {
        if (this.store[locale] == null) {
            this.store[locale] = new Store()
        }
        return this.store[locale]
    }

    add(data: { [key: string]: any }, prefix = '') {
        if (typeof data !== 'object') {
            throw this.$devError('set', 'Data not a object')
        }
        for (let key in data) {
            let store = this.getStore(key)
            for (let name in data[key]) {
                store.add(prefix + name, data[key][name])
            }
        }
    }

    get(key: string, value?: { [key: string]: string }): string {
        let message = this.messages.get(key) || this.default.get(key) || key
        if (value) {
            for (let key in value) {
                let reg = new RegExp(`{${key}}`, 'g')
                message = message.replace(reg, value[key])
            }
        }
        return message
    }
}

export default Message
