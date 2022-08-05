import assert from 'assert';
import filterParser from '../../../src/parsing/filterParser';
import { ConstantSpatialNode, ConstantSpatialNodeAbstractSpatialTypes, FilterNode, NodeTypes, SpatialNode } from '../../../src/types/nodes';

function testParsingAndAST(testcase: { type: string, input: string, expectedAST: any }) {
    it(`should parse ${testcase.type}: ${testcase.input}`, () => {
        let ast = filterParser.parse(testcase.input)
        assert.deepStrictEqual(ast, testcase.expectedAST)
    })
}


/* 
                 X nullValue                  ; plain values up to int64Value
                 X booleanValue 
                 X guidValue 
                 X dateTimeOffsetValueInUrl 
                 X dateValue
                 X timeOfDayValueInUrl
                 X decimalValue 
                 X Integer
                 X string                     ; single-quoted
                 X duration
                 X enum
                 X binary                     ; all others are quoted and prefixed 
                 / geographyCollection 
                 / geographyLineString 
                 / geographyMultiLineString 
                 / geographyMultiPoint 
                 / geographyMultiPolygon 
                 / geographyPoint 
                 / geographyPolygon 
                 / geometryCollection 
                 / geometryLineString 
                 / geometryMultiLineString 
                 / geometryMultiPoint 
                 / geometryMultiPolygon 
                 / geometryPoint 
                 / geometryPolygon
*/
describe('Literal Tests', () => {
    describe('Primitive Literal Tests', () => {
        [
            {
                abnfType: "Null",
                value: null
            },
            {
                abnfType: "Boolean",
                value: true
            },
            {
                abnfType: "Boolean",
                value: false
            },
            {
                abnfType: "GUID",
                value: "550E8400-E29B-11D4-A716-446655440000"
            },
            {
                abnfType: "DateTimeOffsetValueInUrl",
                value: "2022-07-02T13:10:20.0000Z"
            },
            {
                abnfType: "DateValue",
                value: "2022-07-02"
            },
            {
                abnfType: "TimeOfDayValueInUrl",
                value: "13:12:01.0000"
            },
            {
                abnfType: "TimeOfDayValueInUrl",
                value: "13:12:01"
            },
            {
                abnfType: "TimeOfDayValueInUrl",
                value: "13:12"
            },
            {
                abnfType: "Decimal",
                value: 1.2
            },
            {
                abnfType: "Decimal",
                value: -1.2
            },
            {
                abnfType: "Integer",
                value: 5
            }, {
                abnfType: "Integer",
                value: -5
            },
            {
                abnfType: "String",
                value: "'Hello World!'",
                expected: "Hello World!"
            },
            {
                abnfType: "Duration",
                value: "duration'P1DT12H3M25S'",
            },
            {
                abnfType: "Duration",
                value: "'P1DT12H3M25S'",
            },
            {
                abnfType: "Binary",
                value: "binary'A123AA=='"
            }].forEach(testcase => {
                testParsingAndAST({
                    type: `simple eq expression with ${testcase.abnfType} (${testcase.value})`, input: `Identifier eq ${testcase.value}`, expectedAST: {
                        nodeType: "OperatorNode",
                        op: "eq",
                        left: {
                            nodeType: "SymbolNode",
                            type: "Identifier",
                            value: "Identifier"
                        },
                        right: {
                            nodeType: "ConstantNode",
                            type: testcase.abnfType,
                            value: testcase.expected ? testcase.expected : testcase.value
                        }
                    }
                })
            })
        testParsingAndAST({
            type: "simple eq expression with enumValue (namespace.EnumName'Value')",
            input: "Identifier eq namespace.EnumName'Value'",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "eq",
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: "Identifier"
                },
                right: {
                    nodeType: "EnumValueNode",
                    type: "EnumValue",
                    enumTypeName: "namespace.EnumName",
                    enumValue: "Value"
                }
            }

        })
    })

    describe('complex literal tests', () => {
        [{
            type: "simple eq expression with Object-Expression",
            input: "Identifier eq {\"prop1\": \"value1\", \"prop2\": 2}",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "eq",
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: "Identifier"
                },
                right: {
                    nodeType: "ConstantNode",
                    type: "Object",
                    value: {
                        prop1: 'value1',
                        prop2: 2
                    }
                }
            }
        },
        {
            type: "simple eq expression with nested Object-Expression",
            input: "Identifier eq {\"prop1\":{\"prop2\": \"value2\"}}",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "eq",
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: "Identifier"
                },
                right: {
                    nodeType: "ConstantNode",
                    type: "Object",
                    value: {
                        prop1: {
                            prop2: 'value2'
                        }
                    }
                }
            }
        },
        {
            type: "simple eq expression with Array-expression",
            input: "Identifier eq [\"1\", 2, \"3\"]",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "eq",
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: "Identifier"
                },
                right: {
                    nodeType: "ConstantNode",
                    type: "Array",
                    value: ["1", 2, "3"]
                }
            }
        },
        {
            type: "simple eq expression with Object in Array-expression",
            input: "Identifier eq [{\"prop1\":\"value1\"}]",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "eq",
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: "Identifier"
                },
                right: {
                    nodeType: "ConstantNode",
                    type: "Array",
                    value: [{ prop1: "value1" }]
                }
            }
        },
        {
            type: "simple eq expression with member-expression",
            input: "Identifier eq Address/Name",
            expectedAST: {
                nodeType: "OperatorNode",
                op: "eq",
                left: {
                    nodeType: "SymbolNode",
                    type: "Identifier",
                    value: "Identifier"
                },
                right: {
                    nodeType: "SymbolNode",
                    type: "MemberExpression",
                    value: ["Address", "Name"]
                }
            }
        },
    ].forEach(testcase => testParsingAndAST(testcase))
    })
    describe('Spatial Literal Tests', () => {
        [{
            type: "simple eq expression with GeographyCollection",
            spatialInput: "geography'SRID=0;Collection(LineString(142.1 64.1,3.14 2.78))'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geography,
                value: <SpatialNode>{
                    nodeType: NodeTypes.CollectionNode,
                    srid: 0,
                    collection: [{
                        nodeType: NodeTypes.LineStringNode,
                        positions: [{
                            lon: 142.1,
                            lat: 64.1,
                            alt: 0,
                            lrm: 0
                        },
                        {
                            lon: 3.14,
                            lat: 2.78,
                            alt: 0,
                            lrm: 0
                        }]
                    }]
                }
            }
        },
        {
            type: "simple eq expression with GeographyLineString",
            spatialInput: "geography'SRID=0;LineString(142.1 64.1,3.14 2.78)'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geography,
                value: <SpatialNode>{
                    nodeType: NodeTypes.LineStringNode,
                    srid: 0,
                    positions: [{
                        lon: 142.1,
                        lat: 64.1,
                        alt: 0,
                        lrm: 0
                    },
                    {
                        lon: 3.14,
                        lat: 2.78,
                        alt: 0,
                        lrm: 0
                    }]
                }
            }
        },

        {
            type: "simple eq expression with GeographyMultiLineString",
            spatialInput: "geography'SRID=0;MultiLineString((142.1 64.1,3.14 2.78),(142.1 64.1,3.14 2.78))'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geography,
                value: <SpatialNode>{
                    nodeType: NodeTypes.MultiLineStringNode,
                    srid: 0,
                    lineStrings: [{
                        nodeType: NodeTypes.LineStringNode,
                        positions: [{
                            lon: 142.1,
                            lat: 64.1,
                            alt: 0,
                            lrm: 0
                        },
                        {
                            lon: 3.14,
                            lat: 2.78,
                            alt: 0,
                            lrm: 0
                        }]
                    },
                    {
                        nodeType: NodeTypes.LineStringNode,
                        positions: [{
                            lon: 142.1,
                            lat: 64.1,
                            alt: 0,
                            lrm: 0
                        },
                        {
                            lon: 3.14,
                            lat: 2.78,
                            alt: 0,
                            lrm: 0
                        }]
                    }]
                }
            }
        },

        {
            type: "simple eq expression with GeographyMultiPoint I",
            spatialInput: "geography'SRID=0;MultiPoint()'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geography,
                value: <SpatialNode>{
                    nodeType: NodeTypes.MultiPointNode,
                    srid: 0,
                    points: []
                }
            }
        },
        {
            type: "simple eq expression with GeographyMultiPoint II",
            spatialInput: "geography'SRID=0;MultiPoint((142.1 64.1),(1 2))'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geography,
                value: <SpatialNode>{
                    nodeType: NodeTypes.MultiPointNode,
                    srid: 0,
                    points: [{
                        lon: 142.1,
                        lat: 64.1,
                        alt: 0,
                        lrm: 0
                    },
                    {
                        lon: 1,
                        lat: 2,
                        alt: 0,
                        lrm: 0
                    }]
                }
            }
        },
        {
            type: "simple eq expression with GeographyMultiPolygon",
            spatialInput: "geography'SRID=0;MultiPolygon(((1 1,1 1),(1 1,2 2,3 3,1 1)))'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geography,
                value: <SpatialNode>{
                    nodeType: NodeTypes.MultiPolygonNode,
                    srid: 0,
                    polygons: [{
                        nodeType: NodeTypes.PolygonNode,
                        rings: [{
                            positions: [{
                                lon: 1,
                                lat: 1,
                                alt: 0,
                                lrm: 0
                            },
                            {
                                lon: 1,
                                lat: 1,
                                alt: 0,
                                lrm: 0
                            }]
                        },
                        {
                            positions: [{
                                lon: 1,
                                lat: 1,
                                alt: 0,
                                lrm: 0
                            },
                            {
                                lon: 2,
                                lat: 2,
                                alt: 0,
                                lrm: 0

                            },
                            {
                                lon: 3,
                                lat: 3,
                                alt: 0,
                                lrm: 0
                            },
                            {
                                lon: 1,
                                lat: 1,
                                alt: 0,
                                lrm: 0
                            }]
                        }]
                    }]
                }
            }
        },
        {
            type: "simple eq expression with GeographyPoint",
            spatialInput: "geography'SRID=0;Point(142.1 64.1)'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geography,
                value: <SpatialNode>{
                    nodeType: NodeTypes.PointNode,
                    srid: 0,
                    point: {
                        lon: 142.1,
                        lat: 64.1,
                        alt: 0,
                        lrm: 0
                    }
                }
            }
        },

        {
            type: "simple eq expression with GeographyPoint with elevation(altitude)",
            spatialInput: "geography'SRID=0;Point(142.1 64.1 10.0)'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geography,
                value: <SpatialNode>{
                    nodeType: NodeTypes.PointNode,
                    srid: 0,
                    point: {
                        lon: 142.1,
                        lat: 64.1,
                        alt: 10.0,
                        lrm: 0
                    }
                }
            }
        },
        {
            type: "simple eq expression with GeographyPoint with elevation(altitude) and measure",
            spatialInput: "geography'SRID=0;Point(142.1 64.1 10.0 -3.14)'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geography,
                value: <SpatialNode>{
                    nodeType: NodeTypes.PointNode,
                    srid: 0,
                    point: {
                        lon: 142.1,
                        lat: 64.1,
                        alt: 10.0,
                        lrm: -3.14
                    }
                }
            }
        },
        {
            type: "simple eq expression with GeographyPolygon",
            spatialInput: "geography'SRID=0;Polygon((1 1,1 1),(1 1,2 2,3 3,1 1))'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geography,
                value: <SpatialNode>{
                    nodeType: NodeTypes.PolygonNode,
                    srid: 0,
                    rings: [{
                        positions: [{
                            lon: 1,
                            lat: 1,
                            alt: 0,
                            lrm: 0
                        },

                        {
                            lon: 1,
                            lat: 1,
                            alt: 0,
                            lrm: 0

                        }]
                    },
                    {
                        positions: [{
                            lon: 1,
                            lat: 1,
                            alt: 0,
                            lrm: 0
                        },

                        {
                            lon: 2,
                            lat: 2,
                            alt: 0,
                            lrm: 0
                        },


                        {
                            lon: 3,
                            lat: 3,
                            alt: 0,
                            lrm: 0
                        },

                        {
                            lon: 1,
                            lat: 1,
                            alt: 0,
                            lrm: 0
                        }]
                    }]
                }
            }
        },
        {
            type: "simple eq expression with GeometryCollection",
            spatialInput: "geometry'SRID=0;Collection(LineString(142.1 64.1,3.14 2.78))'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geometry,
                value: <SpatialNode>{
                    nodeType: NodeTypes.CollectionNode,
                    srid: 0,
                    collection: [{
                        nodeType: NodeTypes.LineStringNode,
                        positions: [{
                            lon: 142.1,
                            lat: 64.1,
                            alt: 0,
                            lrm: 0

                        },
                        {
                            lon: 3.14,
                            lat: 2.78,
                            alt: 0,
                            lrm: 0

                        }]
                    }]
                }
            }
        },
        {
            type: "simple eq expression with GeometryLineString",
            spatialInput: "geometry'SRID=0;LineString(142.1 64.1,3.14 2.78)'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geometry,
                value: <SpatialNode>{
                    nodeType: NodeTypes.LineStringNode,
                    srid: 0,
                    positions: [{
                        lon: 142.1,
                        lat: 64.1,
                        alt: 0,
                        lrm: 0

                    },
                    {
                        lon: 3.14,
                        lat: 2.78,
                        alt: 0,
                        lrm: 0

                    }]
                }
            }
        },
        {
            type: "simple eq expression with GeometryMultiLineString",
            spatialInput: "geometry'SRID=0;MultiLineString((142.1 64.1,3.14 2.78),(142.1 64.1,3.14 2.78))'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geometry,
                value: <SpatialNode>{
                    nodeType: NodeTypes.MultiLineStringNode,
                    srid: 0,
                    lineStrings: [{
                        nodeType: NodeTypes.LineStringNode,
                        positions: [{
                            lon: 142.1,
                            lat: 64.1,
                            alt: 0,
                            lrm: 0

                        },
                        {
                            lon: 3.14,
                            lat: 2.78,
                            alt: 0,
                            lrm: 0

                        }]
                    },
                    {
                        nodeType: NodeTypes.LineStringNode,
                        positions: [{
                            lon: 142.1,
                            lat: 64.1,
                            alt: 0,
                            lrm: 0

                        },
                        {
                            lon: 3.14,
                            lat: 2.78,
                            alt: 0,
                            lrm: 0

                        }]
                    }]
                }
            }
        },
        {
            type: "simple eq expression with GeometryMultiPoint I",
            spatialInput: "geometry'SRID=0;MultiPoint()'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geometry,
                value: <SpatialNode>{
                    nodeType: NodeTypes.MultiPointNode,
                    srid:0,
                    points: []
                }
            }
        },
        {
            type: "simple eq expression with GeometryMultiPoint II",
            spatialInput: "geometry'SRID=0;MultiPoint((142.1 64.1),(1 2))'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geometry,
                value: <SpatialNode>{
                    nodeType: NodeTypes.MultiPointNode,
                    srid: 0,
                    points: [{
                        lon: 142.1,
                        lat: 64.1,
                        alt: 0,
                        lrm: 0
                    },
                    {
                        lon: 1,
                        lat: 2,
                        alt: 0,
                        lrm: 0

                    }]
                }
            }
        },
        {
            type: "simple eq expression with GeometryMultiPolygon",
            spatialInput: "geometry'SRID=0;MultiPolygon(((1 1,1 1),(1 1,2 2,3 3,1 1)))'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geometry,
                value: <SpatialNode>{
                    nodeType: NodeTypes.MultiPolygonNode,
                    srid: 0,
                    polygons: [{
                        nodeType: NodeTypes.PolygonNode,
                        rings: [{
                            positions: [{
                                lon: 1,
                                lat: 1,
                                alt: 0,
                                lrm: 0

                            },
                            {
                                lon: 1,
                                lat: 1,
                                alt: 0,
                                lrm: 0

                            }]
                        },
                        {
                            positions: [{
                                lon: 1,
                                lat: 1,
                                alt: 0,
                                lrm: 0

                            },
                            {
                                lon: 2,
                                lat: 2,
                                alt: 0,
                                lrm: 0


                            },
                            {
                                lon: 3,
                                lat: 3,
                                alt: 0,
                                lrm: 0

                            },
                            {
                                lon: 1,
                                lat: 1,
                                alt: 0,
                                lrm: 0

                            }]
                        }]
                    }]
                }
            }
        },
        {
            type: "simple eq expression with GeometryPoint",
            spatialInput: "geometry'SRID=0;Point(142.1 64.1)'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geometry,
                value: <SpatialNode>{
                    nodeType: NodeTypes.PointNode,
                    srid: 0,
                    point: {
                        lon: 142.1,
                        lat: 64.1,
                        alt: 0,
                        lrm: 0
                    }
                }
            }

        },
        {
            type: "simple eq expression with GeometryPolygon",
            spatialInput: "geometry'SRID=0;Polygon((1 1,1 1),(1 1,2 2,3 3,1 1))'",
            expectedSpatialAST: <ConstantSpatialNode>{
                nodeType: NodeTypes.ConstantSpatialNode,
                abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes.Geometry,
                value: <SpatialNode>{
                    nodeType: NodeTypes.PolygonNode,
                    srid: 0,
                    rings: [{
                        positions: [{
                            lon: 1,
                            lat: 1,
                            alt: 0,
                            lrm: 0

                        },
                        {
                            lon: 1,
                            lat: 1,
                            alt: 0,
                            lrm: 0

                        }]
                    },
                    {
                        positions: [{
                            lon: 1,
                            lat: 1,
                            alt: 0,
                            lrm: 0

                        },
                        {
                            lon: 2,
                            lat: 2,
                            alt: 0,
                            lrm: 0


                        },
                        {
                            lon: 3,
                            lat: 3,
                            alt: 0,
                            lrm: 0

                        },
                        {
                            lon: 1,
                            lat: 1,
                            alt: 0,
                            lrm: 0

                        }]
                    }]
                }
            }
        }].forEach(partialTestcase => {
            let testcase = {
                type: partialTestcase.type,
                input: `Identifier eq ${partialTestcase.spatialInput}`,
                expectedAST: <FilterNode>{
                    nodeType: "OperatorNode",
                    op: "eq",
                    left: {
                        nodeType: "SymbolNode",
                        type: "Identifier",
                        value: "Identifier"
                    },
                    right: partialTestcase.expectedSpatialAST
                }
            }
            testParsingAndAST(testcase);

        })
    })
})

