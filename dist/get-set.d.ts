type Params = {
    get: (...params: any) => any;
    set: (...params: any) => any;
};
export default function (target: any, params: Params, useProxy?: boolean): any;
export {};
