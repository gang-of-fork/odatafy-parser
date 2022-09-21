import { expandParser} from './src/parser';

export * from './src/types/nodes';
export * from './src/parser';

console.log(JSON.stringify(expandParser.parse("Address"), null, 4))
console.log(JSON.stringify(expandParser.parse("Address($top=5)"), null, 4))
console.log(JSON.stringify(expandParser.parse("Address/Name"), null, 4))
console.log(JSON.stringify(expandParser.parse("Address.mem"), null, 4))
console.log(JSON.stringify(expandParser.parse("$value"), null, 4))



