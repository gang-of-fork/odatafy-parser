import { expandParser } from './src/parser';

export * from './src/types/nodes';
export * from './src/parser';

console.log(JSON.stringify(expandParser.parse("Name($top=4)"),null,4))



