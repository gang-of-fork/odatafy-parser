import { parseSelect } from './src/parsing/selectParser';



export * from './src/types/nodes';
export * from './src/parser';

/*
import { testMongoDB } from './prototype/mongodbGenerator';

testMongoDB();
*/

console.log(JSON.stringify(parseSelect("Name, Auto")))