import { parseSearch } from './src/parsing/searchParser';

export * from './src/types/nodes';
export * from './src/parser';


console.log(JSON.stringify(parseSearch("blue OR green OR red"), null, 4))