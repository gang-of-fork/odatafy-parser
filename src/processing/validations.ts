import {
    FuncNode0Args, FuncNode1Args, FuncNode2Args, FuncNodeVarArgs, 
    FuncNames1Args, FuncNames2Args, FuncNamesVarArgs, FuncNames0Args,
    FilterNode, NodeTypes, ConstantNodeTypes, ConstantNode
} from '../types/nodes';

import { getFuncSignature } from './signatureResolver';

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export function isFuncNode(node: FilterNode): boolean {
    if(!node) {
        return false;
    }

    return  Object.values(FuncNames0Args).includes((<FuncNode0Args>node).func) ||
              Object.values(FuncNames1Args).includes((<FuncNode1Args>node).func) ||
                Object.values(FuncNames2Args).includes((<FuncNode2Args>node).func) ||
                  Object.values(FuncNamesVarArgs).includes((<FuncNodeVarArgs>node).func)
}

export function isFuncNodeWithArgs(node: FilterNode): boolean {
    return isFuncNode(node) && !Object.values(FuncNames0Args).includes((<FuncNode0Args>node).func);
}

export function validateFuncNode(node: FuncNode1Args | FuncNode2Args | FuncNodeVarArgs) {
    const signatures = getFuncSignature(node.func);
    let lastMatchedSig: number[] = [];

    for(let i=0; i<node.args.length; i++) {
        let isSymbolNode = false;
        let typesToMatch: ConstantNodeTypes[] = [];
        let matched: number[] = []


        if(node.args[i].nodeType == NodeTypes.SymbolNode) { //is symbol node
            isSymbolNode = true;

            if(i == 0) { //if symbolnode and initial -> match all signatures
                lastMatchedSig = Array.from(Array(signatures.length).keys());
            }
        } else if(node.args[i].nodeType == NodeTypes.ConstantNode) { //is constant node
            
            typesToMatch = [ (<ConstantNode>node.args[i]).type ]
        } else { //is nested function node
            if(!Object.values(FuncNames0Args).includes((<FuncNode0Args>node.args[i]).func)) { //if 
                validateFuncNode(node.args[i] as FuncNode1Args | FuncNode2Args | FuncNodeVarArgs);
            }

            typesToMatch = getFuncSignature(
                (<FuncNode0Args | FuncNode1Args | FuncNode2Args | FuncNodeVarArgs>node.args[i]).func
            ).map(sig => sig.returnType);
        }


        //no need to check if symbolnode -> matches any signature
        if(!isSymbolNode) {
            for(let j=0; j<signatures.length; j++) {
                if(typesToMatch.includes(signatures[j].params[i])) {
                    matched.push(j)
                }
            }

        
            if(i == 0) {
                lastMatchedSig = matched;
            } else {
                lastMatchedSig = matched.filter(m => lastMatchedSig.includes(m));
            }
        }

        if(lastMatchedSig.length == 0) {
            throw new ValidationError(`Invalid arguemnts passed to function ${node.func}`)       
        }
    }
}