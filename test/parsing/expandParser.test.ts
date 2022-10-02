import assert from "assert";
import expandParser from "../../src/parsing/expandParser";
import { NodeTypes, ExpandNode } from "../../src/types/nodes";

function testParsingAndAST(testcase: {
  type: string;
  input: string;
  expectedAST: any;
}) {
  it(`should parse ${testcase.type}: ${testcase.input}`, () => {
    let ast = expandParser.parse(testcase.input);
    assert.deepStrictEqual(ast, testcase.expectedAST);
  });
}

describe("Expand Parser tests", () => {
  describe("single navigation", () => {
    [
      {
        type: "single navigation property",
        input: "Items",
        expectedAST: <ExpandNode>{
          nodeType: NodeTypes.ExpandNode,
          value: [
            {
              nodeType: NodeTypes.ExpandPathNode,
              value: [
                {
                  nodeType: NodeTypes.ExpandIdentifierNode,
                  value: "Items",
                },
              ],
            },
          ],
        },
      },
      {
        type: "single navigation property",
        input: "Items/$ref",
        expectedAST: <ExpandNode>{
          nodeType: NodeTypes.ExpandNode,
          value: [
            {
              nodeType: NodeTypes.ExpandPathNodeWithOptions,
              optionType: "ref",
              options: {},
              value: [
                {
                  nodeType: NodeTypes.ExpandIdentifierNode,
                  value: "Items",
                },
              ],
            },
          ],
        },
      },
    ].forEach(testParsingAndAST);
  });

  describe("multi navigation", () => {
    [
      {
        type: "multi navigation property",
        input: "Customer,Items",
        expectedAST: <ExpandNode>{
          nodeType: NodeTypes.ExpandNode,
          value: [
            {
              nodeType: NodeTypes.ExpandPathNode,
              value: [
                {
                  nodeType: NodeTypes.ExpandIdentifierNode,
                  value: "Customer",
                },
              ],
            },
            {
              nodeType: NodeTypes.ExpandPathNode,
              value: [
                {
                  nodeType: NodeTypes.ExpandIdentifierNode,
                  value: "Items",
                },
              ],
            },
          ],
        },
      },
      {
        type: "multi navigation property",
        input: "Customer/$ref,Items",
        expectedAST: <ExpandNode>{
          nodeType: NodeTypes.ExpandNode,
          value: [
            {
              nodeType: NodeTypes.ExpandPathNodeWithOptions,
              optionType: "ref",
              options: {},
              value: [
                {
                  nodeType: NodeTypes.ExpandIdentifierNode,
                  value: "Customer",
                },
              ],
            },
            {
              nodeType: NodeTypes.ExpandPathNode,
              value: [
                { nodeType: NodeTypes.ExpandIdentifierNode, value: "Items" },
              ],
            },
          ],
        },
      },
      {
        type: "multi navigation property, nested",
        input: "Customer,Items($expand=Product)",
        expectedAST: <ExpandNode>{
          nodeType: NodeTypes.ExpandNode,
          value: [
            {
              nodeType: NodeTypes.ExpandPathNode,
              value: [
                {
                  nodeType: NodeTypes.ExpandIdentifierNode,
                  value: "Customer",
                },
              ],
            },
            {
              nodeType: NodeTypes.ExpandPathNodeWithOptions,
              value: [
                { nodeType: NodeTypes.ExpandIdentifierNode, value: "Items" },
              ],
              options: {
                expand: {
                  nodeType: NodeTypes.ExpandNode,
                  value: [
                    {
                      nodeType: NodeTypes.ExpandPathNode,
                      value: [
                        {
                          nodeType: NodeTypes.ExpandIdentifierNode,
                          value: "Product",
                        },
                      ],
                    },
                  ],
                },
              },
              optionType: "default"
            },
          ],
        },
      },
    ].forEach(testParsingAndAST);
  });
});
