import { Ope } from "./Ope";

import { Index } from ".";

import { isSymbol } from "./Symbol";
import { isProd } from "./Prod";
import { isAdd, Add } from "./Add";
import { isDiff } from "./Diff";

export function getIndex(ope: Ope): Index[] {
    if (isSymbol(ope)) {
        // console.log("getIndex symbol:" + JSON.stringify(ope.indecies));
        return ope.indecies;
    }
    if (isProd(ope)) {
        let list:Index[] = []
        for (ope of ope.targets) {
            const idx = getIndex(ope);
            list = list.concat(idx);
        }
        return list;
    }
    if (isAdd(ope)) {
        return getIndex(ope.targets[0]);
    }
    if (isDiff(ope)) {
        return ope.indecies.concat(getIndex(ope.targets[0]));
    }
    return [];
}

export function getAllAddIndexList(add: Add): (Index[])[] {
    return add.targets.map((ope) => getIndex(ope));
}
