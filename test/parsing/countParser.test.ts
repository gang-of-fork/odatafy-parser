import assert from "assert"
import countParser from "../../src/parsing/countParser"

describe('Count Parser tests', () => {
    describe('boolean test', () => {
        [{
            type: '$count=true',
            input: 'true',
            expectedOutput: true
        }
        ].forEach(testcase => {
            it(`should parse ${testcase.type}`, () => {
                let parsedOutput = countParser.parse(testcase.input)
                assert(parsedOutput == testcase.expectedOutput)
            });
        });
    });
    describe('error tests', () => {
        [{
            type: 'invalid value',
            input: 'test'
        }].forEach(testcase => {
                it(`should throw Error because of ${testcase.type}`, () => {
                    assert.throws(
                        () => {
                        countParser.parse(testcase.input);
                        }, 
                );
            });
        })
    });

});