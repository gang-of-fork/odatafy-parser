import { isPositiveInteger } from './helpers';

export default {
    /**
     * Parser for skip expressions
     * @param expr skip expression as string
     * @example skipParser.parse("5");
     * @returns integer number for skip
     */
    parse: function(expr: string) {
        if(isPositiveInteger(expr)) {
            return parseInt(expr as string);
        }

        throw new Error("skip must be a valid integer value");
    }
}