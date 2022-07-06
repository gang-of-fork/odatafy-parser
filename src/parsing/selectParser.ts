import peggy from 'peggy';


let selectParser = peggy.generate(`
select         = selectItem ( COMMA BWS selectItem )*
selectItem     = STAR
               / allOperationsInSchema 
               / ( ( qualifiedEntityTypeName / qualifiedComplexTypeName ) "/" )?
                 ( selectProperty
                 / qualifiedActionName  
                 / qualifiedFunctionName  
                 )
selectProperty = primitiveProperty  
               / primitiveColProperty 
               / navigationProperty
               / selectPath ( "/" selectProperty )?
selectPath     = ( complexProperty / complexColProperty ) ( "/" qualifiedComplexTypeName )? 

qualifiedEntityTypeName     = namespace "." entityTypeName
qualifiedComplexTypeName    = namespace "." complexTypeName

entityTypeName      = odataIdentifier
complexTypeName     = odataIdentifier

qualifiedActionName   = namespace "." action
qualifiedFunctionName = namespace "." function [ OPEN parameterNames CLOSE ]

action       = odataIdentifier

function = entityFunction 
         / entityColFunction 
         / complexFunction 
         / complexColFunction 
         / primitiveFunction 
         / primitiveColFunction
         
entityFunction       = odataIdentifier
entityColFunction    = odataIdentifier
complexFunction      = odataIdentifier
complexColFunction   = odataIdentifier
primitiveFunction    = odataIdentifier
primitiveColFunction = odataIdentifier

primitiveProperty       = primitiveKeyProperty / primitiveNonKeyProperty
primitiveKeyProperty    = odataIdentifier
primitiveNonKeyProperty = odataIdentifier
primitiveColProperty    = odataIdentifier
complexProperty         = odataIdentifier
complexColProperty      = odataIdentifier
streamProperty          = odataIdentifier

navigationProperty          = entityNavigationProperty / entityColNavigationProperty  
entityNavigationProperty    = odataIdentifier
entityColNavigationProperty = odataIdentifier

allOperationsInSchema = namespace "." STAR 
namespace     = namespacePart *( "." namespacePart )
namespacePart = odataIdentifier

odataIdentifier             = identifierLeadingCharacter identifierCharacter*
identifierLeadingCharacter  = ALPHA / "_"         
identifierCharacter         = ALPHA / "_" / DIGIT 

ALPHA  = [a-zA-Z] 
DIGIT  = [0-9] 
COMMA  = "," / "%2C"
STAR   = "*" / "%2A"
EQ     = "="

RWS = ( SP / HTAB / "%20" / "%09" )+
BWS =  ( SP / HTAB / "%20" / "%09" )* 
SP     = ' '
HTAB   = '  '
`)
export function parseSelect(expr: string) {
return selectParser.parse(expr);
}



