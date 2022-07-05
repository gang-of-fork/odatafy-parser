import assert from 'assert';
import filterParser from '../../../src/parsing/filterParser';

function testParsingAndAST(testcase: { type: string, input: string, expectedAST: any }) {
    it(`should parse ${testcase.type}: ${testcase.input}`, () => {
        let ast = filterParser.parse(testcase.input)
        assert.deepStrictEqual(ast, testcase.expectedAST)
    })
}

//with pre and postproc
describe('filter-expressions with logical operators', () => {
    describe('basic operator tests', () => {
        [{
            type: "simple expression with and",
            input: "A eq 1 and B eq 2",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "A"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 1
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "B"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 2
                    }
                }
            }
        },
        {
            type: "simple expression with or",
            input: "A eq 1 or B eq 2",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "or",
                left: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "A"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 1
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "B"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 2
                    }
                }
            }
        },
        {
            type: "expression with two ands",
            input: "A eq 1 and B eq 2 and C eq 3",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "and",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "C"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 3
                    }
                }
            }
        },
        {
            type: "expression with two ors",
            input: "A eq 1 or B eq 2 or C eq 3",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "or",
                left: {
                    nodeType: "OperatorNode",
                    op: "or",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "C"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 3
                    }
                }
            }
        },
        {
            type: "expression with and + or",
            input: "A eq 1 and B eq 2 or C eq 3",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "or",
                left: {
                    nodeType: "OperatorNode",
                    op: "and",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "C"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 3
                    }
                }
            }
        },
        {
            type: "expression with or + and",
            input: "A eq 1 or B eq 2 and C eq 3",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "or",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "C"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 3
                    }
                }
            }
        }].forEach(testcase => testParsingAndAST(testcase));
    })

    describe('operator precedence tests (eq/ne/gt/lt/ge/le > not > and/or)', () => {
        [{
            type: "simple expression with and / eq",
            input: "A eq 1 and B eq 2",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "A"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 1
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "B"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 2
                    }
                }
            }
        },
        {
            type: "simple expression with and / ne",
            input: "A ne 1 and B ne 2",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "ne",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "A"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 1
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "ne",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "B"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 2
                    }
                }
            }
        },
        {
            type: "simple expression with and / gt",
            input: "A gt 1 and B gt 2",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "gt",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "A"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 1
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "gt",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "B"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 2
                    }
                }
            }
        },
        {
            type: "simple expression with and / lt",
            input: "A lt 1 and B lt 2",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "lt",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "A"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 1
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "lt",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "B"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 2
                    }
                }
            }
        },
        {
            type: "simple expression with and / le",
            input: "A le 1 and B le 2",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "le",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "A"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 1
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "le",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "B"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 2
                    }
                }
            }
        },
        {
            type: "simple expression with and / ge",
            input: "A ge 1 and B ge 2",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "ge",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "A"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 1
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "ge",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "B"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 2
                    }
                }
            }
        },
        {
            type: "not in a comparison expression with eq",
            input: "not Name eq 'Max'",
            expectedAST: {
                nodeType: 'OperatorNode',
                op: 'not',
                right: {
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
            }
        },
        {
            type: "not in a comparison expression with ne",
            input: "not Name ne 'Max'",
            expectedAST: {
                nodeType: 'OperatorNode',
                op: 'not',
                right: {
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
            }
        },
        {
            type: "not in a comparison expression with lt",
            input: "not Name lt 'Max'",
            expectedAST: {
                nodeType: 'OperatorNode',
                op: 'not',
                right: {
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier", value: 'Name'
                    },
                    nodeType: "OperatorNode",
                    op: "lt",
                    right: {
                        nodeType: "ConstantNode",
                        type: "String", value: 'Max'
                    }
                }
            }
        },
        {
            type: "not in a comparison expression with gt",
            input: "not Name gt 'Max'",
            expectedAST: {
                nodeType: 'OperatorNode',
                op: 'not',
                right: {
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier", value: 'Name'
                    },
                    nodeType: "OperatorNode",
                    op: "gt",
                    right: {
                        nodeType: "ConstantNode",
                        type: "String", value: 'Max'
                    }
                }
            }
        },
        {
            type: "not in a comparison expression with le",
            input: "not Name le 'Max'",
            expectedAST: {
                nodeType: 'OperatorNode',
                op: 'not',
                right: {
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier", value: 'Name'
                    },
                    nodeType: "OperatorNode",
                    op: "le",
                    right: {
                        nodeType: "ConstantNode",
                        type: "String", value: 'Max'
                    }
                }
            }
        },
        {
            type: "not in a comparison expression with ge",
            input: "not Name ge 'Max'",
            expectedAST: {
                nodeType: 'OperatorNode',
                op: 'not',
                right: {
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier", value: 'Name'
                    },
                    nodeType: "OperatorNode",
                    op: "ge",
                    right: {
                        nodeType: "ConstantNode",
                        type: "String", value: 'Max'
                    }
                }
            }
        },
        {
            type: "not in and expression on the left",
            input: "not A eq 1 and B eq 2",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "not",
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "B"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 2
                    }
                }

            }
        },
        {
            type: "not in and expression on the right",
            input: "A eq 1 and not B eq 2",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "A"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 1
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "not",
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                }
            }
        },
        ].forEach(testcase => testParsingAndAST(testcase))
    })

    describe('expressions with grouping', () => {
        [{
            type: "expression with or + and with grouping the first two no spaces",
            input: "(A eq 1 or B eq 2) and C eq 3",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "or",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "C"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 3
                    }
                }
            }
        },
        {
            type: "expression with or + and with grouping the first two with spaces",
            input: "( A eq 1 or B eq 2 ) and C eq 3",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "or",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "C"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 3
                    }
                }
            }
        },
        {
            type: "expression with or + and with grouping the last two no spaces",
            input: "A eq 1 or (B eq 2 and C eq 3)",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "or",
                left: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "A"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 1
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "and",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "C"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 3
                        }
                    }
                }
            }
        },
        {
            type: "expression with or + and with grouping the last two with spaces",
            input: "A eq 1 or ( B eq 2 and C eq 3 )",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "or",
                left: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "A"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 1
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "and",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "C"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 3
                        }
                    }
                }
            }
        },
        {
            type: "expression with or + and with nested grouping no spaces",
            input: "((A eq 1 or B eq 2) and C eq 3)",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "or",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "C"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 3
                    }
                }
            }
        },
        {
            type: "expression with or + and with nested grouping with spaces",
            input: "( ( A eq 1 or B eq 2 ) and C eq 3 )",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "or",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "C"
                    },
                    right: {
                        nodeType: "ConstantNode",
                        type: "Integer",
                        value: 3
                    }
                }
            }
        },
        {
            type: "expression with two groupings no spaces",
            input: "(A eq 1 or B eq 2) and (C eq 3 or D eq 4)",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "or",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "or",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "C"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 3
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "D"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 4
                        }
                    }
                }
            }
        },
        {
            type: "expression with two groupings with spaces",
            input: "( A eq 1 or B eq 2 ) and ( C eq 3 or D eq 4 )",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "or",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "or",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "C"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 3
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "D"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 4
                        }
                    }
                }
            }
        },
        {
            type: "expression with two nested groupings no spaces",
            input: "((A eq 1 or B eq 2) and (C eq 3 or D eq 4))",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "or",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "or",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "C"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 3
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "D"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 4
                        }
                    }
                }
            }
        },
        {
            type: "expression with two nested groupings with spaces",
            input: "( ( A eq 1 or B eq 2 ) and ( C eq 3 or D eq 4 ) )",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "and",
                left: {
                    nodeType: "OperatorNode",
                    op: "or",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "or",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "C"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 3
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "D"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 4
                        }
                    }
                }
            }
        },
        {
            type: "expression with not and grouping no spaces",
            input: "not (A eq 1 and B eq 2)",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "not",
                right: {
                    nodeType: "OperatorNode",
                    op: "and",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                }
            }
        },
        {
            type: "expression with not and grouping with spaces",
            input: "not ( A eq 1 and B eq 2 )",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "not",
                right: {
                    nodeType: "OperatorNode",
                    op: "and",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                }
            }
        },
        {
            type: "more complex expression with not and grouping no spaces",
            input: "A eq 1 and B eq 2 or not (C eq 3 or D lt 4)",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "or",
                left: {
                    nodeType: "OperatorNode",
                    op: "and",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "not",
                    right: {
                        nodeType: "OperatorNode",
                        op: "or",
                        left: {
                            nodeType: "OperatorNode",
                            op: "eq",
                            left: {
                                nodeType: "SymbolNode",
                                type: "Identifier",
                                value: "C"
                            },
                            right: {
                                nodeType: "ConstantNode",
                                type: "Integer",
                                value: 3
                            }
                        },
                        right: {
                            nodeType: "OperatorNode",
                            op: "lt",
                            left: {
                                nodeType: "SymbolNode",
                                type: "Identifier",
                                value: "D"
                            },
                            right: {
                                nodeType: "ConstantNode",
                                type: "Integer",
                                value: 4
                            }
                        }
                    }
                }
            }
        },
        {
            type: "more complex expression with not and grouping with spaces",
            input: "A eq 1 and B eq 2 or not ( C eq 3 or D lt 4 )",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "or",
                left: {
                    nodeType: "OperatorNode",
                    op: "and",
                    left: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "A"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 1
                        }
                    },
                    right: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "B"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: "Integer",
                            value: 2
                        }
                    }
                },
                right: {
                    nodeType: "OperatorNode",
                    op: "not",
                    right: {
                        nodeType: "OperatorNode",
                        op: "or",
                        left: {
                            nodeType: "OperatorNode",
                            op: "eq",
                            left: {
                                nodeType: "SymbolNode",
                                type: "Identifier",
                                value: "C"
                            },
                            right: {
                                nodeType: "ConstantNode",
                                type: "Integer",
                                value: 3
                            }
                        },
                        right: {
                            nodeType: "OperatorNode",
                            op: "lt",
                            left: {
                                nodeType: "SymbolNode",
                                type: "Identifier",
                                value: "D"
                            },
                            right: {
                                nodeType: "ConstantNode",
                                type: "Integer",
                                value: 4
                            }
                        }
                    }
                }
            }
        }].forEach(testcase => testParsingAndAST(testcase));
    })
});

