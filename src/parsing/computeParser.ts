import peggy from 'peggy';
import astPostProc from '../processing/filterAstPostProc';
import filterExpressionPreProc from '../processing/filterExpressionPreProc';
import { OdatafyQueryOptions } from '../types/errors';
import { ComputeNode, NodeTypes } from '../types/nodes';
import { getOdatafyParserError } from '../utils';
//import astPostProc from '../processing/astPostProc';
import { filterGrammar } from './filterParser';

let computeParser = peggy.generate(filterGrammar + `
start = head:computeItem tail:( COMMA @computeItem )* {return{nodeType: "ComputeNode", computeProps: [head, ...tail]}}

computeItem = commonExpr:(commonExpr / value:$mathExpr {return {type: 'mathExpr', value: value}} / odataIdentifier) RWS "as" RWS computeIdentifier:$odataIdentifier {return {nodeType: "ComputeItemNode", commonExpr:commonExpr, computeIdentifier: computeIdentifier}}
`, { allowedStartRules: ["start"] })


function parseCompute(expr: string):ComputeNode {
    let computeNode: ComputeNode = {
        nodeType: NodeTypes.ComputeNode,
        value: []
    }
    try {
        expr = filterExpressionPreProc(expr);

        let ast = computeParser.parse(expr);

        ast.computeProps.forEach((computeItem: any) => {
            computeItem.commonExpr = astPostProc(computeItem.commonExpr);
            computeNode.value.push(computeItem)
        });
        return computeNode;
    }
    catch (e) {
        throw getOdatafyParserError("malformed compute expression", OdatafyQueryOptions.Compute)
    }
  
}

export default {
    /**
    * Parser for compute expressions
    * @param expr compute expression as string
    * @example computeParser.parse("FirstName as Name")
    * @returns Abstract Syntax Tree (AST) of type ComputeNode
    */
    parse: parseCompute
}