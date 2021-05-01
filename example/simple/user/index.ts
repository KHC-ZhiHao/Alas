import * as Profile from './profile'
import { ContainerStructure, ContainerOptions } from '../../../core'

export type Structure = ContainerStructure<{
    models: {
        profile: Profile.Structure
    }
}>

export const Options: ContainerOptions<Structure> = {
    models: {
        profile: Profile.Options
    }
}
