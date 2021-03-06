import Main from './main';
import _List from './list';
import _Model from './model';
import _Loader from './loader';
import _Dictionary from './dictionary';
import * as Interfaces from './interfaces';
declare type Basic = {
    [key: string]: any;
};
declare type ContainerModel = {
    model: Basic;
    list?: Basic;
    dictionary?: Basic;
};
export declare type Model = _Model;
export declare type List = _List<_Model>;
export declare type Dictionary = _Dictionary<_Model>;
export declare type PackageOptions = Interfaces.IPackage;
export declare type ContainerStructure<T extends Interfaces.IContainer = Interfaces.IContainer> = T;
export declare type ContainerOptions<T extends ContainerStructure = ContainerStructure> = Interfaces.IContainerOptions<T>;
export declare type Loader<T, P = any> = _Loader<T, P>;
export declare type LoaderDone<T> = (result?: T) => void;
export declare type ModelStructure<T extends ContainerModel> = {
    model: _Model & T['model'];
    list: _List<_Model & T['model']> & T['list'];
    dictionary: _Dictionary<_Model & T['model']> & T['dictionary'];
};
export declare type ModelOptions<T extends ModelStructure<any>> = Interfaces.IModelOptions<T['model'], T['list'], T['dictionary']>;
export declare type Containers = {
    [key: string]: ContainerStructure;
};
export declare type ContainerTypes<G extends Containers> = {
    [C in keyof G]: {
        [M in keyof G[C]['models']]: {
            [T in keyof G[C]['models'][M]]: G[C]['models'][M][T];
        };
    };
};
export declare const Alas: typeof Main;
export default Main;
