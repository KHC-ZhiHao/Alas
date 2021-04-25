import Main from './main';
export declare const Vue2Plugin: {
    install(Vue: any, { alas }: {
        alas: Main;
    }): void;
};
export declare const Vue3Plugin: {
    install(app: any, { alas, reactive }: {
        alas: Main;
        reactive: any;
    }): void;
};
