
import { computeParser } from './src/parser';
//import { OdatafyError, OdatafyModules } from './src/types/errors';
export * from './src/types/nodes';
export * from './src/parser';


try {
    console.log(JSON.stringify(computeParser.parse("mem"), null, 4))
//throw <OdatafyError>{area: "SystemQueryOptions", originModule: OdatafyModules.Parser, queryOption:"dd"};
} catch (e:any) {
    console.log(JSON.stringify(e))
}



