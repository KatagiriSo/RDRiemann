import { Ope } from "./Ope";
import { getIndex } from "./GetIndex";
import { isAdd, cosistencyCheckAdd } from "./Add";
import { isProd, cosistencyCheckProd } from "./Prod";
import { Index } from ".";
import { isSymbol, cosistencyCheckSymbol } from "./Symbol";
import { isDiff, cosistencyCheckDiff } from "./Diff";

export function cosistencyCheck(ope: Ope): "OK" | Error {
    if (isSymbol(ope)) {
        return cosistencyCheckSymbol(ope);
    }
    if (isProd(ope)) {
        return cosistencyCheckProd(ope);
    }
    if (isAdd(ope)) {
        return cosistencyCheckAdd(ope);
    }

    if (isDiff(ope)) {
        return cosistencyCheckDiff(ope);
    }

    return "OK";
}