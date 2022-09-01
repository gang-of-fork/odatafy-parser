import peggy from 'peggy';
/*
import { NodeTypes, SelectNode, SelectOptions, SelectOptionsNode, SelectOptionsUnprocessedNode } from '../types/nodes';
import querystring from 'querystring';
import filterParser from './filterParser';
import orderbyParser from './orderbyParser';
import skipParser from './skipParser';
import topParser from './topParser';
import computeParser from './computeParser';
*/


//TODO add annotations to path

let expandParser = peggy.generate(`

`)

function parseExpand(expr: string) {
    let ast = expandParser.parse(expr);
    /*
    for(let selectItem of ast.value) {
      switch(selectItem.nodeType) {

        case NodeTypes.SelectIdentifierNode:
          if (selectItem.selectOptions && selectItem.selectOptions.nodeType == NodeTypes.SelectOptionsUnprocessedNode) {
            selectItem.selectOptions = processSelectOptionsUnprocessedNode(selectItem.selectOptions)
          }
          break;

        case NodeTypes.SelectPathNode:
          for(let identNode of selectItem.value) {
            if (identNode.selectOptions && identNode.selectOptions.nodeType == NodeTypes.SelectOptionsUnprocessedNode) {
              identNode.selectOptions = processSelectOptionsUnprocessedNode(identNode.selectOptions)
            }
          }
          break;
      }
    }
    */
    return ast
}
/*
export function processSelectOptionsUnprocessedNode(SelectOptionsUnprocessedNode: SelectOptionsUnprocessedNode): SelectOptionsNode {
  const parsedOptions = querystring.parse(SelectOptionsUnprocessedNode.value, ";")
                let options: SelectOptions = {}

                //parse options
                if(parsedOptions.$filter && typeof parsedOptions.$filter == 'string') {
                    options.filter = filterParser.parse(parsedOptions.$filter);
                }

                if(parsedOptions.$orderby && typeof parsedOptions.$orderby == 'string') {
                    options.orderby = orderbyParser.parse(parsedOptions.$orderby);
                }

                if(parsedOptions.$skip && typeof parsedOptions.$skip == 'string') {
                    options.skip = skipParser.parse(parsedOptions.$skip);
                }

                if(parsedOptions.$top && typeof parsedOptions.$top == 'string') {
                    options.top = topParser.parse(parsedOptions.$top);
                }

                if(parsedOptions.$select && typeof parsedOptions.$select == 'string') {
                  options.select = parseSelect(parsedOptions.$select);
                }

                if(parsedOptions.$compute && typeof parsedOptions.$compute == 'string') {
                  options.compute = computeParser.parse(parsedOptions.$compute);
                }

                if(parsedOptions.$expand && typeof parsedOptions.$expand == 'string') {
                  options.expand = expandParser.parse(parsedOptions.$expand);
                }

                if(parsedOptions.$count && typeof parsedOptions.$count == 'string') {
                  options.count = true
                }
                /* ALSO ADD TEST WHEN ACTIVATING
                if(parsedOptions.$search && typeof parsedOptions.$search == 'string') {
                  options.search = searchParser.parse(parsedOptions.$search);
                }
                */
/*
                //TODO search
                return {
                  nodeType: NodeTypes.SelectOptionsNode,
                  value: options
                };
}
*/

export default {
  /**
     * Parser for select expressions
     * @param expr select expression as string
     * @example selectParser.parse("Name,Age")
     * @returns Abstract Syntax Tree (AST) of type SelectNode
     */
    parse: parseExpand
}



