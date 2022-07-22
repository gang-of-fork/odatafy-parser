import peggy from 'peggy';
import astPostProc from '../processing/astPostProc';
import expressionPreProc from '../processing/expressionPreProc';
import { ComputedNode, NodeTypes } from '../types/nodes';
//import astPostProc from '../processing/astPostProc';
import { filterGrammar } from './filterParser';

let computedParser = peggy.generate(filterGrammar + `
start = head:computeItem tail:( COMMA @computeItem )* {return{nodeType: "ComputedNode", computedProps: [head, ...tail]}}

computeItem = commonExpr:(commonExpr / value:$mathExpr {return {type: 'mathExpr', value: value}} / odataIdentifier) RWS "as" RWS computedIdentifier:$odataIdentifier {return {nodeType: "ComputedItemNode", commonExpr:commonExpr, computedIdentifier: computedIdentifier}}
`, {allowedStartRules: ["start"]})

export function parseComputed(expr: string):ComputedNode {
    expr = expressionPreProc(expr);
    let computedNode:ComputedNode = {
        nodeType: NodeTypes.ComputedNode,
        value: []
    }

    let ast = computedParser.parse(expr);

    ast.computedProps.forEach((computedItem:any) => {
        computedItem.commonExpr = astPostProc(computedItem.commonExpr);
        computedNode.value.push(computedItem)
    });

    return computedNode;
}

export default {
    parse: parseComputed
}