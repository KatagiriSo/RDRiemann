import { Ope } from "./Ope";
import { Index } from ".";

export function identify<T>(t: T): T {
    return t;
}

export namespace Util {
    export type Ans<T> = (t: T) => boolean;
    export function findIndex<T>(list: T[], ans: Ans<T>): number | null {
        for (let index = 0; index < list.length; index++) {
            if (ans(list[index])) {
                return index;
            }
        }
        return null;
    }
    export function divide<T>(list: T[], index: number): { first: T[], target: T, last: T[] } | Error {
        if (list.length <= index) {
            return new Error("divide index:" + index + "length:" + list.length);
        }
        const f: T[] = list.slice(0, index)
        const l: T[] = list.slice(index + 1);
        const t = list[index];
        return {
            first: f,
            target: t,
            last: l
        }
    }

    export function copyObj<T>(ope: T): T {
        let ob: any = {};
        for (let key in ope) {
            let o = ope as any;
            ob[key] = o[key];
        }
        return ob;
    }

    export function copy<Ope>(list: Ope[]): Ope[] {
        const ret = list.map((oo: Ope) => {
            const o = oo;
            const copied: Ope = copyObj(o);
            return copied;
        });
        return ret;
    }

    export function errorCheck<T>(list: (T|Error)[]): T[]|Error {
        for (let o of list) {
            if (o instanceof Error) {
                return o;
            }
        }
        return list as T[];
    }

    export function listAllCheck<T>(list: T[], ans: Ans<T>): boolean {
        for (let o of list) {
            if (!ans(o)) {
                return false;
            }
        }
        return true;
    }

    export function flatten<T>(list: (T[])[]): T[] {
        let ret:T[] = [];
        for (let l of list) {
            ret = ret.concat(l);
        }
        return ret;
    }

    export function exchangeIndex(list: Index[], i1: number, i2: number): Index[] {
        const index1 = list[i1];
        const index2 = list[i2];
        console.log("exchange:" + index1.identifier + "<->" + index2.identifier);
        list[i1] = index2;
        list[i2] = index1;
        return list;
    }
}