import { Ope } from "./Ope";
import { Index } from ".";
import { IDHolding } from "./ID";
import { identify } from "./Util";

export interface Diff extends Ope {
    id: "Diff"
    indecies: Index[]
    display: string,
}

export function isDiff(item: IDHolding): item is Diff {
    if ((item as IDHolding).id == "Diff") {
        return true;
    } else {
        return false;
    }
}

export function makeDiff(display: string, indecies: Index[], target: Ope | Error): Diff | Error {
    if (target instanceof Error) {
        return target;
    }
    const o =  identify<Diff>({
        id: "Diff",
        indecies: indecies,
        targets: [target],
        display: display
    });
    return o;
}

export function cosistencyCheckDiff(ope: Diff): "OK" | Error {
    //todo: tmp
    return "OK";
}