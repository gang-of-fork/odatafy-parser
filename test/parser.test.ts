import assert from "assert"
import { expandParser, parseODataUrl, oDataParseResult } from "../src/parser"
import { ConstantNodeTypes, NodeTypes, OperatorNodeOperators, OrderDirection, SearchItemTypes, SymbolNodeTypes } from "../src/types/nodes"

describe('public API tests', () => {
    describe('parseODataUrl()', () => {
        it('should parse ODataUrl correctly', () => {
            let url = "https://api.dualis-bot.robin-reyer.de/Users?compute=FirstName as Name&expand=Products&$filter=Name eq 'Sebastian'&orderby=Name asc&$search=Spengler&select=Name&$skip=1&top=1"
            let ast = parseODataUrl(url)
            let expectedAST:oDataParseResult = {
                compute: {
                    nodeType: NodeTypes.ComputeNode,
                    value: [{
                        nodeType: NodeTypes.ComputeItemNode,
                        commonExpr: {
                            nodeType: NodeTypes.SymbolNode,
                            type: SymbolNodeTypes.Identifier,
                            value: "FirstName"
                        },
                        computeIdentifier: "Name"
                    }]
                },
                expand: {
                    nodeType: NodeTypes.ExpandNode,
                    value: [{
                        nodeType: NodeTypes.ExpandIdentifierNode,
                        identifier: "Products"
                    }]
                },
                filter: {
                    nodeType: NodeTypes.OperatorNode,
                    op: OperatorNodeOperators.Eq,
                    left: {
                        nodeType: NodeTypes.SymbolNode,
                        type: SymbolNodeTypes.Identifier,
                        value: "Name"
                    },
                    right: {
                        nodeType: NodeTypes.ConstantNode,
                        type: ConstantNodeTypes.String,
                        value: "Sebastian"
                    }
                },
                orderby: {
                    nodeType: NodeTypes.OrderbyNode,
                    value: [{
                        nodeType: NodeTypes.OrderbyItemNode,
                        type: OrderDirection.Asc,
                        value: "Name"
                    }]
                },
                search: {
                    nodeType: NodeTypes.SearchItemNode,
                    type: SearchItemTypes.Word,
                    value: "Spengler"
                },
                select: {nodeType: NodeTypes.SelectNode,
                value: [{
                    nodeType: NodeTypes.SelectIdentifierNode,
                    value: "Name"
                }]},
                skip: 1,
                top: 1

            }
            assert.deepStrictEqual(ast,expectedAST)
        });

        it('should not parse url with duplicate queryoption', () => {
            let url = "https://api.dualis-bot.robin-reyer.de/Users?$skip=1&skip=1"
            assert.throws(() => {parseODataUrl(url)})
        })

        it('should only parse existing queryoptions', () => {
            let url = 'https://api.dualis-bot.robin-reyer.de/Users?$skip=1'
            let ast = parseODataUrl(url)
            let expectedAST:oDataParseResult = {
                skip: 1
            }
            assert.deepStrictEqual(ast, expectedAST)

            url = 'https://api.dualis-bot.robin-reyer.de/Users?$top=1'
            ast = parseODataUrl(url)
            expectedAST = {
                top: 1
            }
            assert.deepStrictEqual(ast, expectedAST)
        })
    })
})

expandParser.parse