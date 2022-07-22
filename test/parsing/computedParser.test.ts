import assert from "assert"
import computedParser from "../../src/parsing/computedParser"
import { NodeTypes } from "../../src/types/nodes"

function testParsingAndAST(testcase: { type: string, input: string, expectedAST: any }) {
    it(`should parse ${testcase.type}: ${testcase.input}`, () => {
        let ast = computedParser.parse(testcase.input)
        assert.deepStrictEqual(ast, testcase.expectedAST)
    })
}

describe('computedParser tests', () => {
    [{
        type: "computed Expression with Identifier",
        input: "Name as LastName",
        expectedAST: {
            nodeType: "ComputedNode",
            value: [
                {
                    nodeType: NodeTypes.ComputedItemNode,
                    commonExpr: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Name"
                    },
                    computedIdentifier: "LastName"
                }
            ]
        }
    },
    {
        type: "computed Expression with MathExpression",
        input: "Age add 1 as NewAge",
        expectedAST: {
            nodeType: "ComputedNode",
            value: [
                {
                    nodeType: NodeTypes.ComputedItemNode,
                    commonExpr: {
                        nodeType: "OperatorNode",
                        op: "add",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "Age"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    computedIdentifier: "NewAge"
                }
            ]
        }
    },
    {
        type: "computed Expression with FunctionCall",
        input: "concat(Name,'Petersen') as LastName",
        expectedAST: {
            nodeType: "ComputedNode",
            value: [
                {
                    nodeType: NodeTypes.ComputedItemNode,
                    commonExpr: {
                        nodeType: "FuncNode2Args",
                        func: "concat",
                        args: [
                            {
                                nodeType: "SymbolNode",
                                type: "Identifier",
                                value: "Name"
                            },
                            {
                                nodeType: "ConstantNode",
                                type: "String",
                                value: "Petersen"
                            }
                        ]
                    },
                    computedIdentifier: "LastName"
                }
            ]
        }
    },
    {
        type: "computed Expression with filterExpression",
        input: "Age eq 18 as isOfLegalAge",
        expectedAST: {
            nodeType: "ComputedNode",
            value: [
                {
                    nodeType: NodeTypes.ComputedItemNode,
                    commonExpr: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            "nodeType": "SymbolNode",
                            "type": "Identifier",
                            "value": "Age"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 18
                        }
                    },
                    computedIdentifier: "isOfLegalAge"
                }
            ]
        }
    },
    {
        type: "multiple computedExpressions",
        input: "Age as Alter,Name as LastName",
        expectedAST: {
            nodeType: "ComputedNode",
            value: [
                {
                    nodeType: NodeTypes.ComputedItemNode,
                    commonExpr: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Age"
                    },
                    computedIdentifier: "Alter"
                },
                {
                    nodeType: NodeTypes.ComputedItemNode,
                    commonExpr: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Name"
                    },
                    computedIdentifier: "LastName"
                }
            ]
        }
    }].forEach(testcase => testParsingAndAST(testcase))
})


