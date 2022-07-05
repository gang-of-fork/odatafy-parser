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
        },].forEach(testcase => testParsingAndAST(testcase))
    })

})
