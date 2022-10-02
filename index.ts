import { expandParser } from './src/parser';

export * from './src/types/nodes';
export * from './src/parser';

console.log(JSON.stringify(expandParser.parse("Customer,Items"),null,4))



