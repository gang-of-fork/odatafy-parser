import assert from "assert"
import orderbyParser from "../../src/parsing/orderbyParser"
import { NodeTypes, OrderbyNode } from "../../src/types/nodes"

function testParsingAndAST(testcase: { type: string, input: string, expectedAST: any }) {
    it(`should parse ${testcase.type}: ${testcase.input}`, () => {
        let ast = orderbyParser.parse(testcase.input)
        assert.deepStrictEqual(ast, testcase.expectedAST)
    })
}

describe('Orderby Parser tests', () => {
    [{
        type: "single default asc",
        input: "Country/Name",
        expectedAST: <OrderbyNode>{
            nodeType: NodeTypes.OrderbyNode,
            value: [
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    type: "asc",
                    value: "Country/Name"
                }
            ]
        }
    },
    {
        type: "multi default asc",
        input: "Country/Name,City,Street",
        expectedAST: <OrderbyNode>{
            nodeType: NodeTypes.OrderbyNode,
            value: [
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    type: "asc",
                    value: "Country/Name"
                },
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    "type": "asc",
                    "value": "City"
                },
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    "type": "asc",
                    "value": "Street"
                }
            ]
        }
    },
    {
        type: "single specified asc",
        input: "Country/Name asc",
        expectedAST: <OrderbyNode>{
            nodeType: NodeTypes.OrderbyNode,
            value: [
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    type: "asc",
                    value: "Country/Name"
                }
            ]
        }
    },
    {
        type: "multi specified asc",
        input: "Country/Name asc,City asc,Street asc",
        expectedAST: <OrderbyNode>{
            nodeType: NodeTypes.OrderbyNode,
            value: [
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    type: "asc",
                    value: "Country/Name"
                },
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    "type": "asc",
                    "value": "City"
                },
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    "type": "asc",
                    "value": "Street"
                }
            ]
        }
    },
    {
        type: "single specified desc",
        input: "Country/Name desc",
        expectedAST: <OrderbyNode>{
            nodeType: NodeTypes.OrderbyNode,
            value: [
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    type: "desc",
                    value: "Country/Name"
                }
            ]
        }
    },
    {
        type: "multi specified desc",
        input: "Country/Name desc,City desc,Street desc",
        expectedAST: <OrderbyNode>{
            nodeType: NodeTypes.OrderbyNode,
            value: [
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    type: "desc",
                    value: "Country/Name"
                },
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    "type": "desc",
                    "value": "City"
                },
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    "type": "desc",
                    "value": "Street"
                }
            ]
        }
    },
    {
        type: "default asc and specified desc",
        input: "Country/Name,Street desc",
        expectedAST: <OrderbyNode>{
            nodeType: NodeTypes.OrderbyNode,
            value: [
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    type: "asc",
                    value: "Country/Name"
                },
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    type: "desc",
                    value: "Street"
                }
            ]
        }
    },
    {
        type: "specified asc and desc",
        input: "Country/Name asc,Street desc",
        expectedAST: <OrderbyNode>{
            nodeType: NodeTypes.OrderbyNode,
            value: [
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    type: "asc",
                    value: "Country/Name"
                },
                {
                    nodeType: NodeTypes.OrderbyItemNode,
                    type: "desc",
                    value: "Street"
                }
            ]
        }
    },
    {
        type: "default asc and specified asc",
        input: "Country/Name,Street asc",
        expectedAST: <OrderbyNode>{
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
                    value: "Street"
                }
            ]
        }
    }
    ].forEach(testParsingAndAST)
})

