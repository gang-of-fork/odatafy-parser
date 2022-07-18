/**
 * Node Types
 */

export enum NodeTypes {
    OperatorNode = 'OperatorNode',
    ConstantNode = 'ConstantNode',
    SymbolNode = 'SymbolNode',
    FuncNode2Args = 'FuncNode2Args',
    FuncNode1Args = 'FuncNode1Args',
    FuncNode0Args = 'FuncNode0Args',
    FuncNodeVarArgs = 'FuncNodeVarArgs',
    FuncNodeCase = 'FuncNodeCase',
    EnumValueNode = 'EnumValueNode',
    OrderbyNode = 'OrderbyNode',
    OrderbyItemNode = 'OrderbyItemNode',
    ExpandNode = 'ExpandNode',
    ExpandIdentifierNode = 'ExpandIdentifierNode',
    ComputedNode = 'ComputedNode',
    ComputedItemNode = 'ComputedItemNode',
    SelectNode = 'SelectNode',
    SelectFunctionNode = 'SelectFunctionNode',
    SelectPathNode = 'SelectPathNode',
    SelectIdentifierNode = 'SelectIdentifierNode',
    SelectOptionsUnprocessedNode = 'SelectOptionsUnprocessedNode',
    SelectOptionsNode = 'SelectOptionsNode'
}

/** 
 * General nodes
 */

 export type ConstantNode = {
    nodeType: NodeTypes.ConstantNode;
    type: ConstantNodeTypes;
    value: any;
}

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

export enum SymbolNodeTypes {
    Identifier = 'Identifier',
    MemberExpression = 'MemberExpression',
    Collection = 'Collection',
    TypeName = 'TypeName'
}



/**
 * Filter parser node
 */

export type FilterNode = OperatorNode | ConstantNode | SymbolNode | FuncNode2Args | FuncNode1Args | FuncNode0Args | EnumValueNode | undefined
export type FuncArg = ConstantNode | SymbolNode | FuncNode2Args | FuncNode1Args | FuncNode0Args | EnumValueNode

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
 * Expand parser nodes
 */

export type ExpandNode = {
    nodeType: NodeTypes.ExpandNode;
    value: ExpandItemNode[];
}

export type ExpandItemNode = {
    nodeType: NodeTypes.ExpandIdentifierNode;
    identifier: string;
    options: ExpandItemOptions
}

export type ExpandItemOptions = {
    filter?: FilterNode;
    orderby?: OrderbyNode;
    skip?: number;
    top?: number;
}

/**
 * Computed Parser Nodes
 */

export type ComputedNode = {
    nodeType: NodeTypes.ComputedNode,
    value: ComputedItemNode[]
}

export type ComputedItemNode = {
    nodeType: NodeTypes.ComputedItemNode,
    commonExpr: FilterNode,
    computedIdentifier: string
}

/**
 * Select parser nodes
 */


export type SelectNode = {
    nodeType: NodeTypes.SelectNode;
    value: SelectItemNode[];

}
export type SelectItemNode = SelectFunctionNode | SelectPathNode | SelectIdentifierNode | SelectOptionsUnprocessedNode


export type SelectFunctionNode = {
    nodeType: NodeTypes.SelectFunctionNode;
    func: string;
    args: SelectIdentifierNode[];
    
}
export type SelectPathNode = {
    nodeType: NodeTypes.SelectPathNode;
    value: SelectIdentifierNode[];
}

export type SelectIdentifierNode = {
    nodeType: NodeTypes.SelectIdentifierNode;
    flag?: SelectIdentifierFlags;
    value: string;
    selectOptions?: SelectOptionsUnprocessedNode | SelectOptionsNode
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
    computed?: ComputedNode;
    expand?: ExpandNode;
    filter?: FilterNode;
    inlinecount?: any;
    orderby?: OrderbyNode;
    search?: any;
    select?: SelectNode;
    skip?: number;
    top?: number;
}

export enum SelectIdentifierFlags {
    AllOperationsInSchema = "AllOperationsInSchema", //Name.*
    Annotation = "Annotation" //@Measures.Currency
}