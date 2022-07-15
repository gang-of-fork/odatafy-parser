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
    describe('official url-convention examples', () => {
        [{
            type: "Example 127",
            input: "Rating,ReleaseDate",
            expectedAST: <SelectNode>{
                nodeType: "SelectNode",
                value: [{
                    nodeType: "SelectIdentifierNode",
                    value: "Rating",
                },
                {
                    nodeType: "SelectIdentifierNode",
                    value: "ReleaseDate",
                }]
            }
        },
        {
            type: "Example 128",
            input: "*",
            expectedAST: <SelectNode>{
                nodeType: "SelectNode",
                value: []
            }
        },
        {
            type: "Example 130",
            input: "Namespace.PreferredSupplier/AccountRepresentative,Address/Street,Address/Namespace.AddressWithLocation/Location",
            expectedAST: <SelectNode>{
                nodeType: "SelectNode",
                value: [{
                    nodeType: "SelectPathNode",
                    value: [{
                        nodeType: "SelectIdentifierNode",
                        value: "Namespace.PreferredSupplier",
                    },
                    {
                        nodeType: "SelectIdentifierNode",
                        value: "AccountRepresentative",
                    }]
                },
                {
                    nodeType: "SelectPathNode",
                    value: [{
                        nodeType: "SelectIdentifierNode",
                        value: "Address",
                    },
                    {
                        nodeType: "SelectIdentifierNode",
                        value: "Street",
                    }]
                },
                {
                    nodeType: "SelectPathNode",
                    value: [{
                        nodeType: "SelectIdentifierNode",
                        value: "Address",
                    },
                    {
                        nodeType: "SelectIdentifierNode",
                        value: "Namespace.AddressWithLocation",
                    },
                    {
                        nodeType: "SelectIdentifierNode",
                        value: "Location",
                    }]
                }]
            }
        },
        
        {
            type: "Example 131",
            input: "Addresses($filter=startswith(City,'H');$top=5;$orderby=Country/Name,City,Street)",
            expectedAST: <SelectNode>{

            }
        },
        /*
        {
            type: "Example 132",
            input: "ID,Model.ActionName,Model2.*",
            expectedAST: <SelectNode>{

            }
        }
    */].forEach(testParsingAndAST)
    });

    describe('additional tests', () => {
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
})

