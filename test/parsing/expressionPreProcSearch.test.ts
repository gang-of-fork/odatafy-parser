import assert from "assert"
import { reverseExprLogic } from "../../src/processing/searchExpressionPreProc"

describe('expressionPreProcessingSearch tests', () => {
    describe('reverseExprLogic()', () => {
        [{
            input: "blau AND rot AND gruen",
            expected: "gruen AND rot AND blau"
        },
        {
            input: "blau OR rot OR gruen",
            expected: "gruen OR rot OR blau"
        },
        {
            input: "blau AND rot OR gruen",
            expected: "gruen OR rot AND blau"
        },
        {
            input: "'Fynn' AND 'Steffen' OR 'Robin'",
            expected: "'Robin' OR 'Steffen' AND 'Fynn'"
        },
        {
            input: "('Fynn' AND 'Steffen') OR 'Robin'",
            expected: "'Robin' OR ('Steffen' AND 'Fynn')"
        },
        {
            input: "'Fynn' AND ('Steffen' OR 'Robin')",
            expected: "('Robin' OR 'Steffen') AND 'Fynn'"
        }
    ,{
        input: "'Fynn' AND ('Steffen' OR 'Robin' AND D eq 'Maik')",
        expected: "(D eq 'Maik' AND 'Robin' OR 'Steffen') AND 'Fynn'"
    },
    {
        input: "'Fynn' AND NOT ('Steffen' OR 'Robin' AND D eq 'Maik')",
        expected: "NOT (D eq 'Maik' AND 'Robin' OR 'Steffen') AND 'Fynn'"
    }
   ].forEach(testcase => {
            it(`should return ${testcase.expected} for expression ${testcase.input}`, () => {
                assert.equal(reverseExprLogic(testcase.input), testcase.expected)
            })
        })
    })
})