import peggy from 'peggy';


let selectParser = peggy.generate(`
select         = head:selectItem tail:( COMMA BWS @selectItem )* {return{ nodeType: "SelectNode", value: [head, ...tail]}}
selectItem     = STAR 
               / allOperationsInSchema 
               / ( ( odataIdentifierWithNamespace ) "/" )?
                 ( selectProperty
                 / odataIdentifierWithNamespace  
                 / qualifiedFunctionName  
                 )

selectProperty = odataIdentifier  
               / selectPath ( "/" selectProperty )?
selectPath     = ( odataIdentifier ) ( "/" odataIdentifierWithNamespace )? 

odataIdentifierWithNamespace =  odataIdentifier ( "." odataIdentifier )+

qualifiedFunctionName = odataIdentifierWithNamespace ( OPEN parameterNames CLOSE )?

parameterNames = odataIdentifier ( COMMA odataIdentifier )*

allOperationsInSchema = odataIdentifier ( "." odataIdentifier )* "." STAR 


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



