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
            it(`should parse ${testcase.type}`, () => {
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
            type: 'negative Integer',
            input: '-5'
        }].forEach(testcase => {
            it(`should throw Error because of ${testcase.type}`, () => {
                assert.throws(
                    () => {
                        topParser.parse(testcase.input);
                    });
            });
        })
    });

});