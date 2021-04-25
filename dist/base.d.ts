declare type DevErrorContext = {
    name: string;
    target: any;
    message: string;
    functionName: string;
};
declare class Base {
    _base: {
        name: string;
    };
    constructor(name: string);
    static onDevError(callback: (context: DevErrorContext) => void): void;
    $devError(functionName: string, message: string): void;
}
export default Base;
