import {
  OdatafyError,
  OdatafyErrorNames,
  OdatafyModules,
  OdatafyQueryOptions
} from './types/errors';

export function getOdatafyParserError(
  message: string,
  queryOption?: OdatafyQueryOptions
): OdatafyError {
  return {
    name: OdatafyErrorNames.ParserException,
    area: 'SystemQueryOptions',
    originModule: OdatafyModules.Parser,
    ...(queryOption && { queryOption: queryOption }),
    message: message
  };
}
