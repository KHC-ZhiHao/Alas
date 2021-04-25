import * as User from './user'
import * as Attributes from './attributes'
import { ContainerStructure, ContainerOptions } from '../../../core'

export type Structure = ContainerStructure<{
    models: {
        user: User.Structure
        attributes: Attributes.Structure
    }
}>

export const Container: ContainerOptions<Structure> = {
    models: {
        user: User.options,
        attributes: Attributes.options
    },
    config: {
        test: 'test'
    },
    install(self, config, options: any = {}) {
        config.installed = !!options.installed
        return self.utils.generateId()
    },
    rules: {
        number(self, value) {
            return self.$utils.getType(value) === 'number' ? true : 'error'
        }
    },
    locales: {
        'en-us': {
            'hello': 'Hello {name}.'
        },
        'zh-tw': {
            'hello': '你好 {name}。'
        }
    }
}
