import assert from 'assert';
import filterParser from '../../../src/parsing/filterParser';

function testParsingAndAST(testcase: { type: string, input: string, expectedAST: any }) {
    it(`should parse ${testcase.type}: ${testcase.input}`, () => {
        let ast = filterParser.parse(testcase.input)
        assert.deepStrictEqual(ast, testcase.expectedAST)
    })
}

//with pre and postproc
describe('filter-expressions with condition-expressions (compare, has, in)', () => {
    describe('basic compare operator tests', () => {
        [{
            type: "simple comparison with eq",
            input: "Name eq 'Max'",
            expectedAST: {
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier", value: 'Name'
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "String", value: 'Max'
                }
            }
        },
        {
            type: "simple comparison with ne",
            input: "Name ne 'Max'",
            expectedAST: {
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier", value: 'Name'
                },
                nodeType: "OperatorNode",
                op: "ne",
                right: {
                    nodeType: "ConstantNode",
                    type: "String", value: 'Max'
                }
            }
        },
        {
            type: "simple comparison with lt",
            input: "Age lt 18",
            expectedAST: {
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier", value: 'Age'
                },
                nodeType: "OperatorNode",
                op: "lt",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        },
        {
            type: "simple comparison with gt",
            input: "Age gt 18",
            expectedAST: {
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier", value: 'Age'
                },
                nodeType: "OperatorNode",
                op: "gt",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        },
        {
            type: "simple comparison with le",
            input: "Age le 18",
            expectedAST: {
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier", value: 'Age'
                },
                nodeType: "OperatorNode",
                op: "le",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        },
        {
            type: "simple comparison with ge",
            input: "Age ge 18",
            expectedAST: {
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier", value: 'Age'
                },
                nodeType: "OperatorNode",
                op: "ge",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        }].forEach(testcase => testParsingAndAST(testcase));
    });

    describe("expressions with in", () => {
        [{
            type: "standalone in with (Identifier) in (Identifier)",
            input: "Name in Names",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "in",
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: 'Name'
                },
                right: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: 'Names'
                }
            }
        },
        {
            type: "standalone in with (Number) in (Identifier)",
            input: "1000 in OrderNumbers",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "in",
                left: {
                    nodeType: "ConstantNode",
                    type: "Integer",
                    value: 1000
                },
                right: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: 'OrderNumbers'
                }
            }
        },
        {
            type: "standalone in with (String) in (Identifier)",
            input: "'Mustermann' in lastNames",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "in",
                left: {
                    nodeType: "ConstantNode",
                    type: "String",
                    value: 'Mustermann'
                },
                right: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: 'lastNames'
                }
            }
        },
        {
            type: "standalone in with (EnumTypeName) in (Identifier)",
            input: "Qualified.Namespace.Names in Customers",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "in",
                left: {
                    nodeType: "ConstantNode",
                    type: "EnumTypeName",
                    value: 'Qualified.Namespace.Names'
                },
                right: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: 'Customers'
                }
            }
        },
        {
            type: "standalone in with (Identifier) in (EnumTypeName)",
            input: "Name in Qualified.Namespace.Customers",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "in",
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: 'Name'
                },
                right: {
                    nodeType: "ConstantNode",
                    type: "EnumTypeName",
                    value: 'Qualified.Namespace.Customers'
                }
            }
        },
        {
            type: "standalone in with (Identifier) in (List)",
            input: "Name in ('Mustermann','Max')",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "in",
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: 'Name'
                },
                right: {
                    type: 'list',
                    value: [{
                        nodeType: "ConstantNode",
                        type: "String",
                        value: 'Mustermann'
                    },
                    {
                        nodeType: "ConstantNode",
                        type: "String",
                        value: 'Max'
                    }]
                }
            }
        },
        {
            type: "expression with in + and",
            input: "Name in ('Mustermann','Max') and Age eq 18",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "in",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: 'Name'
                    },
                    right: {
                        type: 'list',
                        value: [{
                            nodeType: "ConstantNode",
                            type: "String",
                            value: 'Mustermann'
                        },
                        {
                            nodeType: "ConstantNode",
                            type: "String",
                            value: 'Max'
                        }]
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: 'Age'
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 18
                    }
                }
            }
        },
        {
            type: "expression with two ins + and",
            input: "Name in ('Mustermann','Max') and Age in (18,19)",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "in",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: 'Name'
                    },
                    right: {
                        type: 'list',
                        value: [{
                            nodeType: "ConstantNode",
                            type: "String",
                            value: 'Mustermann'
                        },
                        {
                            nodeType: "ConstantNode",
                            type: "String",
                            value: 'Max'
                        }]
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "in",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: 'Age'
                    },
                    right: {
                        type: 'list',
                        value: [{
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 18
                        },
                        {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 19
                        }]
                    }
                }
            }
        }].forEach(testcase => testParsingAndAST(testcase))
    });
    describe('expressions with has', () => {
        [{
            type: "standalone has-expression with EnumTypeName",
            input: "BackgroundColor has Qualified.Enum'Red'",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "has",
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: "BackgroundColor"
                },
                right: {
                    nodeType: "EnumValueNode",
                    type: "EnumValue",
                    enumTypeName: "Qualified.Enum",
                    enumValue: "Red"
                }
            }
        },
        {
            type: "standalone has-expression without EnumTypeName",
            input: "BackgroundColor has 'Red'",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "has",
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: "BackgroundColor"
                },
                right: {
                    nodeType: "EnumValueNode",
                    type: "EnumValue",
                    enumValue: "Red"
                }
            }
        },
        {
            type: "has-expression inside and expression",
            input: "BackgroundColor has Qualified.Enum'Red' and Name eq 'Hase'",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "has",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "BackgroundColor"
                    },
                    right: {
                        nodeType: "EnumValueNode",
                        type: "EnumValue",
                        enumTypeName: "Qualified.Enum",
                        enumValue: "Red"
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Name"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "String",
                        value: "Hase"
                    }
                }
            }
        },
        {
            type: "two has-expressions inside and expression",
            input: "BackgroundColor has Qualified.Enum'Red' and MainColor has Qualified.Enum'Blue'",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "has",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "BackgroundColor"
                    },
                    right: {
                        nodeType: "EnumValueNode",
                        type: "EnumValue",
                        enumTypeName: "Qualified.Enum",
                        enumValue: "Red"
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "has",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "MainColor"
                    },
                    right: {
                        nodeType: "EnumValueNode",
                        type: "EnumValue",
                        enumTypeName: "Qualified.Enum",
                        enumValue: "Blue"
                    }
                }
            }
        }].forEach(testcase => testParsingAndAST(testcase))
    })
})