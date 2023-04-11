import assert from "assert";
import expandParser from "../../src/parsing/expandParser";
import {
  NodeTypes,
  ExpandNode,
  OperatorNodeOperators,
  SymbolNodeTypes,
  ConstantNodeTypes,
} from "../../src/types/nodes";

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
        type: "single navigation property with $ref",
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
              optionType: "default",
            },
          ],
        },
      },
    ].forEach(testParsingAndAST);
  });

  describe("options testcases", () => {
    [
      {
        type: "recursive expansion",
        input: "Customer($levels=4)",
        expectedAST: <ExpandNode>{
          nodeType: NodeTypes.ExpandNode,
          value: [
            {
              nodeType: NodeTypes.ExpandPathNodeWithOptions,
              optionType: "default",
              options: {
                levels: 4,
              },
              value: [
                {
                  nodeType: NodeTypes.ExpandIdentifierNode,
                  value: "Customer",
                },
              ],
            },
          ],
        },
      },
      {
        type: "recursive expansion - no $ prefix",
        input: "Customer(levels=4)",
        expectedAST: <ExpandNode>{
          nodeType: NodeTypes.ExpandNode,
          value: [
            {
              nodeType: NodeTypes.ExpandPathNodeWithOptions,
              optionType: "default",
              options: {
                levels: 4,
              },
              value: [
                {
                  nodeType: NodeTypes.ExpandIdentifierNode,
                  value: "Customer",
                },
              ],
            },
          ],
        },
      },
      {
        type: "Expand - $count",
        input: "Items($count=true)",
        expectedAST: <ExpandNode>{
          nodeType: NodeTypes.ExpandNode,
          value: [
            {
              nodeType: NodeTypes.ExpandPathNodeWithOptions,
              optionType: "default",
              options: {
                count: true,
              },
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
        type: "Expand - $filter",
        input: "Items($filter=Name eq 'Hugo')",
        expectedAST: <ExpandNode>{
          nodeType: NodeTypes.ExpandNode,
          value: [
            {
              nodeType: NodeTypes.ExpandPathNodeWithOptions,
              optionType: "default",
              options: {
                filter: {
                  nodeType: NodeTypes.OperatorNode,
                  op: OperatorNodeOperators.Eq,
                  left: {
                    nodeType: NodeTypes.SymbolNode,
                    type: SymbolNodeTypes.Identifier,
                    value: "Name",
                  },
                  right: {
                    nodeType: NodeTypes.ConstantNode,
                    type: ConstantNodeTypes.String,
                    value: "Hugo",
                  },
                },
              },
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
        type: "Expand - $skip",
        input: "Items($skip=4)",
        expectedAST: <ExpandNode>{
          nodeType: NodeTypes.ExpandNode,
          value: [
            {
              nodeType: NodeTypes.ExpandPathNodeWithOptions,
              optionType: "default",
              options: {
                skip: 4,
              },
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
        type: "Expand - $top",
        input: "Items($top=4)",
        expectedAST: <ExpandNode>{
          nodeType: NodeTypes.ExpandNode,
          value: [
            {
              nodeType: NodeTypes.ExpandPathNodeWithOptions,
              optionType: "default",
              options: {
                top: 4,
              },
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
        type: "Expand - $select",
        input: "Items($select=Product)",
        expectedAST: <ExpandNode>{
          nodeType: NodeTypes.ExpandNode,
          value: [
            {
              nodeType: NodeTypes.ExpandPathNodeWithOptions,
              optionType: "default",
              options: {
                select: {
                  nodeType: NodeTypes.SelectNode,
                  value: [
                    {
                      nodeType: NodeTypes.SelectPathNode,
                      value: [
                        {
                          nodeType: NodeTypes.SelectIdentifierNode,
                          value: "Product",
                        },
                      ],
                    },
                  ],
                },
              },
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

  // describe("error tests", () => {
  //   [
  //     {
  //       type: "no $select after $ref",
  //       input: "Customer/$ref($select=Name)"
  //      }
  //   ].forEach(testcase => {
  //   it(`should throw Error because of ${testcase.type}`, () => {
  //     assert.throws(
  //         () => {
  //         expandParser.parse(testcase.input);
  //         },
  //         {
  //         name: 'peg$SyntaxError',
  //         message: 'Expected "$value", "%2A", "%40", "*", "@", "_", or [a-z,A-Z] but "$" found'
  //   });
  // });
});
