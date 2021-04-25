import { ModelOptions, ModelStructure } from '../../../core'

let map = {
    phone: 'Phone'
}

export type Structure = ModelStructure<{
    model: {
        phone: string
    }
}>

export const options: ModelOptions<Structure> = {
    body: {
        phone: []
    },
    init(self, source = {}) {
        return self.$utils.mapping(map, source)
    },
    export(self) {
        return self.$utils.mapping(map, self, true)
    }
}
