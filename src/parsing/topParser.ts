import { isPositiveInteger } from './helpers';

export default {
    /**
     * Parser for top expression
     * @param expr top expression as string
     * @returns integer for top
     */
    parse: function(expr: string) {
        if(isPositiveInteger(expr)) {
            return parseInt(expr as string);
        }

        throw new Error("top must be a valid integer value");
    }
}