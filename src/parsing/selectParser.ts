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
  }
  
  select         = head:selectItem tail:( COMMA BWS @selectItem )* {return SelectNodeHelper([head, ...tail])}
  selectItem     = STAR {return undefined}
                 / allOperationsInSchema 
                 / (    
                     selectProperty
                     / qualifiedFunctionName 
                     / odataIdentifierWithNamespace
                    / odataIdentifier 
                   )
  
  selectProperty = head:(odataIdentifierWithNamespace / odataIdentifier) tail:( "/" @(odataIdentifierWithNamespace / odataIdentifier) )+ {return SelectPathNodeHelper([head, ...tail])}
  
  odataIdentifierWithNamespace =  value:$(odataIdentifier ( "." odataIdentifier )+) {return SelectIdentifierNodeHelper(value)}
  
  qualifiedFunctionName = func:$odataIdentifierWithNamespace OPEN args:parameterNames CLOSE  {return SelectFunctionNodeHelper(func, args)}
  
  parameterNames = head:odataIdentifier tail:( COMMA @odataIdentifier )* {return [head, ...tail]}
  
  allOperationsInSchema =  value:$(odataIdentifier ( "." odataIdentifier )*) "." STAR {return SelectIdentifierNodeHelper(value, true)}
  
  
  odataIdentifier             = value:$(identifierLeadingCharacter identifierCharacter*) {return SelectIdentifierNodeHelper(value)}
  identifierLeadingCharacter  = ALPHA / "_"         
  identifierCharacter         = ALPHA / "_" / DIGIT 
  
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



