import { OdatafyQueryOptions } from '../types/errors';
import { getOdatafyParserError } from '../utils';
import { isPositiveInteger } from './helpers';

export default {
    /**
     * Parser for top expression
     * @param expr top expression as string
     * @example topParser.parse("5");
     * @returns integer for top
     */
    parse: function(expr: string):number {
        if(isPositiveInteger(expr)) {
            return parseInt(expr as string);
        }

        throw getOdatafyParserError("top must be a valid integer value", OdatafyQueryOptions.Top)
    }
}