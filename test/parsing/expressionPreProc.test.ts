import assert from 'assert';
import { Prefixes, getIdentifier, hasOnlyMatchingParentheses, escapeStrings, escapeFunctions } from '../../src/processing/expressionPreProc'

//tests if result conforms to given format via regexp

const Str_Escape_Regex = /\$(.*?)\$/;
const Func_Escape_Regex = /\%(.*?)\%/;
const Expr_Escape_Regex = /\§(.*?)\§/;
const Multiexpr_Escape_Regex = /\&(.*?)\&/;


describe('expressionPreProcessing tests', () => {

    describe('test getIdentifier()', () => {
        [{
            escapeType: 'String',
            input: Prefixes.Str_Escape,
            expectedRegex: Str_Escape_Regex,
            expectedLength: 42
        },
        {
            escapeType: 'Function',
            input: Prefixes.Func_Escape,
            expectedRegex: Func_Escape_Regex,
            expectedLength: 42
        },
        {
            escapeType: 'Expression',
            input: Prefixes.Expr_Escape,
            expectedRegex: Expr_Escape_Regex,
            expectedLength: 42
        },
        {
            escapeType: 'Multiexpression',
            input: Prefixes.Multiexpr_Escape,
            expectedRegex: Multiexpr_Escape_Regex,
            expectedLength: 42
        }].forEach(testcase => {
            it(`should generate a valid ${testcase.escapeType} Escape Identifier`, () => {
                let identifier = getIdentifier(testcase.input)
                assert(testcase.expectedRegex.test(identifier))
                assert(identifier.length == testcase.expectedLength)
            });
        });
    });

    describe('escapeStrings()', () => {
        [{
            type: "no strings",
            input: "Alter eq 5",
            expectedRegex: /Alter eq 5/,
            expectedToBeEscapeds: []
        },
        {
            type: "simple string",
            input: "'HelloWorld'",
            expectedRegex: /\$(.*?)\$/,
            expectedToBeEscapeds: [
                "'HelloWorld'"
            ]
        },
        {
            type: "string in an expression",
            input: "Name eq 'Mustermann'",
            expectedRegex: /Name eq \$(.*?)\$/,
            expectedToBeEscapeds: [
                "'Mustermann'"
            ]
        },
        {
            type: "string in a function",
            input: "contains(Name, 'Muster')",
            expectedRegex: /contains\(Name, \$(.*?)\$/,
            expectedToBeEscapeds: [
                "'Muster'"
            ]
        },
        {
            type: "multiple strings in an expression",
            input: "Name eq 'Mustermann' and Vorname eq 'Max'",
            expectedRegex: /Name eq \$(.*?)\$ and Vorname eq \$(.*?)\$/,
            expectedToBeEscapeds: [
                "'Mustermann'",
                "'Max'"
            ]
        }].forEach(testcase => {
            let [resultString, resultRecord] = escapeStrings(testcase.input)
            it(`should escape a ${testcase.type} ("${testcase.input}") and return a correct result string`, () => {

                //test that the right result string is returned
                assert(testcase.expectedRegex.test(resultString as string));
            });

            it(`should escape a ${testcase.type} ("${testcase.input}") and return a resolver with valid keys`, () => {
                //test that all the result resolver keys are escape identifiers
                Object.keys(resultRecord).forEach(key => {
                    assert(Str_Escape_Regex.test(key), `key ${key} is not a valid string escape identifier`)
                });
            })

            it(`should escape a ${testcase.type} ("${testcase.input}") and return a resolver containing all expectedToBeEscapeds`, () => {
                //test that the resolver contains all of the expected escape sequences
                testcase.expectedToBeEscapeds.forEach(toBeEscaped => {
                    assert(Object.values(resultRecord).includes(toBeEscaped), `escaped sequence ${toBeEscaped} is missing in the resolver`)
                });
            });
        });
    });

    describe('escapeFunctions()', () => {
        [{
            type: "no functions",
            input: "Alter eq 5",
            expectedRegex: /Alter eq 5/,
            expectedToBeEscapeds: []
        },
        //two arg functions
        //"concat" / "contains" / "endswith" / "indexof" / "matchesPattern" / "startswith" / "geo.distance" / "geo.intersects" / "hassubset" / "hassubsequence"
        {
            type: "simple contains function",
            input: "contains(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "contains(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)"
            ]
        },
        {
            type: "simple concat function",
            input: "concat(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "concat(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)"
            ]
        },
        {
            type: "simple endswith function",
            input: "endswith(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "endswith(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)"
            ]
        },
        {
            type: "simple startswith function",
            input: "startswith(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "startswith(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)"
            ]
        },
        {
            type: "simple geo.distance function",
            input: "geo.distance(Location, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "geo.distance(Location, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)"
            ]
        },
        {
            type: "simple geo.intersects function",
            input: "geo.intersects(Location, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "geo.intersects(Location, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)"
            ]
        },
        {
            type: "simple hassubset function",
            input: "hassubset(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "hassubset(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)"
            ]
        },
        {
            type: "simple hassubsequence function",
            input: "hassubsequence(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "hassubsequence(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)"
            ]
        },
        {
            type: "simple indexof function",
            input: "indexof(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "indexof(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)"
            ]
        },
        {
            type: "simple matchesPattern function",
            input: "matchesPattern(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "matchesPattern(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)"
            ]
        },
        //one arg functions
        //"length" / "tolower"/"toupper"/"trim"/"year"/"month"/"day"/"hour"/"minute"/"second"/"fractionalseconds"/"totalseconds"/"date"/"time"/"totaloffsetminutes"/"round"/"floor"/"ceiling"/"geo.length"
        {
            type: "simple length function",
            input: "length($abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "length($abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)"
            ]
        },
        {
            type: "simple tolower function",
            input: "tolower($abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "tolower($abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)"
            ]
        },
        {
            type: "simple toupper function",
            input: "toupper($abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "toupper($abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)"
            ]
        },
        {
            type: "simple trim function",
            input: "trim($abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "trim($abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)"
            ]
        },
        {
            type: "simple year function",
            input: "year(StartTime)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "year(StartTime)"
            ]
        },
        {
            type: "simple month function",
            input: "month(StartTime)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "month(StartTime)"
            ]
        },
        {
            type: "simple day function",
            input: "day(StartTime)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "day(StartTime)"
            ]
        },
        {
            type: "simple hour function",
            input: "hour(StartTime)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "hour(StartTime)"
            ]
        },
        {
            type: "simple minute function",
            input: "minute(StartTime)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "minute(StartTime)"
            ]
        },
        {
            type: "simple second function",
            input: "second(StartTime)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "second(StartTime)"
            ]
        },
        {
            type: "simple fractionalseconds function",
            input: "fractionalseconds(StartTime)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "fractionalseconds(StartTime)"
            ]
        },
        {
            type: "simple totalseconds function",
            input: "totalseconds(StartTime)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "totalseconds(StartTime)"
            ]
        },
        {
            type: "simple date function",
            input: "date(StartTime)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "date(StartTime)"
            ]
        },
        {
            type: "simple time function",
            input: "time(StartTime)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "time(StartTime)"
            ]
        },
        {
            type: "simple totaloffsetminutes function",
            input: "totaloffsetminutes(StartTime)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "totaloffsetminutes(StartTime)"
            ]
        },
        {
            type: "simple round function",
            input: "round(1.5)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "round(1.5)"
            ]
        },
        {
            type: "simple floor function",
            input: "floor(1.5)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "floor(1.5)"
            ]
        },
        {
            type: "simple ceiling function",
            input: "ceiling(1.5)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "ceiling(1.5)"
            ]
        },
        {
            type: "simple geo.length function",
            input: "geo.length(Location)",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "geo.length(Location)"
            ]
        },
        //zero arg functions
        //"mindatetime" / "maxdatetime" / "now"
        {
            type: "simple mindatetime function",
            input: "mindatetime()",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "mindatetime()"
            ]
        },
        {
            type: "simple maxdatetime function",
            input: "maxdatetime()",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "maxdatetime()"
            ]
        },
        {
            type: "simple now function",
            input: "now()",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "now()"
            ]
        },
        //others
        {
            type: "function in an expression",
            input: "Alter eq 18 and contains(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
            expectedRegex: /Alter eq 18 and \%(.*?)\%/,
            expectedToBeEscapeds: [
                "contains(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)"
            ]
        },
        {
            type: "function in a function",
            input: "contains(Name, concat($abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$, $abcdabcdabcdabcdabcdabcdabcdabcdabcd1234$))",
            expectedRegex: /\%(.*?)\%/,
            expectedToBeEscapeds: [
                "contains(Name, concat($abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$, $abcdabcdabcdabcdabcdabcdabcdabcdabcd1234$))"
            ]
        },
        {
            type: "multiple functions in an expression",
            input: "contains(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$) and contains(Vorname, $abcdabcdabcdabcdabcdabcdabcdabcdabcd1234$)",
            expectedRegex: /\%(.*?)\% and \%(.*?)\%/,
            expectedToBeEscapeds: [
                "contains(Name, $abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd$)",
                "contains(Vorname, $abcdabcdabcdabcdabcdabcdabcdabcdabcd1234$)"
            ]
        }].forEach(testcase => {
            let [resultString, resultRecord] = escapeFunctions(testcase.input)
            it(`should escape a ${testcase.type} ("${testcase.input}")`, () => {
                //test that the right result string is returned
                assert(testcase.expectedRegex.test(resultString as string), `expected ${testcase.expectedRegex} but got ${resultString}`);



                //test that all the result resolver keys are escape identifiers
                Object.keys(resultRecord).forEach(key => {
                    assert(Func_Escape_Regex.test(key), `key ${key} is not a valid function escape identifier`)
                });


                //test that the resolver contains all of the expected escape sequences
                testcase.expectedToBeEscapeds.forEach(toBeEscaped => {
                    assert(Object.values(resultRecord).includes(toBeEscaped), `escaped sequence ${toBeEscaped} is missing in the resolver`)
                });

            });
        });
    });

    describe('hasOnlyMatchingParentheses()', () => {
        [{
            input: '()',
            expected: true
        },
        {
            input: '(())',
            expected: true
        },
        {
            input: '()()',
            expected: true
        },
        {
            input: '()(())',
            expected: true
        },
        {
            input: '(',
            expected: false
        },
        {
            input: '())',
            expected: false
        },
        {
            input: '(()',
            expected: false
        },
        {
            input: '()(()',
            expected: false
        }].forEach(testcase => {
            it(`should return ${testcase.expected} for expression ${testcase.input}`, () => {
                assert.equal(hasOnlyMatchingParentheses(testcase.input), testcase.expected)
            })
        });
    });



    //waiting for refactoring
    xdescribe('escapeExpression()', () => {
        //let assertionValues: {[key:string]:any} = {}
        it('TBD', () => { })
    })

    xdescribe('reverseEscaped()', () => {
        it('TBD', () => { })
    });

    xdescribe('resolveExpression()', () => {
        it('TBD', () => { })
    });


    //waiting for refactoring 
    xdescribe('reverseExprLogic()', () => {
        //let assertionValues: {[key:string]:any} = {        }
        it('TBD', () => { })
    })

});
