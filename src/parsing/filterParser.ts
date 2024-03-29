/*
 * parser for $filter-Expressions
 * NOTE: STRING MUST BE URL-DECODED EXACTLY ONCE
 */

import peggy from 'peggy';
import astPostProc from '../processing/filterAstPostProc';
import filterExpressionPreProc from '../processing/filterExpressionPreProc';
import { OdatafyQueryOptions } from '../types/errors';

import { FilterNode } from '../types/nodes';
import { getOdatafyParserError } from '../utils';

//import fs from "fs";
//import path from "path"

//const grammar = fs.readFileSync(path.join(__dirname, "filterParser.pegjs")).toString();

export const filterGrammar = `

{
    function filterExprHelper(left, right){
      if (right) {
          return {
            nodeType: 'OperatorNode',
              op: right.op,
              left: left,
              right: right.value
          }
      } else {
          return left;
      }
    }

    function constantNodeHelper(type, value) {
        return {
            nodeType: "ConstantNode",
            type: type,
            value: value
        }
    }

    function removeEmpty(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}
  }


boolCommonExpr = commonExpr


//basic types
UINT = $DIGIT+
// INT covers value ranges of sbyte, byte, int16, int32, int64
INT = value:$(SIGN? DIGIT+)

/*
* 4. Expressions
*/

//TODO ADD rootExpr/firstMemberExpr/functionExpr
//ggf methodCall auf boolMethodCalls restricten
commonExpr = (
    andOrExpr
    / booleanValue
    )
    //{if(opAndRight) {return {left:left, op: opAndRight.op, right: opAndRight.right}} return left}

    part =   arrayOrObject  / negateExpr / methodCallExpr / value:$mathExpr {return {type: 'mathExpr', value: value}} / primitiveLiteral / qualifiedEnumTypeName / memberExpr/  odataIdentifier/ enum
    boolExpr = compareExpr / hasExpr / inExpr /  methodCallExpr / notExpr
    notExpr =  "not" RWS right:compareExpr {return {nodeType: "OperatorNode", op: "not", right: right}} / "not" RWS OPEN BWS right:commonExpr BWS CLOSE {return {nodeType: "OperatorNode", op: "not", right: right}}

    memberExpr = head:$odataIdentifier tail:( "/"  @$odataIdentifier)+ {return {nodeType:"SymbolNode", type: "MemberExpression", value: [head, ...tail]}}

    methodCallExpr = noArgFunctionCallExpr 
    / oneArgFunctionCallExpr
    / twoArgFunctionCallExpr 
    / substringMethodCallExpr 
    / caseMethodCallExpr
    / castExpr 
    / isofExpr 
    
    

twoArgFunctionCallExpr = func:twoArgFunc OPEN BWS arg1:part BWS COMMA BWS arg2:part BWS CLOSE {return {nodeType: 'FuncNode2Args', func:func, args:[arg1, arg2]}}
twoArgFunc = "concat" / "contains" / "endswith" / "indexof" / "matchesPattern" / "startswith" / "geo.distance" / "geo.intersects" / "hassubset" / "hassubsequence"

oneArgFunctionCallExpr = func:oneArgFunc         OPEN BWS arg1:part BWS CLOSE {return {nodeType: 'FuncNode1Args', func:func, args:[arg1]}}
oneArgFunc = "length" / "tolower"/"toupper"/"trim"/"year"/"month"/"day"/"hour"/"minute"/"second"/"fractionalseconds"/"totalseconds"/"date"/"time"/"totaloffsetminutes"/"round"/"floor"/"ceiling"/"geo.length"

noArgFunctionCallExpr = func:noArgFunc OPEN BWS CLOSE {return {nodeType: 'FuncNode0Args', func:func}}
noArgFunc = "mindatetime" / "maxdatetime" / "now"

//FuncNodeVarArgs
substringMethodCallExpr      = "substring" OPEN BWS part1:part BWS COMMA BWS part2:part BWS part3:( COMMA BWS @part BWS )? CLOSE {return{nodeType: "FuncNodeVarArgs", func: "substring", args:part3?[part1,part2,part3]:[part1,part2]}}
caseMethodCallExpr = "case" OPEN BWS head:(cond:boolCommonExpr BWS COLON BWS value:part BWS {return{cond:cond, value:value}})
             tail:( COMMA BWS cond:boolCommonExpr BWS COLON BWS value:part BWS {return{cond:cond, value:value}})* CLOSE {return{nodeType: "FuncNodeCase", args:[head, ...tail]}}
             
             
             
             
parenExpr = OPEN BWS commonExpr:commonExpr BWS CLOSE {return commonExpr}
listExpr  = OPEN BWS head:primitiveLiteral BWS tail:( COMMA BWS @primitiveLiteral BWS )* CLOSE {return [head, ...tail]}
             

//unary minus and plus are not needed according to odata ABNF
mathOp = "add" / "sub" / "mul" / "divby" / "div" / "mod"
mathExpr = ((primitiveLiteral / odataIdentifier / methodCallExpr / OPEN BWS mathExpr2 BWS CLOSE ) RWS mathOp RWS mathExpr2) / OPEN BWS mathExpr2 BWS CLOSE
mathExpr2 = (primitiveLiteral / odataIdentifier / methodCallExpr / OPEN BWS mathExpr2 BWS CLOSE ) (RWS mathOp RWS mathExpr2)?


andOrExpr = OPEN BWS left:commonExpr BWS CLOSE right:(RWS op:("and"/"or") RWS value:commonExpr BWS {return {op:op, value:value}})? {return filterExprHelper(left, right)} 
    / BWS left:boolExpr right:(RWS op:("and"/"or") RWS value:commonExpr BWS {return {op:op, value:value}})? {return filterExprHelper(left, right)} 

compareExpr = left:part RWS op:compareOp RWS right:part  {return {nodeType: "OperatorNode", op: op, left: left,  right:right }}
compareOp = "eq" / "ne" / "lt" / "le" / "gt" / "ge"


inExpr = left:part RWS "in" RWS right:( value:listExpr {return {type: "list", value:value}} / qualifiedEnumTypeName / odataIdentifier ) {return {nodeType: "OperatorNode", op: "in", left:left, right:right }}
hasExpr = left:part RWS "has" RWS right:enum {return {nodeType: "OperatorNode", op: "has", left:left, right:right }}

negateExpr = "-" BWS right:commonExpr {return {op: "-", value:right}}

//FuncNodeVarArgs
isofExpr = "isof" OPEN BWS part:( @part BWS COMMA BWS )? typeName:optionallyQualifiedTypeName BWS CLOSE { return {nodeType: "FuncNodeVarArgs", func: "isof", args:part?[part,typeName]:[typeName] }}
castExpr = "cast" OPEN BWS part:( @part BWS COMMA BWS )? typeName:optionallyQualifiedTypeName BWS CLOSE { return {nodeType: "FuncNodeVarArgs", func: "cast", args:part?[part,typeName]:[typeName] }}
    
/*
* 5. JSON format for queries
*/

arrayOrObject = value:$array {return constantNodeHelper("Array",JSON.parse(value))} / value:$object {return constantNodeHelper("Object",JSON.parse(value))}

    array = begin_array 
        ( valueInUrl ( value_separator valueInUrl )* )?
        end_array

    object = begin_object
         ( member ( value_separator member )* )?
         end_object

    member = stringInUrl name_separator valueInUrl
    
    begin_object = BWS ( "{" / "%7B" ) BWS
    end_object   = BWS ( "}" / "%7D" )
    
    begin_array = BWS ( "[" / "%5B" ) BWS 
    end_array   = BWS ( "]" / "%5D" )

    name_separator  = BWS COLON BWS
    value_separator = BWS COMMA BWS
    quotation_mark  = DQUOTE / "%22"
    valueInUrl = stringInUrl / arrayOrObject / primitiveLiteral 
    stringInUrl = quotation_mark charInJSON* quotation_mark 
    charInJSON = [^"]
    


/*
* 6. Names and Identifiers
*/

optionallyQualifiedTypeName = singleQualifiedTypeName                  
                            / 'Collection' OPEN value:$singleQualifiedTypeName CLOSE {return{ nodeType: "SymbolNode", type: "Collection", value: value}}
                            / odataIdentifier
                            / 'Collection' OPEN value:$odataIdentifier CLOSE {return{ nodeType: "SymbolNode", type: "Collection", value: value}}

singleQualifiedTypeName  = value:$(odataIdentifier ("." odataIdentifier)+ / primitiveTypeName) {return{ nodeType: "SymbolNode", type: "TypeName", value: value }}

primitiveTypeName = 'Edm.' ( 'Binary'
                           / 'Boolean'
                           / 'Byte'
                           / 'Date' 
                           / 'DateTimeOffset'
                           / 'Decimal'
                           / 'Double'
                           / 'Duration' 
                           / 'Guid' 
                           / 'Int16'
                           / 'Int32'
                           / 'Int64'
                           / 'ObjectId'
                           / 'SByte'
                           / 'Single'
                           / 'Stream'
                           / 'String'
                           / 'TimeOfDay'
                           / abstractSpatialTypeName ( concreteSpatialTypeName )? 
                           )
abstractSpatialTypeName = 'Geography'
                        / 'Geometry'
concreteSpatialTypeName = 'Collection'
                        / 'LineString'
                        / 'MultiLineString'
                        / 'MultiPoint'
                        / 'MultiPolygon'
                        / 'Point'
                        / 'Polygon'

odataIdentifier             = value:$(identifierLeadingCharacter identifierCharacter*) {return{nodeType: "SymbolNode",type: "Identifier", value: value }}
identifierLeadingCharacter  = ALPHA / "_"         
identifierCharacter         = ALPHA / "_" / DIGIT 
qualifiedEnumTypeName       = value:$(odataIdentifier ("." odataIdentifier)+) {return {nodeType: "ConstantNode",type: 'EnumTypeName', value:value}}
namespace     = namespacePart ( "." namespacePart )*
namespacePart = odataIdentifier
enumerationTypeName = odataIdentifier




/*
* 7. Literal Data Values
*/
// INT covers value ranges of sbyte, byte, int16, int32, int64
//left out geography and geometry stuff bcs probably not relevant
primitiveLiteral = nullValue {return constantNodeHelper("Null", null)}               
                 / booleanValue
                 / value:$guidValue {return constantNodeHelper("GUID",value)}
                 / value:$dateTimeOffsetValueInUrl {return constantNodeHelper("DateTimeOffsetValueInUrl",value)}
                 / value:$dateValue {return constantNodeHelper("DateValue",value)}
                 / value:$timeOfDayValueInUrl {return constantNodeHelper("TimeOfDayValueInUrl",value)}
                 / value:$decimalValue {return {nodeType: "ConstantNode", type: "Decimal", value:parseFloat(value)}}
                 / value:$INT {return{nodeType: "ConstantNode", type: "Integer", value:parseInt(value)}} 
                 / value:$duration {return constantNodeHelper("Duration", value)}
                 / value:string {return{nodeType: "ConstantNode", type: "String", value: value}}                     
                 / enum
                 / value:$binary {return constantNodeHelper("Binary",value)}    
                 / geographyLiteral
                 / geometryLiteral
                  
                 geographyLiteral = value:(geographyCollection 
                 / geographyLineString 
                 / geographyMultiLineString 
                 / geographyMultiPoint 
                 / geographyMultiPolygon 
                 / geographyPoint 
                 / geographyPolygon) {return {nodeType: "ConstantSpatialNode", abstractSpatialType: "Geography", value: value}}

                 geometryLiteral =  value:(geometryCollection 
                 / geometryLineString 
                 / geometryMultiLineString 
                 / geometryMultiPoint 
                 / geometryMultiPolygon 
                 / geometryPoint 
                 / geometryPolygon ) {return {nodeType: "ConstantSpatialNode", abstractSpatialType: "Geometry", value: value}}             


nullValue = 'null' 
booleanValue = value:$("true" / "false") {return {nodeType: "ConstantNode", type: "Boolean", value: value === "true" ? true : false}}
//peggyjs does not support specific repetition
guidValue = HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG "-" HEXDIG HEXDIG HEXDIG HEXDIG "-" HEXDIG HEXDIG HEXDIG HEXDIG "-" HEXDIG HEXDIG HEXDIG HEXDIG "-" HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG  

dateTimeOffsetValueInUrl = year "-" month "-" day "T" timeOfDayValueInUrl ( "Z" / SIGN hour COLON minute )
dateValue = year "-" month "-" day
timeOfDayValueInUrl = hour COLON minute ( COLON second ( "." fractionalSeconds )? )?

    year  = ( "-" )? ( "0" DIGIT+ / oneToNine DIGIT+ )    
    month = "0" oneToNine
        / "1" ( "0" / "1" / "2" )
    day   = "0" oneToNine
        / ( "1" / "2" ) DIGIT
        / "3" ( "0" / "1" )
    hour   = ( "0" / "1" ) DIGIT
        / "2" ( "0" / "1" / "2" / "3" ) 
    minute = zeroToFiftyNine
    second = zeroToFiftyNine / "60"

    oneToNine       = "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" 
    zeroToFiftyNine = ( "0" / "1" / "2" / "3" / "4" / "5" ) DIGIT
    fractionalSeconds = DIGIT+

//decimalValue also covers doubleValue, singleValue
decimalValue = ( SIGN )? DIGIT+ ( "." DIGIT+ ) ( "e" ( SIGN )? DIGIT+ )? / nanInfinity
    nanInfinity  = 'NaN' / '-INF' / 'INF'

string           = SQUOTE string:$( SQUOTE_in_string / [^'] )* SQUOTE {return string}
    SQUOTE_in_string = SQUOTE SQUOTE

duration      = ( "duration" )? SQUOTE durationValue SQUOTE
    durationValue = ( SIGN )? "P" ( DIGIT+ "D" )? ( "T" ( DIGIT+ "H" )? ( DIGIT+ "M" )? ( DIGIT+ ( "." DIGIT+ )? "S" )? )?

enum            = enumTypeName:$( qualifiedEnumTypeName )? SQUOTE enumValue:$enumValue SQUOTE {return enumTypeName ? {nodeType: 'EnumValueNode', type: 'EnumValue', enumTypeName: enumTypeName, enumValue: enumValue} : {nodeType: 'EnumValueNode', type: 'EnumValue', enumValue: enumValue}}
    enumValue       = singleEnumValue ( COMMA singleEnumValue )*
    singleEnumValue = enumerationMember / enumMemberValue
    enumMemberValue = INT
    enumerationMember   = odataIdentifier

binary      = "binary" SQUOTE binaryValue SQUOTE
    binaryValue = (base64char base64char base64char base64char)* ( base64b16  / base64b8 )?
    base64b16   = base64char base64char ( 'A' / 'E' / 'I' / 'M' / 'Q' / 'U' / 'Y' / 'c' / 'g' / 'k' / 'o' / 's' / 'w' / '0' / '4' / '8' )   ( "=" )?
    base64b8    = base64char ( 'A' / 'Q' / 'g' / 'w' ) ( "==" )?
    base64char  = ALPHA / DIGIT / "-" / "_"

geographyCollection   = geographyPrefix SQUOTE node:fullCollectionLiteral SQUOTE {return node}
fullCollectionLiteral = srid: sridLiteral node:collectionLiteral {return {...srid, ...node}}
collectionLiteral     = "Collection(" head:geoLiteral tail:( COMMA @geoLiteral )* CLOSE {return {nodeType: "CollectionNode",collection: [head, ...tail]}}
geoLiteral            = collectionLiteral
                      / lineStringLiteral
                      / multiPointLiteral
                      / multiLineStringLiteral
                      / multiPolygonLiteral
                      / pointLiteral
                      / polygonLiteral

geographyLineString   = geographyPrefix SQUOTE node:fullLineStringLiteral SQUOTE {return node}
fullLineStringLiteral = srid:sridLiteral node:lineStringLiteral {return {...node, ...srid}}
lineStringLiteral     = "LineString" node:lineStringData {return node}
lineStringData        = OPEN positions:(head:positionLiteral tail:( COMMA @positionLiteral )* {return [head, ...tail]}) CLOSE {return {nodeType: "LineStringNode", positions: positions}}

geographyMultiLineString   = geographyPrefix SQUOTE node:fullMultiLineStringLiteral SQUOTE {return node}
fullMultiLineStringLiteral = srid:sridLiteral node:multiLineStringLiteral {return {...srid, ...node}}
multiLineStringLiteral     = "MultiLineString(" lineStrings:( head:lineStringData tail:( COMMA @lineStringData )* {return [head, ...tail]} )? CLOSE {return {nodeType: "MultiLineStringNode", lineStrings: lineStrings}}

geographyMultiPoint   = geographyPrefix SQUOTE node:fullMultiPointLiteral SQUOTE {return node}
fullMultiPointLiteral = srid:sridLiteral node:multiPointLiteral {return {...srid, ...node}}
multiPointLiteral     = "MultiPoint("  points:( head:pointData tail:( COMMA @pointData )* {return [head, ...tail]})? CLOSE {return {nodeType: "MultiPointNode", points: points ? points: []}}

geographyMultiPolygon   = geographyPrefix SQUOTE node:fullMultiPolygonLiteral SQUOTE {return node}
fullMultiPolygonLiteral = srid:sridLiteral node:multiPolygonLiteral {return {...srid, ...node}}
multiPolygonLiteral     = "MultiPolygon(" polygons:( head:polygonData tail:( COMMA @polygonData )* {return [head, ...tail]} )? CLOSE {return {nodeType: "MultiPolygonNode", polygons: polygons? polygons: []}}

geographyPoint   = geographyPrefix SQUOTE node:fullPointLiteral SQUOTE {return node}
fullPointLiteral = srid:sridLiteral node:pointLiteral {return {...srid, ...node}}
sridLiteral      = "SRID" EQ srid:$DIGIT+ SEMI {return {srid: parseInt(srid)}}
pointLiteral     ="Point" point:pointData {return {nodeType: "PointNode", point: point}}
pointData        = OPEN pos:positionLiteral CLOSE {return pos}
positionLiteral  = lon:$(decimalValue/INT) SP lat:$(decimalValue/INT) alt:( SP @$(decimalValue/INT) )? lrm:( SP @$(decimalValue/INT) )?  {return {lon:Number(lon), lat:Number(lat), alt: Number(alt), lrm: Number(lrm)}}

geographyPolygon   = geographyPrefix SQUOTE node:fullPolygonLiteral SQUOTE {return node}
fullPolygonLiteral = srid:sridLiteral node:polygonLiteral {return {...srid, ...node}}
polygonLiteral     = "Polygon" node:polygonData {return node}
polygonData        = OPEN head:ringLiteral tail:( COMMA @ringLiteral )* CLOSE {return {nodeType: "PolygonNode", rings: [head, ...tail]}}
ringLiteral        = OPEN head:positionLiteral tail:( COMMA @positionLiteral )* CLOSE {return {positions:[head, ...tail]}}

geometryCollection      = geometryPrefix SQUOTE node:fullCollectionLiteral      SQUOTE {return node}
geometryLineString      = geometryPrefix SQUOTE node:fullLineStringLiteral      SQUOTE {return node}
geometryMultiLineString = geometryPrefix SQUOTE node:fullMultiLineStringLiteral SQUOTE {return node}
geometryMultiPoint      = geometryPrefix SQUOTE node:fullMultiPointLiteral      SQUOTE {return node}
geometryMultiPolygon    = geometryPrefix SQUOTE node:fullMultiPolygonLiteral    SQUOTE {return node}
geometryPoint           = geometryPrefix SQUOTE node:fullPointLiteral           SQUOTE {return node}
geometryPolygon         = geometryPrefix SQUOTE node:fullPolygonLiteral         SQUOTE {return node}

geographyPrefix = "geography"
geometryPrefix  = "geometry" 


/*
* 9. Punctuation
*/

//rws = required whitespace, bws = bad whitespace
RWS = ( SP / HTAB / "%20" / "%09" )+
BWS =  ( SP / HTAB / "%20" / "%09" )* 

AT     = "@" / "%40"
COLON  = ":" / "%3A"
COMMA  = "," / "%2C"
EQ     = "="
// the # character is not allowed in the query part
HASH   = "%23" 
SIGN   = "+" / "%2B" / "-"
SEMI   = ";" / "%3B"
STAR   = "*" / "%2A"
SQUOTE = "'" / "%27"

OPEN  = "(" / "%28"
CLOSE = ")" / "%29"

/*
* abnf core rules (vchar missing)
*/
ALPHA  = [a-zA-Z] / "ä" / "ö" / "ü" / "Ä" / "Ö" / "Ü" / "ß"
DIGIT  = [0-9] 
HEXDIG = DIGIT / A_to_F
A_to_F = "A" / "B" / "C" / "D" / "E" / "F" 
DQUOTE = '"'
SP     = ' '
HTAB   = '  '
`;

export const rawParser = peggy.generate(filterGrammar, { trace: false });
const myParser = peggy.generate(filterGrammar, { trace: false });

export default {
    /**
     * Parser for filter expressions
     * @param expr filter expression as string
     * @param options options for peggy.js parser
     * @example filterParser.parse("Name eq 'Max'");
     * @returns Abstract Syntax Tree (AST) of type FilterNode
     */
    parse: (
        expr: string,
        options?: peggy.ParserOptions | undefined
    ): FilterNode => {
        try {
            expr = filterExpressionPreProc(expr);
            let output = myParser.parse(expr, options);
            output = astPostProc(output);
            return output;
        } catch (e) {
            throw getOdatafyParserError(
                'malformed filter expression',
                OdatafyQueryOptions.Filter
            );
        }
    }
};
