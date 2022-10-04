import { expandParser } from './src/parser';

export * from './src/types/nodes';
export * from './src/parser';

console.log(JSON.stringify(expandParser.parse("Items/$ref($levels=2)"),null,4))



