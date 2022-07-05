import assert from 'assert';
import filterParser from '../../../src/parsing/filterParser';

function testParsingAndAST(testcase: { type: string, input: string, expectedAST: any }) {
    it(`should parse ${testcase.type}: ${testcase.input}`, () => {
        let ast = filterParser.parse(testcase.input)
        assert.deepStrictEqual(ast, testcase.expectedAST)
    })
}

//with pre and postproc
describe('filter-expressions with mathematical operators', () => {
    describe('basic operator tests', () => {
        [{
            type: "simple expression with add",
            input: "Age add 1 eq 18",
            expectedAST: {
                left: {
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier", value: 'Age'
                    },
                    op: 'add',
                    nodeType: 'OperatorNode',
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer", value: 1
                    }
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        },
        {
            type: "simple expression with sub",
            input: "Age sub 1 eq 18",
            expectedAST: {
                left: {
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier", value: 'Age'
                    },
                    op: 'sub',
                    nodeType: 'OperatorNode',
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer", value: 1
                    }
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        },
        {
            type: "simple expression with mul",
            input: "Age mul 1 eq 18",
            expectedAST: {
                left: {
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier", value: 'Age'
                    },
                    op: 'mul',
                    nodeType: 'OperatorNode',
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer", value: 1
                    }
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        },
        {
            type: "simple expression with div",
            input: "Age div 1 eq 18",
            expectedAST: {
                left: {
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier", value: 'Age'
                    },
                    op: 'div',
                    nodeType: 'OperatorNode',
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer", value: 1
                    }
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        },
        {
            type: "simple expression with divby",
            input: "Age divby 1.5 eq 18",
            expectedAST: {
                left: {
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier", value: 'Age'
                    },
                    op: 'divby',
                    nodeType: 'OperatorNode',
                    right: {
                        nodeType: "ConstantNode",
                        type: "Decimal", value: 1.5
                    }
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        },
        {
            type: "simple expression with mod",
            input: "Age mod 1 eq 18",
            expectedAST: {
                left: {
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier", value: 'Age'
                    },
                    op: 'mod',
                    nodeType: 'OperatorNode',
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer", value: 1
                    }
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        },
        {
            type: "expression with two mods",
            input: "Age mod 1 mod 10 eq 18",
            expectedAST: {
                left: {
                    left: {
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier", value: 'Age'
                        },
                        op: 'mod',
                        nodeType: 'OperatorNode',
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer", value: 1
                        }
                    },
                    op: "mod",
                    nodeType: 'OperatorNode',
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 10
                    }
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        },
        {
            type: "expression with two muls",
            input: "Age mul 1 mul 10 eq 18",
            expectedAST: {
                left: {
                    left: {
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier", value: 'Age'
                        },
                        op: 'mul',
                        nodeType: 'OperatorNode',
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer", value: 1
                        }
                    },
                    op: "mul",
                    nodeType: 'OperatorNode',
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 10
                    }
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        },
        {
            type: "expression with two divs",
            input: "Age div 1 div 10 eq 18",
            expectedAST: {
                left: {
                    left: {
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier", value: 'Age'
                        },
                        op: 'div',
                        nodeType: 'OperatorNode',
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer", value: 1
                        }
                    },
                    op: "div",
                    nodeType: 'OperatorNode',
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 10
                    }
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        },
        {
            type: "expression with two divbys",
            input: "Age divby 1.5 divby 10.5 eq 18",
            expectedAST: {
                left: {
                    left: {
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier", value: 'Age'
                        },
                        op: 'divby',
                        nodeType: 'OperatorNode',
                        right: {
                            nodeType: "ConstantNode",
                            type: "Decimal", value: 1.5
                        }
                    },
                    op: "divby",
                    nodeType: 'OperatorNode',
                    right: {
                        nodeType: "ConstantNode",
                        type: "Decimal",
                        value: 10.5
                    }
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        },
        {
            type: "expression with two adds",
            input: "Age add 1 add 10 eq 18",
            expectedAST: {
                left: {
                    left: {
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier", value: 'Age'
                        },
                        op: 'add',
                        nodeType: 'OperatorNode',
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer", value: 1
                        }
                    },
                    op: "add",
                    nodeType: 'OperatorNode',
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 10
                    }
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        },
        {
            type: "expression with two subs",
            input: "Age sub 1 sub 10 eq 18",
            expectedAST: {
                left: {
                    left: {
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier", value: 'Age'
                        },
                        op: 'sub',
                        nodeType: 'OperatorNode',
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer", value: 1
                        }
                    },
                    op: "sub",
                    nodeType: 'OperatorNode',
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 10
                    }
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer", value: 18
                }
            }
        },
        ].forEach(testcase => testParsingAndAST(testcase))
    })

    describe('operator precedence tests (mod > mul/div/divby > add/sub)', () => {
        [
            // mul/div/divby > add/sub
            {
                type: "expression with mul and add",
                input: "Age add 4 mul 8 eq 100",
                expectedAST: {
                    left: {
                        op: 'add',
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier", value: 'Age'
                        },
                        right: {
                            op: "mul",
                            nodeType: 'OperatorNode',
                            left: {
                                nodeType: "ConstantNode",
                                type: "Integer",
                                value: 4
                            },
                            right: {
                                nodeType: "ConstantNode",
                                type: "Integer", value: 8
                            },
                        },
                    },
                    nodeType: "OperatorNode",
                    op: "eq",
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 100
                    }
                }
            },
            {
                type: "expression with div and add",
                input: "Age add 4 div 8 eq 100",
                expectedAST: {
                    left: {
                        op: 'add',
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier", value: 'Age'
                        },
                        right: {
                            op: "div",
                            nodeType: 'OperatorNode',
                            left: {
                                nodeType: "ConstantNode",
                                type: "Integer",
                                value: 4
                            },
                            right: {
                                nodeType: "ConstantNode",
                                type: "Integer", value: 8
                            },
                        },
                    },
                    nodeType: "OperatorNode",
                    op: "eq",
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 100
                    }
                }
            },
            {
                type: "expression with divby and add",
                input: "Age add 4.5 divby 8.5 eq 100",
                expectedAST: {
                    left: {
                        op: 'add',
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier", value: 'Age'
                        },
                        right: {
                            op: "divby",
                            nodeType: 'OperatorNode',
                            left: {
                                nodeType: "ConstantNode",
                                type: "Decimal",
                                value: 4.5
                            },
                            right: {
                                nodeType: "ConstantNode",
                                type: "Decimal", value: 8.5
                            },
                        },
                    },
                    nodeType: "OperatorNode",
                    op: "eq",
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 100
                    }
                }
            },
            {
                type: "expression with mul and sub",
                input: "Age sub 4 mul 8 eq 100",
                expectedAST: {
                    left: {
                        op: 'sub',
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier", value: 'Age'
                        },
                        right: {
                            op: "mul",
                            nodeType: 'OperatorNode',
                            left: {
                                nodeType: "ConstantNode",
                                type: "Integer",
                                value: 4
                            },
                            right: {
                                nodeType: "ConstantNode",
                                type: "Integer", value: 8
                            },
                        },
                    },
                    nodeType: "OperatorNode",
                    op: "eq",
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 100
                    }
                }
            },
            {
                type: "expression with div and sub",
                input: "Age sub 4 div 8 eq 100",
                expectedAST: {
                    left: {
                        op: 'sub',
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier", value: 'Age'
                        },
                        right: {
                            op: "div",
                            nodeType: 'OperatorNode',
                            left: {
                                nodeType: "ConstantNode",
                                type: "Integer",
                                value: 4
                            },
                            right: {
                                nodeType: "ConstantNode",
                                type: "Integer", value: 8
                            },
                        },
                    },
                    nodeType: "OperatorNode",
                    op: "eq",
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 100
                    }
                }
            },
            {
                type: "expression with divby and sub",
                input: "Age sub 4.5 divby 8.5 eq 100",
                expectedAST: {
                    left: {
                        op: 'sub',
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier", value: 'Age'
                        },
                        right: {
                            op: "divby",
                            nodeType: 'OperatorNode',
                            left: {
                                nodeType: "ConstantNode",
                                type: "Decimal",
                                value: 4.5
                            },
                            right: {
                                nodeType: "ConstantNode",
                                type: "Decimal", value: 8.5
                            },
                        },
                    },
                    nodeType: "OperatorNode",
                    op: "eq",
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 100
                    }
                }
            },
            // mod > mul/div/divby
            {
                type: "expression with mod and mul",
                input: "Age mul 4 mod 8 eq 100",
                expectedAST: {
                    left: {
                        op: 'mul',
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier", value: 'Age'
                        },
                        right: {
                            left: {
                                nodeType: "ConstantNode",
                                type: "Integer", value: 4
                            },
                            op: "mod",
                            nodeType: 'OperatorNode',
                            right: {
                                nodeType: "ConstantNode",
                                type: "Integer",
                                value: 8
                            }
                        },
                    },
                    nodeType: "OperatorNode",
                    op: "eq",
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 100
                    }
                }
            },
            {
                type: "expression with mod and div",
                input: "Age div 4 mod 8 eq 100",
                expectedAST: {
                    left: {
                        op: 'div',
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier", value: 'Age'
                        },
                        right: {
                            left: {
                                nodeType: "ConstantNode",
                                type: "Integer", value: 4
                            },
                            op: "mod",
                            nodeType: 'OperatorNode',
                            right: {
                                nodeType: "ConstantNode",
                                type: "Integer",
                                value: 8
                            }
                        },
                    },
                    nodeType: "OperatorNode",
                    op: "eq",
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 100
                    }
                }
            },
            {
                type: "expression with mod and divby",
                input: "Age divby 4 mod 8 eq 100",
                expectedAST: {
                    left: {
                        op: 'divby',
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier", value: 'Age'
                        },
                        right: {
                            left: {
                                nodeType: "ConstantNode",
                                type: "Integer", value: 4
                            },
                            op: "mod",
                            nodeType: 'OperatorNode',
                            right: {
                                nodeType: "ConstantNode",
                                type: "Integer",
                                value: 8
                            }
                        },
                    },
                    nodeType: "OperatorNode",
                    op: "eq",
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 100
                    }
                }
            },
            //mod > mul/div/divby > add/sub
            {
                type: "expression with mod, div, add",
                input: "Age add 4 div 8 mod 7 eq 100",
                expectedAST: {
                    left: {
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: 'Age'
                        },
                        op: "add",
                        nodeType: 'OperatorNode',
                        right: {
                            left: {
                                nodeType: "ConstantNode",
                                type: "Integer", value: 4
                            },
                            op: 'div',
                            nodeType: 'OperatorNode',
                            right: {
                                left: {
                                    nodeType: "ConstantNode",
                                    type: "Integer",
                                    value: 8
                                },
                                op: "mod",
                                nodeType: 'OperatorNode',
                                right: {
                                    nodeType: "ConstantNode",
                                    type: "Integer",
                                    value: 7
                                }
                            },
                        },

                    },
                    nodeType: "OperatorNode",
                    op: "eq",
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 100
                    }
                }
            }
        ].forEach(testcase => testParsingAndAST(testcase))
    });

    describe('expressions with grouping', () => {
        //thorough tests for the math parsing is provided by mathjs
        [{
            type: "expression with one grouping, no spaces",
            input: "(Age add 4) mul 8 eq 100",
            expectedAST: {
                left: {
                    op: 'mul',
                    nodeType: 'OperatorNode',
                    left: {
                        op: "add",
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "Age"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer", value: 4
                        },
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer", value: 8
                    },
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer",
                    value: 100
                }
            }
        },
        {
            type: "expression with one grouping, with spaces",
            input: "( Age add 4 ) mul 8 eq 100",
            expectedAST: {
                left: {
                    op: 'mul',
                    nodeType: 'OperatorNode',
                    left: {
                        op: "add",
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "Age"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer", value: 4
                        },
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer", value: 8
                    },
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer",
                    value: 100
                }
            }
        },
        {
            type: "expression with nested groupings, no spaces",
            input: "((Age add 4) mul 8) eq 100",
            expectedAST: {
                left: {
                    op: 'mul',
                    nodeType: 'OperatorNode',
                    left: {
                        op: "add",
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "Age"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer", value: 4
                        },
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer", value: 8
                    },
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer",
                    value: 100
                }
            }
        },
        {
            type: "expression with nested grouping, with spaces",
            input: "( ( Age add 4 ) mul 8 ) eq 100",
            expectedAST: {
                left: {
                    op: 'mul',
                    nodeType: 'OperatorNode',
                    left: {
                        op: "add",
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "Age"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer", value: 4
                        },
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer", value: 8
                    },
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer",
                    value: 100
                }
            }
        },
        {
            type: "expression with two groupings, no spaces",
            input: "((Age add 4) mul (8 add 16)) eq 100",
            expectedAST: {
                left: {
                    op: 'mul',
                    nodeType: 'OperatorNode',
                    left: {
                        op: "add",
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "Age"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer", value: 4
                        },
                    },
                    right: {
                        op: "add",
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "ConstantNode",
                            type: "Integer", value: 8
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer", value: 16
                        },
                    },
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer",
                    value: 100
                }
            }
        },
        {
            type: "expression with two groupings, with spaces",
            input: "( ( Age add 4 ) mul ( 8 add 16 ) ) eq 100",
            expectedAST: {
                left: {
                    op: 'mul',
                    nodeType: 'OperatorNode',
                    left: {
                        op: "add",
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "Age"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer", value: 4
                        },
                    },
                    right: {
                        op: "add",
                        nodeType: 'OperatorNode',
                        left: {
                            nodeType: "ConstantNode",
                            type: "Integer", value: 8
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer", value: 16
                        },
                    },
                },
                nodeType: "OperatorNode",
                op: "eq",
                right: {
                    nodeType: "ConstantNode",
                    type: "Integer",
                    value: 100
                }
            }
        },
        ].forEach(testcase => testParsingAndAST(testcase))
    });
});