import { expandParser } from './src/parser';

export * from './src/types/nodes';
export * from './src/parser';

<<<<<<< HEAD
import expandParser from './src/parsing/expandParser';

console.log(expandParser.parse("$expand=Items,Customer($expand=Product)"))
=======
console.log(JSON.stringify(expandParser.parse("Name($top=4)"),null,4))

>>>>>>> df071af13bcfd57646bdbc3558d7ce663f66f87f


