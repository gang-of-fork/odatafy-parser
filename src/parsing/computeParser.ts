import peggy from 'peggy';
import astPostProc from '../processing/filterAstPostProc';
import filterExpressionPreProc from '../processing/filterExpressionPreProc';
import { computeNode, NodeTypes } from '../types/nodes';
//import astPostProc from '../processing/astPostProc';
import { filterGrammar } from './filterParser';

let computeParser = peggy.generate(filterGrammar + `
start = head:computeItem tail:( COMMA @computeItem )* {return{nodeType: "computeNode", computeProps: [head, ...tail]}}

computeItem = commonExpr:(commonExpr / value:$mathExpr {return {type: 'mathExpr', value: value}} / odataIdentifier) RWS "as" RWS computeIdentifier:$odataIdentifier {return {nodeType: "computeItemNode", commonExpr:commonExpr, computeIdentifier: computeIdentifier}}
`, {allowedStartRules: ["start"]})

export function parsecompute(expr: string):computeNode {
    expr = filterExpressionPreProc(expr);
    let computeNode:computeNode = {
        nodeType: NodeTypes.computeNode,
        value: []
    }

    let ast = computeParser.parse(expr);

    ast.computeProps.forEach((computeItem:any) => {
        computeItem.commonExpr = astPostProc(computeItem.commonExpr);
        computeNode.value.push(computeItem)
    });

    return computeNode;
}

export default {
    parse: parsecompute
}