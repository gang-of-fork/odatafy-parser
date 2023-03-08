import { OdatafyQueryOptions } from '../types/errors';
import { OrderbyNode, OrderDirection, NodeTypes } from '../types/nodes';
import { getOdatafyParserError } from '../utils';

export default {
  /**
   * Parser for orderby expression
   * @param expr orderby expression as string
   * @example orderbyParser.parse("Country/Name asc,Street desc")
   * @returns AbstractSyntaxTree (AST) of type OrderbyNode
   */
  parse: function parseOrderby(expr: string): OrderbyNode {
    const regexp = new RegExp(
      '^(([a-zA-z/]+ (asc|desc),)|[a-zA-z/]+,)*(([a-zA-z/]+ (asc|desc))|[a-zA-z/]+)$',
      'gmy'
    );
    if (regexp.test(expr)) {
      return {
        nodeType: NodeTypes.OrderbyNode,
        value: expr.split(',').map((ele) => {
          const splt_ele = ele.trim().split(' ');
          return {
            nodeType: NodeTypes.OrderbyItemNode,
            type: (splt_ele.length == 1
              ? OrderDirection.Asc
              : splt_ele[1]) as OrderDirection,
            value: splt_ele[0]
          };
        })
      };
    } else {
      throw getOdatafyParserError(
        'malformed orderby expression',
        OdatafyQueryOptions.OrderBy
      );
    }
  }
};
