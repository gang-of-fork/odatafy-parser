import assert from "assert"
import selectParser from "../../src/parsing/selectParser"
import { NodeTypes, SelectIdentifierFlags, SelectNode, SymbolNodeTypes } from "../../src/types/nodes"

function testParsingAndAST(testcase: { type: string, input: string, expectedAST: any }) {
    it(`should parse ${testcase.type}: ${testcase.input}`, () => {
        let ast = selectParser.parse(testcase.input)
        assert.deepStrictEqual(ast, testcase.expectedAST)
    })
}

//ADD test from https://github.com/oasis-tcs/odata-abnf/blob/main/abnf/odata-abnf-testcases.yaml line 2467 when all parsers are finished
describe('Select Parser tests', () => {
    describe('official url-convention examples', () => {
        [{
            type: "Example 127",
            input: "Rating,ReleaseDate",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                value: [{
                    nodeType: NodeTypes.SelectIdentifierNode,
                    value: "Rating",
                },
                {
                    nodeType: NodeTypes.SelectIdentifierNode,
                    value: "ReleaseDate",
                }]
            }
        },
        {
            type: "Example 128",
            input: "*",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                value: []
            }
        },
        {
            type: "Example 130",
            input: "Namespace.PreferredSupplier/AccountRepresentative,Address/Street,Address/Namespace.AddressWithLocation/Location",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                value: [{
                    nodeType: NodeTypes.SelectPathNode,
                    value: [{
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "Namespace.PreferredSupplier",
                    },
                    {
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "AccountRepresentative",
                    }]
                },
                {
                    nodeType: NodeTypes.SelectPathNode,
                    value: [{
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "Address",
                    },
                    {
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "Street",
                    }]
                },
                {
                    nodeType: NodeTypes.SelectPathNode,
                    value: [{
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "Address",
                    },
                    {
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "Namespace.AddressWithLocation",
                    },
                    {
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "Location",
                    }]
                }]
            }
        },
        {
            type: "Example 131",
            input: "Addresses($filter=startswith(City,'H');$top=5;$orderby=Country/Name,City,Street)",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                value: [
                    {
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "Addresses",
                        selectOptions: {
                            nodeType: NodeTypes.SelectOptionsNode,
                            value: {
                                filter: {
                                    nodeType: NodeTypes.FuncNode2Args,
                                    func: "startswith",
                                    args: [
                                        {
                                            nodeType: NodeTypes.SymbolNode,
                                            type: "Identifier",
                                            value: "City"
                                        },
                                        {
                                            nodeType: NodeTypes.ConstantNode,
                                            type: "String",
                                            value: "H"
                                        }
                                    ]
                                },
                                orderby: {
                                    nodeType: NodeTypes.OrderbyNode,
                                    value: [
                                        {
                                            nodeType: NodeTypes.OrderbyItemNode,
                                            type: "asc",
                                            value: "Country/Name"
                                        },
                                        {
                                            nodeType: NodeTypes.OrderbyItemNode,
                                            type: "asc",
                                            value: "City"
                                        },
                                        {
                                            nodeType: NodeTypes.OrderbyItemNode,
                                            type: "asc",
                                            value: "Street"
                                        }
                                    ]
                                },
                                top: 5
                            }
                        }
                    }
                ]

            }
        },

        {
            type: "Example 132",
            input: "ID,Model.ActionName,Model2.*",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                value: [{
                    nodeType: NodeTypes.SelectIdentifierNode,
                    value: "ID"
                },
                {
                    nodeType: NodeTypes.SelectIdentifierNode,
                    value: "Model.ActionName"
                },
                {
                    nodeType: NodeTypes.SelectIdentifierNode,
                    value: "Model2",
                    flag: SelectIdentifierFlags.AllOperationsInSchema
                }]
            }
        }
        ].forEach(testParsingAndAST)
    });

    describe('additional tests', () => {
        [{
            type: "select expression with 1 Item - odataIdentifier",
            input: "Name",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                value: [{
                    nodeType: NodeTypes.SelectIdentifierNode,
                    value: "Name",
                }]
            }

        },
        {
            type: "select expression with 1 Item - odataIdentifierWithNamespace",
            input: "namespace.Name",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                value: [{
                    nodeType: NodeTypes.SelectIdentifierNode,
                    value: "namespace.Name",
                }]
            }

        },
        {
            type: "select expression with 1 Item - Function",
            input: "namespace.function(arg)",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                value: [{
                    nodeType: NodeTypes.SelectFunctionNode,
                    func: "namespace.function",
                    args: [{
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "arg"
                    }]
                }]
            }

        },
        {
            type: "select expression with 1 Item - Path with odataIdentifiers",
            input: "Adresse/Name",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                value: [{
                    nodeType: NodeTypes.SelectPathNode,
                    value: [{
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "Adresse",
                    },
                    {
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "Name",
                    }]
                }]
            }

        },
        {
            type: "select expression with 1 Item - Path with odataIdentifiersWithNamespace",
            input: "namespace.Adresse/namespace.Name",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                value: [{
                    nodeType: NodeTypes.SelectPathNode,
                    value: [{
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "namespace.Adresse",
                    },
                    {
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "namespace.Name",
                    }]
                }]
            }

        },
        {
            type: "select expression with 1 Item - allOperationsInSchema",
            input: "Adresse.*",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                value: [{
                    nodeType: NodeTypes.SelectIdentifierNode,
                    value: "Adresse",
                    flag: SelectIdentifierFlags.AllOperationsInSchema
                }]
            }

        },
        {
            type: "select expression with 1 Item - Wildcard",
            input: "*",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                value: []
            }

        },
        {
            type: "select expression with multiple items",
            input: "Name, namespace.Adresse, Adresse/Name, namespace.Adresse/namespace.Name, Adresse.*",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                value: [{
                    nodeType: NodeTypes.SelectIdentifierNode,
                    value: "Name"
                },
                {
                    nodeType: NodeTypes.SelectIdentifierNode,
                    value: "namespace.Adresse"
                },
                {
                    nodeType: NodeTypes.SelectPathNode,
                    value: [{
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "Adresse",
                    },
                    {
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "Name",
                    }]
                },
                {
                    nodeType: NodeTypes.SelectPathNode,
                    value: [{
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "namespace.Adresse",
                    },
                    {
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "namespace.Name",
                    }]
                },
                {
                    nodeType: NodeTypes.SelectIdentifierNode,
                    value: "Adresse",
                    flag: SelectIdentifierFlags.AllOperationsInSchema
                }]
            }

        },
        {
            type: "select expression with annotation and options",
            input: "@Core.Messages($top=5)",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                value: [{
                    nodeType: NodeTypes.SelectIdentifierNode,
                    flag: SelectIdentifierFlags.Annotation,
                    value: "Core.Messages",
                    selectOptions: {
                        nodeType: NodeTypes.SelectOptionsNode,
                        value: {
                            top: 5
                        }
                    }
                }]
            }
        },
        {
            type: "select expression with annotation in path and options",
            input: "Address/@Core.Messages($top=5)",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                value: [{
                    nodeType: NodeTypes.SelectPathNode,
                    value: [{
                        nodeType: NodeTypes.SelectIdentifierNode,
                        value: "Address"
                    }, {
                        nodeType: NodeTypes.SelectIdentifierNode,
                        flag: SelectIdentifierFlags.Annotation,
                        value: "Core.Messages",
                        selectOptions: {
                            nodeType: NodeTypes.SelectOptionsNode,
                            value: {
                                top: 5
                            }
                        }
                    }]
                }]
            }
        },
        {
            type: "select expression with two annotations and options",
            input: "@Measures.Currency,@Core.MayImplement($top=2)",
            expectedAST: <SelectNode>{
                nodeType: NodeTypes.SelectNode,
                    value: [{
                        nodeType: NodeTypes.SelectIdentifierNode,
                        flag: SelectIdentifierFlags.Annotation,
                        value: "Measures.Currency"
                },
                {
                    nodeType: NodeTypes.SelectIdentifierNode,
                    flag: SelectIdentifierFlags.Annotation,
                    value: "Core.MayImplement",
                    selectOptions: {
                        nodeType: NodeTypes.SelectOptionsNode,
                        value: {
                            top: 2
                        }
                    }
                }]
            }
        },
    {
        type: "nested select expression",
        input: "Addresses($select=Street,City)",
        expectedAST: <SelectNode> {
            nodeType: NodeTypes.SelectNode,
            value: [
                {
                    nodeType: NodeTypes.SelectIdentifierNode,
                    value: "Addresses",
                    selectOptions: {
                        nodeType: NodeTypes.SelectOptionsNode,
                        value: {
                            select: {
                                nodeType: NodeTypes.SelectNode, 
                                value: [{
                                    nodeType: NodeTypes.SelectIdentifierNode,
                                    value: "Street"
                                },
                                {
                                    nodeType: NodeTypes.SelectIdentifierNode,
                                    value: "City"
                                }]
                            }
                        }
                    }
                }
            ]
        }
    },
    {
        type: "Expressions with select options for skip, count, expand, compute, !search(deactivated)",
        input: "Addresses($skip=0;$count=true;$expand=Addresses/Country;$compute=Name as LastName)",
        expectedAST: <SelectNode>{
            nodeType: NodeTypes.SelectNode,
            value: [
                {
                    nodeType: NodeTypes.SelectIdentifierNode,
                    value: "Addresses",
                    selectOptions: {
                        nodeType: NodeTypes.SelectOptionsNode,
                        value: {
                            skip: 0,
                            count: true,
                            expand: {
                                nodeType: NodeTypes.ExpandNode,
                                value: [{
                                    nodeType: NodeTypes.ExpandIdentifierNode,
                                    value: "Addresses/Country"
                                }]
                            },
                            compute: {
                              nodeType: NodeTypes.ComputeNode,
                              value: [{
                                nodeType: NodeTypes.ComputeItemNode,
                                commonExpr: {
                                    nodeType: NodeTypes.SymbolNode,
                                    type: SymbolNodeTypes.Identifier,
                                    value: "Name"
                                },
                                computeIdentifier: "LastName"
                              }]  
                            }
                        },
                    }
                }
            ]

        }
    },].forEach(testParsingAndAST)
    })
})

