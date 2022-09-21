/**
 * Node Types
 */

export enum NodeTypes {
    OperatorNode = 'OperatorNode',
    ConstantNode = 'ConstantNode',
    ConstantSpatialNode = 'ConstantSpatialNode',
    CollectionNode = 'CollectionNode',
    LineStringNode = 'LineStringNode',
    MultiLineStringNode = 'MultiLineStringNode',
    MultiPointNode = 'MultiPointNode',
    MultiPolygonNode = 'MultiPolygonNode',
    PointNode = 'PointNode',
    PolygonNode = 'PolygonNode',
    SymbolNode = 'SymbolNode',
    FuncNode2Args = 'FuncNode2Args',
    FuncNode1Args = 'FuncNode1Args',
    FuncNode0Args = 'FuncNode0Args',
    FuncNodeVarArgs = 'FuncNodeVarArgs',
    FuncNodeCase = 'FuncNodeCase',
    EnumValueNode = 'EnumValueNode',
    OrderbyNode = 'OrderbyNode',
    OrderbyItemNode = 'OrderbyItemNode',
    ComputeNode = 'ComputeNode',
    ComputeItemNode = 'ComputeItemNode',
    SearchOperatorNode = 'SearchOperatorNode',
    SearchItemNode = 'SearchItemNode',
    SelectNode = 'SelectNode',
    SelectFunctionNode = 'SelectFunctionNode',
    SelectPathNode = 'SelectPathNode',
    SelectIdentifierNode = 'SelectIdentifierNode',
    SelectOptionsUnprocessedNode = 'SelectOptionsUnprocessedNode',
    SelectOptionsNode = 'SelectOptionsNode',
    ExpandNode = 'ExpandNode',
    ExpandFunctionNode = 'ExpandFunctionNode',
    ExpandPathNode = 'ExpandPathNode',
    ExpandIdentifierNode = 'ExpandIdentifierNode',
    ExpandOptionsUnprocessedNode = 'ExpandOptionsUnprocessedNode',
    ExpandOptionsNode = 'ExpandOptionsNode',
    ExpandStarNode = 'ExpandStarNode',
    ExpandValueNode = 'ExpandValueNode'
}

/** 
 * General nodes
 */

export type ConstantNode = {
    nodeType: NodeTypes.ConstantNode;
    type: ConstantNodeTypes;
    value: any;
}

export type ConstantSpatialNode = {
    nodeType: NodeTypes.ConstantSpatialNode;
    abstractSpatialType: ConstantSpatialNodeAbstractSpatialTypes;
    value: SpatialNode
}

export type SpatialNode = CollectionNode | LineStringNode | MultiLineStringNode | MultiPointNode | MultiPolygonNode | PointNode | PolygonNode

export type CollectionNode = {
    nodeType: NodeTypes.CollectionNode,
    srid?: number,
    collection: SpatialNode[]
}

export type LineStringNode = {
    nodeType: NodeTypes.LineStringNode,
    srid?: number,
    positions: PositionLiteral[]
}

export type PositionLiteral = {
    lon: number,
    lat: number,
    alt: number,
    /** 
     * @description linear referencing measure
    */
    lrm: number
}

export type MultiLineStringNode = {
    nodeType: NodeTypes.MultiLineStringNode,
    srid?: number,
    lineStrings: LineStringNode[]

}

export type MultiPointNode = {
    nodeType: NodeTypes.MultiPointNode,
    srid?: number,
    points: PositionLiteral[]
}

export type MultiPolygonNode = {
    nodeType: NodeTypes.MultiPolygonNode,
    srid?: number,
    polygons: PolygonNode[];
}

export type PointNode = {
    nodeType: NodeTypes.PointNode,
    srid?: number,
    point: PositionLiteral
}

export type PolygonNode = {
    nodeType: NodeTypes.PolygonNode;
    srid?: number;
    rings: RingLiteral[];
}

export type RingLiteral = {
    positions: PositionLiteral[];
};

export type SymbolNode = {
    nodeType: NodeTypes.SymbolNode;
    type: SymbolNodeTypes;
    value: string
}

export enum ConstantNodeTypes {
    Null = 'Null',
    Boolean = 'Boolean',
    GUID = 'GUID',
    DateTimeOffsetValueInUrl = 'DateTimeOffsetValueInUrl',
    DateValue = 'DateValue',
    TimeOfDayValueInUrl = 'TimeOfDayValueInUrl',
    Decimal = 'Decimal',
    Integer = 'Integer',
    String = 'String',
    Duration = 'Duration',
    Binary = 'Binary',
    Object = 'Object',
    Array = 'Array'
}

export enum ConstantSpatialNodeAbstractSpatialTypes {
    Geography = 'Geography',
    Geometry = 'Geometry'
}

export enum ConstantSpatialNodeTypes {
    Collection = 'Collection',
    MultiLineString = 'MultiLineString',
    MultiPoint = 'MultiPoint',
    MultiPolygon = 'MultiPolygon',
    Point = 'Point',
    Polygon = 'Polygon'
}

export enum SymbolNodeTypes {
    Identifier = 'Identifier',
    MemberExpression = 'MemberExpression',
    Collection = 'Collection',
    TypeName = 'TypeName'
}



/**
 * Filter parser node
 */

export type FilterNode = OperatorNode | ConstantNode | ConstantSpatialNode | SymbolNode | FuncNode2Args | FuncNode1Args | FuncNode0Args | EnumValueNode | undefined
export type FuncArg = ConstantNode | ConstantSpatialNode | SymbolNode | FuncNode2Args | FuncNode1Args | FuncNode0Args | EnumValueNode

export type OperatorNode = {
    nodeType: NodeTypes.OperatorNode;
    op: OperatorNodeOperators;
    left?: FilterNode;
    right: FilterNode;
}

export type FuncNode2Args = {
    nodeType: NodeTypes.FuncNode2Args;
    func: FuncNames2Args;
    args: [FuncArg, FuncArg]
}

export type FuncNode1Args = {
    nodeType: NodeTypes.FuncNode1Args;
    func: FuncNames1Args;
    args: [FuncArg]
}

export type FuncNode0Args = {
    nodeType: NodeTypes.FuncNode0Args;
    func: FuncNames0Args;
}

export type FuncNodeVarArgs = {
    nodeType: NodeTypes.FuncNodeVarArgs,
    func: FuncNamesVarArgs;
    args: FuncArg[];
}

export type FuncNodeCase = {
    nodeType: NodeTypes.FuncNodeCase;
    args: CaseFuncArg[];
}

export type CaseFuncArg = {
    cond: FilterNode;
    value: FuncArg;
}

export type EnumValueNode = {
    nodeType: NodeTypes.EnumValueNode,
    type: "EnumValue",
    enumTypeName?: string,
    enumValue: string
}

export enum OperatorNodeOperators {
    And = 'and',
    Or = 'or',
    Eq = 'eq',
    Ne = 'ne',
    Ge = 'ge',
    Le = 'le',
    Gt = 'gt',
    Lt = 'lt',
    Add = 'add',
    Sub = 'sub',
    Mul = 'mul',
    Div = 'div',
    Divby = 'divby',
    Mod = 'mod',
    Has = 'has',
    Not = 'not'
}


export enum FuncNames2Args {
    Concat = 'concat',
    Contains = 'contains',
    Endswith = 'endswith',
    Indexof = 'indexof',
    MatchesPattern = 'matchesPattern',
    Startswith = 'startswith',
    Geo_distance = 'geo.distance',
    Geo_intersects = 'geo.intersects',
    Hassubset = 'hassubset',
    Hassubsequence = 'hassubsequence'
}

export enum FuncNames1Args {
    Length = 'length',
    Tolower = 'tolower',
    Toupper = 'toupper',
    Trim = 'trim',
    Year = 'year',
    Month = 'month',
    Day = 'day',
    Hour = 'hour',
    Minute = 'minute',
    Second = 'second',
    Fractionalseconds = 'fractionalseconds',
    Totalseconds = 'totalseconds',
    Date = 'date',
    Time = 'time',
    Totaloffsetminutes = 'totaloffsetminutes',
    Round = 'round',
    Floor = 'floor',
    Ceiling = 'ceiling',
    Geo_length = 'geo.length'
}

export enum FuncNames0Args {
    Mindatetime = 'mindatetime',
    Maxdatetime = 'maxdatetime',
    Now = 'now'
}

export enum FuncNamesVarArgs {
    Isof = 'isof',
    Cast = 'cast',
    Substring = 'substring',
    Case = 'case'
}


/**
 * Order parser nodes
 */
export enum OrderDirection {
    Asc = 'asc',
    Desc = 'desc'
}

export type OrderbyNode = {
    nodeType: NodeTypes.OrderbyNode;
    value: OrderbyItemNode[];
}

export type OrderbyItemNode = {
    nodeType: NodeTypes.OrderbyItemNode;
    type: OrderDirection;
    value: string;
}

/**
 * Compute Parser Nodes
 */

export type ComputeNode = {
    nodeType: NodeTypes.ComputeNode,
    value: ComputeItemNode[]
}

export type ComputeItemNode = {
    nodeType: NodeTypes.ComputeItemNode,
    commonExpr: FilterNode,
    computeIdentifier: string
}

/**
 * Select parser nodes
 */


export type SelectNode = {
    nodeType: NodeTypes.SelectNode;
    value: SelectPathNode[];

}
export type SelectPathNode = {
    nodeType: NodeTypes.SelectPathNode;
    value: SelectItemNode[];
    options?: SelectOptionsNode | SelectOptionsUnprocessedNode
}
export type SelectItemNode = SelectIdentifierNode | SelectFunctionNode


export type SelectFunctionNode = {
    nodeType: NodeTypes.SelectFunctionNode;
    func: string;
    args: SelectIdentifierNode[];

}

export type SelectIdentifierNode = {
    nodeType: NodeTypes.SelectIdentifierNode;
    flag?: SelectIdentifierFlags;
    value: string;
}

export type SelectOptionsUnprocessedNode = {
    nodeType: NodeTypes.SelectOptionsUnprocessedNode,
    value: string;
}

export type SelectOptionsNode = {
    nodeType: NodeTypes.SelectOptionsNode,
    value: SelectOptions;
}

export type SelectOptions = {
    aliasAndValue?: any;
    compute?: ComputeNode;
    expand?: ExpandNode;
    filter?: FilterNode;
    count?: any;
    orderby?: OrderbyNode;
    search?: SearchNode;
    select?: SelectNode;
    skip?: number;
    top?: number;
}

export enum SelectIdentifierFlags {
    AllOperationsInSchema = "AllOperationsInSchema", //Name.*
    Annotation = "Annotation" //@Measures.Currency
}

/**
 * Search parser nodes
 */

export type SearchNode = SearchOperatorNode | SearchItemNode

export type SearchOperatorNode = {
    nodeType: NodeTypes.SearchOperatorNode,
    op: SearchOperators,
    left?: SearchNode,
    right: SearchNode
}

export type SearchItemNode = {
    nodeType: NodeTypes.SearchItemNode,
    type: SearchItemTypes,
    value: string
}

export enum SearchOperators {
    And = "AND",
    Or = "OR",
    Not = "NOT"
}

export enum SearchItemTypes {
    Phrase = "Phrase",
    Word = "Word"
}

/**
 * Expand parser nodes
 */


export type ExpandNode = {
    nodeType: NodeTypes.ExpandNode;
    value: ExpandItemNode[];

}
export type ExpandItemNode = ExpandPathNode | ExpandValueNode | ExpandIdentifierNode


export type ExpandPathNode = {
    nodeType: NodeTypes.ExpandPathNode;
    value: (ExpandIdentifierNode | ExpandStarNode)[];
    options?: ExpandOptionsUnprocessedNode | ExpandOptions
    optionType?: "default" | "ref" | "count"
}

export type ExpandIdentifierNode = {
    nodeType: NodeTypes.ExpandIdentifierNode;
    flag?: ExpandIdentifierFlags;
    value: string;
}

export type ExpandOptionsUnprocessedNode = {
    nodeType: NodeTypes.ExpandOptionsUnprocessedNode,
    value: string,
    type: "default" | "ref" | "count"
}

export type ExpandStarNode = {
    nodeType: NodeTypes.ExpandStarNode,
    options: {
        ref?: boolean,
        levels?: number | "max"
    }
}

export type ExpandValueNode = {
    nodeType: NodeTypes.ExpandValueNode
}

export type ExpandOptions = {
    aliasAndValue?: any;
    compute?: ComputeNode;
    expand?: ExpandNode;
    filter?: FilterNode;
    count?: any;
    orderby?: OrderbyNode;
    search?: any;
    select?: SelectNode;
    skip?: number;
    top?: number;
}

export enum ExpandIdentifierFlags {
    Annotation = "Annotation" //@Measures.Currency
}

