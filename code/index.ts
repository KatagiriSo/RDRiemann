import { identify } from "./Util";

export interface IndexRange {
    min: string,
    max: string
}

type IndexTopBottom = "Top" | "Bottom"

export interface Index {
    id:"Index"
    indexTopBottom: IndexTopBottom
    indexRange: IndexRange | null
    identifier: string
}

export function transIndex(index: Index, l: IndexTopBottom):Index {
    const copyIndex = identify<Index>({
        id: "Index",
        indexTopBottom: l,
        indexRange: index.indexRange,
        identifier: index.identifier
    });
    return copyIndex;
}

export function sameIndex(indecies1: Index[], indecies2: Index[]): boolean {
    if (indecies1.length != indecies2.length) {
        return false;
    }
    const count = indecies1.length;
    for (let i = 0; i < count; i++) {
        if (indecies1[i].identifier != indecies2[i].identifier) {
            return false;
        }
        if (indecies1[i].indexTopBottom != indecies2[i].indexTopBottom) {
            return false;
        }
    }
    return true;
}

export function reverceIndex(inds:Index[]): Index[] {
    return inds.map((i) => {
        if (i.indexTopBottom == "Top") {
            i.indexTopBottom = "Bottom";
        } else {
            i.indexTopBottom = "Top";
        }
        return i;
    })
}

export type IndexDisplay = { repo: { [key: string]: string }, alphabet: string[], count: number }

export function getIndexDisplay(rule: IndexDisplay, id: string):string|Error {
    if (rule.repo[id] == undefined) {
        if (rule.alphabet.length <= rule.count) {
            return new Error("Index alphabet range out");
        }
        rule.repo[id] = rule.alphabet[rule.count];
        // console.log("getIndexDisplay: regist id:" + id + "alphabet:" + rule.repo[id]);
        rule.count++;
    }
    // console.log("getIndexDisplay: get id:" + id + "alphabet:" + rule.repo[id]);
    return rule.repo[id];
}


export class IndexManager {
    private indexRep: { [key: string]: Index } = {}
    private count: number = 0;
    constructor() {

    }
    getIndex(lb: IndexTopBottom): Index {
        this.count++;
        // console.log("getIndex count:" + this.count);
        const ind:string = String(this.count);
        let index = identify<Index>({
            id: "Index",
            indexTopBottom: lb,
            indexRange: null,
            identifier: ind
        });
        this.indexRep[ind] = index;
        return index;
    }

}


export function getFreeindex(indecies: Index[] | Error): Index[] | Error {
    if (indecies instanceof Error) {
        return indecies;
    }
    // console.log("getFreeindex")


    const repo: { [key: string]: Index | undefined } = {}
    for (let index of indecies) {
        // console.log("index:" + JSON.stringify(index));
        const cor = repo[index.identifier];
        if (cor == undefined) {
            // console.log("regist:"+JSON.stringify(index));
            repo[index.identifier] = index;
            // console.log("repo:" + JSON.stringify(repo));
            continue;
        }
        if (cor.indexTopBottom == index.indexTopBottom) {
            // console.log("Error!");
            return new Error("cosistencyCheck indexTopBottom");
        }
        // console.log("delete:");
        repo[index.identifier] = undefined;
    }

    let ret: Index[] = [];
    // console.log("repo:"+JSON.stringify(repo));
    for (let key in repo) {
        // console.log("key:"+key);
        const v = repo[key];
        if (v != undefined) {
            // console.log("push:" + key);
            ret.push(v);
        }
    }
    return ret;
}
