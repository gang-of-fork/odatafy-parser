import assert from 'assert';
import filterParser from '../../../src/parsing/filterParser';

function testParsingAndAST(testcase: { type: string, input: string, expectedAST: any }) {
    it(`should parse ${testcase.type}: ${testcase.input}`, () => {
        let ast = filterParser.parse(testcase.input)
        assert.deepStrictEqual(ast, testcase.expectedAST)
    })
}



describe('filter-expressions with method calls', () => {
    describe('basic method calls', () => {
        describe('twoArgExpressions', () => {
            ["concat", "contains", "endswith", "indexof", "matchesPattern", "startswith", "geo.distance", "geo.intersects", "hassubset", "hassubsequence"].forEach(func => {
                testParsingAndAST({
                    type: `basic function expression with ${func}`,
                    input: `${func}(Identifier, 'Value')`,
                    expectedAST: {
                        nodeType: 'FuncNode2Args',
                        func: func,
                        args: [{
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "Identifier"
                        },
                        {
                            nodeType: "ConstantNode",
                            type: "String",
                            value: "Value"
                        }]

                    }
                })
            })
        });

        describe('oneArgExpressions', () => {
            ["length", "tolower", "toupper", "trim", "year", "month", "day", "hour", "minute", "second", "fractionalseconds", "totalseconds", "date", "time", "totaloffsetminutes", "round", "floor", "ceiling", "geo.length"].forEach(func => {
                testParsingAndAST({
                    type: `basic function expression with ${func}`,
                    input: `${func}(Identifier)`,
                    expectedAST: {
                        nodeType: 'FuncNode1Args',
                        func: func,
                        args: [{
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "Identifier"
                        }]

                    }
                })
            })
        });

        describe('zeroArgExpressions', () => {
            ["mindatetime", "maxdatetime", "now"].forEach(func => {
                testParsingAndAST({
                    type: `basic function expression with ${func}`,
                    input: `${func}()`,
                    expectedAST: {
                        nodeType: 'FuncNode0Args',
                        func: func
                    }
                })
            })
        });

        describe('variableArgExpressions', () => {
            [{
                type: "basic function expression with isof (1Arg)",
                input: "isof(NorthwindModel.BigOrder)",
                expectedAST: {
                    nodeType: "FuncNodeVarArgs",
                    func: "isof",
                    args: [
                        {
                            nodeType: "SymbolNode",
                            type: "TypeName",
                            value: "NorthwindModel.BigOrder"
                        }
                    ]
                }
            },
            {
                type: "basic function expression with isof (2Arg)",
                input: "isof(Customer,NorthwindModel.VIPCustomer)",
                expectedAST: {
                    nodeType: "FuncNodeVarArgs",
                    func: "isof",
                    args: [
                        {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "Customer"
                        },
                        {
                            nodeType: "SymbolNode",
                            type: "TypeName",
                            value: "NorthwindModel.VIPCustomer"
                        }
                    ]
                }
            },
            {
                type: "basic function expression with cast (1Arg)",
                input: "cast(NorthwindModel.BigOrder)",
                expectedAST: {
                    nodeType: "FuncNodeVarArgs",
                    func: "cast",
                    args: [
                        {
                            nodeType: "SymbolNode",
                            type: "TypeName",
                            value: "NorthwindModel.BigOrder"
                        }
                    ]
                }
            },
            {
                type: "basic function expression with cast (2Arg)",
                input: "cast(Customer,NorthwindModel.VIPCustomer)",
                expectedAST: {
                    nodeType: "FuncNodeVarArgs",
                    func: "cast",
                    args: [
                        {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "Customer"
                        },
                        {
                            nodeType: "SymbolNode",
                            type: "TypeName",
                            value: "NorthwindModel.VIPCustomer"
                        }
                    ]
                }
            },
            {
                type: "basic function expression with substring (2Arg)",
                input: "substring(CompanyName,1)",
                expectedAST: {
                    nodeType: "FuncNodeVarArgs",
                    func: "substring",
                    args: [
                        {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "CompanyName"
                        },
                        {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    ]
                }
            },
            {
                type: "basic function expression with substring (3Arg)",
                input: "substring(CompanyName,1,2)",
                expectedAST: {
                    nodeType: "FuncNodeVarArgs",
                    func: "substring",
                    args: [
                        {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "CompanyName"
                        },
                        {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        },
                        {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    ]
                }
            },
            {
                type: "basic function expression with case",
                input: "case(X gt 0:1,X lt 0:-1,true:0)",
                expectedAST: {
                    nodeType: "FuncNodeCase",
                    args: [
                        {
                            cond: {
                                nodeType: "OperatorNode",
                                op: "gt",
                                left: {
                                    nodeType: "SymbolNode",
                                    type: "Identifier",
                                    value: "X"
                                },
                                right: {
                                    nodeType: "ConstantNode",
                                    type: "Integer",
                                    value: 0
                                }
                            },
                            value: {
                                nodeType: "ConstantNode",
                                type: "Integer",
                                value: 1
                            }
                        },
                        {
                            cond: {
                                nodeType: "OperatorNode",
                                op: "lt",
                                left: {
                                    nodeType: "SymbolNode",
                                    type: "Identifier",
                                    value: "X"
                                },
                                right: {
                                    nodeType: "ConstantNode",
                                    type: "Integer",
                                    value: 0
                                }
                            },
                            value: {
                                nodeType: "ConstantNode",
                                type: "Integer",
                                value: -1
                            }
                        },
                        {
                            cond: {
                                nodeType: "ConstantNode",
                                type: "Boolean",
                                value: true
                            },
                            value: {
                                nodeType: "ConstantNode",
                                type: "Integer",
                                value: 0
                            }
                        }
                    ]
                }
            }].forEach(testcase => testParsingAndAST(testcase))
        })

    })

    describe('nested method Call', () => {
        [{
            type: "nested method Call",
            input: "contains(concat('Max', Lastname), Name)",
            expectedAST: {
                nodeType: "FuncNode2Args",
                func: "contains",
                args: [{
                    nodeType: "FuncNode2Args",
                    func: "concat",
                    args: [{
                        nodeType: "ConstantNode",
                        type: "String",
                        value: "Max"
                    },
                    {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Lastname"
                    }]
                },
                {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: "Name"
                }]
            }
        }]
    })

    describe('compareExpr with method calls', () => {
        [{
            type: "eq Expression with method on the left",
            input: "tolower('Max') eq Name",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "eq",
                left: {
                    nodeType: "FuncNode1Args",
                    func: "tolower",
                    args: [{
                        nodeType: "ConstantNode",
                        type: "String",
                        value: "Max"
                    }]
                },
                right: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: "Name"
                }
            }
        },
        {
            type: "ne Expression with method on the right",
            input: "Name ne tolower('Max')",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "ne",
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: "Name"
                },
                right: {
                    nodeType: "FuncNode1Args",
                    func: "tolower",
                    args: [{
                        nodeType: "ConstantNode",
                        type: "String",
                        value: "Max"
                    }]
                },
            }
        },
        {
            type: "eq Expression with method on the left and right",
            input: "tolower(Name) eq tolower('Max')",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "eq",
                left: {
                    nodeType: "FuncNode1Args",
                    func: "tolower",
                    args: [{
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Name"
                    }]
                },
                right: {
                    nodeType: "FuncNode1Args",
                    func: "tolower",
                    args: [{
                        nodeType: "ConstantNode",
                        type: "String",
                        value: "Max"
                    }]
                },
            }
        }].forEach(testcase => testParsingAndAST(testcase))
    })
    describe('mathExpr with method calls', () => {
        [{
            type: "mathExpression with method call",
            input: "indexof('a','Hallo') add 1",
            expectedAST: {
                nodeType: 'OperatorNode',
                op: 'add',
                left: {
                    nodeType: 'FuncNode2Args',
                    func: "indexof",
                    args: [{
                        nodeType: "ConstantNode",
                        type: "String",
                        value: "a"
                    },
                    {
                        nodeType: "ConstantNode",
                        type: "String",
                        value: "Hallo"
                    }]
                },
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer",
                    value: 1
                }
            }
        }]
    })
    describe('logicalExpr with method calls', () => {
        [{
            type: "and Expression with method on the left",
            input: "contains('Max', Name) and Alter eq 18",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "FuncNode2Args",
                    func: "contains",
                    args: [{
                        nodeType: "ConstantNode",
                        type: "String",
                        value: "Max"
                    },
                    {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Name"
                    }]
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Alter"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 18
                    }
                }
            }
        },
        {
            type: "and Expression with method on the right",
            input: "Alter eq 18 and contains('Max', Name)",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Alter"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 18
                    }
                },
                right: {
                    nodeType: "FuncNode2Args",
                    func: "contains",
                    args: [{
                        nodeType: "ConstantNode",
                        type: "String",
                        value: "Max"
                    },
                    {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Name"
                    }]
                },
            }
        },
        {
            type: "and Expression with method on the left and right",
            input: "contains('Mustermann', Lastname) and contains('Max', Name)",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "FuncNode2Args",
                    func: "contains",
                    args: [{
                        nodeType: "ConstantNode",
                        type: "String",
                        value: "Mustermann"
                    },
                    {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Lastname"
                    }]
                },
                right: {
                    nodeType: "FuncNode2Args",
                    func: "contains",
                    args: [{
                        nodeType: "ConstantNode",
                        type: "String",
                        value: "Max"
                    },
                    {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Name"
                    }]
                },
            }
        },
        {
            type: "method with Object as Argument",
            input: "length({\"prop\": \"value\"})",
            expectedAST: {
                nodeType: "FuncNode1Args",
                func: "length",
                args: [{
                    nodeType: "ConstantNode",
                    type: "Object",
                    value: {
                        prop: "value"
                    }
                }]
            }
        },
        {
            type: "method with Array as Argument",
            input: "length([\"1\",2,null])",
            expectedAST: {
                nodeType: "FuncNode1Args",
                func: "length",
                args: [{
                    nodeType: "ConstantNode",
                    type: "Array",
                    value: ["1", 2, null]
                }
                ]
            }
        },
        {
            type: "method with Geometry as Argument",
            input: "geo.intersects(geometry'SRID=0;Point(142.164.1)',geometry'SRID=0;Polygon((1 1,1 1),(1 1,2 2,3 3,1 1))'",
            //TODO
            expectedAST: {}
        },
    ].forEach(testcase => testParsingAndAST(testcase))
    })

})
