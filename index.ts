import { selectParser } from './src/parser';

export * from './src/types/nodes';
export * from './src/parser';

console.log(JSON.stringify(selectParser.parse("Address($top=3)"), null, 4))



