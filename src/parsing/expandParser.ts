import peggy from 'peggy';
import querystring from 'querystring';
import { OdatafyQueryOptions } from '../types/errors';
import {
  ExpandNode,
  ExpandOptions,
  ExpandOptionsUnprocessedNode,
  NodeTypes
} from '../types/nodes';
import { getOdatafyParserError } from '../utils';
import computeParser from './computeParser';
import filterParser from './filterParser';
import levelsParser from './levelsParser';
import orderbyParser from './orderbyParser';
import searchParser from './searchParser';
import selectParser from './selectParser';
import skipParser from './skipParser';
import topParser from './topParser';

const expandParser = peggy.generate(
  `
{
    function ExpandNodeHelper(value) {
      return {
        nodeType: "ExpandNode",
        value: value.filter(expandItem => expandItem != undefined)
      }
    }
    function ExpandPathNodeHelper(value, expOps) {
      return expOps && expOps.value != ""?{
        nodeType: "ExpandPathNodeWithOptions",
        value: value.filter(expandPathItem => expandPathItem  != undefined),
        options:expOps
      } : {
        nodeType: "ExpandPathNode",
        value: value.filter(expandPathItem => expandPathItem  != undefined)
      }

    }
    function ExpandIdentifierNodeHelper(value, flag) {
      return {
        nodeType: "ExpandIdentifierNode",
        value: value,
        ...(flag && {flag: flag}) 
      }
    }
    function ExpandFunctionNodeHelper(func, args) {
      return {
        nodeType: "ExpandFunctionNode",
        func: func,
        args: args
      }
    }
    function ExpandOptionsUnprocessedNodeHelper(expandOptionsString, type) {
      return {
        nodeType: "ExpandOptionsUnprocessedNode",
        value: expandOptionsString,
        type: type
      }
    }
    function ExpandStarNodeHelper(options) {
      return {
        nodeType: "ExpandStarNode",
        ...(options && {options: options})
      }
    }
    function ExpandValueNodeHelper() {
      return {
        nodeType: "ExpandValueNode"
      }
    }
  }
  
  
  start = head:expandItem tail:(COMMA @expandItem)* {return ExpandNodeHelper([head, ...tail])}
  expandItem        = "$value" {return ExpandPathNodeHelper([ExpandValueNodeHelper()])}
                    / identNode:odataIdentifierWithNamespace !("/" / "(") {return ExpandPathNodeHelper([identNode])}
                    / identNode:odataIdentifier !("/" / "." / "(") {return ExpandPathNodeHelper([identNode])}
                    / expandPath
                    //if there is a dollar sign, dont read the ident here so that it can be read later
  expandPath        = path1: ( @( odataIdentifierWithNamespace / odataIdentifier ) "/" !"$")*
                      path2: ( STAR options:( ref {return {ref: true}} / OPEN levels:levels CLOSE {return {levels: levels}} )? {return {path: [ExpandStarNodeHelper(options)]}}
                      / ident1:(odataIdentifier / odataAnnotation) ident2:( "/" @(odataIdentifierWithNamespace/odataIdentifier) )?
                        expOps:( 
                          type:(ref {return "ref"} / count {return "count"} / "" &OPEN {return "default"})  optionString:expandOptions? {return ExpandOptionsUnprocessedNodeHelper(optionString, type)}
                        )?    
                        {return {path: [ident1, ident2], expOps: expOps}}                
                      )
                      {return ExpandPathNodeHelper([...path1, ...path2.path], path2.expOps)}
  
  count = "/$count"
  ref   = "/$ref"
  
  odataAnnotation = AT identNode:(odataIdentifierWithNamespace / odataIdentifier) {return {...identNode, flag: "Annotation"}}
  
  expandOptions = OPEN expandOptionString:$textUntilTerminator CLOSE {return expandOptionString}
  textUntilTerminator = ( &haveTerminatorAhead .)*
  haveTerminatorAhead = . ( !")" . )* ")"
  
  levels = ( "$levels" / "levels" ) EQ value:( oneToNine DIGIT* / "max" ) {return value}
  
  
  odataIdentifierWithNamespace =  value:$(odataIdentifier ( "." odataIdentifier )+) {return ExpandIdentifierNodeHelper(value)}
  odataIdentifier             = value:$(identifierLeadingCharacter identifierCharacter*) {return ExpandIdentifierNodeHelper(value)}
  identifierLeadingCharacter  = ALPHA / "_"         
  identifierCharacter         = ALPHA / "_" / DIGIT 
  
  oneToNine       = "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" 
  
  AT     = "@" / "%40"
  ALPHA  = [a-zA-Z] 
  DIGIT  = [0-9] 
  COMMA  = "," / "%2C"
  STAR   = "*" / "%2A"
  EQ     = "="
  
  OPEN  = "(" / "%28"
  CLOSE = ")" / "%29"
  
  RWS = ( SP / HTAB / "%20" / "%09" )+
  BWS =  ( SP / HTAB / "%20" / "%09" )* 
  SP     = ' '
  HTAB   = '  '
  
`,
  { trace: false }
);

function parseExpand(expr: string): ExpandNode {
  let ast;
  try {
    ast = <ExpandNode>expandParser.parse(expr);
  } catch (e) {
    throw getOdatafyParserError(
      'malformed expand expression',
      OdatafyQueryOptions.Expand
    );
  }
  try {
    for (const expandItem of ast.value) {
      if (expandItem.nodeType == NodeTypes.ExpandPathNodeWithOptions) {
        const expandOptions = processExpandOptionsUnprocessedNode(
          <ExpandOptionsUnprocessedNode>expandItem.options
        );
        expandItem.options = expandOptions.value;
        expandItem.optionType = expandOptions.type;
      }
    }
    return ast;
  } catch (e) {
    throw getOdatafyParserError(
      'malformed expand options',
      OdatafyQueryOptions.Expand
    );
  }
}

export function processExpandOptionsUnprocessedNode(
  expandOptionsUnprocessedNode: ExpandOptionsUnprocessedNode
) {
  const parsedOptions = querystring.parse(
    expandOptionsUnprocessedNode.value,
    ';'
  );
  const options: ExpandOptions = {};

  //parse options with $
  if (parsedOptions.$filter && typeof parsedOptions.$filter == 'string') {
    options.filter = filterParser.parse(parsedOptions.$filter);
  }

  if (parsedOptions.$orderby && typeof parsedOptions.$orderby == 'string') {
    options.orderby = orderbyParser.parse(parsedOptions.$orderby);
  }

  if (parsedOptions.$skip && typeof parsedOptions.$skip == 'string') {
    options.skip = skipParser.parse(parsedOptions.$skip);
  }

  if (parsedOptions.$top && typeof parsedOptions.$top == 'string') {
    options.top = topParser.parse(parsedOptions.$top);
  }

  if (parsedOptions.$select && typeof parsedOptions.$select == 'string') {
    options.select = selectParser.parse(parsedOptions.$select);
  }

  if (parsedOptions.$compute && typeof parsedOptions.$compute == 'string') {
    options.compute = computeParser.parse(parsedOptions.$compute);
  }

  if (parsedOptions.$expand && typeof parsedOptions.$expand == 'string') {
    options.expand = parseExpand(parsedOptions.$expand);
  }

  if (parsedOptions.$count && typeof parsedOptions.$count == 'string') {
    options.count = true;
  }

  if (parsedOptions.$search && typeof parsedOptions.$search == 'string') {
    options.search = searchParser.parse(parsedOptions.$search);
  }

  if (parsedOptions.$levels && typeof parsedOptions.$levels == 'string') {
    options.levels = levelsParser.parse(parsedOptions.$levels);
  }

  //parse options without $
  if (parsedOptions.filter && typeof parsedOptions.filter == 'string') {
    options.filter = filterParser.parse(parsedOptions.filter);
  }

  if (parsedOptions.orderby && typeof parsedOptions.orderby == 'string') {
    options.orderby = orderbyParser.parse(parsedOptions.orderby);
  }

  if (parsedOptions.skip && typeof parsedOptions.skip == 'string') {
    options.skip = skipParser.parse(parsedOptions.skip);
  }

  if (parsedOptions.top && typeof parsedOptions.top == 'string') {
    options.top = topParser.parse(parsedOptions.top);
  }

  if (parsedOptions.select && typeof parsedOptions.select == 'string') {
    options.select = selectParser.parse(parsedOptions.select);
  }

  if (parsedOptions.compute && typeof parsedOptions.compute == 'string') {
    options.compute = computeParser.parse(parsedOptions.compute);
  }

  if (parsedOptions.expand && typeof parsedOptions.expand == 'string') {
    options.expand = parseExpand(parsedOptions.expand);
  }

  if (parsedOptions.count && typeof parsedOptions.count == 'string') {
    options.count = true;
  }

  if (parsedOptions.search && typeof parsedOptions.search == 'string') {
    options.search = searchParser.parse(parsedOptions.search);
  }

  if (parsedOptions.levels && typeof parsedOptions.levels == 'string') {
    options.levels = levelsParser.parse(parsedOptions.levels);
  }

  //TODO search
  return {
    value: options,
    type: expandOptionsUnprocessedNode.type
  };
}
export default {
  /**
   * Parser for expand expressions
   * @param expr expand expression as string
   * @example expandParser.parse("Items/$ref")
   * @returns Abstract Syntax Tree (AST) of type ExpandNode
   */
  parse: parseExpand
};
