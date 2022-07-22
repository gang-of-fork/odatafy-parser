import peggy from 'peggy';
import { NodeTypes, SelectNode, SelectOptions, SelectOptionsNode, SelectOptionsUnprocessedNode } from '../types/nodes';
import querystring from 'querystring';
import filterParser from './filterParser';
import orderbyParser from './orderbyParser';
import skipParser from './skipParser';
import topParser from './topParser';
import computedParser from './computedParser';
import expandParser from './expandParser';


//TODO add annotations to path

let selectParser = peggy.generate(`
{
  function SelectNodeHelper(value) {
    return {
      nodeType: "SelectNode",
      value: value.filter(selectItem => selectItem != undefined)
    }
  }
  function SelectPathNodeHelper(value) {
    return {
      nodeType: "SelectPathNode",
      value: value
    }
  }
  function SelectIdentifierNodeHelper(value, flag) {
    return flag?{
      nodeType: "SelectIdentifierNode",
      value: value,
      flag: flag
    } : {
      nodeType: "SelectIdentifierNode",
      value: value,
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
               / allOperationsInSchema 
               / (    
                   selectPath 
                   / qualifiedFunctionName 
                   / identNode:(selectPathPart) selOps:selectOptions? {return selOps? {...identNode, selectOptions: selOps} : identNode}
                 )

selectPath = head:(selectPathPart) tail:( "/" @(identNode:(selectPathPart) selOps:selectOptions? {return selOps? {...identNode, selectOptions: selOps} : identNode}) )+ {return SelectPathNodeHelper([head, ...tail])}
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
export function parseSelect(expr: string): SelectNode {
    let ast = <SelectNode>selectParser.parse(expr);
    for(let selectItem of ast.value) {
      switch(selectItem.nodeType) {

        case NodeTypes.SelectIdentifierNode:
          if (selectItem.selectOptions && selectItem.selectOptions.nodeType == NodeTypes.SelectOptionsUnprocessedNode) {
            selectItem.selectOptions = processSelectOptionsUnprocessedNode(selectItem.selectOptions)
          }
          break;

        case NodeTypes.SelectPathNode:
          for(let identNode of selectItem.value) {
            if (identNode.selectOptions && identNode.selectOptions.nodeType == NodeTypes.SelectOptionsUnprocessedNode) {
              identNode.selectOptions = processSelectOptionsUnprocessedNode(identNode.selectOptions)
            }
          }
          break;
      }
    }
    return ast
}

export function processSelectOptionsUnprocessedNode(SelectOptionsUnprocessedNode: SelectOptionsUnprocessedNode): SelectOptionsNode {
  const parsedOptions = querystring.parse(SelectOptionsUnprocessedNode.value, ";")
                let options: SelectOptions = {}

                //parse options
                if(parsedOptions.$filter && typeof parsedOptions.$filter == 'string') {
                    options.filter = filterParser.parse(parsedOptions.$filter);
                }

                if(parsedOptions.$orderby && typeof parsedOptions.$orderby == 'string') {
                    options.orderby = orderbyParser.parse(parsedOptions.$orderby);
                }

                if(parsedOptions.$skip && typeof parsedOptions.$skip == 'string') {
                    options.skip = skipParser.parse(parsedOptions.$skip);
                }

                if(parsedOptions.$top && typeof parsedOptions.$top == 'string') {
                    options.top = topParser.parse(parsedOptions.$top);
                }

                if(parsedOptions.$select && typeof parsedOptions.$select == 'string') {
                  options.select = parseSelect(parsedOptions.$select);
                }

                if(parsedOptions.$computed && typeof parsedOptions.$computed == 'string') {
                  options.computed = computedParser.parse(parsedOptions.$computed);
                }

                if(parsedOptions.$expand && typeof parsedOptions.$expand == 'string') {
                  options.expand = expandParser.parse(parsedOptions.$expand);
                }

                if(parsedOptions.$count && typeof parsedOptions.$count == 'string') {
                  options.count = true
                }
                /* ALSO ADD TEST WHEN ACTIVATING
                if(parsedOptions.$search && typeof parsedOptions.$search == 'string') {
                  options.search = searchParser.parse(parsedOptions.$search);
                }
                */



                //TODO annotations, inlinecount, search
                return {
                  nodeType: NodeTypes.SelectOptionsNode,
                  value: options
                };
}

export default {
    parse: parseSelect
}



