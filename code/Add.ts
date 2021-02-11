import { Ope } from "./Ope";
import { getAllAddIndexList } from "./GetIndex";
import { getFreeindex, Index } from ".";
import { IDHolding } from "./ID";
import { identify } from "./Util";

export interface Add extends Ope {
    id: "Add"
}

export function makeAdd(items: Ope[] | Error): Add | Error {
    if (items instanceof Error) {
        return items;
    }
    let adds: Add = identify<Add>({
        id: "Add",
        targets: items
    })
    return adds;
}

export function isAdd(item: IDHolding): item is Add {
    if ((item as Add).id == "Add") {
        return true;
    } else {
        return false;
    }
}

export function cosistencyCheckAdd(s: Add): "OK" | Error {
    let indecies = getAllAddIndexList(s);
    let freeIndexList = indecies.map(getFreeindex)
    for (let freeindex of freeIndexList) {
        if (freeindex instanceof Error) {
            return freeindex;
        }
    }
    const freeIndexList_ = freeIndexList as (Index[])[];
    //todo: 各indexidが同じであることをチェックする
    return "OK";
}