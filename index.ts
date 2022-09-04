import { expandParser } from './src/parser';

export * from './src/types/nodes';
export * from './src/parser';

console.log(JSON.stringify(expandParser.parse("Address/*,Address/Address/*,Addresses/*,Address/Model.AddressWithLocation/*,Model.VipCustomer/Address/*"), null, 4))



