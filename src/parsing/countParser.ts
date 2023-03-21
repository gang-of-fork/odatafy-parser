import { OdatafyQueryOptions } from '../types/errors';
import { getOdatafyParserError } from '../utils';

export default {
    /**
     * Parser for count expressions
     * @param expr count boolean expression as string
     * @example countParser.parse("true");
     * @returns boolean for count
     */
    parse: function (expr: string): boolean {
        if (expr == 'true' || expr == 'TRUE') {
            return true;
        } else {
            throw getOdatafyParserError(
                'count must be "true"',
                OdatafyQueryOptions.Count
            );
        }
    }
};
