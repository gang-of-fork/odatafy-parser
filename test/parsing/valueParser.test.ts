/*
import assert from 'assert';
import valueParser from './../../src/parsing/valueParser';

function testParsing(assertionValues: {[key:string]:any}) {
    for (let inputString in assertionValues) {
        it('should parse \"' + inputString + "\"", () => {
            let ast = valueParser.parse(inputString)
            assert.strictEqual(ast, assertionValues[inputString]);
        })
    }
}

function testParsingFails(inputStrings:Array<string>) {
    for (let inputString of inputStrings) {
        it('should not parse \"' + inputString + "\"", () => {
            assert.throws(() => { valueParser.parse(inputString) })
        })
    }
}

//TBD
describe('test apply-expressions', () => {
    let assertionValues: {[key:string]:any} = {}
    testParsing(assertionValues)
})

//TBD
describe('test compute-expressions', () => {
    let assertionValues: {[key:string]:any} = {}
    testParsing(assertionValues)
})

//TBD
describe('test search-expressions', () => {
    let assertionValues: {[key:string]:any} = {}
    testParsing(assertionValues)
})

//TBD
describe('test filter-expressions', () => {
    let assertionValues: {[key:string]:any} = {}
    testParsing(assertionValues)
})

//TBD
describe('test orderby-expressions', () => {
    let assertionValues: {[key:string]:any} = {}
    testParsing(assertionValues)
})

//$skip, $top and $index all accept the exact same values
describe('test skip/top/index-expressions', () => {
    let assertionValues: {[key:string]:any} = {
        "1":"1",
        "9":"9",
        "1234":"1234",
        "255645":"255645"
    }
    testParsing(assertionValues)
})

//TBD
describe('test expand-expressions', () => {
    let assertionValues: {[key:string]:any} = {}
    testParsing(assertionValues)
})

//TBD
describe('test select-expressions', () => {
    let assertionValues: {[key:string]:any} = {}
    testParsing(assertionValues)
})

describe('test format-expressions', () => {
    let assertionValues: {[key:string]:any} = {
        "atom":"atom",
        "json":"json",
        "xml":"xml",
        "application/html":"application/html",
        "value1/value2":"value1/value2",
        // needed? => "1234/5678": "1234/5678"
    }
    testParsing(assertionValues)
})

//TBD
describe('test invalid-expressions', () => {
        let inputStrings = [
            "abghhf47f43§4§$4f\"f_.,<y23r4r",

            //format
            "///",
            "//",
            "/",

            //skip, top, index
            "-1"

        ]
        testParsingFails(inputStrings)
    
})
*/