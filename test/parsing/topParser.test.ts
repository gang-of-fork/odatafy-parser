import assert from "assert"
import topParser from "../../src/parsing/topParser"

describe('Skip Parser tests', () => {
    describe('integer tests', () => {
        [{
            type: 'positive Integer',
            input: '5',
            expectedOutput: 5
        },
        {
            type: 'Zero',
            input: '0',
            expectedOutput: 0
        }
        ].forEach(testcase => {
            it(`should generate a valid ${testcase.type} Escape Identifier`, () => {
                let parsedOutput = topParser.parse(testcase.input)
                assert(parsedOutput == testcase.expectedOutput)
            });
        });
    });
    describe('error tests', () => {
        [{
            type: 'no Integer',
            input: 'test'
        },
        {
            type: 'comma',
            input: ','
        },
        {
            type: 'negative Integer',
            input: '-5'
        }].forEach(testcase => {
            it(`should throw Error because of ${testcase.type} Escape`, () => {
                assert.throws(
                    () => {
                    topParser.parse(testcase.input);
                    },
                    {
                    name: 'Error',
                    message: 'top must be a valid integer value'
                });
            });
        })
    });

});