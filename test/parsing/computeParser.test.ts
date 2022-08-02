import assert from "assert"
import computeParser from "../../src/parsing/computeParser"
import { NodeTypes } from "../../src/types/nodes"

function testParsingAndAST(testcase: { type: string, input: string, expectedAST: any }) {
    it(`should parse ${testcase.type}: ${testcase.input}`, () => {
        let ast = computeParser.parse(testcase.input)
        assert.deepStrictEqual(ast, testcase.expectedAST)
    })
}

describe('computeParser tests', () => {
    [{
        type: "compute Expression with Identifier",
        input: "Name as LastName",
        expectedAST: {
            nodeType: "computeNode",
            value: [
                {
                    nodeType: NodeTypes.computeItemNode,
                    commonExpr: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Name"
                    },
                    computeIdentifier: "LastName"
                }
            ]
        }
    },
    {
        type: "compute Expression with MathExpression",
        input: "Age add 1 as NewAge",
        expectedAST: {
            nodeType: "computeNode",
            value: [
                {
                    nodeType: NodeTypes.computeItemNode,
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
                    computeIdentifier: "NewAge"
                }
            ]
        }
    },
    {
        type: "compute Expression with FunctionCall",
        input: "concat(Name,'Petersen') as LastName",
        expectedAST: {
            nodeType: "computeNode",
            value: [
                {
                    nodeType: NodeTypes.computeItemNode,
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
                    computeIdentifier: "LastName"
                }
            ]
        }
    },
    {
        type: "compute Expression with filterExpression",
        input: "Age eq 18 as isOfLegalAge",
        expectedAST: {
            nodeType: "computeNode",
            value: [
                {
                    nodeType: NodeTypes.computeItemNode,
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
                    computeIdentifier: "isOfLegalAge"
                }
            ]
        }
    },
    {
        type: "multiple computeExpressions",
        input: "Age as Alter,Name as LastName",
        expectedAST: {
            nodeType: "computeNode",
            value: [
                {
                    nodeType: NodeTypes.computeItemNode,
                    commonExpr: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Age"
                    },
                    computeIdentifier: "Alter"
                },
                {
                    nodeType: NodeTypes.computeItemNode,
                    commonExpr: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Name"
                    },
                    computeIdentifier: "LastName"
                }
            ]
        }
    }].forEach(testcase => testParsingAndAST(testcase))
})


