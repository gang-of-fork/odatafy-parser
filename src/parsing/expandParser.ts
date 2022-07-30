import querystring from 'querystring';
import matchBracket from 'find-matching-bracket';

import filterParser from './filterParser';
import orderbyParser from './orderbyParser';
import skipParser from './skipParser';
import topParser from './topParser';
import { ExpandNode, NodeTypes, ExpandItemOptions } from '../types/nodes';

import { getIdentifier, Prefixes } from '../processing/filterExpressionPreProc';

export function parseExpand(expr: string): ExpandNode {
    /**
     * Preprocessing
     */
    let escapedExpr = expr;
    let escapeResolver: { [key: string]: string } = {}

    while (escapedExpr.includes('(')) {
        for (let i = 0; i < escapedExpr.length; i++) {
            if (escapedExpr.charAt(i) == '(') {
                const endPos = matchBracket(escapedExpr, i);
                const identifier = getIdentifier(Prefixes.Func_Escape);
                escapeResolver[identifier] = escapedExpr.substring(i + 1, endPos);
                escapedExpr = escapedExpr.substring(0, i) + identifier + escapedExpr.substring(endPos + 1);
                break;
            }
        }
    }

    const identifiers = Object.keys(escapeResolver);
    const expandFields = escapedExpr.split(',').map(esc => esc.trim());

    const result: ExpandNode = {
        nodeType: NodeTypes.ExpandNode,
        value: []
    }

    /**
     * Construct ast for expand, with options, currently supports $filter, $expand, $orderby, $skip, $top
     */
    for (let exField of expandFields) {
        let hasIdent = false;

        for (let ident of identifiers) {
            //field includes resolve identifier -> has options
            if(exField.includes(ident)) {
                const parsedOptions = querystring.parse(escapeResolver[ident], ";")
                let options: ExpandItemOptions = {}

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

                result.value.push({
                    nodeType: NodeTypes.ExpandIdentifierNode,
                    identifier: exField.replace(ident, ''),
                    options: options
                });

                hasIdent = true;
                break;
            }
        }

        //field without options
        if(!hasIdent) {
            result.value.push({
                nodeType: NodeTypes.ExpandIdentifierNode,
                identifier: exField,
                options: {}
            });
        }
    }

    return result;
}

export default {
    parse: parseExpand
}