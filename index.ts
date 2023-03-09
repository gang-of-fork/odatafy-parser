export * from './src/types/nodes';
export * from './src/parser';

import * as p from './src/parser';

console.log(p.parseODataUrl(`?$filter=concat(test,'string') eq 'test123'`))
