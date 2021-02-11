import { Ope } from "./Ope";
import { isAdd, Add, makeAdd } from "./Add";
import { isProd, Prod, makeProd, makeProdList } from "./Prod";
import { isSymbol, isSymbolDep, Symbol, makeSymbol } from "./Symbol";
import { getIndex } from "./GetIndex";
import { Util } from "./Util";
import { isDiff, Diff, makeDiff } from "./Diff";
import { IndexManager, sameIndex, getFreeindex } from ".";

export namespace Func {

    export function expandDiff(ope: Ope | Error): Ope | Error {

        if (ope instanceof Error) {
            return ope;
        }

        if (isSymbol(ope)) {
            return ope;
        }

        if (isAdd(ope)) {
            const ret = ope.targets.map(expandDiff);
            const ret2 = Util.errorCheck(ret);
            if (ret2 instanceof Error) {
                return ret2;
            }
            return makeAdd(ret2);
        }

        if (isProd(ope)) {
            const ret = ope.targets.map(expandDiff);
            const ret2 = Util.errorCheck(ret);
            if (ret2 instanceof Error) {
                return ret2;
            }
            return makeProdList(ret2);
        }

        if (isDiff(ope)) {
            const diff = ope;
            if (diff.targets.length > 1) {
                return new Error("expandDiff 1 < :" + diff.targets.length)
            }
            if (diff.targets.length == 0) {
                return diff;
            }
            const target = diff.targets[0];
            if (isAdd(target)) {
                let sum = target.targets.map((o) => {
                    return makeDiff(diff.display, diff.indecies, o);
                })
                let ret = Util.errorCheck(sum);
                return makeAdd(ret);
            }
            if (isProd(target)) {
                let terms = target.targets;
                let prods: Prod[] = [];
                for (let i = 0; i < terms.length; i++) {
                    const copiedList = Util.copy(terms);
                    const t = copiedList[i];
                    const diff_t = makeDiff(diff.display, diff.indecies, t);
                    if (diff_t instanceof Error) {
                        return diff_t;
                    }
                    copiedList[i] = diff_t;
                    const term = makeProdList(copiedList);
                    prods.push(term);
                }
                let ret = makeAdd(prods);
                return ret;
            }
            if (isSymbol(target)) {
                return diff;
            }
            return new Error("diff unknown target:" + target.id);
        }
        return new Error("diff unknown ope:" + ope.id);
    }

    export function simplifyAdd(ope: Ope | Error): Ope | Error {
        if (ope instanceof Error) {
            return ope;
        }
        if (isAdd(ope)) {
            if (Util.listAllCheck(ope.targets, (o) => isAdd(o))) {
                const adds = ope.targets as Add[];
                const addss = adds.map(o => o.targets);
                const addsss = Util.flatten(addss);
                return makeAdd(addsss);
            }                             
        }
        if (isDiff(ope)) {
            if (ope.targets.length == 0) {
                return ope;
            }
            const t = simplifyAdd(ope.targets[0]);
            if (t instanceof Error) {
                return t;
            }
            return makeDiff(ope.display, ope.indecies, t)
        }
        if (isProd(ope)) {
            const terms = ope.targets;
            const termss = terms.map(simplifyAdd);
            const termsss = Util.errorCheck(termss);
            if (termsss instanceof Error) {
                return termsss;
            }
            return makeProdList(termsss);
        }
        
        if (isSymbol(ope)) {
            return ope;
        }

        return new Error("simplifyAdd unknown ope:"+ope.targets);
    }

    export function distribute(ope: Ope | Error): Ope | Error {
        if (ope instanceof Error) {
            return ope;
        }
        if (isSymbol(ope)) {
            return ope;
        }
        if (isProd(ope)) {
            return distributeProd(ope);
        }
        if (isAdd(ope)) {
            const terms = ope.targets;
            const tesmsmaped = terms.map((o) => distribute(o));
            const targetMaped2 = Util.errorCheck(tesmsmaped);
            if (targetMaped2 instanceof Error) {
                return targetMaped2;
            }
            return makeAdd(targetMaped2);
        }

        if (isDiff(ope)) {
            return ope;
        }

        return new Error("distribute ope?" + ope.id);
    }

    export function distributeProd(ope: Prod): Ope | Error {
        console.log("distributeProd");
        const index = Util.findIndex(ope.targets, (o) => isAdd(o));
        if (index == null) {
            console.log("nothing");
            return ope;
        }
        const terms = Util.divide(ope.targets, index);
        if (terms instanceof Error) {
            console.log("Error!");
            return terms;
        }

        const target = terms.target;
        const targetMaped = target.targets.map((o) => {
            let l = terms.first.concat([o]).concat(terms.last);
            return makeProdList(l);
        })
        return makeAdd(targetMaped);
    }

    export function exchange(target: Ope | Error, from: Symbol, to: Ope, im: IndexManager): Ope | Error {
        console.log("exchange");
        if (target instanceof Error) {
            return target;
        }
        if (isAdd(target)) {
            const terms = target.targets;
            const termss = Util.errorCheck(terms.map((o) => exchange(o, from, to, im)));
            if (termss instanceof Error) {
                return termss;
            }
            console.log(" add");
            return makeAdd(termss);
        }
        if (isProd(target)) {
            const terms = target.targets;
            const termss = Util.errorCheck(terms.map((o) => exchange(o, from, to, im)));
            if (termss instanceof Error) {
                return termss;
            }
            console.log(" prod");
            return makeProdList(termss);
        }
        if (isSymbol(target)) {
            let index1 = getIndex(from);
            let index2 = getIndex(to);
            let index3 = getIndex(target);

            let freeIndex1 = getFreeindex(index1);
            let freeIndex2 = getFreeindex(index2);
            let freeIndex3 = getFreeindex(index3);

            if (freeIndex1 instanceof Error) {
                return freeIndex1;
            }
            if (freeIndex2 instanceof Error) {
                return freeIndex2;
            }
            if (freeIndex3 instanceof Error) {
                return freeIndex3;
            }

            if (!sameIndex(freeIndex1, freeIndex2)) {
                return target;
            }
            if (!sameIndex(freeIndex2, freeIndex3)) {
                return target;
            }

            if (target.display != from.display) {
                return target;
            }

            return to;
        }
        if (isDiff(target)) {            
            return makeDiff(target.display, target.indecies, exchange(target, from, to, im))
        }

        return new Error("exchange unknwon target:" + target.id);
    }
}

