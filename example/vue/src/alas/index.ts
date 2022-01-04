import { Agri } from './agri'
import { Alas, ContainerTypes } from 'alas'

type Containers = {
    Agri: Agri
}

export type AlasTypes = ContainerTypes<Containers>

export const alas = new Alas<Containers>({
    containers: {
        Agri
    }
})

export default alas
