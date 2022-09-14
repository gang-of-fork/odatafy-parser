import { expandParser } from './src/parser';

export * from './src/types/nodes';
export * from './src/parser';

console.log(JSON.stringify(expandParser.parse("Name/Address($expand=mem)"), null, 4))



