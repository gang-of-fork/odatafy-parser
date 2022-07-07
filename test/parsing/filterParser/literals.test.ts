import assert from 'assert';
import filterParser from '../../../src/parsing/filterParser';

function testParsingAndAST(testcase: { type: string, input: string, expectedAST: any }) {
    it(`should parse ${testcase.type}: ${testcase.input}`, () => {
        let ast = filterParser.parse(testcase.input)
        assert.deepStrictEqual(ast, testcase.expectedAST)
    })
}


/* 
nullValue                  ; plain values up to int64Value
                 X booleanValue 
                 X guidValue 
                 X dateTimeOffsetValueInUrl 
                 X dateValue
                 X timeOfDayValueInUrl
                 X decimalValue 
                 X Integer
                 X string                     ; single-quoted
                 ! duration
                 ! enum
                 X binary                     ; all others are quoted and prefixed 
                 / geographyCollection 
                 / geographyLineString 
                 / geographyMultiLineString 
                 / geographyMultiPoint 
                 / geographyMultiPolygon 
                 / geographyPoint 
                 / geographyPolygon 
                 / geometryCollection 
                 / geometryLineString 
                 / geometryMultiLineString 
                 / geometryMultiPoint 
                 / geometryMultiPolygon 
                 / geometryPoint 
                 / geometryPolygon
*/
describe('Primitive Literal Tests', () => {
    [
        {
            abnfType: "Null",
            value: null
        },
        {
            abnfType: "Boolean",
            value: true
        },
        {
            abnfType: "Boolean",
            value: false
        },
        {
            abnfType: "GUID",
            value: "550E8400-E29B-11D4-A716-446655440000"
        },
        {
            abnfType: "DateTimeOffsetValueInUrl",
            value: "2022-07-02T13:10:20.0000Z"
        },
        {
            abnfType: "DateValue",
            value: "2022-07-02"
        },
        {
            abnfType: "TimeOfDayValueInUrl",
            value: "13:12:01.0000"
        },
        {
            abnfType: "TimeOfDayValueInUrl",
            value: "13:12:01"
        },
        {
            abnfType: "TimeOfDayValueInUrl",
            value: "13:12"
        },
        {
            abnfType: "Decimal",
            value: 1.2
        },
        {
            abnfType: "Decimal",
            value: -1.2
        },
        {
            abnfType: "Integer",
            value: 5
        }, {
            abnfType: "Integer",
            value: -5
        },
        {
            abnfType: "String",
            value: "'Hello World!'",
            expected: "Hello World!"
        },
        {
            abnfType: "Duration",
            value: "duration'P1DT12H3M25S'",
        },
        {
            abnfType: "Duration",
            value: "'P1DT12H3M25S'",
        },
        {
            abnfType: "Binary",
            value: "binary'A123AA=='"
        }].forEach(testcase => {
            testParsingAndAST({
                type: `simple eq expression with ${testcase.abnfType} (${testcase.value})`, input: `Identifier eq ${testcase.value}`, expectedAST: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Identifier"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: testcase.abnfType,
                        value: testcase.expected ? testcase.expected : testcase.value
                    }
                }
            })
        })
    testParsingAndAST({
        type: "simple eq expression with enumValue (namespace.EnumName'Value')",
        input: "Identifier eq namespace.EnumName'Value'",
        expectedAST: {
            nodeType: "OperatorNode",
            op: "eq",
            left: {
                nodeType: "SymbolNode",
                type: "Identifier",
                value: "Identifier"
            },
            right: {
                nodeType: "EnumValueNode",
                type: "EnumValue",
                enumTypeName: "namespace.EnumName",
                enumValue: "Value"
            }
        }

    })
})

describe('complex literal tests', () => {
    [{
        type: "simple eq expression with Object-Expression",
        input: "Identifier eq {\"prop1\": \"value1\", \"prop2\": \"value2\"}",
        expectedAST: {
            nodeType: "OperatorNode",
            op: "eq",
            left: {
                nodeType: "SymbolNode",
                type: "Identifier",
                value: "Identifier"
            },
            right: {
                nodeType: "ConstantNode",
                type: "Object",
                value: {
                    prop1: 'value1',
                    prop2: 'value2'
                }
            }
        }
    },
    {
        type: "simple eq expression with nested Object-Expression",
        input: "Identifier eq {\"prop1\":{\"prop2\": \"value2\"}}",
        expectedAST: {
            nodeType: "OperatorNode",
            op: "eq",
            left: {
                nodeType: "SymbolNode",
                type: "Identifier",
                value: "Identifier"
            },
            right: {
                nodeType: "ConstantNode",
                type: "Object",
                value: {
                    prop1: {
                        prop2: 'value2'
                    }
                }
            }
        }
    },
    {
        type: "simple eq expression with Array-expression",
        input: "Identifier eq [\"1\", \"2\", \"3\"]",
        expectedAST: {
            nodeType: "OperatorNode",
            op: "eq",
            left: {
                nodeType: "SymbolNode",
                type: "Identifier",
                value: "Identifier"
            },
            right: {
                nodeType: "ConstantNode",
                type: "Array",
                value: ["1", "2", "3"]
            }
        }
    },
    {
        type: "simple eq expression with Object in Array-expression",
        input: "Identifier eq [{\"prop1\":\"value1\"}]",
        expectedAST: {
            nodeType: "OperatorNode",
            op: "eq",
            left: {
                nodeType: "SymbolNode",
                type: "Identifier",
                value: "Identifier"
            },
            right: {
                nodeType: "ConstantNode",
                type: "Array",
                value: [{ prop1: "value1" }]
            }
        }
    },
    {
        type: "simple eq expression with member-expression",
        input: "Identifier eq Address/Name",
        expectedAST: {
            nodeType: "OperatorNode",
            op: "eq",
            left: {
                nodeType: "SymbolNode",
                type: "Identifier",
                value: "Identifier"
            },
            right: {
                nodeType: "SymbolNode",
                type: "MemberExpression",
                value: ["Address", "Name"]
            }
        }
    },
    /*
    keine Ahnung wofür man das benutzen soll"
    {
        type: "simple eq expression with rootExpression", 
        input: "Identifier eq ",
        expectedAST: {
            nodeType: "OperatorNode",
            op: "eq",
            left: {
                nodeType: "SymbolNode",
                type: "Identifier",
                value: "Identifier"
            },
            right: {
                
            }
        }
    }*/].forEach(testcase => testParsingAndAST(testcase))
})

