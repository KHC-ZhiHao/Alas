import { Trans } from './trans'
import { TransSearch } from './trans-search'
import { ContainerStructure, ContainerOptions } from 'alas'

export type Agri = ContainerStructure<{
    models: {
        Trans: Trans
        TransSearch: TransSearch
    }
}>

export const Agri: ContainerOptions<Agri> = {
    models: {
        Trans,
        TransSearch
    }
}
