import { ModelStructure, ModelOptions } from '../../../core'

export type Structure = ModelStructure<{
    model: {
        name: string
        $v: {
            name: string
        }
        $m: {
            setName: (newName: string) => void
        }
    }
}>

export const Options: ModelOptions<Structure> = {
    body: {
        name: ['#ms.required', '#ms.length|max:5|min:1']
    },
    views: {
        name(self) {
            return self.name
        }
    },
    methods: {
        setName(self, newName) {
            self.name = newName
        }
    }
}
