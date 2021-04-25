import Base from './base';
import * as Types from './types';
declare class Rule extends Base {
    items: {
        [key: string]: Types.Rule;
    };
    constructor();
    add(name: string, rule: Types.Rule | Types.RuleCallback): void;
    addMultiple(rules: {
        [key: string]: any;
    }, prefix?: string): void;
    get(target: any, raw: string): Types.RuleCallback;
    getMore(target: any, array: Types.RuleArray): Types.RuleCallback[];
    validate(target: any, value: any, array: Types.RuleArray): string | true;
}
export default Rule;
