/* AED · laboratórios interativos.
   Usa os utilitários globais de assets/engine.js ($, $$, h, rnd, shuffle, store...).
   Cada lab procura seus elementos por id dentro de materias/aed/index.html (seções .pr-cap). */

// ===================================================== kit de desenho
const SV = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="Diagrama da estrutura"><defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="arrowhead"/></marker><marker id="ahb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--clk)"/></marker></defs>${body}</svg>`;
const tx = (x, y, s, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || "middle"}" font-size="${o.sz || 14}" class="${o.c || "ds-t"}" dominant-baseline="middle"${o.style ? ` style="${o.style}"` : ""}>${s}</text>`;
const ln = (pts, o = {}) => `<polyline points="${pts.map(p => p.join(",")).join(" ")}" class="edge ${o.hot ? "hot" : ""}"${o.head === false ? "" : ` marker-end="url(#${o.blue ? "ahb" : "ah"})"`}${o.blue ? ' style="stroke:var(--clk)"' : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
const bx = (x, y, w, h, cls = "") => `<rect x="${x + 3}" y="${y + 3}" width="${w}" height="${h}" style="fill:var(--line)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" class="cell ${cls}"/>`;
const nullMark = (x, y) => `<g style="stroke:var(--ink)" stroke-width="2.5"><line x1="${x}" y1="${y - 9}" x2="${x}" y2="${y + 9}"/><line x1="${x + 5}" y1="${y - 6}" x2="${x + 5}" y2="${y + 6}"/><line x1="${x + 10}" y1="${y - 3}" x2="${x + 10}" y2="${y + 3}"/></g>`;
const ptrBox = (x, y, lab) => `<rect x="${x}" y="${y}" width="36" height="26" rx="3" class="cell"/><circle cx="${x + 18}" cy="${y + 13}" r="3.5" style="fill:var(--ink)"/>` + tx(x + 18, y - 11, lab, { sz: 12, style: "fill:var(--clk)" });

function dsArray(x, y, vals, o = {}) {
  const cw = o.cw || 46, ch = o.ch || 40; let s = "";
  s += `<rect x="${x + 4}" y="${y + 4}" width="${cw * vals.length}" height="${ch}" style="fill:var(--line)"/>`;
  vals.forEach((v, i) => {
    const cls = (o.cls || {})[i] || (v === null || v === undefined || v === "" ? "null" : "");
    s += `<rect x="${x + i * cw}" y="${y}" width="${cw}" height="${ch}" class="cell ${cls}"/>`;
    s += tx(x + i * cw + cw / 2, y + ch / 2 + 1, v ?? "", { sz: 15, c: cls === "on" || cls === "new" ? "ds-k" : cls === "del" ? "ds-w" : "ds-t" });
    if (o.idx !== false) s += tx(x + i * cw + cw / 2, y + ch + 13, i, { sz: 11, c: "ds-m" });
  });
  Object.entries(o.labels || {}).forEach(([i, lab]) => {
    const cx = x + i * cw + cw / 2;
    s += tx(cx, y - 32, lab, { sz: 12, style: "fill:var(--clk);font-weight:700" }) + ln([[cx, y - 24], [cx, y - 4]], { blue: true });
  });
  Object.entries(o.below || {}).forEach(([i, lab]) => {
    const cx = x + i * cw + cw / 2;
    s += tx(cx, y + ch + 52, lab, { sz: 12, style: "fill:var(--clk);font-weight:700" }) + ln([[cx, y + ch + 42], [cx, y + ch + 22]], { blue: true });
  });
  return s;
}
// nó [info|prox] ou [ant|info|prox]
function dsNode(x, y, val, cls = "", dupla = false) {
  const h_ = 40, pw = 20, w = dupla ? 100 : 78;
  let s = `<rect x="${x + 3}" y="${y + 3}" width="${w}" height="${h_}" style="fill:var(--line)"/>`;
  if (dupla) s += `<rect x="${x}" y="${y}" width="${pw}" height="${h_}" class="cell null"/><circle cx="${x + pw / 2}" cy="${y + 20}" r="3.5" style="fill:var(--ink)"/>`;
  const ix = dupla ? x + pw : x, iw = w - pw - (dupla ? pw : 0);
  s += `<rect x="${ix}" y="${y}" width="${iw}" height="${h_}" class="cell ${cls}"/>` + tx(ix + iw / 2, y + 21, val, { sz: 15, c: cls === "del" ? "ds-w" : cls ? "ds-k" : "ds-t" });
  s += `<rect x="${x + w - pw}" y="${y}" width="${pw}" height="${h_}" class="cell null"/><circle cx="${x + w - pw / 2}" cy="${y + 20}" r="3.5" style="fill:var(--ink)"/>`;
  return { s, w, next: [x + w - pw / 2, y + 20], prev: [x + pw / 2, y + 20], l: x, r: x + w, top: y, bot: y + h_, cx: x + w / 2 };
}

// ---------- árvores (nós {k, l, r, c, h, p})
function treeLayout(root, dx, dy, x0, y0) {
  const pos = new Map(); let i = 0;
  const walk = (n, d) => { if (!n) return; walk(n.l, d + 1); pos.set(n, [x0 + i * dx, y0 + d * dy, d]); i++; walk(n.r, d + 1); };
  walk(root, 0); return { pos, n: i };
}
function drawTree(root, o = {}) {
  const dx = o.dx || 50, dy = o.dy || 66, r = o.r || 18;
  if (!root) return SV(320, 90, tx(160, 45, o.empty || "árvore vazia", { sz: 14, c: "ds-m" }));
  const { pos, n } = treeLayout(root, dx, dy, 34, o.top || 34);
  let edges = "", nodes = "", maxY = 0;
  const hl = o.hl || {}, lab = o.lab || {}, hot = o.hot || new Set(), seq = o.seq || {};
  pos.forEach(([x, y], nd) => {
    maxY = Math.max(maxY, y);
    ["l", "r"].forEach(side => {
      const c = nd[side];
      if (c) { const [cx, cy] = pos.get(c); edges += ln([[x, y], [cx, cy]], { head: false, hot: hot.has(c.k) }); }
      else if (o.nil) { const cx = x + (side === "l" ? -dx * .42 : dx * .42), cy = y + dy * .58; edges += `<line x1="${x}" y1="${y}" x2="${cx}" y2="${cy}" class="edge" style="stroke-width:1.4"/><rect x="${cx - 9}" y="${cy - 7}" width="18" height="13" rx="2" class="node-b" style="stroke-width:1"/>` + tx(cx, cy, "NIL", { sz: 7, c: "ds-w" }); maxY = Math.max(maxY, cy); }
    });
    const rb = nd.c === "R" ? "node-r" : nd.c === "B" ? "node-b" : "";
    const cls = rb || ("cell " + (hl[nd.k] || ""));
    nodes += `<g class="tnode" data-k="${nd.k}" style="cursor:${o.click ? "pointer" : "default"}"><circle cx="${x + 3}" cy="${y + 3}" r="${r}" style="fill:var(--line)"/><circle cx="${x}" cy="${y}" r="${r}" class="${cls}"/>`;
    if (rb && hl[nd.k]) nodes += `<circle cx="${x}" cy="${y}" r="${r + 6}" fill="none" style="stroke:var(--clk)" stroke-width="2.6" stroke-dasharray="5 3"/>`;
    nodes += tx(x, y + 1, nd.k, { sz: 14, c: rb || hl[nd.k] === "del" ? "ds-w" : (hl[nd.k] === "on" || hl[nd.k] === "new") ? "ds-k" : "ds-t" });
    if (lab[nd.k] !== undefined) { const t = String(lab[nd.k]), w = Math.max(22, t.length * 8 + 8); nodes += `<rect x="${x + r - 3}" y="${y - r - 12}" width="${w}" height="18" rx="4" style="fill:var(--hi);stroke:var(--line)" stroke-width="1.8"/>` + tx(x + r - 3 + w / 2, y - r - 2, t, { sz: 11, c: "ds-k" }); }
    if (seq[nd.k] !== undefined) nodes += `<circle cx="${x - r}" cy="${y - r + 2}" r="10" style="fill:var(--ink)"/>` + tx(x - r, y - r + 3, seq[nd.k], { sz: 11, style: "fill:var(--bg);font-weight:700" });
    if (o.under && o.under[nd.k] !== undefined) nodes += tx(x, y + r + 13, o.under[nd.k], { sz: 11, style: "fill:var(--clk);font-weight:700" });
    nodes += `</g>`;
  });
  const W = Math.max(o.minW || 0, 68 + (n - 1) * dx), H = maxY + r + (o.under ? 28 : 18);
  return SV(W, H, edges + nodes);
}
const cloneT = (n, p = null) => { if (!n) return null; const c = { k: n.k, c: n.c, h: n.h, p }; c.l = cloneT(n.l, c); c.r = cloneT(n.r, c); return c; };
const ht = n => n ? n.h : 0;
const upd = n => { n.h = 1 + Math.max(ht(n.l), ht(n.r)); };
const fbOf = n => ht(n.l) - ht(n.r);
function inorder(n, out = []) { if (n) { inorder(n.l, out); out.push(n.k); inorder(n.r, out); } return out; }
function heightE(n) { return n ? 1 + Math.max(heightE(n.l), heightE(n.r)) : -1; }
function fbMap(root) { const m = {}; const w = n => { if (!n) return 0; const a = w(n.l), b = w(n.r); m[n.k] = a - b; return 1 + Math.max(a, b); }; w(root); return m; }
function bstInsertPlain(root, k) { if (!root) return { k, l: null, r: null }; if (k < root.k) root.l = bstInsertPlain(root.l, k); else if (k > root.k) root.r = bstInsertPlain(root.r, k); return root; }

// passo a passo genérico
function Stepper(ids, render) {
  const S = { steps: [], i: 0 };
  S.set = steps => { S.steps = steps; S.i = steps.length - 1; S.draw(); };
  S.go = steps => { S.steps = steps; S.i = 0; S.draw(); };
  S.draw = () => {
    const st = S.steps[S.i]; if (!st) return;
    render(st);
    $(ids.pos).textContent = S.steps.length > 1 ? `passo ${S.i + 1} de ${S.steps.length}` : "";
    $(ids.prev).disabled = S.i === 0; $(ids.next).disabled = S.i >= S.steps.length - 1;
  };
  $(ids.prev).onclick = () => { if (S.i > 0) { S.i--; S.draw(); } };
  $(ids.next).onclick = () => { if (S.i < S.steps.length - 1) { S.i++; S.draw(); } };
  return S;
}
const say = (id, html, cls = "") => { const e = $(id); e.className = "status " + cls; e.innerHTML = html; };
const numIn = id => { const v = parseInt($(id).value, 10); return Number.isFinite(v) ? v : null; };

// ===================================================== CAP 1 · TAD
(function () {
  const S = [];
  function draw() {
    const cap = 8;
    let a = dsArray(20, 54, [...S, ...Array(cap - S.length).fill(null)], { cls: S.length ? { [S.length - 1]: "on" } : {}, labels: S.length ? { [S.length - 1]: `topo = ${S.length - 1}` } : {}, cw: 42 });
    a += tx(20, 126, `struct pilha { int itens[8]; int topo = ${S.length - 1}; }`, { a: "start", sz: 12, c: "ds-m" });
    $("#tad-seq").innerHTML = SV(400, 140, a);
    let b = ptrBox(14, 52, "topo"), x = 80;
    const rev = [...S].reverse();
    if (!rev.length) b += ln([[50, 65], [76, 65]], { head: false }) + nullMark(78, 65);
    else b += ln([[32, 65], [x - 2, 65]]);
    rev.forEach((v, i) => { const nd = dsNode(x, 45, v, i === 0 ? "on" : ""); b += nd.s; if (i < rev.length - 1) b += ln([nd.next, [x + nd.w + 28, 65]]); else b += ln([nd.next, [nd.r + 18, 65]], { head: false }) + nullMark(nd.r + 18, 65); x += nd.w + 30; });
    b += tx(14, 126, "struct pilha { NO *topo; }  (cada nó: malloc)", { a: "start", sz: 12, c: "ds-m" });
    $("#tad-enc").innerHTML = SV(Math.max(400, x + 40), 140, b);
  }
  $("#tad-push").onclick = () => { const x = numIn("#tad-x") ?? rnd(90); if (S.length >= 8) return say("#tad-st", "A versão em vetor está <b>cheia</b> (overflow). A encadeada ainda aceitaria: essa é uma diferença de implementação que o usuário pode sentir.", "bad"); S.push(x); $("#tad-x").value = rnd(90) + 1; say("#tad-st", `Empilhou ${x}. No vetor, <code>topo++</code> e grava; na encadeada, cria um nó e faz ele apontar para o antigo topo.`, "ok"); draw(); };
  $("#tad-pop").onclick = () => { if (!S.length) return say("#tad-st", "Pilha vazia: underflow nas duas versões.", "bad"); const v = S.pop(); say("#tad-st", `Desempilhou <b>${v}</b> nas duas. O resultado para quem usa é o mesmo.`, "hl"); draw(); };
  [3, 9].forEach(v => S.push(v)); draw();
  const big = () => {
    const n = +$("#big-n").value; $("#big-nv").textContent = n;
    const fs = [["O(1)", 1], ["O(log n)", Math.max(1, Math.log2(n))], ["O(n)", n], ["O(n log n)", n * Math.max(1, Math.log2(n))], ["O(n²)", n * n], ["O(2ⁿ)", 2 ** n]];
    const mx = Math.log10(2 ** 60);
    let s = "";
    fs.forEach(([nm, v], i) => { const w = Math.max(4, Math.log10(v + 1) / mx * 440); const y = 12 + i * 38; s += tx(92, y + 14, nm, { a: "end", sz: 13 }); s += bx(104, y, w, 28, i === 5 ? "del" : i === 4 ? "new" : "on"); s += tx(112 + w + 6, y + 14, v >= 1e6 ? v.toExponential(1).replace("e+", "×10^") : Math.round(v).toLocaleString("pt-BR"), { a: "start", sz: 12 }); });
    $("#big-svg").innerHTML = SV(700, 240, s);
  };
  $("#big-n").oninput = big; big();
})();

// ===================================================== CAP 2 · PILHAS
(function () {
  const MAX = 8, P = [];
  function draw(cls = {}) {
    let s = ""; const x = 120, ch = 34;
    s += `<polyline points="${x - 6},20 ${x - 6},${26 + MAX * ch} ${x + 96},${26 + MAX * ch} ${x + 96},20" fill="none" style="stroke:var(--ink)" stroke-width="3"/>`;
    for (let i = 0; i < MAX; i++) {
      const y = 22 + (MAX - 1 - i) * ch, v = P[i];
      s += `<rect x="${x}" y="${y}" width="90" height="${ch - 4}" rx="3" class="cell ${cls[i] || (v === undefined ? "null" : i === P.length - 1 ? "on" : "")}"/>` + tx(x + 45, y + (ch - 4) / 2 + 1, v ?? "", { sz: 15, c: cls[i] === "del" ? "ds-w" : "ds-t" });
      s += tx(x - 20, y + ch / 2 - 2, i, { sz: 11, c: "ds-m" });
    }
    const ty = P.length ? 22 + (MAX - P.length) * ch + 15 : 22 + MAX * ch + 4;
    s += ln([[x + 160, ty], [x + 102, ty]], { blue: true }) + tx(x + 166, ty, `topo = ${P.length - 1}`, { a: "start", sz: 13, style: "fill:var(--clk);font-weight:700" });
    $("#pl-svg").innerHTML = SV(420, 40 + MAX * ch, s);
  }
  $("#pl-push").onclick = () => { const x = numIn("#pl-x") ?? 0; if (P.length === MAX) { say("#pl-st", "<b>Overflow:</b> topo == MAX − 1. A pilha sequencial tem tamanho fixo.", "bad"); return; } P.push(x); $("#pl-x").value = rnd(99) + 1; say("#pl-st", `<code>itens[++topo] = ${x}</code> → topo = ${P.length - 1}.`, "ok"); draw({ [P.length - 1]: "new" }); };
  $("#pl-pop").onclick = () => { if (!P.length) { say("#pl-st", "<b>Underflow:</b> topo == −1, não há o que desempilhar.", "bad"); return; } const i = P.length - 1, v = P[i]; draw({ [i]: "del" }); setTimeout(() => { P.pop(); draw(); }, 450); say("#pl-st", `<code>x = itens[topo--]</code> → devolve <b>${v}</b>, topo = ${i - 1}. O valor nem é apagado do vetor: só deixa de contar.`, "hl"); };
  $("#pl-top").onclick = () => { if (!P.length) return say("#pl-st", "Pilha vazia.", "bad"); say("#pl-st", `Topo = <b>${P[P.length - 1]}</b> (só consulta, não remove).`); draw({ [P.length - 1]: "mark" }); };
  $("#pl-clr").onclick = () => { P.length = 0; say("#pl-st", "Pilha vazia (topo = −1)."); draw(); };
  [4, 8, 15].forEach(v => P.push(v)); say("#pl-st", "Empilhe e desempilhe. Só o topo é acessível."); draw();

  // parênteses
  const PB = { s: "", i: 0, st: [], done: false };
  const par = { ")": "(", "]": "[", "}": "{" };
  function pbDraw(msg, cls) {
    $("#pb-chars").innerHTML = [...PB.s].map((c, i) => `<span class="chip" style="${i === PB.i - 1 ? "background:var(--mat);color:#121212" : i < PB.i ? "opacity:.45" : ""}">${c.replace("<", "&lt;")}</span>`).join("");
    let s = ""; const ch = 32;
    PB.st.forEach((c, i) => { s += bx(30, 190 - (i + 1) * ch, 70, ch - 4, i === PB.st.length - 1 ? "on" : "") + tx(65, 190 - (i + 1) * ch + 14, c, { sz: 17 }); });
    s += `<polyline points="24,10 24,194 106,194 106,10" fill="none" style="stroke:var(--ink)" stroke-width="3"/>` + tx(65, 212, PB.st.length ? "pilha" : "pilha vazia", { sz: 12, c: "ds-m" });
    $("#pb-stack").innerHTML = SV(140, 222, s);
    if (msg) say("#pb-st", msg, cls);
  }
  function pbStep() {
    if (PB.done) return;
    if (PB.i >= PB.s.length) { PB.done = true; return pbDraw(PB.st.length ? `Fim da expressão com <b>${PB.st.length}</b> símbolo(s) na pilha: <b>não balanceada</b>.` : "Fim da expressão com a pilha vazia: <b>balanceada</b>! ✓", PB.st.length ? "bad" : "ok"); }
    const c = PB.s[PB.i++];
    if ("([{".includes(c)) return pbDraw(`'${c}' é abertura: empilha.`, "hl");
    if (")]}".includes(c)) {
      if (!PB.st.length) { PB.done = true; return pbDraw(`'${c}' fecha, mas a pilha está vazia: <b>não balanceada</b>.`, "bad"); }
      const t = PB.st[PB.st.length - 1];
      if (t !== par[c]) { PB.done = true; return pbDraw(`'${c}' fecha, mas o topo é '${t}': tipos diferentes, <b>não balanceada</b>.`, "bad"); }
      PB.st.pop(); return pbDraw(`'${c}' combina com o topo '${t}': desempilha.`, "ok");
    }
    pbDraw(`'${c}' não é parêntese: ignora.`);
  }
  $("#pb-go").onclick = () => { PB.s = $("#pb-in").value.replace(/\s+/g, ""); PB.i = 0; PB.st = []; PB.done = false; pbDraw("Pronto. Clique em “Próximo caractere”."); };
  const origStep = pbStep;
  $("#pb-step").onclick = () => { if (!PB.s) $("#pb-go").onclick(); const c = PB.s[PB.i]; if (c && "([{".includes(c)) PB.st.push(c); origStep(); };
  $("#pb-all").onclick = () => { if (!PB.s) $("#pb-go").onclick(); let guard = 0; while (!PB.done && guard++ < 500) $("#pb-step").onclick(); };
  $("#pb-go").onclick();

  // pós-fixa
  function tokens(s) { return (s.match(/\d+(\.\d+)?|[-+*/()]/g) || []); }
  const prec = { "+": 1, "-": 1, "*": 2, "/": 2 };
  $("#pf-go").onclick = () => {
    const tk = tokens($("#pf-in").value); const out = [], op = []; let rows = "";
    const row = (t, a) => rows += `<tr><td class="mono">${t}</td><td class="l">${a}</td><td class="mono l">${op.join(" ") || "∅"}</td><td class="mono l">${out.join(" ")}</td></tr>`;
    try {
      tk.forEach(t => {
        if (/^\d/.test(t)) { out.push(t); row(t, "número → saída"); }
        else if (t === "(") { op.push(t); row(t, "empilha"); }
        else if (t === ")") { while (op.length && op[op.length - 1] !== "(") out.push(op.pop()); if (!op.length) throw "parênteses desbalanceados"; op.pop(); row(t, "desempilha até o “(”"); }
        else { const moved = []; while (op.length && op[op.length - 1] !== "(" && prec[op[op.length - 1]] >= prec[t]) moved.push(op.pop()); out.push(...moved); op.push(t); row(t, moved.length ? `tira ${moved.join(", ")} (prec. ≥) e empilha` : "empilha"); }
      });
      while (op.length) { const o = op.pop(); if (o === "(") throw "parênteses desbalanceados"; out.push(o); }
      row("fim", "esvazia a pilha");
    } catch (e) { $("#pf-conv").innerHTML = ""; $("#pf-eval").innerHTML = ""; return say("#pf-st", "Erro: " + e + ".", "bad"); }
    $("#pf-conv").innerHTML = `<table><tr><th>lido</th><th class="l">ação</th><th class="l">pilha de operadores</th><th class="l">saída</th></tr>${rows}</table>`;
    const st = []; let er = ""; rows = "";
    try {
      out.forEach(t => {
        if (/^\d/.test(t)) { st.push(+t); er += `<tr><td class="mono">${t}</td><td class="l">empilha</td><td class="mono l">${st.join(" ")}</td></tr>`; }
        else { if (st.length < 2) throw "faltam operandos"; const b = st.pop(), a = st.pop(); const v = t === "+" ? a + b : t === "-" ? a - b : t === "*" ? a * b : a / b; st.push(+v.toFixed(6)); er += `<tr><td class="mono">${t}</td><td class="l">b=${b}, a=${a} → ${a} ${t} ${b} = ${+v.toFixed(6)}</td><td class="mono l">${st.join(" ")}</td></tr>`; }
      });
      if (st.length !== 1) throw "sobrou mais de um valor";
    } catch (e) { return say("#pf-st", "Erro ao avaliar: " + e + ".", "bad"); }
    $("#pf-eval").innerHTML = `<table><tr><th>lido</th><th class="l">ação</th><th class="l">pilha</th></tr>${er}</table>`;
    say("#pf-st", `Pós-fixa: <code>${out.join(" ")}</code> · resultado <b>${st[0]}</b>`, "ok");
  };
  $("#pf-go").onclick();
})();

// ===================================================== CAP 3 · FILAS
(function () {
  const MAX = 8; let Q = { v: Array(MAX).fill(null), ini: 0, fim: 0, qtd: 0 }, last = null;
  function draw() {
    const cx = 150, cy = 150, R1 = 62, R2 = 122; let s = "";
    for (let i = 0; i < MAX; i++) {
      const a0 = -Math.PI / 2 + i * 2 * Math.PI / MAX, a1 = a0 + 2 * Math.PI / MAX, P = (R, a) => [cx + R * Math.cos(a), cy + R * Math.sin(a)];
      const [p0, p1, p2, p3] = [P(R2, a0), P(R2, a1), P(R1, a1), P(R1, a0)];
      const occ = Q.v[i] !== null; const cls = i === last ? "new" : (i === Q.ini && Q.qtd) ? "on" : occ ? "" : "null";
      s += `<path d="M${p0} A${R2},${R2} 0 0 1 ${p1} L${p2} A${R1},${R1} 0 0 0 ${p3} Z" class="cell ${cls}"/>`;
      const am = (a0 + a1) / 2, [tx_, ty_] = P((R1 + R2) / 2, am), [ix, iy] = P(R2 + 15, am);
      s += tx(tx_, ty_, occ ? Q.v[i] : "", { sz: 16, c: cls === "on" || cls === "new" ? "ds-k" : "ds-t" }) + tx(ix, iy, i, { sz: 11, c: "ds-m" });
    }
    const arrowAt = (i, lab, off) => { const am = -Math.PI / 2 + (i + .5) * 2 * Math.PI / MAX; const a = [cx + 40 * Math.cos(am), cy + 40 * Math.sin(am)], b = [cx + (R1 - 4) * Math.cos(am), cy + (R1 - 4) * Math.sin(am)]; return ln([a, b], { blue: true }) + tx(cx, cy + off, lab, { sz: 12, style: "fill:var(--clk);font-weight:700" }); };
    s += arrowAt(Q.ini, `início=${Q.ini}`, -10) + arrowAt(Q.fim, `fim=${Q.fim}`, 10);
    $("#fc-svg").innerHTML = SV(300, 300, s);
    $("#fc-vars").innerHTML = `<table><tr><th>inicio</th><th>fim</th><th>qtd</th><th>vazia?</th><th>cheia?</th></tr><tr><td>${Q.ini}</td><td>${Q.fim}</td><td>${Q.qtd}</td><td>${Q.qtd === 0 ? "sim" : "não"}</td><td>${Q.qtd === MAX ? "sim" : "não"}</td></tr></table>`;
  }
  const log = t => { const l = $("#fc-log"); l.prepend(h("div", {}, t)); };
  $("#fc-ins").onclick = () => {
    const x = numIn("#fc-x") ?? 0;
    if (Q.qtd === MAX) { say("#fc-st", "<b>Cheia</b> (qtd == MAX). Repare que inicio == fim, igual a quando está vazia: por isso o contador.", "bad"); return; }
    const old = Q.fim; Q.v[Q.fim] = x; Q.fim = (Q.fim + 1) % MAX; Q.qtd++; last = old; $("#fc-x").value = (x % 90) + 10;
    say("#fc-st", `itens[${old}] = ${x}; fim = (${old} + 1) % ${MAX} = <b>${Q.fim}</b>${old === MAX - 1 ? " ← deu a volta!" : ""}`, old === MAX - 1 ? "hl" : "ok"); log(`ins ${x} → pos ${old}`); draw();
  };
  $("#fc-rem").onclick = () => {
    if (!Q.qtd) { say("#fc-st", "<b>Vazia</b> (qtd == 0).", "bad"); return; }
    const old = Q.ini, x = Q.v[old]; Q.v[old] = null; Q.ini = (Q.ini + 1) % MAX; Q.qtd--; last = null;
    say("#fc-st", `Saiu <b>${x}</b> (posição ${old}); inicio = (${old} + 1) % ${MAX} = <b>${Q.ini}</b>${old === MAX - 1 ? " ← deu a volta!" : ""}`, "hl"); log(`rem → ${x}`); draw();
  };
  $("#fc-clr").onclick = () => { Q = { v: Array(MAX).fill(null), ini: 0, fim: 0, qtd: 0 }; last = null; $("#fc-log").innerHTML = ""; say("#fc-st", "Fila vazia. Insira e remova várias vezes para ver os índices darem a volta."); draw(); };
  $("#fc-clr").onclick();

  // deque circular
  const D = { v: Array(MAX).fill(null), ini: 0, qtd: 0 };
  function dqDraw(hlI) {
    const fim = (D.ini + D.qtd - 1 + MAX) % MAX;
    const cls = {}; for (let k = 0; k < D.qtd; k++) cls[(D.ini + k) % MAX] = "";
    for (let i = 0; i < MAX; i++) if (!(i in cls)) cls[i] = "null";
    if (D.qtd) { cls[D.ini] = "on"; cls[fim] = cls[fim] === "on" ? "on" : "mark"; }
    if (hlI !== undefined) cls[hlI] = "new";
    const labels = {}; if (D.qtd) { labels[D.ini] = "início"; if (fim !== D.ini) labels[fim] = "fim"; }
    $("#dq-svg").innerHTML = SV(440, 130, dsArray(30, 50, D.v, { cls, labels, cw: 48 }));
  }
  const dqx = () => { const v = numIn("#dq-x") ?? 0; $("#dq-x").value = v + 1; return v; };
  $("#dq-ii").onclick = () => { if (D.qtd === MAX) return say("#dq-st", "Cheio.", "bad"); D.ini = (D.ini - 1 + MAX) % MAX; D.v[D.ini] = dqx(); D.qtd++; say("#dq-st", `inicio = (inicio − 1 + MAX) % MAX = <b>${D.ini}</b>; grava ali. O <code>+ MAX</code> evita índice negativo.`, "ok"); dqDraw(D.ini); };
  $("#dq-if").onclick = () => { if (D.qtd === MAX) return say("#dq-st", "Cheio.", "bad"); const p = (D.ini + D.qtd) % MAX; D.v[p] = dqx(); D.qtd++; say("#dq-st", `grava em (inicio + qtd) % MAX = <b>${p}</b>.`, "ok"); dqDraw(p); };
  $("#dq-ri").onclick = () => { if (!D.qtd) return say("#dq-st", "Vazio.", "bad"); const x = D.v[D.ini]; D.v[D.ini] = null; D.ini = (D.ini + 1) % MAX; D.qtd--; say("#dq-st", `saiu <b>${x}</b> do início; inicio avança para ${D.ini}.`, "hl"); dqDraw(); };
  $("#dq-rf").onclick = () => { if (!D.qtd) return say("#dq-st", "Vazio.", "bad"); const p = (D.ini + D.qtd - 1) % MAX, x = D.v[p]; D.v[p] = null; D.qtd--; say("#dq-st", `saiu <b>${x}</b> do fim (posição ${p}).`, "hl"); dqDraw(); };
  [5, 6, 7].forEach(v => { D.v[(D.ini + D.qtd) % MAX] = v; D.qtd++; }); $("#dq-x").value = 8; dqDraw();
})();

// ===================================================== CAP 4 · LISTAS
(function () {
  let L = [3, 8, 12, 20];
  const CODE = {
    ini: { simples: "novo->prox = L;\nL = novo;", cabeca: "novo->prox = cab->prox;\ncab->prox = novo;", circular: "/* ult = último nó */\nnovo->prox = ult->prox;\nult->prox = novo;", dupla: "novo->ant = NULL;\nnovo->prox = L;\nif (L) L->ant = novo;\nL = novo;", duplacirc: "novo->prox = cab->prox; novo->ant = cab;\ncab->prox->ant = novo;\ncab->prox = novo;" },
    fim: { simples: "p = L;\nwhile (p->prox) p = p->prox;   /* O(n) */\np->prox = novo; novo->prox = NULL;", cabeca: "p = cab;\nwhile (p->prox) p = p->prox;\np->prox = novo;", circular: "novo->prox = ult->prox;\nult->prox = novo;\nult = novo;          /* O(1) */", dupla: "p = L; while (p->prox) p = p->prox;\np->prox = novo; novo->ant = p;", duplacirc: "novo->ant = cab->ant; novo->prox = cab;\ncab->ant->prox = novo;\ncab->ant = novo;     /* O(1) */" },
    ord: { simples: "while (p && p->info < x) { ant = p; p = p->prox; }\nnovo->prox = p;            /* 1º */\nif (!ant) L = novo; else ant->prox = novo;  /* 2º */", cabeca: "ant = cab; p = cab->prox;\nwhile (p && p->info < x) { ant = p; p = p->prox; }\nnovo->prox = p; ant->prox = novo;  /* sem caso especial */", circular: "/* anda até voltar ao início */\ndo { ... } while (p != primeiro);\nnovo->prox = p; ant->prox = novo;", dupla: "novo->prox = p; novo->ant = ant;\nif (ant) ant->prox = novo; else L = novo;\nif (p) p->ant = novo;", duplacirc: "novo->prox = p; novo->ant = p->ant;\np->ant->prox = novo; p->ant = novo;" },
    rem: { simples: "while (p && p->info != x) { ant = p; p = p->prox; }\nif (!ant) L = p->prox; else ant->prox = p->prox;\nfree(p);", cabeca: "ant->prox = p->prox;   /* ant nunca é NULL */\nfree(p);", circular: "ant->prox = p->prox;\nif (p == ult) ult = ant;\nfree(p);", dupla: "if (p->ant) p->ant->prox = p->prox; else L = p->prox;\nif (p->prox) p->prox->ant = p->ant;\nfree(p);", duplacirc: "p->ant->prox = p->prox;\np->prox->ant = p->ant;\nfree(p);" },
    bus: { simples: "p = L;\nwhile (p && p->info != x) p = p->prox;\nreturn p;   /* O(n) */", cabeca: "p = cab->prox;\nwhile (p && p->info != x) p = p->prox;", circular: "p = ult->prox;\ndo { if (p->info == x) return p; p = p->prox; }\nwhile (p != ult->prox);", dupla: "p = L;\nwhile (p && p->info != x) p = p->prox;", duplacirc: "p = cab->prox;\nwhile (p != cab && p->info != x) p = p->prox;" }
  };
  const kind = () => $("#le-kind").value;
  function draw(cls = {}) {
    const k = kind(), dupla = k.startsWith("dupla"), cab = k === "cabeca" || k === "duplacirc", circ = k === "circular" || k === "duplacirc";
    const vals = cab ? ["cab", ...L] : [...L];
    let s = "", x = 74; const y = 60; const nds = [];
    vals.forEach((v, i) => { const c = cab && i === 0 ? "null" : (cls[cab ? i - 1 : i] || ""); const nd = dsNode(x, y, v, c, dupla); s += nd.s; nds.push(nd); x += nd.w + 34; });
    s += ptrBox(8, y + 7, "L");
    if (nds.length) s += ln([[26, y + 20], [nds[0].l - 2, y + 20]]); else s += ln([[44, y + 20], [64, y + 20]], { head: false }) + nullMark(64, y + 20);
    for (let i = 0; i < nds.length - 1; i++) {
      const a = nds[i], b = nds[i + 1];
      if (dupla) { s += ln([[a.next[0], a.next[1] - 7], [b.l - 2, b.next[1] - 7]]) + ln([[b.prev[0], b.prev[1] + 7], [a.r + 2, a.next[1] + 7]]); }
      else s += ln([a.next, [b.l - 2, a.next[1]]]);
    }
    const last = nds[nds.length - 1], first = nds[0];
    if (last) {
      if (circ) {
        s += ln([last.next, [last.next[0], y + 72], [first.cx, y + 72], [first.cx, y + 44]]);
        if (dupla) s += ln([first.prev, [first.prev[0], y - 26], [last.cx, y - 26], [last.cx, y - 4]]);
      } else {
        s += ln([last.next, [last.r + 16, last.next[1]]], { head: false }) + nullMark(last.r + 16, last.next[1]);
        if (dupla) s += ln([first.prev, [first.prev[0], y + 64]], { head: false }) + tx(first.prev[0], y + 74, "NULL", { sz: 10 });
      }
    }
    $("#le-svg").innerHTML = SV(Math.max(560, x + 30), 160, s);
  }
  const show = (op, msg, cls) => { $("#le-code").textContent = CODE[op][kind()]; say("#le-st", msg, cls); };
  const vx = () => numIn("#le-x") ?? 0;
  $("#le-kind").onchange = () => { draw(); show("ord", { simples: "Lista simples: cada nó só conhece o próximo.", cabeca: "Com nó-cabeça: o primeiro nó real nunca precisa de tratamento especial.", circular: "Circular: o último aponta para o primeiro. Guardando o último, início e fim ficam O(1).", dupla: "Dupla: cada nó conhece o anterior e o próximo.", duplacirc: "Dupla circular com cabeça: o “canivete suíço” das listas." }[kind()]); };
  $("#le-ini").onclick = () => { const x = vx(); L.unshift(x); draw({ 0: "new" }); show("ini", `Inseriu ${x} no início: O(1).`, "ok"); };
  $("#le-fim").onclick = () => { const x = vx(); L.push(x); draw({ [L.length - 1]: "new" }); const o1 = kind() === "circular" || kind() === "duplacirc"; show("fim", `Inseriu ${x} no fim: ${o1 ? "O(1) porque se tem acesso direto ao último" : "O(n), precisou percorrer até o último"}.`, "ok"); };
  $("#le-ord").onclick = () => { const x = vx(); let i = L.findIndex(v => v >= x); if (i < 0) i = L.length; L.splice(i, 0, x); draw({ [i]: "new" }); show("ord", `Percorreu ${i} nó(s) até achar o lugar e religou ${kind().startsWith("dupla") ? 4 : 2} ponteiros. Nenhum elemento foi deslocado.`, "ok"); $("#le-x").value = rnd(40) + 1; };
  $("#le-rem").onclick = () => { const x = vx(), i = L.indexOf(x); if (i < 0) return show("rem", `${x} não está na lista.`, "bad"); draw({ [i]: "del" }); show("rem", `Achou ${x} (${i + 1}º nó). O anterior passa a apontar para o seguinte e o nó é liberado.`, "hl"); setTimeout(() => { L.splice(i, 1); draw(); }, 650); };
  $("#le-bus").onclick = () => {
    const x = vx(); const i = L.indexOf(x), stop = i < 0 ? L.length : i + 1; let k = 0;
    const tick = () => { const cls = {}; for (let j = 0; j < k; j++) cls[j] = "mark"; if (k === stop && i >= 0) cls[i] = "on"; draw(cls); if (k < stop) { k++; setTimeout(tick, 280); } else show("bus", i >= 0 ? `Achou ${x} visitando ${i + 1} nó(s): busca sequencial, O(n).` : `Visitou os ${L.length} nós e não achou ${x}.`, i >= 0 ? "ok" : "bad"); };
    tick();
  };
  $("#le-kind").onchange();

  // sequencial x encadeada
  let SVv = [5, 9, 14, 21, 30];
  function svDraw(ins, msg) {
    let s = tx(10, 18, "sequencial (vetor)", { a: "start", sz: 13 });
    const cls = {}; if (ins !== undefined) { cls[ins] = "new"; for (let j = ins + 1; j < SVv.length; j++) cls[j] = "mark"; }
    s += dsArray(10, 34, [...SVv, ...Array(Math.max(0, 12 - SVv.length)).fill(null)].slice(0, Math.max(12, SVv.length)), { cls, cw: 40 });
    s += tx(10, 112, "encadeada", { a: "start", sz: 13 });
    let x = 10; SVv.forEach((v, i) => { const nd = dsNode(x, 126, v, i === ins ? "new" : (ins !== undefined && i < ins) ? "mark" : ""); s += nd.s; if (i < SVv.length - 1) s += ln([nd.next, [x + nd.w + 16, 146]]); x += nd.w + 18; });
    $("#sv-svg").innerHTML = SV(Math.max(520, x + 10, 10 + 40 * Math.max(12, SVv.length) + 10), 182, s);
    if (msg) say("#sv-st", msg);
  }
  const svIns = x => { let i = SVv.findIndex(v => v >= x); if (i < 0) i = SVv.length; const desl = SVv.length - i; SVv.splice(i, 0, x); return [i, desl]; };
  $("#sv-go").onclick = () => { const x = numIn("#sv-x") ?? 0; const [i, d] = svIns(x); svDraw(i, `Vetor: <b>${d} deslocamento(s)</b> (células azuis andaram uma casa). Encadeada: <b>${i} nó(s) percorrido(s)</b> e 2 ponteiros religados, zero deslocamentos. As duas são O(n), mas por motivos diferentes. Inserir no começo é o pior caso do vetor e o melhor da lista.`); $("#sv-x").value = rnd(40) + 1; };
  $("#sv-rnd").onclick = () => { let D = 0, P = 0; for (let k = 0; k < 10; k++) { const [i, d] = svIns(rnd(60) + 1); D += d; P += i; } svDraw(undefined, `10 inserções: <b>${D}</b> deslocamentos no vetor × <b>${P}</b> nós percorridos na lista.`); };
  $("#sv-clr").onclick = () => { SVv = []; svDraw(undefined, "Listas vazias."); };
  svDraw(undefined, "Insira um valor ordenado nas duas listas ao mesmo tempo.");

  // lista generalizada
  function parseGL(s) {
    let i = 0; const ws = () => { while (i < s.length && /[\s,]/.test(s[i])) i++; };
    const list = () => { ws(); if (s[i] !== "(") throw "esperava “(”"; i++; const out = []; ws(); while (s[i] !== ")") { if (i >= s.length) throw "faltou “)”"; if (s[i] === "(") out.push(list()); else { let a = ""; while (i < s.length && !/[\s,()]/.test(s[i])) a += s[i++]; if (!a) throw "elemento vazio"; out.push(a); } ws(); } i++; return out; };
    const r = list(); ws(); if (i < s.length) throw "texto sobrando depois da lista"; return r;
  }
  const glStr = L => "(" + L.map(e => Array.isArray(e) ? glStr(e) : e).join(", ") + ")";
  const NW = 112, GAP = 30;
  const glW = L => Math.max(NW, L.reduce((s, e) => s + (Array.isArray(e) ? Math.max(NW, glW(e)) : NW) + GAP, -GAP));
  function glDraw(L, x, y) {
    let s = "", cx = x; const nodes = [];
    if (!L.length) return { s: tx(x + 30, y + 20, "( ) vazia", { sz: 12, c: "ds-m" }), w: 90, h: 40 };
    let H = 40;
    L.forEach(e => {
      const sub = Array.isArray(e), w = sub ? Math.max(NW, glW(e)) : NW;
      s += `<rect x="${cx + 3}" y="${y + 3}" width="${NW - 6}" height="40" style="fill:var(--line)"/>` + `<rect x="${cx}" y="${y}" width="24" height="40" class="cell null"/><rect x="${cx + 24}" y="${y}" width="${NW - 50}" height="40" class="cell ${sub ? "on" : ""}"/><rect x="${cx + NW - 26}" y="${y}" width="20" height="40" class="cell null"/>`;
      s += tx(cx + 12, y + 21, sub ? "S" : "A", { sz: 12 }) + tx(cx + 24 + (NW - 50) / 2, y + 21, sub ? "•" : e, { sz: 15, c: sub ? "ds-k" : "ds-t" }) + `<circle cx="${cx + NW - 16}" cy="${y + 20}" r="3.5" style="fill:var(--ink)"/>`;
      if (sub) { const r = glDraw(e, cx, y + 84); s += ln([[cx + 24 + (NW - 50) / 2, y + 22], [cx + 24 + (NW - 50) / 2, y + 82]]) + r.s; H = Math.max(H, 84 + r.h); }
      nodes.push([cx, w]); cx += w + GAP;
    });
    nodes.forEach(([nx], i) => { const from = [nx + NW - 16, y + 20]; if (i < nodes.length - 1) s += ln([from, [nodes[i + 1][0] - 2, y + 20]]); else s += ln([from, [nx + NW + 6, y + 20]], { head: false }) + nullMark(nx + NW + 6, y + 20); });
    return { s, w: cx - x, h: H };
  }
  const depth = L => 1 + Math.max(0, ...L.filter(Array.isArray).map(depth));
  const atoms = L => L.reduce((s, e) => s + (Array.isArray(e) ? atoms(e) : 1), 0);
  $("#lg-go").onclick = () => {
    let L; try { L = parseGL($("#lg-in").value.trim()); } catch (e) { return say("#lg-st", "Não consegui ler: " + e + ". Exemplo: (a, (b, c), d).", "bad"); }
    const r = glDraw(L, 60, 30);
    $("#lg-svg").innerHTML = SV(r.w + 110, r.h + 50, ptrBox(8, 37, "L") + (L.length ? ln([[26, 50], [58, 50]]) : "") + r.s);
    const head = L.length ? (Array.isArray(L[0]) ? glStr(L[0]) : L[0]) : "indefinida (lista vazia)", tail = L.length ? glStr(L.slice(1)) : "indefinida";
    say("#lg-st", `cabeça(L) = <code>${head}</code> · cauda(L) = <code>${tail}</code> · <b>${L.length}</b> elemento(s) no 1º nível · <b>${atoms(L)}</b> átomo(s) · profundidade <b>${depth(L)}</b>`, "ok");
  };
  $("#lg-go").onclick();

  // matriz esparsa
  const R = 4, C = 6; const M = {}; [[0, 1, 7], [1, 3, 2], [2, 0, 5], [2, 3, 9], [3, 5, 4]].forEach(([i, j, v]) => M[i + "," + j] = v);
  function meDraw() {
    let g = "";
    for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) { const v = M[i + "," + j]; g += `<g class="me-c" data-i="${i}" data-j="${j}" style="cursor:pointer"><rect x="${10 + j * 40}" y="${10 + i * 40}" width="40" height="40" class="cell ${v ? "on" : ""}"/>` + tx(30 + j * 40, 31 + i * 40, v || 0, { sz: 14, c: v ? "ds-k" : "ds-m" }) + `</g>`; }
    $("#me-grid").innerHTML = SV(260, 180, g);
    $$("#me-grid .me-c").forEach(e => e.onclick = () => { const k = e.dataset.i + "," + e.dataset.j; if (M[k]) delete M[k]; else M[k] = rnd(9) + 1; meDraw(); });
    const ox = 50, oy = 40, sx = 84, sy = 58; let s = "";
    for (let j = 0; j < C; j++) s += `<rect x="${ox + 56 + j * sx}" y="${oy - 30}" width="40" height="22" rx="3" class="cell null"/>` + tx(ox + 76 + j * sx, oy - 19, "c" + j, { sz: 11 });
    for (let i = 0; i < R; i++) s += `<rect x="${ox - 44}" y="${oy + 12 + i * sy}" width="38" height="26" rx="3" class="cell null"/>` + tx(ox - 25, oy + 25 + i * sy, "l" + i, { sz: 11 });
    const keys = Object.keys(M).map(k => k.split(",").map(Number));
    keys.forEach(([i, j]) => { const x = ox + 48 + j * sx, y = oy + 6 + i * sy; s += bx(x, y, 56, 38) + tx(x + 28, y + 11, `[${i},${j}]`, { sz: 9, c: "ds-m" }) + tx(x + 28, y + 27, M[i + "," + j], { sz: 14 }); });
    for (let i = 0; i < R; i++) { const js = keys.filter(k => k[0] === i).map(k => k[1]).sort((a, b) => a - b); let px = ox - 6; const y = oy + 25 + i * sy; js.forEach(j => { const x = ox + 48 + j * sx; s += ln([[px, y], [x - 2, y]]); px = x + 56; }); }
    for (let j = 0; j < C; j++) { const is = keys.filter(k => k[1] === j).map(k => k[0]).sort((a, b) => a - b); let py = oy - 8; const x = ox + 76 + j * sx + 10; is.forEach(i => { const y = oy + 6 + i * sy; s += ln([[x, py], [x, y - 2]], { blue: true }); py = y + 38; }); }
    $("#me-svg").innerHTML = SV(ox + 60 + C * sx, oy + R * sy + 20, s);
    const k = keys.length;
    say("#me-st", `${k} não nulo(s). Matriz comum: ${R} × ${C} = <b>${R * C}</b> posições. Listas cruzadas: 5 campos × ${k} + ${R} + ${C} cabeças ≈ <b>${5 * k + R + C}</b>. ${5 * k + R + C < R * C ? "Compensa." : "Aqui não compensa: a matriz não está esparsa o suficiente."}`, 5 * k + R + C < R * C ? "ok" : "bad");
  }
  meDraw();
})();

// ===================================================== CAP 5 · PERCURSOS
function randomBST(n, max = 99) { const ks = new Set(); while (ks.size < n) ks.add(rnd(max) + 1); let r = null; [...ks].forEach(k => r = bstInsertPlain(r, k)); return r; }
function orders(root) {
  const pre = [], em = [], pos = [], niv = [];
  const w = n => { if (!n) return; pre.push(n.k); w(n.l); em.push(n.k); w(n.r); pos.push(n.k); }; w(root);
  const q = root ? [root] : []; while (q.length) { const n = q.shift(); niv.push(n.k); if (n.l) q.push(n.l); if (n.r) q.push(n.r); }
  return { pre, em, pos, nivel: niv };
}
(function () {
  let T = null, timer = null, sel = null;
  const draw = (seq = {}) => { $("#pc-svg").innerHTML = drawTree(T, { seq, hl: Object.fromEntries(Object.keys(seq).map(k => [k, "on"]).concat(sel !== null ? [[sel, "new"]] : [])), click: true }); $$("#pc-svg .tnode").forEach(g => g.onclick = () => info(+g.dataset.k)); };
  function info(k) {
    sel = k; let path = [], n = T; while (n && n.k !== k) { path.push(n.k); n = k < n.k ? n.l : n.r; }
    const cnt = x => x ? 1 + cnt(x.l) + cnt(x.r) : 0, leaves = x => !x ? 0 : (!x.l && !x.r ? 1 : leaves(x.l) + leaves(x.r));
    const grau = (n.l ? 1 : 0) + (n.r ? 1 : 0);
    say("#pc-info", `Nó <b>${k}</b>: nível <b>${path.length}</b> · altura <b>${heightE(n)}</b> · grau <b>${grau}</b> (${grau ? "nó interno" : "folha"}) · subárvore com <b>${cnt(n)}</b> nó(s) e ${leaves(n)} folha(s) · ancestrais: ${path.length ? path.join(" → ") : "nenhum (é a raiz)"}`, "hl");
    draw();
  }
  const run = kind => {
    clearInterval(timer); const seq = orders(T)[kind]; let i = 0, m = {};
    const names = { pre: "pré-ordem (raiz, esq, dir)", em: "em-ordem (esq, raiz, dir)", pos: "pós-ordem (esq, dir, raiz)", nivel: "em nível (fila)" };
    say("#pc-st", `${names[kind]}: …`); sel = null;
    timer = setInterval(() => { if (i >= seq.length) { clearInterval(timer); say("#pc-st", `${names[kind]}: <b class="mono">${seq.join(" ")}</b>${kind === "em" ? " (é uma ABB, então sai ordenado)" : ""}`, "ok"); return; } m[seq[i]] = i + 1; i++; draw(m); }, 520);
  };
  $$("[data-pc]").forEach(b => b.onclick = () => run(b.dataset.pc));
  $("#pc-new").onclick = () => { clearInterval(timer); T = randomBST(8); sel = null; draw(); say("#pc-st", "Escolha um percurso."); say("#pc-info", "Clique num nó para ver suas medidas."); };
  $("#pc-new").onclick();
})();

// ===================================================== CAP 6 · ABB
(function () {
  let T = null;
  const draw = (hl = {}, hot = new Set()) => {
    $("#abb-svg").innerHTML = drawTree(T, { hl, hot, empty: "ABB vazia: insira uma chave" });
    $("#abb-in").textContent = "em-ordem: " + (inorder(T).join(" ") || "—"); $("#abb-h").textContent = "altura: " + heightE(T) + " · nós: " + inorder(T).length;
  };
  const path = k => { const p = []; let n = T; while (n) { p.push(n.k); if (k === n.k) break; n = k < n.k ? n.l : n.r; } return p; };
  const hlPath = (p, last, cls) => { const hl = {}, hot = new Set(); p.forEach((k, i) => { hl[k] = "mark"; if (i) hot.add(k); }); if (last !== undefined) hl[last] = cls; return [hl, hot]; };
  $("#abb-ins").onclick = () => {
    const k = numIn("#abb-x"); if (k === null) return;
    const p = path(k); if (inorder(T).includes(k)) { draw(...hlPath(p, k, "on")); return say("#abb-st", `${k} já existe: ABB não guarda repetidos.`, "bad"); }
    const dirs = p.map(x => k < x ? "esq" : "dir");
    T = bstInsertPlain(T, k); draw(...hlPath([...p, k], k, "new"));
    say("#abb-st", p.length ? `Caminho: ${p.map((x, i) => `${x} (${k} ${k < x ? "<" : ">"} ${x} → ${dirs[i]})`).join(" · ")} · entrou como <b>folha</b>.` : `${k} virou a raiz.`, "ok");
    $("#abb-x").value = rnd(99) + 1;
  };
  $("#abb-bus").onclick = () => { const k = numIn("#abb-x"); const p = path(k), ok = p[p.length - 1] === k; draw(...hlPath(p, ok ? k : undefined, "on")); say("#abb-st", ok ? `Achou ${k} em ${p.length} comparação(ões): ${p.join(" → ")}.` : `Não está na árvore: ${p.join(" → ") || "árvore vazia"} → NULL. ${p.length} comparação(ões).`, ok ? "ok" : "bad"); };
  $("#abb-rem").onclick = () => {
    const k = numIn("#abb-x"); let n = T; while (n && n.k !== k) n = k < n.k ? n.l : n.r;
    if (!n) return say("#abb-st", `${k} não está na árvore.`, "bad");
    const pred = $("#abb-mode").value === "pred"; let msg, sub = null;
    if (!n.l && !n.r) msg = `Caso 1: <b>${k}</b> é folha. O ponteiro do pai vira NULL.`;
    else if (!n.l || !n.r) msg = `Caso 2: <b>${k}</b> tem um filho (${(n.l || n.r).k}), que sobe para o lugar dele.`;
    else { let s = pred ? n.l : n.r; while (pred ? s.r : s.l) s = pred ? s.r : s.l; sub = s.k; msg = `Caso 3: <b>${k}</b> tem dois filhos. ${pred ? "Predecessor (maior da esquerda)" : "Sucessor (menor da direita)"} = <b>${sub}</b>: copia ${sub} para o nó e remove o ${sub} de baixo.`; }
    const hl = { [k]: "del" }; if (sub !== null) hl[sub] = "new"; draw(hl);
    say("#abb-st", msg, "hl");
    setTimeout(() => {
      const rem = (r, x) => { if (!r) return null; if (x < r.k) r.l = rem(r.l, x); else if (x > r.k) r.r = rem(r.r, x); else { if (!r.l || !r.r) return r.l || r.r; let s = pred ? r.l : r.r; while (pred ? s.r : s.l) s = pred ? s.r : s.l; r.k = s.k; if (pred) r.l = rem(r.l, s.k); else r.r = rem(r.r, s.k); } return r; };
      T = rem(T, k); draw(sub !== null ? { [sub]: "new" } : {});
    }, 900);
  };
  $("#abb-rnd").onclick = () => { T = null; [50, 30, 70, 20, 40, 60, 80, 10, 35, 90].forEach(k => T = bstInsertPlain(T, k)); draw(); say("#abb-st", "A árvore da Figura 6.1. Experimente remover 20 (caso 2), 10 (caso 1) e 50 (caso 3)."); };
  $("#abb-ord").onclick = () => { T = null; [1, 2, 3, 4, 5, 6, 7].forEach(k => T = bstInsertPlain(T, k)); draw(); say("#abb-st", "Chaves em ordem crescente: a ABB degenera numa “lista” de altura 6. Buscar o 7 custa 7 comparações. Compare com a AVL no próximo capítulo.", "bad"); };
  $("#abb-clr").onclick = () => { T = null; draw(); say("#abb-st", "ABB vazia."); };
  $("#abb-rnd").onclick();
})();

// ===================================================== CAP 7 · AVL (com ponteiro para pai)
const AVL = { root: null };
function rotL(R, x) { const y = x.r; x.r = y.l; if (y.l) y.l.p = x; y.p = x.p; if (!x.p) R.root = y; else if (x === x.p.l) x.p.l = y; else x.p.r = y; y.l = x; x.p = y; if (x.h !== undefined) { upd(x); upd(y); } return y; }
function rotR(R, x) { const y = x.l; x.l = y.r; if (y.r) y.r.p = x; y.p = x.p; if (!x.p) R.root = y; else if (x === x.p.r) x.p.r = y; else x.p.l = y; y.r = x; x.p = y; if (x.h !== undefined) { upd(x); upd(y); } return y; }
function avlRebalance(R, n, steps, snap) {
  while (n) {
    upd(n); const f = fbOf(n);
    if (f > 1 || f < -1) {
      const heavyL = f > 1, c = heavyL ? n.l : n.r, fc = fbOf(c);
      const dupla = heavyL ? fc < 0 : fc > 0;
      const caso = heavyL ? (dupla ? "LR" : "LL") : (dupla ? "RL" : "RR");
      snap(`Nó <b>${n.k}</b> com FB = ${f > 0 ? "+" : ""}${f}; filho ${c.k} com FB = ${fc > 0 ? "+" : ""}${fc} → caso <b>${caso}</b>.`, { [n.k]: "del", [c.k]: "new" });
      if (dupla) { const ck = c.k; heavyL ? rotL(R, c) : rotR(R, c); snap(`1ª rotação: ${heavyL ? "à esquerda" : "à direita"} em ${ck} (endireita o zigue-zague).`, { [n.k]: "del" }); }
      const nk = n.k; const top = heavyL ? rotR(R, n) : rotL(R, n);
      snap(`${dupla ? "2ª rotação" : "Rotação simples"}: ${heavyL ? "à direita" : "à esquerda"} em ${nk}. Nova raiz da subárvore: <b>${top.k}</b>.`, { [top.k]: "on" });
      n = top;
    }
    n = n.p;
  }
}
(function () {
  const S = Stepper({ pos: "#avl-pos", prev: "#avl-prev", next: "#avl-next" }, st => { $("#avl-svg").innerHTML = drawTree(st.t, { hl: st.hl, lab: fbMap(st.t), empty: "AVL vazia: insira uma chave" }); say("#avl-st", st.msg, st.cls || ""); });
  let steps = [];
  const snap = (msg, hl = {}, cls = "hl") => steps.push({ t: cloneT(AVL.root), msg, hl, cls });
  function ins(k, quiet) {
    let p = null, n = AVL.root; while (n) { if (k === n.k) return false; p = n; n = k < n.k ? n.l : n.r; }
    const nn = { k, l: null, r: null, h: 1, p }; if (!p) AVL.root = nn; else if (k < p.k) p.l = nn; else p.r = nn;
    if (!quiet) snap(`Inseriu <b>${k}</b> como folha (igual à ABB). Agora volta subindo e recalculando os FBs.`, { [k]: "new" });
    avlRebalance(AVL, p, steps, quiet ? () => { } : snap);
    return true;
  }
  $("#avl-ins").onclick = () => { const k = numIn("#avl-x"); if (k === null) return; steps = []; if (!ins(k)) { snap(`${k} já existe.`, {}, "bad"); } else snap(steps.length > 1 ? "Balanceada de novo: todos os FBs em −1, 0 ou +1." : "Todos os FBs continuam em −1, 0 ou +1: nenhuma rotação.", { [k]: "new" }, "ok"); S.go(steps); $("#avl-x").value = rnd(99) + 1; };
  $("#avl-rem").onclick = () => {
    const k = numIn("#avl-x"); steps = []; let n = AVL.root; while (n && n.k !== k) n = k < n.k ? n.l : n.r;
    if (!n) { snap(`${k} não está na árvore.`, {}, "bad"); return S.go(steps); }
    snap(`Remover <b>${k}</b>.`, { [k]: "del" });
    if (n.l && n.r) { let s = n.r; while (s.l) s = s.l; snap(`Dois filhos: o sucessor ${s.k} toma o lugar de ${k}.`, { [k]: "del", [s.k]: "new" }); n.k = s.k; n = s; }
    const ch = n.l || n.r, p = n.p; if (ch) ch.p = p; if (!p) AVL.root = ch; else if (p.l === n) p.l = ch; else p.r = ch;
    snap(`Nó removido fisicamente. Subindo a partir de ${p ? p.k : "—"} para rebalancear (pode haver mais de uma rotação).`, p ? { [p.k]: "mark" } : {});
    avlRebalance(AVL, p, steps, snap);
    snap("Remoção concluída.", {}, "ok"); S.go(steps);
  };
  $("#avl-seq").onclick = () => { AVL.root = null; steps = []; [10, 20, 30, 40, 50].forEach(k => ins(k)); snap("Fim: 10, 20, 30, 40, 50 em ordem. Na ABB seria uma lista de altura 4; aqui a altura é 2.", {}, "ok"); S.go(steps); };
  $("#avl-clr").onclick = () => { AVL.root = null; steps = []; snap("AVL vazia."); S.go(steps); };
  [40, 20, 60, 10, 30, 70].forEach(k => ins(k, true)); steps = []; snap("A AVL da Figura 7.1, com os FBs nas etiquetas. Experimente: 80 (caso RR em 60); 5 e depois 1 (caso LL em 10); 25 e depois 27 (dupla em 30).", {}, ""); S.go(steps);
})();

// ===================================================== CAP 8 · RUBRO-NEGRA
(function () {
  const RB = { root: null };
  const S = Stepper({ pos: "#rn-pos", prev: "#rn-prev", next: "#rn-next" }, st => { $("#rn-svg").innerHTML = drawTree(st.t, { hl: st.hl, nil: true, dx: 56, empty: "Árvore vazia: insira uma chave" }); say("#rn-st", st.msg, st.cls || ""); check(st.t); });
  let steps = [];
  const snap = (msg, hl = {}, cls = "hl") => steps.push({ t: cloneT(RB.root), msg, hl, cls });
  function check(t) {
    let ok = true, why = [], bh = null;
    if (t && t.c !== "B") { ok = false; why.push("raiz vermelha"); }
    const w = (n, b) => { if (!n) { if (bh === null) bh = b; else if (bh !== b) { ok = false; why.push("alturas negras diferentes"); } return; } if (n.c === "R" && ((n.l && n.l.c === "R") || (n.r && n.r.c === "R"))) { ok = false; why.push(`vermelho-vermelho em ${n.k}`); } w(n.l, b + (n.c === "B")); w(n.r, b + (n.c === "B")); };
    w(t, 0);
    $("#rn-check").textContent = ok ? "✓ propriedades OK" : "✗ " + [...new Set(why)].join(", ");
    $("#rn-h").textContent = `altura negra: ${bh ?? 0} · altura: ${heightE(t)}`;
  }
  const col = n => n ? n.c : "B";
  function ins(k, quiet) {
    let p = null, n = RB.root; while (n) { if (n.k === k) return false; p = n; n = k < n.k ? n.l : n.r; }
    const z = { k, l: null, r: null, p, c: "R" }; if (!p) RB.root = z; else if (k < p.k) p.l = z; else p.r = z;
    const sn = quiet ? () => { } : snap;
    sn(`Inseriu <b>${k}</b> vermelho, como folha da ABB.`, { [k]: "x" });
    let x = z;
    while (x !== RB.root && col(x.p) === "R") {
      const P = x.p, G = P.p, left = P === G.l, U = left ? G.r : G.l;
      if (col(U) === "R") {
        P.c = "B"; U.c = "B"; G.c = "R";
        sn(`Pai ${P.k} e tio ${U.k} vermelhos → <b>caso 1</b>: recolore ${P.k} e ${U.k} de preto e ${G.k} de vermelho. O problema pode subir para ${G.k}.`, { [G.k]: "x" });
        x = G;
      } else {
        if ((left && x === P.r) || (!left && x === P.l)) {
          sn(`Pai ${P.k} vermelho, tio ${U ? U.k : "NIL"} preto, ${x.k} em <b>zigue-zague</b> → <b>caso 2</b>: rotação à ${left ? "esquerda" : "direita"} em ${P.k}.`, { [x.k]: "x" });
          left ? rotL(RB, P) : rotR(RB, P); x = P;
          sn(`Agora ${x.k} e ${x.p.k} estão em linha reta: vira o caso 3.`, { [x.k]: "x" });
        }
        const P2 = x.p, G2 = P2.p;
        sn(`Tio preto e linha reta → <b>caso 3</b>: rotação à ${left ? "direita" : "esquerda"} no avô ${G2.k} e troca de cores de ${P2.k} e ${G2.k}.`, { [G2.k]: "x" });
        P2.c = "B"; G2.c = "R"; left ? rotR(RB, G2) : rotL(RB, G2);
        sn(`${P2.k} subiu e ficou preto; ${G2.k} desceu vermelho. Resolvido.`, { [P2.k]: "x" });
      }
    }
    if (RB.root.c === "R") { RB.root.c = "B"; sn("A raiz ficou vermelha: pinta de preto (propriedade 2).", { [RB.root.k]: "x" }); }
    return true;
  }
  $("#rn-ins").onclick = () => { const k = numIn("#rn-x"); if (k === null) return; steps = []; if (!ins(k)) snap(`${k} já existe.`, {}, "bad"); else snap("Fim da correção.", {}, "ok"); S.go(steps); $("#rn-x").value = rnd(99) + 1; };
  $("#rn-seq").onclick = () => { RB.root = null; steps = []; [10, 20, 30, 15, 25].forEach(k => ins(k)); snap("Fim do exemplo da seção 8.3.", {}, "ok"); S.go(steps); };
  $("#rn-asc").onclick = () => { RB.root = null; steps = []; for (let k = 1; k <= 10; k++) ins(k, k < 10); snap("Inserindo 1 a 10 em ordem: a árvore se mantém baixa, com no máximo 2 rotações por inserção.", {}, "ok"); S.go(steps); };
  $("#rn-clr").onclick = () => { RB.root = null; steps = []; snap("Árvore vazia."); S.go(steps); };
  $("#rn-seq").onclick();
})();

// ===================================================== CAP 9 · HEAP
function heapTree(v) { const nodes = v.map(k => ({ k, l: null, r: null })); nodes.forEach((n, i) => { n.l = nodes[2 * i + 1] || null; n.r = nodes[2 * i + 2] || null; }); return nodes[0] || null; }
function drawHeap(v, hlIdx = {}, sortedFrom = null) {
  // nós podem ter chaves repetidas: usa índice como chave interna
  const nodes = v.map((k, i) => ({ k: i, l: null, r: null, val: k })); nodes.forEach((n, i) => { n.l = nodes[2 * i + 1] || null; n.r = nodes[2 * i + 2] || null; });
  const lim = sortedFrom ?? v.length; const tnodes = nodes.slice(0, lim); tnodes.forEach((n, i) => { if (2 * i + 1 >= lim) n.l = null; if (2 * i + 2 >= lim) n.r = null; });
  let svgT = drawTree(tnodes[0] || null, { hl: hlIdx, under: Object.fromEntries(tnodes.map((n, i) => [i, `[${i}]`])), dx: 46, empty: "heap vazio" });
  // troca rótulo (índice) pelo valor
  svgT = svgT.replace(/(<g class="tnode" data-k="(\d+)"[\s\S]*?<text[^>]*>)(\d+)(<\/text>)/g, (m, a, k, t, b) => a + v[+k] + b);
  const cls = {}; Object.entries(hlIdx).forEach(([i, c]) => cls[i] = c); if (sortedFrom !== null) for (let i = sortedFrom; i < v.length; i++) cls[i] = "mark";
  const arr = SV(Math.max(360, 40 + 44 * v.length), 80, dsArray(20, 14, v, { cls, cw: 44 }));
  return `<div style="display:flex;flex-direction:column;gap:6px;align-items:center">${svgT}${arr}</div>`;
}
(function () {
  let H = [90, 70, 80, 40, 50, 60, 30, 10, 20];
  const S = Stepper({ pos: "#hp-pos", prev: "#hp-prev", next: "#hp-next" }, st => { $("#hp-svg").innerHTML = drawHeap(st.v, st.hl, st.sorted ?? null); say("#hp-st", st.msg, st.cls || ""); });
  let steps = [];
  const snap = (v, msg, hl = {}, cls = "hl", sorted = null) => steps.push({ v: [...v], msg, hl, cls, sorted });
  const isMax = () => $("#hp-kind").value === "max", better = (a, b) => isMax() ? a > b : a < b, word = () => isMax() ? "maior" : "menor";
  function up(v, i) { while (i > 0) { const p = (i - 1) >> 1; if (!better(v[i], v[p])) { snap(v, `${v[i]} ${isMax() ? "≤" : "≥"} pai ${v[p]}: para de subir.`, { [i]: "on" }); return; } snap(v, `${v[i]} ${isMax() ? ">" : "<"} pai ${v[p]} (índice ${p} = (${i}−1)/2): troca.`, { [i]: "new", [p]: "del" }); [v[i], v[p]] = [v[p], v[i]]; i = p; } snap(v, "Chegou à raiz.", { 0: "on" }); }
  function down(v, i, n) { while (true) { const l = 2 * i + 1, r = 2 * i + 2; let m = i; if (l < n && better(v[l], v[m])) m = l; if (r < n && better(v[r], v[m])) m = r; if (m === i) { snap(v, `${v[i]} já é ${isMax() ? "≥" : "≤"} que os filhos: para.`, { [i]: "on" }, "hl", n < v.length ? n : null); return; } snap(v, `${v[i]} vs filhos ${l < n ? v[l] : "—"} e ${r < n ? v[r] : "—"}: troca com o ${word()} (${v[m]}).`, { [i]: "del", [m]: "new" }, "hl", n < v.length ? n : null); [v[i], v[m]] = [v[m], v[i]]; i = m; } }
  const rebuild = () => { const v = [...H]; for (let i = (v.length >> 1) - 1; i >= 0; i--) { let j = i; while (true) { const l = 2 * j + 1, r = 2 * j + 2; let m = j; if (l < v.length && better(v[l], v[m])) m = l; if (r < v.length && better(v[r], v[m])) m = r; if (m === j) break; [v[j], v[m]] = [v[m], v[j]]; j = m; } } H = v; };
  $("#hp-kind").onchange = () => { rebuild(); steps = []; snap(H, `Convertido para heap ${isMax() ? "máximo: pai ≥ filhos" : "mínimo: pai ≤ filhos"}.`, {}, "ok"); S.go(steps); };
  $("#hp-ins").onclick = () => { const x = numIn("#hp-x"); if (x === null) return; steps = []; H.push(x); snap(H, `Coloca ${x} na primeira posição livre (índice ${H.length - 1}), mantendo a árvore completa.`, { [H.length - 1]: "new" }); up(H, H.length - 1); snap(H, "Inserção concluída: O(log n).", {}, "ok"); S.go(steps); $("#hp-x").value = rnd(99) + 1; };
  $("#hp-rem").onclick = () => { steps = []; if (!H.length) { snap(H, "Heap vazio.", {}, "bad"); return S.go(steps); } const top = H[0]; snap(H, `Remove a raiz <b>${top}</b> (o ${word()}).`, { 0: "del" }); const last = H.pop(); if (H.length) { H[0] = last; snap(H, `O último (${last}) vai para a raiz.`, { 0: "new" }); down(H, 0, H.length); } snap(H, `Removido ${top}. O(log n).`, {}, "ok"); S.go(steps); };
  $("#hp-build").onclick = () => { const v = $("#hp-arr").value.split(/[\s,;]+/).filter(Boolean).map(Number).filter(Number.isFinite); if (!v.length) return; steps = []; snap(v, `Vetor original. Nós internos: de ${(v.length >> 1) - 1} até 0.`); for (let i = (v.length >> 1) - 1; i >= 0; i--) { snap(v, `Descer o índice ${i} (${v[i]}).`, { [i]: "mark" }); down(v, i, v.length); } H = v; snap(H, "Heap construído em O(n).", {}, "ok"); S.go(steps); };
  $("#hp-sort").onclick = () => { const v = $("#hp-arr").value.split(/[\s,;]+/).filter(Boolean).map(Number).filter(Number.isFinite); if (!v.length) return; steps = []; for (let i = (v.length >> 1) - 1; i >= 0; i--) { let j = i; while (true) { const l = 2 * j + 1, r = 2 * j + 2; let m = j; if (l < v.length && better(v[l], v[m])) m = l; if (r < v.length && better(v[r], v[m])) m = r; if (m === j) break; [v[j], v[m]] = [v[m], v[j]]; j = m; } } snap(v, "Fase 1: heap construído.", {}, "hl"); for (let fim = v.length - 1; fim > 0; fim--) { snap(v, `Troca a raiz ${v[0]} com o índice ${fim}; ele fica na posição final.`, { 0: "del", [fim]: "new" }, "hl", fim + 1); [v[0], v[fim]] = [v[fim], v[0]]; down(v, 0, fim); } snap(v, `Ordenado ${isMax() ? "crescente" : "decrescente"}: ${v.join(" ")}.`, {}, "ok", 0); H = []; S.go(steps); };
  $("#hp-clr").onclick = () => { H = []; steps = []; snap(H, "Heap vazio."); S.go(steps); };
  steps = []; snap(H, "O heap da Figura 9.1. Insira 85 para ver a subida da Figura 9.2."); S.go(steps);
})();

// ===================================================== REVISÃO · exercícios
(function () {
  let T, kind, ans;
  const names = { pre: "pré-ordem", em: "em-ordem", pos: "pós-ordem", nivel: "em nível" };
  $("#tp-new").onclick = () => { T = randomBST(7 + rnd(3)); kind = ["pre", "em", "pos", "nivel"][rnd(4)]; ans = orders(T)[kind]; $("#tp-q").innerHTML = `Escreva o percurso <b>${names[kind]}</b> desta árvore:`; $("#tp-svg").innerHTML = drawTree(T); $("#tp-in").value = ""; say("#tp-st", "Digite as chaves separadas por espaço."); };
  $("#tp-ok").onclick = () => { const u = $("#tp-in").value.split(/[\s,]+/).filter(Boolean).map(Number); const ok = u.join(" ") === ans.join(" "); say("#tp-st", ok ? "<b>Certo!</b>" : `Ainda não. Resposta: <b class="mono">${ans.join(" ")}</b>`, ok ? "ok" : "bad"); };
  $("#tp-in").onkeydown = e => { if (e.key === "Enter") $("#tp-ok").onclick(); };
  $("#tp-new").onclick();

  let R;
  const pats = { LL: [30, 20, 10], RR: [10, 20, 30], LR: [30, 10, 20], RL: [10, 30, 20], nenhuma: [20, 10, 30] };
  const OPTS = [["LL", "rotação simples à direita"], ["RR", "rotação simples à esquerda"], ["LR", "dupla: esquerda no filho, direita no nó"], ["RL", "dupla: direita no filho, esquerda no nó"], ["nenhuma", "nenhuma rotação"]];
  $("#tr-new").onclick = () => {
    const k = Object.keys(pats)[rnd(5)], base = 10 + rnd(5) * 10; R = k;
    const ks = pats[k].map(v => v + base);
    $("#tr-q").innerHTML = `Numa AVL vazia, insira <b>${ks.join(", ")}</b>. Depois da última inserção (antes de balancear), qual a operação?`;
    let t = null; ks.forEach(v => t = bstInsertPlain(t, v));
    $("#tr-svg").innerHTML = drawTree(t, { lab: fbMap(t) });
    $("#tr-opts").innerHTML = ""; OPTS.forEach(([c, d]) => { const b = h("button", { class: "opt", type: "button" }, `<b>${c === "nenhuma" ? "—" : c}</b> · ${d}`); b.onclick = () => { if ($("#tr-opts").dataset.done) return; $("#tr-opts").dataset.done = 1; const ok = c === R; b.classList.add(ok ? "right" : "wrong"); say("#tr-st", ok ? "<b>Certo!</b>" : `Não. Era <b>${R}</b>: ${OPTS.find(o => o[0] === R)[1]}. Olhe os sinais dos FBs do nó desbalanceado e do filho.`, ok ? "ok" : "bad"); }; $("#tr-opts").appendChild(b); });
    delete $("#tr-opts").dataset.done; say("#tr-st", "Escolha uma opção. As etiquetas amarelas mostram os FBs.");
  };
  $("#tr-new").onclick();

  let HA;
  $("#th-new").onclick = () => {
    const base = shuffle([...Array(90).keys()].map(x => x + 5)).slice(0, 7);
    const v = [...base]; for (let i = (v.length >> 1) - 1; i >= 0; i--) { let j = i; while (true) { const l = 2 * j + 1, r = 2 * j + 2; let m = j; if (l < v.length && v[l] > v[m]) m = l; if (r < v.length && v[r] > v[m]) m = r; if (m === j) break; [v[j], v[m]] = [v[m], v[j]]; j = m; } }
    const op = rnd(2); const w = [...v];
    if (op === 0) { const x = rnd(95) + 3; w.push(x); let i = w.length - 1; while (i > 0 && w[(i - 1) >> 1] < w[i]) { const p = (i - 1) >> 1; [w[i], w[p]] = [w[p], w[i]]; i = p; } $("#th-q").innerHTML = `Heap máximo <b class="mono">[${v.join(", ")}]</b>. Insira <b>${x}</b>. Qual o vetor?`; }
    else { w[0] = w.pop(); let i = 0; while (true) { const l = 2 * i + 1, r = 2 * i + 2; let m = i; if (l < w.length && w[l] > w[m]) m = l; if (r < w.length && w[r] > w[m]) m = r; if (m === i) break; [w[i], w[m]] = [w[m], w[i]]; i = m; } $("#th-q").innerHTML = `Heap máximo <b class="mono">[${v.join(", ")}]</b>. Remova o máximo. Qual o vetor?`; }
    HA = w; $("#th-in").value = ""; say("#th-st", "Digite o vetor resultante, separado por espaços.");
  };
  $("#th-ok").onclick = () => { const u = $("#th-in").value.split(/[\s,\[\]]+/).filter(Boolean).map(Number); const ok = u.join(" ") === HA.join(" "); say("#th-st", ok ? "<b>Certo!</b>" : `Ainda não. Resposta: <b class="mono">${HA.join(" ")}</b>`, ok ? "ok" : "bad"); };
  $("#th-in").onkeydown = e => { if (e.key === "Enter") $("#th-ok").onclick(); };
  $("#th-new").onclick();
})();
