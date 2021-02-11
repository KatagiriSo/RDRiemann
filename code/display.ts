import { Ope } from "./Ope";
import { IndexManager, IndexDisplay } from ".";
import { isSymbol, displaySymbol } from "./Symbol";
import { isProd } from "./Prod";
import { isAdd } from "./Add";
import { isDiff } from "./Diff";

export function defaultIndexRule(): IndexDisplay {
    let alphabet: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
        "t", "u", "v", "w", "x", "y", "z"];
    let rule: IndexDisplay = { repo: {}, alphabet: alphabet, count: 0 }
    return rule;
}


export function display(ope: Ope | Error, rule: IndexDisplay): string | Error {
    if (ope instanceof Error) {
        return ope.message;
    }
    if (isSymbol(ope)) {
        return displaySymbol(ope, rule);
    }
    if (isProd(ope)) {
        return ope.targets.map((t) => display(t, rule)).join("");
    }
    if (isAdd(ope)) {
        return "("+ope.targets.map((t) => display(t, rule)).join("+")+")";
    }

    if (isDiff(ope)) {
        if (ope instanceof Error) {
            return ope;
        }
        return displaySymbol(ope, rule) + "(" + ope.targets.map((t) => display(t, rule)) + ")";
    }

    return new Error("display ope:" + JSON.stringify(ope));
}
