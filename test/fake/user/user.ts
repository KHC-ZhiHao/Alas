import { ModelOptions, ModelStructure, Loader } from '../../../core'
import { loaderSimplify } from '../../../core/loader'
import * as Attributes from './attributes'

const map = {
    id: 'id',
    name: 'Name',
    children: 'Children',
    attributes: 'Attributes'
}

export type Structure = ModelStructure<{
    model: {
        id: number
        name: string
        children: Structure['list']
        attributes: Attributes.Structure['model']
        $v: {
            name: string
        }
        $m: {
            getAge: () => number
            getName: (prefix: string) => string
        }
        $o: {
            getName: Loader<string, string>
            getError: Loader<string, string>
            getNameSimple: Loader<string, string>
        }
    }
    list: {
        v: {
            size: number
        }
        m: {
            getSize: (add: number) => number
        },
        o: {
            getSize: Loader<string, string>
            getError: Loader<string, string>
        }
    }
}>

export const options: ModelOptions<Structure> = {

    body: {
        id: ['number'],
        name: ['#ms.required']
    },

    defs: {
        id: () => Math.floor(Math.random() * 1000000)
    },

    refs: {
        children: '[user]',
        attributes: 'attributes'
    },

    init: (self, source) => {
        return self.$utils.mapping(map, source || {})
    },

    export: self => {
        let result = self.$utils.mapping(map, self, true)
        delete result.id
        return result
    },

    views: {
        name: self => 'my name is ' + self.name
    },

    watch: {
        name(self, value) {
            self.$emit('name-change', value)
        }
    },

    methods: {
        getAge() {
            return 18
        },
        getName(self, prefix) {
            return prefix + self.name
        }
    },

    loaders: {
        getName(self, resolve, reject, prefix) {
            setTimeout(() => resolve(prefix + self.name), 50)
        },
        getError(self, resolve, reject, prefix) {
            setTimeout(() => reject(prefix + self.name), 50)
        },
        getNameSimple: loaderSimplify(async(self, prefix) => {
            return prefix + self.name
        })
    },

    errorMessage(self, message) {
        return 'Error ' + message
    },

    list: {
        key: model => model.id.toString(),
        write(self, context) {
            if (context.key === '9487') {
                context.reject('error')
            } else {
                context.success()
            }
        },
        writeAfter(self, context) {
            context.model.$self.writeAfter = true
        },
        views: {
            size(self) {
                return self.size
            }
        },
        methods: {
            getSize(self, add) {
                return self.size + add
            }
        },
        loaders: {
            getSize(self, resolve, reject, prefix = '') {
                setTimeout(() => resolve(prefix + self.size), 50)
            },
            getError(self, resolve, reject, prefix = '') {
                setTimeout(() => reject(prefix + self.size), 50)
            }
        }
    }
}
