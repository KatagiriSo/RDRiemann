# RDRiemann
Riemann tensor symbol calc

Example.

## Make Rieman Tensor
```ts
function makeRieman(im: IndexManager): Symbol {
    const indexTop_1 = im.getIndex("Top");
    const indexBottom_1 = im.getIndex("Bottom");
    const indexBottom_2 = im.getIndex("Bottom");
    const indexBottom_3 = im.getIndex("Bottom");

    const R = makeSymbol("R", [indexTop_1, indexBottom_1, indexBottom_2, indexBottom_3]);
    return R;
}
```

## Make Metric Tensor
```ts
function makeMetric(im: IndexManager): Symbol {
    const indexBottom_1 = im.getIndex("Bottom");
    const indexBottom_2 = im.getIndex("Bottom");

    const g = makeSymbol("g", [indexBottom_1, indexBottom_2]);
    return g;
}
```

## Control Symbol 
```ts
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
```

