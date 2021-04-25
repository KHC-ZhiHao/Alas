import Main from './main'
import _List from './list'
import _Model from './model'
import _Loader from './loader'
import _Dictionary from './dictionary'
import * as Interfaces from './interfaces'

type Basic = {
    [key: string]: any
}

type ContainerModel = {
    model: Basic
    list?: Basic
    dictionary?: Basic
}

export type Model = _Model

export type List = _List<_Model>

export type Dictionary = _Dictionary<_Model>

export type PackageOptions = Interfaces.IPackage

export type ContainerStructure<T extends Interfaces.IContainer = Interfaces.IContainer> = T

export type ContainerOptions<T extends ContainerStructure = ContainerStructure> = Interfaces.IContainerOptions<T>

export type Loader<T, P = any> = _Loader<T, P>

export type LoaderDone<T> = (result?: T) => void

export type ModelStructure<T extends ContainerModel> = {
    model: _Model & T['model']
    list: _List<_Model & T['model']> & T['list']
    dictionary: _Dictionary<_Model & T['model']> & T['dictionary']
}

export type ModelOptions<T extends ModelStructure<any>> = Interfaces.IModelOptions<
    T['model'],
    T['list'],
    T['dictionary']
>

export type Containers = {
    [key: string]: ContainerStructure
}

export type ContainerTypes<G extends Containers> = {
    [C in keyof G]: {
        [M in keyof G[C]['models']]: {
            [T in keyof G[C]['models'][M]]: G[C]['models'][M][T]
        }
    }
}

module.exports = Main

export const Alas = Main

export default Main
