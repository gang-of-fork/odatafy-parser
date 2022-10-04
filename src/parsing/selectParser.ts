import peggy from 'peggy';
import { NodeTypes, SelectNode, SelectOptions, SelectOptionsUnprocessedNode } from '../types/nodes';
import querystring from 'querystring';
import filterParser from './filterParser';
import orderbyParser from './orderbyParser';
import skipParser from './skipParser';
import topParser from './topParser';
import computeParser from './computeParser';
import expandParser from './expandParser';
import searchParser from './searchParser';
import { getOdatafyParserError } from '../utils';
import { OdatafyQueryOptions } from '../types/errors';


//TODO add annotations to path

let selectParser = peggy.generate(`
{
  function SelectNodeHelper(value) {
    return {
      nodeType: "SelectNode",
      value: value.filter(selectItem => selectItem != undefined)
    }
  }
  function SelectPathNodeHelper(value, options) {
    return options?{
      nodeType: "SelectPathNodeWithOptions",
      value: value,
      options: options
    } : {
      nodeType: "SelectPathNode",
      value: value
    }
  }
  function SelectIdentifierNodeHelper(value, flag) {
    return {
      nodeType: "SelectIdentifierNode",
      value: value,
      ...(flag && {flag: flag}) 
    }
  }
  function SelectFunctionNodeHelper(func, args) {
    return {
      nodeType: "SelectFunctionNode",
      func: func,
      args: args
    }
  }
  function SelectOptionsUnprocessedNodeHelper(selectOptionsString) {
    return {
      nodeType: "SelectOptionsUnprocessedNode",
      value: selectOptionsString
    }
  }
}

//functionname and selectoption are not clashing, because function params need to have odataIdentifiers as params and selectoptions always contain EQs, which are not allowed in odataIdents
select         = head:selectItem tail:( COMMA BWS @selectItem )* {return SelectNodeHelper([head, ...tail])}
selectItem     = STAR {return undefined}
               / identNode:allOperationsInSchema  {return SelectPathNodeHelper([identNode])}
               / (    
                  identNode:qualifiedFunctionName {return SelectPathNodeHelper([identNode])}
                 / selectPath 
                 / identNode:(selectPathPart) selOps:selectOptions? {return SelectPathNodeHelper([identNode], selOps) }
                 )

selectPath = head:(selectPathPart) tail:( "/" @(identNode: selectPathPart ) )* selOps:selectOptions?  {return SelectPathNodeHelper([head, ...tail], selOps)}
selectPathPart = odataIdentifierWithNamespace / odataIdentifier / odataAnnotation

selectOptions = OPEN selectOptionString:$textUntilTerminator CLOSE {return SelectOptionsUnprocessedNodeHelper(selectOptionString)}
textUntilTerminator = ( &haveTerminatorAhead .)*
haveTerminatorAhead = . ( !")" . )* ")"


//avoid the matching with qualifiedFunctionName if the expression is actually an Identifier with selectOptions
qualifiedFunctionName = func:$odataIdentifierWithNamespace OPEN args:parameterNames CLOSE  {return SelectFunctionNodeHelper(func, args)}
//selectOptionStart = ("$"? ("filter" / "search" / "count" / "orderby" / "skip" / "top" / "compute" / "select" / "expand") EQ .*) 

parameterNames = head:odataIdentifier tail:( COMMA @odataIdentifier )* {return [head, ...tail]}

allOperationsInSchema =  value:$(odataIdentifier ( "." odataIdentifier )*) "." STAR {return SelectIdentifierNodeHelper(value, "AllOperationsInSchema")}

odataAnnotation = AT identNode:(odataIdentifierWithNamespace / odataIdentifier) {return {...identNode, flag: "Annotation"}}
odataIdentifierWithNamespace =  value:$(odataIdentifier ( "." odataIdentifier )+) {return SelectIdentifierNodeHelper(value)}

odataIdentifier             = value:$(identifierLeadingCharacter identifierCharacter*) {return SelectIdentifierNodeHelper(value)}
identifierLeadingCharacter  = ALPHA / "_"         
identifierCharacter         = ALPHA / "_" / DIGIT 

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
`)

function parseSelect(expr: string): SelectNode {
  let ast;
  try {
    ast = <SelectNode>selectParser.parse(expr);
  } catch (e) {
    throw getOdatafyParserError("malformed select expression", OdatafyQueryOptions.Select)
  }
  
  try {
    for (let selectPath of ast.value) {
      if (selectPath.nodeType == NodeTypes.SelectPathNodeWithOptions) {
        selectPath.options = processSelectOptionsUnprocessedNode(<SelectOptionsUnprocessedNode>selectPath.options)
      }
    }
    return ast
  } catch (e) {
    throw getOdatafyParserError("malformed select options", OdatafyQueryOptions.Select)
  }
}

export function processSelectOptionsUnprocessedNode(SelectOptionsUnprocessedNode: SelectOptionsUnprocessedNode): SelectOptions {
  const parsedOptions = querystring.parse(SelectOptionsUnprocessedNode.value, ";")
  let options: SelectOptions = {}

  //parse options wíth $
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
    options.select = parseSelect(parsedOptions.$select);
  }

  if (parsedOptions.$compute && typeof parsedOptions.$compute == 'string') {
    options.compute = computeParser.parse(parsedOptions.$compute);
  }

  if (parsedOptions.$expand && typeof parsedOptions.$expand == 'string') {
    options.expand = expandParser.parse(parsedOptions.$expand);
  }

  if (parsedOptions.$count && typeof parsedOptions.$count == 'string') {
    options.count = true
  }

  if (parsedOptions.$search && typeof parsedOptions.$search == 'string') {
    options.search = searchParser.parse(parsedOptions.$search);
  }

  // parse options without $
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
    options.select = parseSelect(parsedOptions.select);
  }

  if (parsedOptions.compute && typeof parsedOptions.compute == 'string') {
    options.compute = computeParser.parse(parsedOptions.compute);
  }

  if (parsedOptions.expand && typeof parsedOptions.expand == 'string') {
    options.expand = expandParser.parse(parsedOptions.expand);
  }

  if (parsedOptions.count && typeof parsedOptions.count == 'string') {
    options.count = true
  }

  if (parsedOptions.search && typeof parsedOptions.search == 'string') {
    options.search = searchParser.parse(parsedOptions.search);
  }

  return options;
}

export default {
  /**
     * Parser for select expressions
     * @param expr select expression as string
     * @example selectParser.parse("Name,Age")
     * @returns Abstract Syntax Tree (AST) of type SelectNode
     */
  parse: parseSelect
}



