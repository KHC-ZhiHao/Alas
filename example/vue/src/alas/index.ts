import Alas, { ContainerTypes } from 'alas'
import { Agri } from './agri'

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
