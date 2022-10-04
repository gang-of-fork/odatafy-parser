//import { expandParser } from './src/parser'
import { OdatafyError, OdatafyModules } from './src/types/errors';
export * from './src/types/nodes';
export * from './src/parser';


//console.log(JSON.stringify(expandParser.parse("Address/Name"), null, 4))ole
try {
throw <OdatafyError>{area: "SystemQueryOptions", originModule: OdatafyModules.Parser, queryOption:"dd"};
} catch (e:any) {
    console.log(JSON.stringify(e))
}



