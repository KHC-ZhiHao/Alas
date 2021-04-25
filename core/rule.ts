import Base from './base'
import Utils from './utils'
import * as Types from './types'

class Rule extends Base {
    items: { [key: string]: Types.Rule } = {}
    constructor() {
        super('Rule')
    }

    add(name: string, rule: Types.Rule | Types.RuleCallback) {
        if (this.items['$' + name]) {
            this.$devError('add', `The name(${name}) already exists.`)
        }
        let target = typeof rule !== 'function' ? rule : {
            required: true,
            handler: rule
        }
        this.items['$' + name] = Utils.verify(target, {
            handler: [true, ['function']],
            required: [false, ['boolean'], true]
        })
    }

    addMultiple(rules: { [key: string]: any }, prefix: string = '') {
        for (let name in rules) {
            this.add(prefix + name, rules[name])
        }
    }

    get(target: any, raw: string): Types.RuleCallback {
        let args = raw.split('|')
        let main = args.shift()
        let name = main ? main.trim() : ''
        let rule: any = this.items['$' + name]
        let params: any = {}
        if (rule == null) {
            this.$devError('get', `Form rule list name(${name}) not found.`)
        }
        for (let value of args) {
            let data: any = value.split(':').map(s => s.trim())
            params[data[0]] = data[1] === undefined ? true : data[1]
        }
        return function(value: any) {
            if (rule.required && value == null) {
                return true
            }
            return rule.handler(target, value, params)
        }
    }

    getMore(target: any, array: Types.RuleArray): Types.RuleCallback[] {
        let output: Types.RuleCallback[] = []
        for (let data of array) {
            if (typeof data === 'function') {
                output.push(data.bind(target) as Types.RuleCallback)
            } else {
                output.push(this.get(target, data as string))
            }
        }
        return output
    }

    validate(target: any, value: any, array: Types.RuleArray): string | true {
        let rules = this.getMore(target, array)
        for (let rule of rules) {
            let result = rule(value)
            if (result !== true) {
                return result
            }
        }
        return true
    }
}

export default Rule
