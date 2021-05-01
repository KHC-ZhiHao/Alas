import Alas, { ContainerTypes } from '../../core'
import * as User from './user'
import * as Office from './office'

type Containers = {
    user: User.Structure
    office: Office.Structure
}

export type AlasTypes = ContainerTypes<Containers>

export const alas: Alas<Containers> = new Alas({
    containers: {
        user: User.Options,
        office: [Office.Options, {}]
    }
})
