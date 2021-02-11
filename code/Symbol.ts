import { Ope } from "./Ope";
import { Index, getFreeindex, IndexDisplay, getIndexDisplay } from ".";
import { IDHolding } from "./ID";
import { Diff } from "./Diff";

export interface Depends {
    dependes:string
}



export interface SymbolDep extends Symbol, Depends {
}


export interface Symbol extends Ope {
    id: "Symbol"
    indecies: Index[]
    display: string,
}

export function isSymbol(item: IDHolding): item is Symbol {
    if ((item as Symbol).id == "Symbol") {
        return true;
    } else {
        return false;
    }
}

export function isSymbolDep(item: IDHolding): item is SymbolDep {
    if (!isSymbol(item)) {
        return false;
    }
    if ((item as SymbolDep).dependes) {
        return true;
    }
    return false;
}

export function makeSymbol(display:string, indecies: Index[] = []): Symbol {
    const o = {
        id: "Symbol",
        indecies: indecies,
        targets: [],
        display: display
    } as Symbol;
    return o;
} 

export function getFreeindexSymbol(s: Symbol): Index[] | Error {
    const indecies = s.indecies;
    return getFreeindex(indecies);
}

export function cosistencyCheckSymbol(s: Symbol):"OK"|Error {
    let indecies = getFreeindexSymbol(s);

    if (indecies instanceof Error) {
        return indecies;
    }
    return "OK";
}

export function displaySymbol(ope: Symbol|Diff, rule: IndexDisplay):string|Error {
    let ret = ope.display;
    let top:string[] = []
    let bottom:string[] = []
    for (const index of ope.indecies) {
        const st = getIndexDisplay(rule, index.identifier);
        if (st instanceof Error) {
            return st;
        }
        if (index.indexTopBottom == "Top") {
            top.push(st);
            bottom.push("\ ");        
        } else {
            bottom.push(st);
            top.push("\ ");
        }
    }
    if (top.length > 0) {
        ret = ret + "^" + "{" + top.join("") + "}"
    }
    if (bottom.length > 0) {
        ret = ret + "_" + "{" + bottom.join("") + "}"
    }
    return ret
}