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
selectProperty = odataIdentifier  
               / selectPath ( "/" selectProperty )?
selectPath     = ( odataIdentifier ) ( "/" qualifiedComplexTypeName )? 

qualifiedEntityTypeName     = namespace "." odataIdentifier
qualifiedComplexTypeName    = namespace "." odataIdentifier

qualifiedActionName   = namespace "." odataIdentifier
qualifiedFunctionName = namespace "." odataIdentifier ( OPEN parameterNames CLOSE )?

parameterNames = odataIdentifier ( COMMA odataIdentifier )*

allOperationsInSchema = namespace "." STAR 
namespace     = odataIdentifier *( "." odataIdentifier )

odataIdentifier             = identifierLeadingCharacter identifierCharacter*
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
export function parseSelect(expr: string) {
    return selectParser.parse(expr);
}

export default {
    parse: parseSelect
}



