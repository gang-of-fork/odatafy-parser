export * from './src/types/nodes';
export * from './src/parser';

import expandParser from './src/parsing/expandParser';

console.log(expandParser.parse("$expand=Items,Customer($expand=Product)"))


