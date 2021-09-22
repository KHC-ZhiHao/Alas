import { BodyRules } from './interfaces';
export declare type Views = {
    [key: string]: any;
};
export declare type MakeModelOptions = {
    save?: boolean;
};
export declare type InterfaceSuppotrs = 'body' | 'views' | 'methods' | 'loaders';
export declare type ContainerInterface = {
    [key in InterfaceSuppotrs]?: Array<string>;
};
export declare type Modes = 'status' | 'model' | 'list' | 'dictionary' | 'any';
export declare type ListWriteOptions = {
    insert?: number;
};
export declare type RuleCallback = (...params: any) => true | string;
export declare type RuleArray = Array<BodyRules | RuleCallback>;
export interface Rule {
    required: boolean;
    handler: RuleCallback;
}
export declare type EventCallback<T extends any[] = any> = (target: any, context: EventContext, ...params: T) => void;
export declare type EventContext = {
    id: string;
};
