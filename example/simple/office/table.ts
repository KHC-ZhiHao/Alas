import { ModelStructure, ModelOptions } from '../../../core'

export type Structure = ModelStructure<{
    model: {
        name: string
    }
}>

export const Options: ModelOptions<Structure> = {
    body: {
        name: ['#ms.required', '#ms.length|max:5|min:1']
    }
}
