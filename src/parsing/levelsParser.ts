import { isPositiveInteger } from './helpers';

export default {
    /**
     * Parser for levels expressions
     * @param expr levels expression as string
     * @example levelsParser.parse("5");
     * @returns integer number for levels or "max"
     */
    parse: function(expr: string): number | "max" {
        if(expr == "max") {
            return "max";
        }
        if(isPositiveInteger(expr)) {
            return parseInt(expr as string);
        }

        throw new Error("skip must be a valid integer value");
    }
}