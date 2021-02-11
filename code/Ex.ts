import { IndexManager, transIndex, Index } from ".";
import { Ope } from "./Ope";
import { makeSymbol, Symbol } from "./Symbol";
import { makeProd, Prod } from "./Prod";
import { makeAdd, Add } from "./Add";

export namespace Ex {
    export function getAB(symbols:string[], im: IndexManager): Ope|Error {
        const i = im.getIndex("Top");
        const a: Symbol = makeSymbol(symbols[0], [i]);
        const ib = transIndex(i, "Bottom");
        const a2: Symbol = makeSymbol(symbols[1], [ib]);
        const term = makeProd(a, a2);
        return term;
    }
    export function getAPlusB(symbols: string[], index:Index): Ope|Error {
        const i = index;
        const a: Symbol = makeSymbol(symbols[0], [i]);
        const a2: Symbol = makeSymbol(symbols[1], [i]);
        const term = makeAdd([a, a2]);
        return term;
    }
}