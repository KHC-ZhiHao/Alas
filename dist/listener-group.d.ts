import List from './list';
import Main from './main';
import Model from './model';
import Status from './status';
import Loader from './loader';
import Dictionary from './dictionary';
import { EventCallback } from './types';
declare type GetEvent<T> = T extends Model ? T['$on'] : (T extends List<any> ? T['on'] : (T extends Dictionary<any> ? T['on'] : (T extends Main ? T['on'] : (T extends Status<any> ? T['on'] : (T extends Loader<any> ? T['on'] : () => void)))));
declare class ListenerGroup {
    private listeners;
    add<T extends Model | List<any> | Dictionary<any> | Main | Status<any> | Loader<any>, S extends Parameters<GetEvent<T>>[0]>(target: T, channel: S, callback: EventCallback): any;
    close(): void;
}
export default ListenerGroup;
