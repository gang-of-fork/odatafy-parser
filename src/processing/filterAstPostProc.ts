import matchBracket from 'find-matching-bracket';
import crypto from 'crypto';
import math, { parse } from 'mathjs';
import {
  ConstantNodeTypes,
  FilterNode,
  OperatorNodeOperators,
  NodeTypes,
  SymbolNodeTypes
} from '../types/nodes';

//STR and FUNC_ESCAPE switched, because % is reserved in mathjs and in mathExpressions, strings can only occur in functions, so the string escape symbol does not matter
//TODO adjust the grammar, so that strings cannot be part of a mathExpr
export enum Prefixes {
  Str_Escape = '%',
  Func_Escape = '$'
}

const FUNC_ESCAPE_REGEX = /\$(.*?)\$/;

export function getIdentifier(prefix: Prefixes) {
  return `${prefix}${crypto.randomBytes(20).toString('hex')}${prefix}`;
}

export function escapeStrings(expr: string): [string, Record<string, string>] {
  let escaped = expr;
  const stringResolve: Record<string, string> = {};

  while (escaped.includes("'")) {
    const regex = /'.*?'/;
    const identifier = getIdentifier(Prefixes.Str_Escape);
    const toEscape = escaped.match(regex);

    if (toEscape == null) {
      break;
    }

    stringResolve[identifier] = toEscape[0].toString();

    escaped = escaped.replace(regex, identifier);
  }

  return [escaped, stringResolve];
}

export function escapeFunctions(
  expr: string
): [string, Record<string, string>] {
  let escaped = expr;
  const functionResolve: Record<string, string> = {};

  const regex = /contains\(/g;

  while ([...escaped.matchAll(regex)].length > 0) {
    const matches = [...escaped.matchAll(regex)];
    const end = matchBracket(
      escaped,
      <number>matches[0].index + (matches[0][0].length - 1)
    );
    const identifier = getIdentifier(Prefixes.Func_Escape);
    const toEscape = escaped.substring(<number>matches[0].index, end + 1);

    functionResolve[identifier] = toEscape;

    escaped =
      escaped.substring(0, <number>matches[0].index) +
      identifier +
      escaped.substring(end + 1);
  }
  return [escaped, functionResolve];
}

export function replaceMathSymbols(mathExpr: string) {
  mathExpr = mathExpr.replace(/ add /g, ' + ');
  mathExpr = mathExpr.replace(/ sub /g, ' - ');
  mathExpr = mathExpr.replace(/ mul /g, ' * ');
  //element wise division is later resolved to integer division, because mathjs does not support integer division
  mathExpr = mathExpr.replace(/ div /g, ' .* ');
  mathExpr = mathExpr.replace(/ divby /g, ' / ');
  //mathjs knows mod as mod
  return mathExpr;
}

export function parseMathExpression(mathExpr: string) {
  const [strResult, strResolver] = escapeStrings(mathExpr);
  const [funcResult, funcResolver] = escapeFunctions(strResult as string);
  const preparedMathExpr = replaceMathSymbols(funcResult);
  const mathExprAst = parse(preparedMathExpr);

  //@ts-ignore unspecified types from lib
  const resolvedAst = mathExprAst.transform((node, _path, _parent) => {
    if (node.type == 'SymbolNode') {
      const symbolNode = <math.SymbolNode>node;
      if (FUNC_ESCAPE_REGEX.test(symbolNode.name)) {
        //resolve function
        symbolNode.name = funcResolver[symbolNode.name];
        //resolve strings in function, if there are any
        Object.keys(strResolver).forEach((key) => {
          symbolNode.name = symbolNode.name.replace(key, strResolver[key]);
        });
      }
    }

    return node;
  });
  return JSON.parse(JSON.stringify(resolvedAst));
}

export function cleanAST(ast: any): FilterNode {
  let cleanedNode: FilterNode;

  switch (ast.mathjs) {
    case NodeTypes.OperatorNode:
      if (ast.args) {
        if (ast.args.length == 1) {
          cleanedNode = {
            nodeType: NodeTypes.OperatorNode,
            op: ast.fn,
            right: cleanAST(ast.args[0])
          };
        } else {
          cleanedNode = {
            nodeType: NodeTypes.OperatorNode,
            op: ast.fn,
            left: cleanAST(ast.args[0]),
            right: cleanAST(ast.args[1])
          };
        }

        cleanedNode.op = <OperatorNodeOperators>(
          cleanedNode.op
            .replace('add', OperatorNodeOperators.Add)
            .replace('subtract', 'sub')
            .replace('divide', 'divby')
            .replace('dotMultiply', 'div')
            .replace('multiply', 'mul')
            .replace('mod', 'mod')
        );
      }
      break;

    case NodeTypes.ConstantNode:
      cleanedNode = {
        nodeType: NodeTypes.ConstantNode,
        type: Number.isInteger(ast.value)
          ? ConstantNodeTypes.Integer
          : ConstantNodeTypes.Decimal,
        value: ast.value
      };
      break;

    case NodeTypes.SymbolNode:
      cleanedNode = {
        nodeType: NodeTypes.SymbolNode,
        type: SymbolNodeTypes.Identifier,
        value: ast.name
      };
      break;

    case 'ParenthesisNode':
      cleanedNode = cleanAST(ast.content);
      break;
  }
  return cleanedNode;
}

export function processAST(ast: any): FilterNode {
  if (ast.type == 'mathExpr') {
    ast = cleanAST(parseMathExpression(ast.value));
  }

  //and / or args are inverted because of the preprocessing
  if (ast.op == 'and' || ast.op == 'or') {
    const temp = ast.right;
    ast.right = ast.left;
    ast.left = temp;
  }

  if (ast.left) {
    ast.left = processAST(ast.left);
  }

  if (ast.right) {
    ast.right = processAST(ast.right);
  }

  return <FilterNode>ast;
}

export default function astPostProc(ast: any): FilterNode {
  return processAST(ast);
}
