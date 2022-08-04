import url from 'url';

import computeParser from './parsing/computeParser';
import filterParser from './parsing/filterParser';
import orderbyParser from './parsing/orderbyParser';
import skipParser from './parsing/skipParser';
import topParser from './parsing/topParser';
import expandParser from './parsing/expandParser';
import selectParser from './parsing/selectParser';

import { FilterNode, OrderbyNode, ExpandNode, ComputeNode, SelectNode, SearchNode } from './types/nodes';
import searchParser from './parsing/searchParser';

export type oDataParameters = {
    filter?: string;
    orderby?: string;
    skip?: string;
    top?: string;
    expand?: string;
    compute?: string;
    select?: string;
    search?: string;
}

export type oDataParseResult = {
    filter?: FilterNode;
    orderby?: OrderbyNode;
    skip?: number;
    top?: number; 
    expand?: ExpandNode;
    compute?: ComputeNode;
    select?: SelectNode;
    search?: SearchNode;
}

/**
 * parse oData parameter expressions
 * @param parameters oData url parameters
 * @returns parsed oData parameters
 */
 function parseOData(parameters: oDataParameters): oDataParseResult {
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
    
    if(parameters.compute) {
        result.compute = computeParser.parse(parameters.compute);
    }

    if(parameters.select) {
        result.select = selectParser.parse(parameters.select);
    }

    if(parameters.search) {
        result.search = searchParser.parse(parameters.search);
    }
    return result;
}

/**
 * parse oData parameter expressions from url
 * @param oDataUrl oData url as string, from req.url
 * @example //returns {top: 4}
 * parseODataUrl("//https://services.odata.org/v2/northwind/northwind.svc/Customers?$top=4")
 * @returns parsed oData parameters
 */
export function parseODataUrl(oDataUrl: string): oDataParseResult {
    const query = url.parse(oDataUrl, true).query;
    const validParams = [ 'filter', 'orderby', 'skip', 'top', 'expand', 'compute', 'select', 'search'];
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

export { filterParser, orderbyParser, skipParser, topParser, expandParser, computeParser, selectParser, searchParser };