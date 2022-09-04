import peggy from 'peggy';
import { ExpandNode } from '../types/nodes';

let expandParser = peggy.generate(`
{
    function ExpandNodeHelper(value) {
      return {
        nodeType: "ExpandNode",
        value: value.filter(expandItem => expandItem != undefined)
      }
    }
    function ExpandPathNodeHelper(value) {
      return {
        nodeType: "ExpandPathNode",
        value: value.filter(expandPathItem => expandPathItem  != undefined)
      }
    }
    function ExpandIdentifierNodeHelper(value, flag) {
      return flag?{
        nodeType: "ExpandIdentifierNode",
        value: value,
        flag: flag
      } : {
        nodeType: "ExpandIdentifierNode",
        value: value,
      }
    }
    function ExpandFunctionNodeHelper(func, args) {
      return {
        nodeType: "ExpandFunctionNode",
        func: func,
        args: args
      }
    }
    function ExpandOptionsUnprocessedNodeHelper(selectOptionsString, type) {
      return {
        nodeType: "ExpandOptionsUnprocessedNode",
        value: selectOptionsString,
        type: type
      }
    }
    function ExpandStarNodeHelper(options) {
      return {
        nodeType: "ExpandStarNode",
        ref: options.ref,
        levels: options.levels
      }
    }
    function ExpandValueNodeHelper() {
      return {
        nodeType: "ExpandValueNode"
      }
    }
  }
  
  
  start = head:expandItem tail:(COMMA @expandItem)* {return ExpandNodeHelper([head, ...tail])}
  expandItem        = "$value" {return ExpandValueNodeHelper()}
                    / odataIdentifier &COMMA
                    / odataIdentifierWithNamespace &COMMA
                    / expandPath
                    //if there is a dollar sign, dont read the ident here so that it can be read later
  expandPath        = path1: ( @( odataIdentifier / odataIdentifierWithNamespace ) "/" !"$")*
                      path2: ( STAR options:( ref {return {ref: true}} / OPEN levels:levels CLOSE {return {levels: levels}} )? {return [ExpandStarNodeHelper(options)]}
                      / ident1:(odataIdentifier / odataAnnotation) ident2:( "/" @(odataIdentifier/odataIdentifierWithNamespace) )?
                        selOps:( 
                          type:(ref {return "ref"} / count {return "count"} / "" {return "default"})  optionString:expandOptions? {return ExpandOptionsUnprocessedNodeHelper(optionString, type)}
                        )?    
                        {return [ident1, ident2, selOps]}                
                      )
                      {return ExpandPathNodeHelper([...path1, ...path2])}
  
  count = '/$count'
  ref   = '/$ref'
  
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
  
`, {trace: true})

function parseExpand(expr: string): ExpandNode {

    let expandNode = expandParser.parse(expr);

    return expandNode;
}
export default {

    /**
       * Parser for search expressions
       * @param expr search expression as string
       * @example searchParser.parse("blue OR green OR red")
       * @returns Abstract Syntax Tree (AST) of type SearchNode
       */
    parse: parseExpand
}



