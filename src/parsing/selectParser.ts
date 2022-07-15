import peggy from 'peggy';
import { SelectNode } from '../types/nodes';


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
  function SelectIdentifierNodeHelper(value, isWildcard = false) {
    return isWildcard?{
      nodeType: "SelectIdentifierNode",
      value: value,
      isWildcard: true
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
      selectOptionsString: selectOptionsString
    }
  }
}

//functionname and selectoption are not clashing, because function params need to have odataIdentifiers as params and selectoptions always contain EQs, which are not allowed in odataIdents
select         = head:selectItem tail:( COMMA BWS @selectItem )* {return SelectNodeHelper([head, ...tail])}
selectItem     = STAR {return undefined}
               / allOperationsInSchema 
               / (    
                   selectProperty 
                   / qualifiedFunctionName 
                   / ident:odataIdentifierWithNamespace selOps:selectOptions? {return selOps? {...ident, selectOptions: selOps} : ident}
                  / ident:odataIdentifier selOps:selectOptions? {return selOps? {...ident, selectOptions: selOps} : ident}
                 )

selectProperty = head:(odataIdentifierWithNamespace / odataIdentifier) tail:( "/" @(ident:(odataIdentifierWithNamespace / odataIdentifier) selOps:selectOptions? {return selOps? {...ident, selectOptions: selOps} : ident}) )+ {return SelectPathNodeHelper([head, ...tail])}

selectOptions = OPEN selectOptionString:$textUntilTerminator CLOSE {return SelectOptionsUnprocessedNodeHelper(selectOptionString)}
textUntilTerminator = ( &haveTerminatorAhead .)*
haveTerminatorAhead = . ( !")" . )* ")"

odataIdentifierWithNamespace =  value:$(odataIdentifier ( "." odataIdentifier )+) {return SelectIdentifierNodeHelper(value)}

//avoid the matching with qualifiedFunctionName if the expression is actually an Identifier with selectOptions
qualifiedFunctionName = func:$odataIdentifierWithNamespace OPEN args:parameterNames CLOSE  {return SelectFunctionNodeHelper(func, args)}
//selectOptionStart = ("$"? ("filter" / "search" / "count" / "orderby" / "skip" / "top" / "compute" / "select" / "expand") EQ .*) 

parameterNames = head:odataIdentifier tail:( COMMA @odataIdentifier )* {return [head, ...tail]}

allOperationsInSchema =  value:$(odataIdentifier ( "." odataIdentifier )*) "." STAR {return SelectIdentifierNodeHelper(value, true)}


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
    return selectParser.parse(expr);
}

export default {
    parse: parseSelect
}



