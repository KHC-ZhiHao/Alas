import { IPackage } from '../../core/interfaces'

let myPackage: IPackage = {
    name: 'test',
    locales: {
        'en-us': {
            'hello': 'Hello {value}'
        }
    }
}

export default myPackage
