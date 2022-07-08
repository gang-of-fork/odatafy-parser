import assert from "assert"
import selectParser from "../../src/parsing/selectParser"
import { SelectNode } from "../../src/types/nodes"

function testParsingAndAST(testcase: { type: string, input: string, expectedAST: any }) {
    it(`should parse ${testcase.type}: ${testcase.input}`, () => {
        let ast = selectParser.parse(testcase.input)
        assert.deepStrictEqual(ast, testcase.expectedAST)
    })
}

describe('Select Parser tests', () => {
    [{
        type: "select expression with 1 Item - odataIdentifier",
        input: "Name",
        expectedAST: <SelectNode>{
            nodeType: "SelectNode",
            value: [{
                nodeType: "SelectIdentifierNode",
                value: "Name",
            }]
        }

    },
    {
        type: "select expression with 1 Item - odataIdentifierWithNamespace",
        input: "namespace.Name",
        expectedAST: <SelectNode>{
            nodeType: "SelectNode",
            value: [{
                nodeType: "SelectIdentifierNode",
                value: "namespace.Name",
            }]
        }

    },
    {
        type: "select expression with 1 Item - Function",
        input: "namespace.function(arg)",
        expectedAST: <SelectNode>{
            nodeType: "SelectNode",
            value: [{
                nodeType: "SelectFunctionNode",
                func: "namespace.function",
                args: [{
                    nodeType: "SelectIdentifierNode",
                    value: "arg"
                }]
            }]
        }

    },
    {
        type: "select expression with 1 Item - Path with odataIdentifiers",
        input: "Adresse/Name",
        expectedAST: <SelectNode>{
            nodeType: "SelectNode",
            value: [{
                nodeType: "SelectPathNode",
                value: [{
                    nodeType: "SelectIdentifierNode",
                    value: "Adresse",
                },
                {
                    nodeType: "SelectIdentifierNode",
                    value: "Name",
                }]
            }]
        }

    },
    {
        type: "select expression with 1 Item - Path with odataIdentifiersWithNamespace",
        input: "namespace.Adresse/namespace.Name",
        expectedAST: <SelectNode>{
            nodeType: "SelectNode",
            value: [{
                nodeType: "SelectPathNode",
                value: [{
                    nodeType: "SelectIdentifierNode",
                    value: "namespace.Adresse",
                },
                {
                    nodeType: "SelectIdentifierNode",
                    value: "namespace.Name",
                }]
            }]
        }

    },
    {
        type: "select expression with 1 Item - allOperationsInSchema",
        input: "Adresse.*",
        expectedAST: <SelectNode>{
            nodeType: "SelectNode",
            value: [{
                nodeType: "SelectIdentifierNode",
                value: "Adresse",
                isWildcard: true
            }]
        }

    },
    {
        type: "select expression with 1 Item - Wildcard",
        input: "*",
        expectedAST: <SelectNode>{
            nodeType: "SelectNode",
            value: []
        }

    },
    {
        type: "select expression with multiple items",
        input: "Name, namespace.Adresse, Adresse/Name, namespace.Adresse/namespace.Name, Adresse.*",
        expectedAST: <SelectNode>{
            nodeType: "SelectNode",
            value: [{
                nodeType: "SelectIdentifierNode",
                value: "Name"
            },
            {
                nodeType: "SelectIdentifierNode",
                value: "namespace.Adresse"
            },
            {
                nodeType: "SelectPathNode",
                value: [{
                    nodeType: "SelectIdentifierNode",
                    value: "Adresse",
                },
                {
                    nodeType: "SelectIdentifierNode",
                    value: "Name",
                }]
            },
            {
                nodeType: "SelectPathNode",
                value: [{
                    nodeType: "SelectIdentifierNode",
                    value: "namespace.Adresse",
                },
                {
                    nodeType: "SelectIdentifierNode",
                    value: "namespace.Name",
                }]
            },
            {
                nodeType: "SelectIdentifierNode",
                value: "Adresse",
                isWildcard: true
            }]
        }

    }].forEach(testParsingAndAST)
})

