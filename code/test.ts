import { IndexManager, transIndex, getFreeindex, Index } from ".";

import { makeSymbol, Symbol, displaySymbol } from "./Symbol";
import { makeProd, Prod, getFreeindexProd } from "./Prod";
import { cosistencyCheck } from "./Check";
import { getIndex } from "./GetIndex";
import { display, defaultIndexRule } from "./display";
import { Ex } from "./Ex";
import { makeAdd, Add } from "./Add";
import { Func } from "./Expand";
import { Ope } from "./Ope";
import { Util } from "./Util";
import { makeDiff } from "./Diff";

export function test() {
    testSlice();
    testSymbol();
    test1();
    test2();
    test3();
    test4();
    testExpand();
    testDiff();
    testEchange();
    testRieman();
}

function log(txt: string) {
    console.log(txt)
}

function logStart(txt: string) {
    log("")
    log("[Start] "+txt+" --------")
}

function logEnd(txt: string) {
    log("[END] " + txt + " --------")
    log("")
}


function testSlice() {
    logStart("testSlice");
    const list = ["a", "b", "c", "d", "e", "f"];
    log("list" + list.toString());
    log("slice(0,1)" + list.slice(0, 1).toString());
    log("slice(0,0)" + list.slice(0, 0).toString());
    log("slice(2,2)" + list.slice(2, 2).toString());
    log("slice(4,5)" + list.slice(4, 5).toString());
    log("slice(5,5)" + list.slice(5, 5).toString());
    log("slice(3)" + list.slice(3).toString());
    log("slice(3, undefined)" + list.slice(3, undefined).toString());
    const terms = Util.divide(list, 3);
    if (terms instanceof Error) {
        log("Util.divide(list, 3)" + terms.message);
    } else {
        log("Util.divide(list, 3) f:" + terms.first)
        log("Util.divide(list, 3) t:" + terms.target)
        log("Util.divide(list, 3) l:" + terms.last)
    }
    const terms2 = Util.divide(list, 5);
    if (terms2 instanceof Error) {
        log("Util.divide(list, 5)" + terms2.message);
    } else {
        log("Util.divide(list, 5) f:" + terms2.first)
        log("Util.divide(list, 5) t:" + terms2.target)
        log("Util.divide(list, 5) l:" + terms2.last)
    }
    logEnd("testSlice")
}

function testSymbol() {
    const im = new IndexManager();
    const i = im.getIndex("Top");
    const a: Symbol = makeSymbol("A",[i]);
    const i2 = im.getIndex("Bottom");
    const a2: Symbol = makeSymbol("B",[i2]);
    const term: Prod|Error = makeProd(a, a2);

    
    logStart("testSymbol");

    if (term instanceof Error) {
        log("[Error]testSymbol:" + term.message);
        return;
    }
    if (a.indecies.length != 1) {
        log("[Error]a.indecies.length == 1");
    }
    if (term.targets[0].id != "Symbol") {
        log("[Error]term.targets[0].id != Symbol");
    }

}

function test1() {
    log("test1");
    const im = new IndexManager();
    const i = im.getIndex("Top");
    const a: Symbol = makeSymbol("A",[i]);
    const i2 = im.getIndex("Bottom");
    const a2: Symbol = makeSymbol("B",[i2]);
    const term: Prod|Error = makeProd(a, a2);
    if (term instanceof Error) {
        log("[Error]test1:" + term.message);
        return;
    }

    let res = cosistencyCheck(term);
    if (res != "OK") {
        log("Free Index Error");
        log(res.toString());
    }
    let free = getFreeindexProd(term);
    if (free instanceof Error) {
        log("Free Index Error");
        log(res.toString());
    }
    const fi = free as Index[];
    if (fi.length != 2) {
        log("[Error]Free Index.count == 2");
        log("index:" + getIndex(term));
        log("free index:"+fi);
    }
    logEnd("testSymbol");
}

function test2() {
    logStart("test2");
    const im = new IndexManager();
    const i = im.getIndex("Top");
    const a: Symbol = makeSymbol("A",[i]);
    const ib = transIndex(i, "Bottom");
    const a2: Symbol = makeSymbol("B",[ib]);
    const term: Prod|Error = makeProd(a, a2);
    if (term instanceof Error) {
        log("[Error]test2:" + term.message);
        return;
    }

    let res = cosistencyCheck(term);
    // log(res.toString());
    if (res != "OK") {
        log("Top Bottom Error");
        log(res.toString());
    }
    logEnd("test2");
}

function test3() {
    logStart("test3");
    const im = new IndexManager();
    const i = im.getIndex("Top");
    const a: Symbol = makeSymbol("A",[i]);
    const ib = transIndex(i, "Top");
    const i2 = im.getIndex("Bottom");
    const a2: Symbol = makeSymbol("B",[ib]);
    const term: Prod|Error = makeProd(a, a2);
    if (term instanceof Error) {
        log("[Error]test3:" + term.message);
        return;
    }


    let res = cosistencyCheck(term);
    // log(res.toString());
    if (res == "OK") {
        log("Doublue Index Top Error!");
        log(res.toString());
    }
    logEnd("test3");
}

function test4() {
    logStart("test4");
    const im = new IndexManager();
    const i = im.getIndex("Top");
    const a: Symbol = makeSymbol("A", [i]);
    const ib = transIndex(i, "Bottom");
    const a2: Symbol = makeSymbol("B", [ib]);
    const term: Prod|Error = makeProd(a, a2);
    if (term instanceof Error) {
        log("[Error]test4:" + term.message);
        return;
    }

    log("display:A^a == " + display(a, defaultIndexRule()));
    log("display:B_a == " + display(a2, defaultIndexRule()));
    log("display:A^aB_a == " + display(term, defaultIndexRule()));

    logEnd("test4");
}



function testExpand() {
    logStart("testExpand");
    const im = new IndexManager();
    const index = im.getIndex("Top");
    const term = Ex.getAPlusB(["A", "B"], index);
    const botindex = transIndex(index, "Bottom");
    const sym = makeSymbol("C", [botindex]);
    const ex = makeProd(sym, term);

    log("display:C(A+B) == " + display(ex, defaultIndexRule()));
    log("display:C(A+B) == " + display(Func.distribute(ex) as Ope, defaultIndexRule()));
    logEnd("testExpand")
}

function testDiff() {
    logStart("testDiff");
    const im = new IndexManager();
    const index = im.getIndex("Top");
    const term = Ex.getAPlusB(["A", "B"], index);
    const botindex = transIndex(index, "Bottom");
    const sym = makeSymbol("C", [botindex]);
    const ex = makeProd(sym, term);
    const indexdiff = im.getIndex("Top");
    const diffEx = makeDiff("∂", [indexdiff], ex);
    const diffEx2 = Func.expandDiff(diffEx);
    const diffEx3 = Func.expandDiff(diffEx2);
    const diffEx4 = Func.expandDiff(diffEx3);
    const diffEx5 = Func.distribute(diffEx4);
    const diffEx6 = Func.simplifyAdd(diffEx5);



    log("display:C(A+B) == " + display(ex, defaultIndexRule()));
    log("display:C(A+B) == " + display(Func.distribute(ex) as Ope, defaultIndexRule()));
    log("display:∂(C(A+B)) == " + display(diffEx as Ope, defaultIndexRule()));
    log("display:∂(C(A+B)) == " + display(Func.expandDiff(diffEx) as Ope, defaultIndexRule()));
    log("display:∂(C(A+B)) == " + display(Func.expandDiff(diffEx2) as Ope, defaultIndexRule()));
    log("display:∂(C(A+B)) == " + display(Func.expandDiff(diffEx3) as Ope, defaultIndexRule()));
    log("display:∂(C(A+B)) == " + display(Func.expandDiff(diffEx4) as Ope, defaultIndexRule()));
    log("display:∂(C(A+B)) == " + display(Func.expandDiff(diffEx5) as Ope, defaultIndexRule()));
    log("display:∂(C(A+B)) == " + display(Func.expandDiff(diffEx6) as Ope, defaultIndexRule()));

    logEnd("testDiff")
}

function makeRic(im: IndexManager): Symbol {
    const indexBottom1 = im.getIndex("Bottom");
    const indexBottom2 = im.getIndex("Bottom");
    const ric = makeSymbol("Ric", [indexBottom1, indexBottom2])
    return ric
}

function makeChristoffel(im: IndexManager, indecies:Index[]): Symbol {
    const gamma = makeSymbol("Γ", indecies);
    return gamma;
}

//TODO
// function makeChristoffelOfMetric(im: IndexManager, indecies: Index[]): Add | Error {
//     //todo:
    
   
// }


function makeRiemanOfChristoffel(im: IndexManager, indecies:Index[]): Add|Error {
    const gamma1 = makeChristoffel(im, indecies.slice(0,2).concat(indecies.slice(3)));
    const bottomIndex = indecies[2];
    const term1 = makeDiff("∂", [bottomIndex], gamma1);

    const gamma2 = makeChristoffel(im, indecies.slice(0, 3));
    const bottomIndex2 = indecies[3];
    const term2 = makeDiff("∂", [bottomIndex2], gamma2);

    // const gamma2 = Util.copyObj(gamma);
    // const term2 = makeDiff("∂", [bottomIndex], gamma2);
    // if (term2 instanceof Error) {
    //     return term2;
    // }
    let rule = defaultIndexRule();
    // log(display(term2, rule));
    // const indecies = getIndex(term2);

    // Util.exchangeIndex(indecies, 0, 3);
    // const index0 = term2.indecies[0];
    // const index3 = (term2.targets[0] as Symbol).indecies[2];
    // term2.indecies = [index3];
    // (term2.targets[0] as Symbol).indecies[2] = index0;
    // log(display(term2, rule));


    // const indextop = gamma.indecies[0];
    // const indexBottom1 = gamma.indecies[1];
    // const indexBottom2 = gamma.indecies[2];

    // const gamma3 = Util.copyObj(gamma);
    // const gamma4 = Util.copyObj(gamma);
    // gamma3.indecies[0] = im.getIndex("Top")
    // gamma3.indecies[1] = indexBottom1;
    // gamma3.indecies[2] = indexBottom2;
    // gamma4.indecies[0] = indextop;
    // gamma4.indecies[1] = transIndex(gamma3.indecies[0], "Bottom");
    // gamma4.indecies[2] = bottomIndex;
    // const term3 = makeProd(gamma3, gamma4);

    const sum = makeAdd(Util.errorCheck([term1, term2]));
    return sum;
}

function makeRieman(im: IndexManager): Symbol {
    const indexTop_1 = im.getIndex("Top");
    const indexBottom_1 = im.getIndex("Bottom");
    const indexBottom_2 = im.getIndex("Bottom");
    const indexBottom_3 = im.getIndex("Bottom");

    const R = makeSymbol("R", [indexTop_1, indexBottom_1, indexBottom_2, indexBottom_3]);
    return R;
}

function makeRicFromRieman(rim: Symbol, im: IndexManager): Symbol | Error {
    if (rim.indecies.length != 4) {
        return new Error("makeRicFromRieman:" + display(rim, defaultIndexRule()));
    }
    const topindex = im.getIndex("Top");
    const bottomindex = transIndex(topindex, "Bottom");
    rim.indecies[0] = topindex;
    rim.indecies[2] = bottomindex;

    return rim;
}

function makeMetric(im: IndexManager): Symbol {
    const indexBottom_1 = im.getIndex("Bottom");
    const indexBottom_2 = im.getIndex("Bottom");

    const g = makeSymbol("g", [indexBottom_1, indexBottom_2]);
    return g;
}

function testEchange() {
    logStart("testEchange")
    const im = new IndexManager();
    const topIndex = im.getIndex("Top");
    const bottomIndex = transIndex(topIndex, "Bottom");

    const f = makeSymbol("F", [bottomIndex]);

    const a = makeSymbol("A", [im.getIndex("Top"), topIndex]);
    const b = makeSymbol("B", [transIndex(a.indecies[0], "Bottom")]);
    const d = makeSymbol("D", a.indecies);
    const e = makeSymbol("E", b.indecies);

    const ab = makeProd(a, b);
    const de = makeProd(d, e);
    const sum = makeAdd(Util.errorCheck([ab, de]));
    const term = makeProd(f, sum);
    const c = makeSymbol("C", b.indecies);
    const exchanged = Func.exchange(term, b, c, im);
    const dist = Func.distribute(exchanged);

    log("f(ab+de):" + display(term, defaultIndexRule()));
    log("c:" + display(c, defaultIndexRule()));
    log("ab+de ->:" + display(dist, defaultIndexRule()));
    logEnd("testEchange")
}

function testRieman() {
    logStart("testRieman");
    const im = new IndexManager();
    // const g = makeMetric(im);


    // const term = Ex.getAPlusB(["A", "B"], index);
    // const botindex = transIndex(index, "Bottom");
    // const sym = makeSymbol("C", [botindex]);
    // const ex = makeProd(sym, term);
    // const indexdiff = im.getIndex("Top");
    // const diffEx = makeDiff("∂", [indexdiff], ex);
    // const diffEx2 = Func.expandDiff(diffEx);
    // const diffEx3 = Func.expandDiff(diffEx2);
    // const diffEx4 = Func.expandDiff(diffEx3);
    // const diffEx5 = Func.distribute(diffEx4);
    // const diffEx6 = Func.simplifyAdd(diffEx5);

    const rm = makeRieman(im);
    const rim = makeRiemanOfChristoffel(im, rm.indecies) as Ope;
    const g = makeMetric(im) as Symbol;
    g.indecies[1] = transIndex((getFreeindex(getIndex(rim)) as Index[])[0], "Bottom");
    const term = makeProd(g, rm);
    
    // const ric = makeRicFromRieman(rm, im);

    log("display:rm == " + display(rm, defaultIndexRule()));
    log("display:rim == " + display(rim, defaultIndexRule()));

    log("display:rm == " + display(Func.exchange(term, rm, rim, im), defaultIndexRule()));

    // log("display:Ric == " + display(ric, defaultIndexRule()));
    log("display:g == " + display(g, defaultIndexRule()));

    logEnd("testRieman");
}