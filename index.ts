import { parseSelect } from './src/parsing/selectParser';



export * from './src/types/nodes';
export * from './src/parser';

/*
import { testMongoDB } from './prototype/mongodbGenerator';

testMongoDB();
*/

console.log(JSON.stringify(parseSelect("Addresses($filter=startswith(City,'H');$top=5;$orderby=Name,City,Street)"), null, 4))