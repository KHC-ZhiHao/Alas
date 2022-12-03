import Base from './base';
export declare class Store extends Base {
    items: {
        [key: string]: string;
    };
    constructor();
    add(key: string, value: string): void;
    get(key: string): string | null;
}
export declare class Message extends Base {
    store: {
        [key: string]: Store;
    };
    locale: string;
    default: Store;
    messages: Store;
    constructor();
    setLocale(locale: string): void;
    getStore(locale: string): Store;
    add(data: {
        [key: string]: any;
    }, prefix?: string): void;
    get(key: string, value?: {
        [key: string]: string;
    }): string;
}
export default Message;
