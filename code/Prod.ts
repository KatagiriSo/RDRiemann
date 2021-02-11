import { Ope } from "./Ope";
import { getIndex } from "./GetIndex";
import { Index, getFreeindex } from ".";
import { IDHolding } from "./ID";
import { identify } from "./Util";

export interface Prod extends Ope {
    id: "Prod"
}

export function isProd(item: IDHolding): item is Prod {
    if ((item as Prod).id == "Prod") {
        return true;
    } else {
        return false;
    }
}

export function makeProd(left: Ope | Error, right: Ope | Error): Prod | Error {
    if (left instanceof Error) {
        return left;
    }
    if (right instanceof Error) {
        return right;
    }
    let prod: Prod = identify<Prod>({
        id: "Prod",
        targets: [left, right]
    })
    return prod;
}

export function makeProdList(opes: Ope[]): Prod {
    let prod: Prod = identify<Prod>({
        id: "Prod",
        targets: opes
    })
    return prod;
}


export function getFreeindexProd(prod: Prod): Index[]|Error {
    const indecies = getIndex(prod);
    // console.log("getFreeindexProd"+JSON.stringify(indecies));
    return getFreeindex(indecies);    
}


export function cosistencyCheckProd(s: Prod): "OK" | Error {
    // console.log("cosistencyCheckProd");
    let indecies = getFreeindexProd(s);
    if (indecies instanceof Error) {
        return indecies;
    }
    return "OK";
}