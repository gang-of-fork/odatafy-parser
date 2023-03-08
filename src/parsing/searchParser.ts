import peggy from 'peggy';
import searchExpressionPreProc from '../processing/searchExpressionPreProc';
import { OdatafyQueryOptions } from '../types/errors';
import { SearchNode } from '../types/nodes';
import { getOdatafyParserError } from '../utils';

const searchParser = peggy.generate(`
search     = node:(searchExpr / searchExpr_incomplete) {return node}

searchExpr = ( 
               searchOrExpr
             / searchAndExpr
             / searchParenExpr
             / searchNegateExpr
             / searchPhrase
             / searchWord 
            )

searchParenExpr = OPEN BWS searchExpr:searchExpr BWS CLOSE {return searchExpr}

searchNegateExpr = 'NOT' RWS right:searchExpr {return{nodeType: "SearchOperatorNode", op: "NOT", right: right}}

searchOrExpr  = left:(searchParenExpr / searchNegateExpr / searchPhrase / searchWord) RWS 'OR' RWS right:searchExpr {return{nodeType: "SearchOperatorNode", op: "OR", left: left, right: right}}
searchAndExpr = left:(searchParenExpr / searchNegateExpr / searchPhrase / searchWord) (RWS 'AND')? RWS right:searchExpr  {return{nodeType: "SearchOperatorNode", op: "AND", left: left, right: right}}

searchPhrase = quotation_mark value:$( qchar_no_AMP_DQUOTE / SP )* quotation_mark {return {nodeType: "SearchItemNode", type: "Phrase", value: value}}

searchWord = value:$(searchChar ( searchChar / SQUOTE )*) {return {nodeType: "SearchItemNode", type: "Word", value: value}}
searchChar = unreserved / pct_encoded_no_DQUOTE / "!" / "*" / "+" / "," / ":" / "@" / "/" / "?" / "$" / "=" 

searchExpr_incomplete = SQUOTE value:$( SQUOTE_in_string / qchar_no_AMP_SQUOTE / quotation_mark / SP )* SQUOTE {return {nodeType: "SearchItemNode", type: "Phrase", value: value}}


qchar_no_AMP_SQUOTE       = unreserved / pct_encoded           / other_delims / ":" / "@" / "/" / "?" / "$" /       "="
qchar_no_AMP_DQUOTE       = unreserved / pct_encoded_no_DQUOTE / other_delims / ":" / "@" / "/" / "?" / "$" / "'" / "="

pct_encoded   = "%" HEXDIG HEXDIG

other_delims   = "!" /  "(" / ")" / "*" / "+" / "," / ";"

pct_encoded_no_DQUOTE = "%" ( "0" / "1" / "3" / "4" / "5" / "6" / "7" / "8" / "9" / A_to_F ) HEXDIG 
                      / "%" "2" ( "0" / "1" / "3" / "4" / "5" / "6" / "7" / "8" / "9" / A_to_F )



SQUOTE_in_string = SQUOTE SQUOTE

unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"

quotation_mark  = DQUOTE / "%22"

RWS = ( SP / HTAB / "%20" / "%09" )+  
BWS =  ( SP / HTAB / "%20" / "%09" )*  

AT     = "@" / "%40"
COLON  = ":" / "%3A"
COMMA  = "," / "%2C"
EQ     = "="
HASH   = "%23"
SIGN   = "+" / "%2B" / "-"
SEMI   = ";" / "%3B"
STAR   = "*" / "%2A"
SQUOTE = "'" / "%27"

OPEN  = "(" / "%28"
CLOSE = ")" / "%29"

ALPHA  = [a-z] / [A-Z] 
DIGIT  = [0-9]
HEXDIG = DIGIT / A_to_F
A_to_F = "A" / "B" / "C" / "D" / "E" / "F" 
DQUOTE = '"'
SP     = ' ' 
HTAB   = '  ' 

`);

function parseSearch(expr: string): SearchNode {
  try {
    expr = searchExpressionPreProc(expr);

    const searchNode = <SearchNode>searchParser.parse(expr);

    return searchNode;
  } catch (e) {
    throw getOdatafyParserError(
      'malformed search expression',
      OdatafyQueryOptions.Search
    );
  }
}
export default {
  /**
   * Parser for search expressions
   * @param expr search expression as string
   * @example searchParser.parse("blue OR green OR red")
   * @returns Abstract Syntax Tree (AST) of type SearchNode
   */
  parse: parseSearch
};
