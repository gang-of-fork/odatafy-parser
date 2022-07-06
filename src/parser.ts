import url from 'url';

import computedParser from './parsing/computedParser';
import filterParser from './parsing/filterParser';
import orderbyParser from './parsing/orderbyParser';
import skipParser from './parsing/skipParser';
import topParser from './parsing/topParser';
import expandParser from './parsing/expandParser';

import { FilterNode, OrderbyNode, ExpandNode, ComputedNode } from './types/nodes';

export type oDataParameters = {
    filter?: string;
    orderby?: string;
    skip?: string;
    top?: string;
    expand?: string;
    computed?: string;
}

export type oDataParseResult = {
    filter?: FilterNode;
    orderby?: OrderbyNode;
    skip?: number;
    top?: number; 
    expand?: ExpandNode;
    computed?: ComputedNode;
}

/**
 * parse oData parameter expressions
 * @param parameters oData url parameters
 * @returns parsed oData parameters
 */
export function parseOData(parameters: oDataParameters): oDataParseResult {
    let result: oDataParseResult = {};

    if(parameters.filter) {
        result.filter = filterParser.parse(parameters.filter);
    }

    if(parameters.orderby) {
        result.orderby = orderbyParser.parse(parameters.orderby);
    }

    if(parameters.skip) {
        result.skip = skipParser.parse(parameters.skip);
    }

    if(parameters.top) {
        result.top = topParser.parse(parameters.top);
    }

    if(parameters.expand) {
        result.expand = expandParser.parse(parameters.expand);
    }
    
    if(parameters.computed) {
        result.computed = computedParser.parse(parameters.computed);
    }
    return result;
}

/**
 * parse oData parameter expressions from url
 * @param oDataUrl oData url as string, from req.url
 * @returns parsed oData parameters
 */
export function parseODataUrl(oDataUrl: string): oDataParseResult {
    const query = url.parse(oDataUrl, true).query;
    const validParams = [ 'filter', 'orderby', 'skip', 'top', 'expand', 'computed' ];
    const params = Object.keys(query);

    let parseParameters: oDataParameters = {}

    validParams.forEach((param: string) =>{
        //check if url 
        if(params.includes(param) && params.includes('$' + param)) {
            throw new Error(`Malformed oData url, cannot contain param: ${param} and param: $${param}`)
        }

        if(params.includes(param) || params.includes('$' + param)) {
            parseParameters[param as keyof oDataParameters] = query[(params.includes(param)? param: '$' + param)] as string
        }
    });

    return parseOData(parseParameters);
}

export { filterParser, orderbyParser, skipParser, topParser, expandParser, computedParser };