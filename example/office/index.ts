import * as Table from './table'
import { ContainerStructure, ContainerOptions } from '../../core'

export type Structure = ContainerStructure<{
    models: {
        table: Table.Structure
    }
}>

export const Options: ContainerOptions<Structure> = {
    models: {
        table: Table.Options
    }
}
