import assert from "assert";
import searchParser from "../../src/parsing/searchParser";
import {
  NodeTypes,
  SearchNode,
  SearchOperators,
  SearchItemTypes,
} from "../../src/types/nodes";

function testParsingAndAST(testcase: {
  type: string;
  input: string;
  expectedAST: any;
}) {
  it(`should parse ${testcase.type}: ${testcase.input}`, () => {
    let ast = searchParser.parse(testcase.input);
    assert.deepStrictEqual(ast, testcase.expectedAST);
  });
}

function testParsingANDAST_Failing(testcase: {
  type: string;
  input: string;
  message: string;
}) {
  it (`should throw Error because of ${testcase.type}`, () => {
    assert.throws(
        () => {
          searchParser.parse(testcase.input);
        },
        {
          name: 'SyntaxError',
          message: testcase.message
        });
  });
}

describe("Search Parser tests", () => {
  describe("No operator", () => {
    [
      {
        type: "simple term",
        input: "blue",
        expectedAST: <SearchNode>{
          nodeType: NodeTypes.SearchItemNode,
          type: SearchItemTypes.Word,
          value: "blue",
        },
      },
      {
        type: "simple term with dot",
        input: "1.2",
        expectedAST: <SearchNode>{
          nodeType: NodeTypes.SearchItemNode,
          type: SearchItemTypes.Word,
          value: "1.2",
        },
      },
      {
        type: "simple term with comma",
        input: "1,2",
        expectedAST: <SearchNode>{
          nodeType: NodeTypes.SearchItemNode,
          type: SearchItemTypes.Word,
          value: "1,2",
        },
      },
      {
        type: "simple term with dash",
        input: "blue-white",
        expectedAST: <SearchNode>{
          nodeType: NodeTypes.SearchItemNode,
          type: SearchItemTypes.Word,
          value: "blue-white",
        },
      },
      {
        type: "simple term with quote",
        input: "Robin's",
        expectedAST: <SearchNode>{
          nodeType: NodeTypes.SearchItemNode,
          type: SearchItemTypes.Word,
          value: "Robin's",
        },
      },
      {
        type: "AND is a word here, not an operator",
        input: "AND",
        expectedAST: <SearchNode>{
          nodeType: NodeTypes.SearchItemNode,
          type: SearchItemTypes.Word,
          value: "AND",
        },
      },
      {
          type: "simple phrase",
          input: "'blue%20green'",
          expectedAST: <SearchNode>{
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Phrase,
              value: "blue%20green"
          }
      },
      {
          type: "phrase with unbalanced double-quotes - still ok",
          input: "'\"blue\" \"green'",
          expectedAST: <SearchNode>{
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Phrase,
              value: "\"blue\" \"green"
          }
      }
    ].forEach(testParsingAndAST);
  }),
    describe("Single Operator", () => {
      [
        {
          type: "single operator NOT",
          input: "NOT blue",
          expectedAST: <SearchNode>{
            nodeType: NodeTypes.SearchOperatorNode,
            op: SearchOperators.Not,
            right: {
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Word,
              value: "blue",
            },
          },
        },
        {
          type: "single operator NOT with two values",
          input: "NOT (blue green)",
          expectedAST: <SearchNode>{
            nodeType: NodeTypes.SearchOperatorNode,
            op: SearchOperators.Not,
            right: {
              nodeType: NodeTypes.SearchOperatorNode,
              op: SearchOperators.And,
              left: {
                nodeType: NodeTypes.SearchItemNode,
                type: SearchItemTypes.Word,
                value: "blue",
              },
              right: {
                nodeType: NodeTypes.SearchItemNode,
                type: SearchItemTypes.Word,
                value: "green",
              },
            },
          },
        },
        {
          type: "AND and OR are words here, search for items that match both AND and OR",
          input: "AND OR",
          expectedAST: <SearchNode>{
            nodeType: NodeTypes.SearchOperatorNode,
            op: SearchOperators.And,
            left: {
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Word,
              value: "AND",
            },
            right: {
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Word,
              value: "OR",
            },
          },
        },
        {
          type: "single operator OR",
          input: "blue OR red",
          expectedAST: <SearchNode>{
            nodeType: NodeTypes.SearchOperatorNode,
            op: SearchOperators.Or,
            left: {
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Word,
              value: "red",
            },
            right: {
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Word,
              value: "blue",
            },
          },
        },
        {
          type: "single operator AND",
          input: "blue AND red",
          expectedAST: <SearchNode>{
            nodeType: NodeTypes.SearchOperatorNode,
            op: SearchOperators.And,
            left: {
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Word,
              value: "red",
            },
            right: {
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Word,
              value: "blue",
            },
          },
        }
        /*|TBD|
        implicit AND is not working correctly; different order than explicit AND
        {
          type: "implicit AND",
          input: "blue red",
          expectedAST: <SearchNode>{
            nodeType: NodeTypes.SearchOperatorNode,
            op: SearchOperators.And,
            left: {
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Word,
              value: "red",
            },
            right: {
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Word,
              value: "blue",
            },
          },
        }
        */
      ].forEach(testParsingAndAST);
    }),
    describe("Multi Operator", () => {
      [
        {
          type: "multi operator OR OR",
          input: "blue OR green OR red",
          expectedAST: <SearchNode>{
            nodeType: NodeTypes.SearchOperatorNode,
            op: SearchOperators.Or,
            left: {
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Word,
              value: "red",
            },
            right: {
              nodeType: NodeTypes.SearchOperatorNode,
              op: SearchOperators.Or,
              left: {
                nodeType: NodeTypes.SearchItemNode,
                type: SearchItemTypes.Word,
                value: "green",
              },
              right: {
                nodeType: NodeTypes.SearchItemNode,
                type: SearchItemTypes.Word,
                value: "blue",
              },
            },
          },
        },
        {
          type: "multi operator OR AND",
          input: "blue OR green AND red",
          expectedAST: <SearchNode>{
            nodeType: NodeTypes.SearchOperatorNode,
            op: SearchOperators.And,
            left: {
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Word,
              value: "red",
            },
            right: {
              nodeType: NodeTypes.SearchOperatorNode,
              op: SearchOperators.Or,
              left: {
                nodeType: NodeTypes.SearchItemNode,
                type: SearchItemTypes.Word,
                value: "green",
              },
              right: {
                nodeType: NodeTypes.SearchItemNode,
                type: SearchItemTypes.Word,
                value: "blue",
              },
            },
          },
        },
        {
          type: "multi operator AND AND",
          input: "blue AND green AND red",
          expectedAST: <SearchNode>{
            nodeType: NodeTypes.SearchOperatorNode,
            op: SearchOperators.And,
            left: {
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Word,
              value: "red",
            },
            right: {
              nodeType: NodeTypes.SearchOperatorNode,
              op: SearchOperators.And,
              left: {
                nodeType: NodeTypes.SearchItemNode,
                type: SearchItemTypes.Word,
                value: "green",
              },
              right: {
                nodeType: NodeTypes.SearchItemNode,
                type: SearchItemTypes.Word,
                value: "blue",
              },
            },
          },
        },
      ].forEach(testParsingAndAST);
    }),
    describe("grouping Operator", () => {
      [
        {
          type: "AND (OR)",
          input: "blue AND (green OR red)",
          expectedAST: <SearchNode>{
            nodeType: NodeTypes.SearchOperatorNode,
            op: SearchOperators.And,
            left: {
              nodeType: NodeTypes.SearchOperatorNode,
              op: SearchOperators.Or,
              left: {
                nodeType: NodeTypes.SearchItemNode,
                type: SearchItemTypes.Word,
                value: "red",
              },
              right: {
                nodeType: NodeTypes.SearchItemNode,
                type: SearchItemTypes.Word,
                value: "green",
              },
            },
            right: {
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Word,
              value: "blue",
            },
          },
        },
        {
          type: "(NOT) OR",
          input: "(NOT blue) OR red",
          expectedAST: <SearchNode>{
            nodeType: NodeTypes.SearchOperatorNode,
            op: SearchOperators.Or,
            left: {
              nodeType: NodeTypes.SearchItemNode,
              type: SearchItemTypes.Word,
              value: "red"
            },
            right: {
              nodeType: NodeTypes.SearchOperatorNode,
              op: SearchOperators.Not,
              right: {
                nodeType: NodeTypes.SearchItemNode,
                type: SearchItemTypes.Word,
                value: "blue",
              },
            },
          },
        },
      ].forEach(testParsingAndAST);
    });
    describe('error tests', () => {
      [{
          type: 'phrase with unbalanced double-quotes',
          input: '"blue',
          message: `Expected " ", "!", "$", "%", "%22", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "=", "?", "@", "\\"", "_", "~", [0-9], [A-Z], or [a-z] but end of input found.`
      },
      {
          type: 'simple term with unencoded ampersand',
          input: 'more&more',
          message: `Expected "  ", " ", "!", "$", "%", "%09", "%20", "%27", "'", "*", "+", ",", "-", ".", "/", ":", "=", "?", "@", "_", "~", [0-9], [A-Z], [a-z], or end of input but "&" found.`
      },
      {
          type: 'simple term with unencoded hash',
          input: '#1',
          message: `Expected "!", "$", "%", "%22", "%27", "%28", "'", "(", "*", "+", ",", "-", ".", "/", ":", "=", "?", "@", "NOT", "\\"", "_", "~", [0-9], [A-Z], or [a-z] but "#" found.`
      },
      {
        type: 'simple term with unencoded semicolon',
        input: 'a;b',
        message: `Expected "  ", " ", "!", "$", "%", "%09", "%20", "%27", "'", "*", "+", ",", "-", ".", "/", ":", "=", "?", "@", "_", "~", [0-9], [A-Z], [a-z], or end of input but ";" found.`
      }
    ].forEach(testParsingANDAST_Failing)
  });
});
