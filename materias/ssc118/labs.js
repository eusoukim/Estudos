/* SSC118 · laboratórios interativos.
   Usa os utilitários globais de assets/engine.js ($, h, bitButton, led, scopeSVG, gatePath, W, T...).
   Cada lab procura seus elementos por id dentro de materias/ssc118/index.html (seções .pr-cap). */

// ===================================================== início: lâmpadas
(function lamps() {
  const box = $("#lampDemo"); if (!box) return;
  let hist = [];
  const draw = () => {
    box.innerHTML = "";
    [1, 2, 3].forEach(i => { const b = h("button", { class: "btn", type: "button" }, `Acender ${i}`); b.onclick = () => { hist.push(i); hist = hist.slice(-3); draw(); }; box.appendChild(b); });
    const alarm = hist.join("") === "123";
    const st = h("div", { class: "status " + (alarm ? "bad" : "") }, `Histórico: <span class="mono">${hist.join(" → ") || "—"}</span>${alarm ? " · <b>ALARME!</b>" : ""}`);
    st.style.flexBasis = "100%"; box.appendChild(st);
  };
  draw();
})();

// ===================================================== LATCHES
const Latch = { kind: "nor", a: 0, b: 0, q: 0, qn: 1, hist: { a: [], b: [], q: [], qn: [] }, race: "" };
function latchSettle(randomOnRace) {
  const L = Latch; let q = L.q, qn = L.qn;
  for (let i = 0; i < 8; i++) {
    let nq, nqn;
    if (L.kind === "nor") { nq = +!(L.a || qn); nqn = +!(L.b || q); } // a = R (topo), b = S
    else { nq = +!(L.a && qn); nqn = +!(L.b && q); } // a = S̄ (topo), b = R̄
    if (nq === q && nqn === qn) { L.q = q; L.qn = qn; return true; }
    q = nq; qn = nqn;
  }
  // oscilou: corrida
  const r = rnd(2); L.q = r; L.qn = 1 - r; L.race = randomOnRace ? r : "";
  return false;
}
function latchCircuit() {
  const L = Latch, nor = L.kind === "nor";
  const g1 = gatePath(L.kind, 150, 30), g2 = gatePath(L.kind, 150, 130);
  const tl = nor ? "R" : ov("S"), bl = nor ? "S" : ov("R");
  let s = `<svg viewBox="0 0 400 200" width="400" role="img" aria-label="Circuito do latch">`;
  s += W([[44, g1.in[0][1]], g1.in[0]], L.a) + W([[44, g2.in[1][1]], g2.in[1]], L.b);
  s += W([g1.out, [340, g1.out[1]]], L.q) + W([[250, g1.out[1]], [250, 82], [128, 116], [128, g2.in[0][1]], g2.in[0]], L.q);
  s += W([g2.out, [340, g2.out[1]]], L.qn) + W([[272, g2.out[1]], [272, 118], [114, 84], [114, g1.in[1][1]], g1.in[1]], L.qn);
  s += g1.s + g2.s;
  s += `<circle cx="250" cy="${g1.out[1]}" r="3.5" style="fill:var(--ink)"/><circle cx="272" cy="${g2.out[1]}" r="3.5" style="fill:var(--ink)"/>`;
  s += T(30, g1.in[0][1], tl, "end") + T(30, g2.in[1][1], bl, "end");
  s += T(350, g1.out[1], "Q", "start") + T(350, g2.out[1], ov("Q"), "start");
  s += T(380, g1.out[1], L.q, "middle", 15, "fill:var(--hi)") + T(380, g2.out[1], L.qn, "middle", 15, "fill:var(--violet)");
  return s + "</svg>";
}
function latchRender() {
  const L = Latch, nor = L.kind === "nor";
  $("#lt-circ").innerHTML = latchCircuit();
  const S = nor ? L.b : L.a, R = nor ? L.a : L.b;
  let msg, cls = "";
  if (nor) {
    if (S && R) { msg = "S = R = 1: <b>inválido</b>. As duas NOR têm um 1 na entrada, então Q = Q̄ = 0."; cls = "bad"; }
    else if (S) { msg = "SET: S = 1 força Q̄ = 0, e a NOR de cima dá Q = 1."; cls = "hl"; }
    else if (R) { msg = "RESET: R = 1 força Q = 0."; cls = "hl"; }
    else msg = `Repouso (S = R = 0): o latch <b>mantém</b> Q = ${L.q}. A realimentação segura o valor.`;
  } else {
    if (!S && !R) { msg = "S̄ = R̄ = 0: <b>inválido</b>. As duas NAND têm um 0 na entrada, então Q = Q̄ = 1."; cls = "bad"; }
    else if (!S) { msg = "SET: S̄ = 0 força Q = 1."; cls = "hl"; }
    else if (!R) { msg = "RESET: R̄ = 0 força Q̄ = 1, e a NAND de cima dá Q = 0."; cls = "hl"; }
    else msg = `Repouso (S̄ = R̄ = 1): o latch <b>mantém</b> Q = ${L.q}.`;
  }
  if (L.race !== "") { msg = `Corrida! As duas ordens saíram juntas do estado inválido e as portas “disputaram”. Desta vez sobrou Q = ${L.race}, mas poderia ser o contrário. Por isso o estado é proibido.`; cls = "bad"; }
  const st = $("#lt-status"); st.className = "status " + cls; st.innerHTML = msg;
  $("#lt-leds").innerHTML = ""; const l1 = led("Q"), l2 = led("Q̄"); l1.set(L.q); l2.set(L.qn); $("#lt-leds").append(l1, l2);
  const H = L.hist;
  $("#lt-scope").innerHTML = scopeSVG([
    { name: "S", over: !nor, vals: nor ? H.b : H.a, cls: "in" }, { name: "R", over: !nor, vals: nor ? H.a : H.b, cls: "in" },
    { name: "Q", vals: H.q, cls: "q" }, { name: "Q", over: true, vals: H.qn, cls: "qn" }], { id: "lt" });
}
function latchRecord() { const L = Latch; L.hist.a.push(L.a); L.hist.b.push(L.b); L.hist.q.push(L.q); L.hist.qn.push(L.qn); }
function latchInputs() {
  const L = Latch, nor = L.kind === "nor", box = $("#lt-inputs"); box.innerHTML = "";
  const mk = (name, key) => bitButton(name, L[key], v => { L[key] = v; L.race = ""; latchSettle(false); latchRecord(); latchRender(); });
  if (nor) box.append(mk("S (set)", "b"), mk("R (reset)", "a"));
  else box.append(mk("S̄ (set)", "a"), mk("R̄ (reset)", "b"));
}
function latchInit() {
  const L = Latch;
  L.kind = $("#lt-kind").value; L.hist = { a: [], b: [], q: [], qn: [] }; L.race = "";
  if (L.kind === "nor") { L.a = 0; L.b = 0; } else { L.a = 1; L.b = 1; }
  L.q = 0; L.qn = 1; latchRecord(); latchInputs(); latchRender();
}
$("#lt-kind").addEventListener("change", latchInit);
$("#lt-clear").addEventListener("click", () => { Latch.hist = { a: [], b: [], q: [], qn: [] }; latchRecord(); latchRender(); });
$("#lt-race").addEventListener("click", () => {
  const L = Latch, nor = L.kind === "nor";
  // leva ao inválido e solta junto
  if (nor) { L.a = 1; L.b = 1; } else { L.a = 0; L.b = 0; }
  latchSettle(false); latchRecord();
  if (nor) { L.a = 0; L.b = 0; } else { L.a = 1; L.b = 1; }
  latchSettle(true); L.hist.a.push(L.a); L.hist.b.push(L.b); L.hist.q.push("x"); L.hist.qn.push("x"); latchRecord();
  latchInputs(); latchRender();
});
latchInit();

// ===================================================== TEMPO
const CHIPS = [
  { n: "TTL 7474", ts: 20, th: 5, phl: 40, plh: 25, wl: 37, wh: 30, f: 15 },
  { n: "TTL 74LS112", ts: 20, th: 0, phl: 24, plh: 16, wl: 15, wh: 20, f: 30 },
  { n: "CMOS 74C74", ts: 60, th: 0, phl: 200, plh: 200, wl: 100, wh: 100, f: 5 },
  { n: "CMOS 74HC112", ts: 25, th: 0, phl: 31, plh: 31, wl: 25, wh: 25, f: 20 }];
function clockLab() {
  const f = +$("#ck-f").value, d = +$("#ck-d").value;
  const T_ = 1000 / f, th = T_ * d / 100, tl = T_ - th;
  $("#ck-fv").textContent = f + " MHz"; $("#ck-dv").textContent = d + " %";
  const Wd = 760, per = 3, px = (Wd - 80) / per; let pts = [[40, 110]];
  for (let i = 0; i < per; i++) { const x0 = 40 + i * px; pts.push([x0, 110], [x0, 40], [x0 + px * d / 100, 40], [x0 + px * d / 100, 110], [x0 + px, 110]); }
  let s = `<svg viewBox="0 0 ${Wd} 170" width="${Wd}" role="img" aria-label="Clock">`;
  s += `<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" style="stroke:var(--clk)" stroke-width="3"/>`;
  const x0 = 40 + px, x1 = x0 + px, xm = x0 + px * d / 100;
  s += `<line x1="${x0}" y1="140" x2="${x1}" y2="140" style="stroke:var(--hi)" stroke-width="2"/><line x1="${x0}" y1="132" x2="${x0}" y2="148" style="stroke:var(--hi)" stroke-width="2"/><line x1="${x1}" y1="132" x2="${x1}" y2="148" style="stroke:var(--hi)" stroke-width="2"/>`;
  s += T((x0 + x1) / 2, 158, `T = ${T_.toFixed(1)} ns`, "middle", 13, "fill:var(--hi)");
  s += `<line x1="${x0}" y1="26" x2="${xm}" y2="26" style="stroke:var(--ok)" stroke-width="2"/>` + T((x0 + xm) / 2, 14, `alto ${th.toFixed(1)} ns`, "middle", 12, "fill:var(--ok)");
  s += T(20, 40, "1", "middle", 12, "fill:var(--muted)") + T(20, 110, "0", "middle", 12, "fill:var(--muted)");
  $("#ck-svg").innerHTML = s + "</svg>";
  let rows = CHIPS.map(c => { const okF = f <= c.f, okH = th >= c.wh, okL = tl >= c.wl, ok = okF && okH && okL; return `<tr><td class="l">${c.n}</td><td>${c.f}</td><td>${okF ? "✓" : "✗"}</td><td>${c.wh}</td><td>${okH ? "✓" : "✗"}</td><td>${c.wl}</td><td>${okL ? "✓" : "✗"}</td><td style="color:${ok ? "var(--ok)" : "var(--bad)"};font-weight:600">${ok ? "funciona" : "não garante"}</td></tr>`; }).join("");
  $("#ck-read").innerHTML = `<div class="status" style="flex:1">f = ${f} MHz → <b>T = 1/f = ${T_.toFixed(1)} ns</b> · tempo em alto = ${th.toFixed(1)} ns · em baixo = ${tl.toFixed(1)} ns · duty = ${d}%</div>
  <div class="tscroll" style="flex-basis:100%"><table><tr><th class="l">Chip</th><th>f<sub>MAX</sub></th><th></th><th>t<sub>W(H)</sub> mín</th><th></th><th>t<sub>W(L)</sub> mín</th><th></th><th>Com este clock</th></tr>${rows}</table></div>`;
}
["#ck-f", "#ck-d"].forEach(id => $(id).addEventListener("input", clockLab));
function setupLab() {
  const c = CHIPS[+$("#sh-chip").value], t = +$("#sh-t").value;
  $("#sh-tv").textContent = t < 0 ? `${-t} ns antes da borda` : t === 0 ? "exatamente na borda" : `${t} ns depois da borda`;
  const Wd = 760, X0 = 400, k = 4.2, x = v => X0 + v * k;
  let s = `<svg viewBox="0 0 ${Wd} 200" width="${Wd}" role="img" aria-label="Janela de setup e hold">`;
  s += `<rect x="${x(-c.ts)}" y="20" width="${(c.ts + c.th) * k || 2}" height="150" style="fill:var(--bad)" opacity=".13"/>`;
  s += T(x(-c.ts) + (c.ts * k) / 2, 186, `tS = ${c.ts} ns`, "middle", 12, "fill:var(--bad)");
  if (c.th) s += T(x(c.th / 2) + 4, 186, `tH = ${c.th}`, "start", 12, "fill:var(--bad)");
  s += T(40, 50, "CLK", "start", 13, "fill:var(--clk)") + `<polyline points="90,70 ${X0 - 4},70 ${X0 + 4},30 ${Wd - 20},30" fill="none" style="stroke:var(--clk)" stroke-width="3"/>`;
  const xd = x(t);
  s += T(40, 125, "D", "start", 13) + `<polyline points="90,140 ${xd - 5},140 ${xd + 5},100 ${Wd - 20},100" fill="none" style="stroke:var(--ink)" stroke-width="3"/>`;
  s += `<line x1="${X0}" y1="14" x2="${X0}" y2="172" style="stroke:var(--muted)" stroke-dasharray="4 4"/>` + T(X0, 10, "borda ↑", "middle", 12, "fill:var(--muted)");
  $("#sh-svg").innerHTML = s + "</svg>";
  const viol = t > -c.ts && t < c.th, st = $("#sh-status");
  st.className = "status " + (viol ? "bad" : "ok");
  st.innerHTML = viol ? `<b>Violação.</b> D mudou dentro da janela proibida (de ${c.ts} ns antes a ${c.th} ns depois da borda). O FF pode capturar o valor errado ou ficar metaestável.` :
    (t <= -c.ts ? `<b>OK.</b> D já estava estável ${-t} ns antes da borda (mínimo ${c.ts} ns). O FF captura o valor novo.` : `<b>OK.</b> D ficou parado até ${t} ns depois da borda (mínimo ${c.th} ns). O FF capturou o valor antigo; o novo só vale na próxima borda.`);
}
(function () {
  const sel = $("#sh-chip"); CHIPS.forEach((c, i) => sel.appendChild(h("option", { value: i }, c.n))); sel.value = 1;
  $("#sh-table").innerHTML = `<tr><th class="l">Parâmetro</th>${CHIPS.map(c => `<th>${c.n}</th>`).join("")}</tr>` +
    [["t<sub>S</sub> (ns)", "ts"], ["t<sub>H</sub> (ns)", "th"], ["t<sub>PHL</sub> (ns)", "phl"], ["t<sub>PLH</sub> (ns)", "plh"], ["t<sub>W(L)</sub> (ns)", "wl"], ["t<sub>W(H)</sub> (ns)", "wh"], ["f<sub>MAX</sub> (MHz)", "f"]]
      .map(([l, k]) => `<tr><td class="l">${l}</td>${CHIPS.map(c => `<td>${c[k]}</td>`).join("")}</tr>`).join("");
  sel.addEventListener("change", setupLab); $("#sh-t").addEventListener("input", setupLab);
  clockLab(); setupLab();
})();

// ===================================================== FLIP-FLOPS
const FF = { type: "JK", edge: "rise", in: { J: 0, K: 0, D: 0, T: 0, S: 0, R: 0 }, clk: 0, pre: 1, clr: 1, q: 0, ql: 0, hist: [], marks: [], msg: "", timer: null };
const FF_IN = { JK: ["J", "K"], D: ["D"], T: ["T"], SR: ["S", "R"] };
function ffNext(q) {
  const i = FF.in;
  switch (FF.type) {
    case "D": return [i.D, i.D ? "D = 1 → Q = 1" : "D = 0 → Q = 0"];
    case "T": return i.T ? [1 - q, "T = 1 → comuta"] : [q, "T = 0 → mantém"];
    case "JK": if (i.J && i.K) return [1 - q, "J = K = 1 → comuta"]; if (i.J) return [1, "J = 1, K = 0 → set"]; if (i.K) return [0, "J = 0, K = 1 → reset"]; return [q, "J = K = 0 → mantém"];
    case "SR": if (i.S && i.R) return ["x", "S = R = 1 → inválido!"]; if (i.S) return [1, "S = 1 → set"]; if (i.R) return [0, "R = 1 → reset"]; return [q, "S = R = 0 → mantém"];
  }
}
function ffAsync() {
  if (!FF.pre && !FF.clr) { FF.q = "x"; FF.msg = "PRE̅ = CLR̅ = 0 ao mesmo tempo: proibido."; return true; }
  if (!FF.clr) { FF.q = 0; FF.msg = "CLR̅ = 0: Q vai a 0 na hora, sem esperar o clock."; return true; }
  if (!FF.pre) { FF.q = 1; FF.msg = "PRE̅ = 0: Q vai a 1 na hora, sem esperar o clock."; return true; }
  return false;
}
function ffRecord(mark) {
  const r = { clk: FF.clk, ...FF.in, pre: FF.pre, clr: FF.clr, q: FF.q, ql: FF.ql };
  FF.hist.push(r); if (mark) FF.marks.push(FF.hist.length - 1);
  if (FF.hist.length > 200) { FF.hist.shift(); FF.marks = FF.marks.map(m => m - 1).filter(m => m >= 0); }
}
function ffSetClk(v) {
  const prev = FF.clk; FF.clk = v;
  const active = (FF.edge === "rise" && !prev && v) || (FF.edge === "fall" && prev && !v);
  if (FF.type === "D" && FF.clk) FF.ql = FF.in.D;
  if (ffAsync()) { ffRecord(false); ffRender(); return; }
  if (active) {
    const old = FF.q === "x" ? 0 : FF.q;
    const [nq, why] = ffNext(old); FF.q = nq;
    FF.msg = `Borda ${FF.edge === "rise" ? "de subida ↑" : "de descida ↓"}: ${why}. Q = ${nq === "x" ? "?" : nq}.`;
  } else FF.msg = `CLK ${v ? "subiu" : "desceu"}, mas esta não é a borda ativa (${FF.edge === "rise" ? "↑" : "↓"}). Q não muda.`;
  ffRecord(active); ffRender();
}
function ffTable() {
  const t = FF.type, i = FF.in, e = FF.edge === "rise" ? "↑" : "↓";
  const rows = { JK: [["0 0", "mantém"], ["1 0", "Q = 1"], ["0 1", "Q = 0"], ["1 1", "comuta"]], SR: [["0 0", "mantém"], ["1 0", "Q = 1"], ["0 1", "Q = 0"], ["1 1", "inválido"]], D: [["0", "Q = 0"], ["1", "Q = 1"]], T: [["0", "mantém"], ["1", "comuta"]] }[t];
  const cur = FF_IN[t].map(k => i[k]).join(" ");
  return `<table><tr><th>${FF_IN[t].join(" ")}</th><th>CLK</th><th class="l">Saída</th></tr>${rows.map(([a, b]) => `<tr class="${a === cur ? "cur" : ""}"><td class="mono">${a}</td><td>${e}</td><td class="l">${b}</td></tr>`).join("")}
  <tr><td>X</td><td>X</td><td class="l">${ovh("CLR")} = 0 → Q = 0</td></tr><tr><td>X</td><td>X</td><td class="l">${ovh("PRE")} = 0 → Q = 1</td></tr></table><p class="hint">Linha destacada = o que acontecerá na próxima borda ativa.</p>`;
}
function ffRender() {
  $("#ff-clk-lvl").textContent = `CLK = ${FF.clk} (clique para ${FF.clk ? "descer" : "subir"})`;
  const L = $("#ff-leds"); L.innerHTML = ""; const a = led("Q"), b = led("Q̄"); a.set(FF.q); b.set(FF.q === "x" ? "x" : 1 - FF.q); L.append(a, b);
  if (FF.type === "D" && $("#ff-showlatch").checked) { const c = led("latch D"); c.set(FF.ql); L.append(c); }
  $("#ff-status").innerHTML = FF.msg || "Mexa nas entradas e no clock.";
  $("#ff-table").innerHTML = ffTable();
  const Hh = FF.hist, col = k => Hh.map(r => r[k]);
  const rows = [{ name: "CLK", vals: col("clk"), cls: "clk" }, ...FF_IN[FF.type].map(k => ({ name: k, vals: col(k), cls: "in" }))];
  if (Hh.some(r => !r.pre || !r.clr)) rows.push({ name: "PRE", over: true, vals: col("pre"), cls: "m" }, { name: "CLR", over: true, vals: col("clr"), cls: "m" });
  rows.push({ name: "Q", vals: col("q"), cls: "q" });
  if (FF.type === "D" && $("#ff-showlatch").checked) rows.push({ name: "latch", vals: col("ql"), cls: "qn" });
  $("#ff-scope").innerHTML = scopeSVG(rows, { id: "ff", marks: FF.marks });
}
function ffBuild() {
  FF.type = $("#ff-type").value; FF.edge = $("#ff-edge").value;
  const box = $("#ff-inputs"); box.innerHTML = "";
  FF_IN[FF.type].forEach(k => box.appendChild(bitButton(k, FF.in[k], v => { FF.in[k] = v; if (FF.type === "D" && FF.clk) FF.ql = v; FF.msg = `${k} = ${v}. ${FF.type === "D" && FF.clk ? "O latch (nível) copiou na hora; o flip-flop espera a borda." : "Nada muda até a borda ativa."}`; ffRecord(false); ffRender(); })));
  const as = $("#ff-async"); as.innerHTML = "";
  as.append(bitButton("PRE̅", FF.pre, v => { FF.pre = v; if (!ffAsync()) FF.msg = "PRE̅ = 1: inativo."; ffRecord(false); ffRender(); }), bitButton("CLR̅", FF.clr, v => { FF.clr = v; if (!ffAsync()) FF.msg = "CLR̅ = 1: inativo."; ffRecord(false); ffRender(); }));
  FF.hist = []; FF.marks = []; FF.msg = ""; ffRecord(false); ffRender();
}
$("#ff-type").addEventListener("change", ffBuild); $("#ff-edge").addEventListener("change", ffBuild);
$("#ff-clk-lvl").addEventListener("click", () => ffSetClk(1 - FF.clk));
$("#ff-pulse").addEventListener("click", () => { ffSetClk(1 - FF.clk); setTimeout(() => ffSetClk(1 - FF.clk), 180); });
$("#ff-auto").addEventListener("change", e => { clearInterval(FF.timer); if (e.target.checked) FF.timer = setInterval(() => { if (!$("#v-flipflops").hidden) ffSetClk(1 - FF.clk); }, 650); });
$("#ff-showlatch").addEventListener("change", ffRender);
$("#ff-clear").addEventListener("click", () => { FF.hist = []; FF.marks = []; ffRecord(false); ffRender(); });
ffBuild();

// ===================================================== simbolo de FF em SVG (caixa com LED)
function ffBox(x, y, title, qv, extra = "", clkFall = true) {
  const on = qv === 1;
  let s = `<rect x="${x}" y="${y}" width="74" height="70" rx="6" style="fill:var(--panel);stroke:var(--ink)" stroke-width="1.8"/>`;
  s += T(x + 37, y - 10, title, "middle", 12, "fill:var(--muted)");
  s += `<path d="M${x},${y + 44} l9,6 l-9,6" fill="none" style="stroke:var(--ink)" stroke-width="1.6"/>`;
  if (clkFall) s += `<circle cx="${x - 4}" cy="${y + 50}" r="4" style="fill:var(--panel);stroke:var(--ink)" stroke-width="1.6"/>`;
  s += `<circle cx="${x + 54}" cy="${y + 22}" r="10" style="fill:${on ? "var(--hi)" : "var(--led-off)"};stroke:${on ? "var(--hi)" : "var(--line)"}" stroke-width="2"/>`;
  s += T(x + 54, y + 23, qv, "middle", 11, on ? "fill:var(--panel)" : "fill:var(--muted)");
  s += T(x + 20, y + 22, "Q", "middle", 12) + extra;
  return s;
}

// ===================================================== CONTADOR ASSÍNCRONO
const AC = { n: 4, mod: 16, q: [0, 0, 0, 0], hist: [], marks: [], labels: [], busy: false, timer: null, msg: "" };
const acVal = () => AC.q.reduce((s, b, i) => s + (b << i), 0);
function acShown() { const v = acVal(); return $("#ac-read").value === "qn" ? (2 ** AC.n - 1) - v : v; }
function acRec(clk, clr = 1, mark = false, label = null) {
  AC.hist.push({ clk, clr, q: [...AC.q] }); if (mark) AC.marks.push(AC.hist.length - 1); if (label !== null) AC.labels.push([AC.hist.length - 1, label]);
  if (AC.hist.length > 300) { AC.hist.shift(); AC.marks = AC.marks.map(m => m - 1).filter(m => m >= 0); AC.labels = AC.labels.map(([k, t]) => [k - 1, t]).filter(([k]) => k >= 0); }
}
function acNandBits() { if (AC.mod >= 2 ** AC.n) return []; return [...Array(AC.n).keys()].filter(i => (AC.mod >> i) & 1); }
function acRender(transient = false) {
  const n = AC.n, rd = $("#ac-read").value === "qn";
  let s = `<svg viewBox="0 0 ${110 + n * 140} 170" width="${110 + n * 140}" role="img" aria-label="Cadeia de flip-flops">`;
  s += T(14, 100, "CLK", "start", 13, "fill:var(--clk)") + `<line x1="50" y1="100" x2="72" y2="100" style="stroke:var(--clk)" stroke-width="2"/>`;
  const nb = acNandBits();
  for (let i = 0; i < n; i++) {
    const x = 80 + i * 140;
    s += ffBox(x, 50, `FF${i} · T=1`, rd ? 1 - AC.q[i] : AC.q[i]);
    s += T(x + 54, 135, (rd ? ov("Q") : "Q") + i + (i === 0 ? " LSB" : i === n - 1 ? " MSB" : ""), "middle", 12, nb.includes(i) ? "fill:var(--violet)" : "fill:var(--ink)");
    if (i < n - 1) s += `<polyline points="${x + 74},72 ${x + 100},72 ${x + 100},100 ${x + 132},100" fill="none" class="${AC.q[i] ? "w1" : "w0"}" stroke-width="2.2"/>`;
  }
  s += "</svg>";
  $("#ac-chain").innerHTML = s;
  $("#ac-val").textContent = `${bin(acShown(), n)} = ${acShown()}`;
  const st = $("#ac-status");
  const nbTxt = nb.length ? `NAND(${nb.slice().reverse().map(i => "Q" + i).join(", ")}) → CLR̅, porque ${AC.mod} = ${bin(AC.mod, n)}₂.` : `Contagem livre: módulo ${2 ** n} = 2^${n}, sem NAND.`;
  st.className = "status " + (transient ? "hl" : "");
  st.innerHTML = (AC.msg ? AC.msg + "<br>" : "") + `<span class="hint">${nbTxt}</span>`;
  const rows = [{ name: "CLK", vals: AC.hist.map(r => r.clk), cls: "clk" }];
  for (let i = 0; i < n; i++) rows.push({ name: "Q" + i, over: rd, vals: AC.hist.map(r => rd ? 1 - r.q[i] : r.q[i]), cls: i % 2 ? "qn" : "q" });
  if (nb.length) rows.push({ name: "CLR", over: true, vals: AC.hist.map(r => r.clr), cls: "m" });
  $("#ac-scope").innerHTML = scopeSVG(rows, { id: "ac", marks: AC.marks, labels: AC.labels, maxCols: 48 });
  const fclk = 1000;
  $("#ac-freq").innerHTML = `<table><tr><th class="l">Sinal (clock de ${fclk} Hz)</th><th>CLK</th>${[...Array(n).keys()].map(i => `<th>Q${i}</th>`).join("")}</tr><tr><td class="l">Frequência</td><td>${fclk} Hz</td>${[...Array(n).keys()].map(i => `<td>${i === n - 1 && nb.length ? (fclk / AC.mod).toFixed(1) + " Hz*" : (fclk / 2 ** (i + 1)).toFixed(1) + " Hz"}</td>`).join("")}</tr></table>${nb.length ? `<p class="hint">* MSB de um MOD-${AC.mod}: f/${AC.mod}. Como ${AC.mod} não é potência de 2, o duty cycle não é 50%.</p>` : ""}`;
}
function acPulse() {
  if (AC.busy) return; AC.busy = true;
  const slow = $("#ac-slow").checked, delay = 260;
  const before = acShown();
  acRec(1); acRec(0, 1, true);
  let i = 0;
  const step = () => {
    const old = AC.q[i]; AC.q[i] = 1 - old;
    const fell = old === 1;
    if (slow && fell && i < AC.n - 1) { AC.msg = `FF${i} caiu de 1 para 0 e gerou uma borda ↓ no FF${i + 1}. Valor passageiro: ${bin(acShown(), AC.n)} (${acShown()}).`; acRec(0); acRender(true); i++; setTimeout(step, delay); return; }
    if (fell && i < AC.n - 1) { i++; step(); return; }
    finish();
  };
  const finish = () => {
    if (acNandBits().length && acVal() === AC.mod) {
      AC.msg = `Chegou em ${AC.mod} (${bin(AC.mod, AC.n)}): a NAND dispara e CLR̅ = 0 zera tudo. O estado ${AC.mod} durou só um instante (glitch).`;
      acRec(0, 0); AC.q = AC.q.map(() => 0); acRec(0, 1, false, acShown());
    } else { AC.msg = `${before} → ${acShown()}.`; acRec(0, 1, false, acShown()); }
    AC.busy = false; acRender();
  };
  if (slow) { AC.msg = "Borda de descida no FF0..."; acRender(true); setTimeout(step, delay); } else step();
}
function acSetup() {
  AC.n = +$("#ac-n").value; const max = 2 ** AC.n;
  let m = +$("#ac-mod").value || max; if (m > max) m = max; if (m < 2) m = 2; $("#ac-mod").value = m; $("#ac-mod").max = max;
  AC.mod = m; AC.q = Array(AC.n).fill(0); AC.hist = []; AC.marks = []; AC.labels = []; AC.msg = ""; AC.busy = false;
  acRec(0, 1, false, acShown()); acRender();
}
$("#ac-n").addEventListener("change", () => { $("#ac-mod").value = 2 ** +$("#ac-n").value; acSetup(); });
$("#ac-mod").addEventListener("change", acSetup);
$("#ac-read").addEventListener("change", () => { AC.labels = []; acRender(); });
$("#ac-pulse").addEventListener("click", acPulse);
$("#ac-reset").addEventListener("click", () => { AC.q = AC.q.map(() => 0); AC.msg = "CLR̅ = 0 aplicado: todos os FFs em 0."; acRec(0, 0); acRec(0, 1, false, acShown()); acRender(); });
$("#ac-clear").addEventListener("click", () => { AC.hist = []; AC.marks = []; AC.labels = []; acRec(0, 1, false, acShown()); acRender(); });
$("#ac-auto").addEventListener("change", e => { clearInterval(AC.timer); if (e.target.checked) AC.timer = setInterval(() => { if (!$("#v-assincronos").hidden) acPulse(); }, 1300); });
acSetup();

// ===================================================== CONTADOR SÍNCRONO
const SC = { n: 3, q: [0, 0, 0], hist: [], marks: [], labels: [], timer: null, msg: "" };
const scVal = () => SC.q.reduce((s, b, i) => s + (b << i), 0);
function scT() { const en = $("#sc-en").checked ? 1 : 0; return SC.q.map((_, i) => en && SC.q.slice(0, i).every(b => b) ? 1 : 0); }
function scRender() {
  const n = SC.n, t = scT();
  let s = `<svg viewBox="0 0 ${60 + n * 170} 190" width="${60 + n * 170}" role="img" aria-label="Contador síncrono">`;
  for (let i = 0; i < n; i++) {
    const x = 50 + i * 170;
    const eq = i === 0 ? "EN" : "EN·" + [...Array(i).keys()].reverse().map(k => "Q" + k).join("·");
    s += ffBox(x, 50, `FF${i}`, SC.q[i], "", false);
    s += `<line x1="${x - 30}" y1="72" x2="${x}" y2="72" class="${t[i] ? "w1" : "w0"}" stroke-width="3"/>`;
    s += T(x - 32, 60, `T${i}=${t[i]}`, "start", 12, t[i] ? "fill:var(--hi)" : "fill:var(--muted)");
    s += T(x + 37, 30, i === 0 ? "T0 = EN" : `T${i} = ${eq}`, "middle", 11, "fill:var(--muted)");
    s += `<line x1="${x - 14}" y1="100" x2="${x}" y2="100" style="stroke:var(--clk)" stroke-width="2"/><line x1="${x - 14}" y1="100" x2="${x - 14}" y2="160" style="stroke:var(--clk)" stroke-width="2"/>`;
    s += T(x + 37, 136, "Q" + i, "middle", 12);
  }
  s += `<line x1="20" y1="160" x2="${50 + (n - 1) * 170 - 14}" y2="160" style="stroke:var(--clk)" stroke-width="2.4"/>` + T(20, 176, "CLK comum", "start", 12, "fill:var(--clk)");
  $("#sc-chain").innerHTML = s + "</svg>";
  $("#sc-val").textContent = `${bin(scVal(), n)} = ${scVal()}`;
  const tog = t.map((v, i) => v ? "Q" + i : null).filter(Boolean);
  $("#sc-status").innerHTML = (SC.msg ? SC.msg + "<br>" : "") + `Na próxima borda comutam juntos: <b>${tog.join(", ") || "nenhum (EN = 0)"}</b>.`;
  const rows = [{ name: "CLK", vals: SC.hist.map(r => r.clk), cls: "clk" }];
  for (let i = 0; i < n; i++) rows.push({ name: "Q" + i, vals: SC.hist.map(r => r.q[i]), cls: i % 2 ? "qn" : "q" });
  $("#sc-scope").innerHTML = scopeSVG(rows, { id: "sc", marks: SC.marks, labels: SC.labels, maxCols: 40 });
}
function scRec(clk, mark, label) { SC.hist.push({ clk, q: [...SC.q] }); if (mark) SC.marks.push(SC.hist.length - 1); if (label != null) SC.labels.push([SC.hist.length - 1, label]); if (SC.hist.length > 300) { SC.hist.shift(); SC.marks = SC.marks.map(m => m - 1).filter(m => m >= 0); SC.labels = SC.labels.map(([k, l]) => [k - 1, l]).filter(([k]) => k >= 0); } }
function scPulse() { const t = scT(), b = scVal(); SC.q = SC.q.map((q, i) => t[i] ? 1 - q : q); SC.msg = `${b} → ${scVal()}: todos os FFs com T = 1 mudaram na mesma borda.`; scRec(1, true, scVal()); scRec(0); scRender(); }
function scSetup() { SC.n = +$("#sc-n").value; SC.q = Array(SC.n).fill(0); SC.hist = []; SC.marks = []; SC.labels = []; SC.msg = ""; scRec(0, false, 0); scRender(); }
$("#sc-n").addEventListener("change", scSetup); $("#sc-en").addEventListener("change", scRender);
$("#sc-pulse").addEventListener("click", scPulse); $("#sc-reset").addEventListener("click", scSetup);
$("#sc-auto").addEventListener("change", e => { clearInterval(SC.timer); if (e.target.checked) SC.timer = setInterval(() => { if (!$("#v-sincronos").hidden) scPulse(); }, 900); });
scSetup();

// ===================================================== Quine–McCluskey
function qm(n, ones, dcs) {
  if (!ones.length) return [];
  const all = [...new Set([...ones, ...dcs])];
  if (all.length === 2 ** n) return [{ val: 0, mask: 2 ** n - 1 }];
  let cur = all.map(v => ({ val: v, mask: 0 })), primes = [];
  const key = t => t.val + ":" + t.mask;
  while (cur.length) {
    const used = new Set(), next = new Map();
    for (let i = 0; i < cur.length; i++) for (let j = i + 1; j < cur.length; j++) {
      const a = cur[i], b = cur[j];
      if (a.mask !== b.mask) continue;
      const d = a.val ^ b.val;
      if (d && !(d & (d - 1))) { const t = { val: a.val & ~d, mask: a.mask | d }; next.set(key(t), t); used.add(i); used.add(j); }
    }
    cur.forEach((t, i) => { if (!used.has(i) && !primes.some(p => key(p) === key(t))) primes.push(t); });
    cur = [...next.values()];
  }
  const covers = (p, m) => (m & ~p.mask) === p.val;
  let left = new Set(ones), chosen = [];
  ones.forEach(m => { const c = primes.filter(p => covers(p, m)); if (c.length === 1 && !chosen.includes(c[0])) chosen.push(c[0]); });
  chosen.forEach(p => ones.forEach(m => { if (covers(p, m)) left.delete(m); }));
  const lits = p => n - [...Array(n).keys()].filter(i => (p.mask >> i) & 1).length;
  while (left.size) {
    let best = null, bc = -1;
    primes.forEach(p => { const c = [...left].filter(m => covers(p, m)).length; if (c > bc || (c === bc && best && lits(p) < lits(best))) { best = p; bc = c; } });
    chosen.push(best); [...left].forEach(m => { if (covers(best, m)) left.delete(m); });
  }
  return chosen;
}
function sopHTML(terms, n) {
  if (!terms.length) return "0";
  return terms.map(p => { const lits = []; for (let i = n - 1; i >= 0; i--) { if ((p.mask >> i) & 1) continue; lits.push((p.val >> i) & 1 ? `Q${i}` : ovh(`Q${i}`)); } return lits.length ? lits.join("·") : "1"; }).join(" + ");
}
const sopEval = (terms, s) => terms.some(p => (s & ~p.mask) === p.val) ? 1 : 0;

// ===================================================== PROJETISTA
const PD = { n: 3, seq: [], eq: [], state: 0, ff: "T" };
function pdDesign() {
  const err = $("#pd-err"); err.hidden = true;
  const raw = $("#pd-seq").value.split(/[,;\s]+/).filter(Boolean).map(Number);
  if (raw.length < 2 || raw.some(v => !Number.isInteger(v) || v < 0 || v > 15)) { err.hidden = false; err.className = "status bad"; err.textContent = "Use de 2 a 16 números inteiros entre 0 e 15, separados por vírgula."; return; }
  if (new Set(raw).size !== raw.length) { err.hidden = false; err.className = "status bad"; err.textContent = "Cada estado só pode aparecer uma vez na sequência."; return; }
  const n = Math.max(1, Math.ceil(Math.log2(Math.max(...raw) + 1)));
  const ff = $("#pd-ff").value, nx = {};
  raw.forEach((v, i) => nx[v] = raw[(i + 1) % raw.length]);
  const states = [...Array(2 ** n).keys()], unused = states.filter(s => !(s in nx));
  const inputs = []; // por bit: {name, ones, dcs}
  for (let b = n - 1; b >= 0; b--) {
    const names = ff === "JK" ? ["J", "K"] : [ff];
    names.forEach(nm => {
      const ones = [], dcs = [...unused];
      raw.forEach(s => {
        const q = (s >> b) & 1, qn = (nx[s] >> b) & 1; let v;
        if (ff === "D") v = qn; else if (ff === "T") v = q ^ qn;
        else if (nm === "J") v = q ? "X" : qn; else v = q ? 1 - qn : "X";
        if (v === "X") dcs.push(s); else if (v) ones.push(s);
      });
      inputs.push({ name: nm + b, bit: b, kind: nm, ones, dcs, terms: qm(n, ones, dcs) });
    });
  }
  Object.assign(PD, { n, seq: raw, inputs, ff, nx, state: raw[0] });
  const cell = (inp, s) => s in nx ? (inp.ones.includes(s) ? 1 : inp.dcs.includes(s) ? "X" : 0) : "X";
  $("#pd-table").innerHTML = `<table><tr><th>Atual</th><th>Próximo</th>${inputs.map(i => `<th>${i.name}</th>`).join("")}</tr>` +
    states.map(s => `<tr class="${s in nx ? "" : ""}" style="${s in nx ? "" : "opacity:.55"}"><td class="mono">${bin(s, n)}</td><td class="mono">${s in nx ? bin(nx[s], n) : "—"}</td>${inputs.map(i => `<td class="mono">${cell(i, s)}</td>`).join("")}</tr>`).join("") + `</table><p class="hint">Linhas apagadas: estados fora da sequência (don't care).</p>`;
  $("#pd-eqs").innerHTML = `<h3>Equações simplificadas</h3>` + inputs.map(i => `<div class="formula">${i.name} = ${sopHTML(i.terms, n)}</div>`).join("") + `<p class="hint">Simplificação por Quine–McCluskey, usando os X a favor. Resultado equivalente ao mapa de Karnaugh.</p>`;
  pdRunText();
}
function pdStep() {
  const { n, inputs, ff } = PD, s = PD.state; let nxt = 0;
  for (let b = 0; b < n; b++) {
    const q = (s >> b) & 1, get = k => { const i = inputs.find(x => x.bit === b && x.kind === k); return sopEval(i.terms, s); };
    let v;
    if (ff === "D") v = get("D"); else if (ff === "T") v = q ^ get("T");
    else { const j = get("J"), k = get("K"); v = j && k ? 1 - q : j ? 1 : k ? 0 : q; }
    nxt |= v << b;
  }
  PD.state = nxt; pdRunText(s);
}
function pdRunText(prev) {
  const ok = prev == null || PD.nx[prev] === PD.state;
  $("#pd-run").innerHTML = `Estado atual: <b>${bin(PD.state, PD.n)} (${PD.state})</b>${prev != null ? ` · veio de ${prev} ${ok ? '<span style="color:var(--ok)">✓ segue a sequência</span>' : '<span style="color:var(--bad)">fora da sequência</span>'}` : ""}`;
}
$("#pd-go").addEventListener("click", pdDesign); $("#pd-ff").addEventListener("change", pdDesign); $("#pd-step").addEventListener("click", () => pdStep());
pdDesign();

// ===================================================== REGISTRADORES
const RG = { q: [0, 0, 0, 0], din: 1, par: [1, 0, 1, 1], hist: [], marks: [], log: [], pulses: 0, msg: "" };
function rgRec(clk, mark) { RG.hist.push({ clk, din: RG.din, q: [...RG.q] }); if (mark) RG.marks.push(RG.hist.length - 1); if (RG.hist.length > 200) { RG.hist.shift(); RG.marks = RG.marks.map(m => m - 1).filter(m => m >= 0); } }
function rgRender() {
  let s = `<svg viewBox="0 0 700 170" width="700" role="img" aria-label="Registrador de deslocamento">`;
  s += T(14, 72, "Din", "start", 13) + T(14, 90, RG.din, "start", 13, "fill:var(--hi)") + `<line x1="44" y1="72" x2="80" y2="72" class="${RG.din ? "w1" : "w0"}" stroke-width="3"/>`;
  for (let i = 0; i < 4; i++) {
    const x = 80 + i * 140;
    s += ffBox(x, 42, `FF${i} (D)`, RG.q[i]);
    s += T(x + 37, 132, `Q${i}`, "middle", 12) + T(x + 37, 152, `P${i}=${RG.par[i]}`, "middle", 11, "fill:var(--muted)");
    if (i < 3) s += `<polyline points="${x + 74},64 ${x + 140},64" fill="none" class="${RG.q[i] ? "w1" : "w0"}" stroke-width="3"/>`;
  }
  s += `<line x1="634" y1="64" x2="690" y2="64" class="${RG.q[3] ? "w1" : "w0"}" stroke-width="3"/>` + T(690, 84, "saída série", "end", 11, "fill:var(--muted)");
  $("#rg-chain").innerHTML = s + "</svg>";
  $("#rg-status").innerHTML = RG.msg || "Escolha Din e dê pulsos de clock.";
  $("#rg-scope").innerHTML = scopeSVG([{ name: "CLK", vals: RG.hist.map(r => r.clk), cls: "clk" }, { name: "Din", vals: RG.hist.map(r => r.din), cls: "in" }, ...[0, 1, 2, 3].map(i => ({ name: "Q" + i, vals: RG.hist.map(r => r.q[i]), cls: i % 2 ? "qn" : "q" }))], { id: "rg", marks: RG.marks });
  $("#rg-log").innerHTML = RG.log.length ? `<table><tr><th>Evento</th><th>Din</th><th>Q0</th><th>Q1</th><th>Q2</th><th>Q3</th><th>Saída série</th><th class="l">Q3Q2Q1Q0</th></tr>${RG.log.slice(-8).map(r => `<tr><td class="l">${r.ev}</td><td>${r.din}</td>${r.q.map(b => `<td>${b}</td>`).join("")}<td>${r.q[3]}</td><td class="mono l">${[...r.q].reverse().join("")}</td></tr>`).join("")}</table>` : "";
}
function rgLog(ev) { RG.log.push({ ev, din: RG.din, q: [...RG.q] }); }
$("#rg-pulse").addEventListener("click", () => {
  const out = RG.q[3]; rgRec(1); RG.q = [RG.din, RG.q[0], RG.q[1], RG.q[2]]; rgRec(0, true); RG.pulses++;
  RG.msg = `Borda ↓: Din (${RG.din}) entrou em Q0 e cada bit andou uma casa. Saiu pela série: ${out}. Pulsos desde o último CLR: ${RG.pulses}${RG.pulses >= 4 ? " (os 4 bits já são novos)" : ""}.`;
  rgLog(`${RG.pulses}º pulso`); rgRender();
});
$("#rg-clr").addEventListener("click", () => { RG.q = [0, 0, 0, 0]; RG.pulses = 0; RG.msg = "CLR̅ = 0: registrador zerado."; rgRec(0); rgLog("CLR"); rgRender(); });
$("#rg-load").addEventListener("click", () => {
  const wasZero = RG.q.every(b => !b);
  RG.q = RG.q.map((b, i) => b | RG.par[i]); RG.pulses = 0; rgRec(0); rgLog("Enable (carga)");
  RG.msg = wasZero ? `Enable = 1: onde Pᵢ = 1, PRE̅ = NAND(1, Pᵢ) = 0 e o FF vai a 1. Agora Q = P = ${[...RG.par].reverse().join("")}. Dê 4 pulsos para mandar os bits pela saída série.`
    : `Atenção: o registrador não estava zerado. O PRE só consegue colocar 1, então os 1s antigos continuam. Por isso o procedimento da aula começa com CLR.`;
  rgRender();
});
(function () { const d = $("#rg-din"); d.appendChild(bitButton("Din", RG.din, v => { RG.din = v; rgRec(0); rgRender(); }));
  const p = $("#rg-par"); [3, 2, 1, 0].forEach(i => p.appendChild(bitButton("P" + i, RG.par[i], v => { RG.par[i] = v; rgRender(); })));
  rgRec(0); rgRender(); })();

// ===================================================== MEMÓRIAS
const ROM = ["10101110", "10111010", "10111011", "10101011", "10110011", "10111111", "10101011", "10111010", "10111010", "10100010", "10111100", "10111001", "10101000", "10111001", "10110000", "10101101"];
const RM = { a: [1, 1, 1, 0], cs: 0 }; // a[0]=A0 ... (endereço 0111)
function romRender() {
  const adr = RM.a.reduce((s, b, i) => s + (b << i), 0), lin = adr & 3, col = adr >> 2, en = RM.cs === 0;
  const ox = 170, oy = 70, cw = 96, ch = 50;
  let s = `<svg viewBox="0 0 620 ${oy + 4 * ch + 70}" width="620" role="img" aria-label="Matriz da ROM">`;
  s += `<rect x="${ox}" y="8" width="${4 * cw}" height="30" rx="5" style="fill:var(--hi-soft);stroke:var(--hi)"/>` + T(ox + 2 * cw, 23, `Decodificador de COLUNA ← A3A2 = ${RM.a[3]}${RM.a[2]}`, "middle", 12, "fill:var(--hi)");
  s += `<rect x="16" y="${oy}" width="118" height="${4 * ch}" rx="5" style="fill:var(--clk-soft);stroke:var(--clk)"/>` + T(75, oy + 2 * ch - 10, "Decod. LINHA", "middle", 12, "fill:var(--clk)") + T(75, oy + 2 * ch + 10, `← A1A0 = ${RM.a[1]}${RM.a[0]}`, "middle", 12, "fill:var(--clk)");
  for (let c = 0; c < 4; c++) { const x = ox + c * cw + cw / 2, hl = en && c === col; s += `<line x1="${x}" y1="38" x2="${x}" y2="${oy + 4 * ch}" style="stroke:${hl ? "var(--hi)" : "var(--line)"}" stroke-width="${hl ? 3 : 1.5}"/>` + T(x, 54, `C${c} (${bin(c, 2)})`, "middle", 11, "fill:var(--hi)"); }
  for (let r = 0; r < 4; r++) {
    const y = oy + r * ch + ch / 2, hl = en && r === lin;
    s += `<line x1="134" y1="${y}" x2="${ox + 4 * cw}" y2="${y}" style="stroke:${hl ? "var(--clk)" : "var(--line)"}" stroke-width="${hl ? 3 : 1.5}"/>` + T(152, y, `L${r}`, "middle", 11, "fill:var(--clk)");
    for (let c = 0; c < 4; c++) { const k = 4 * c + r, sel = en && k === adr, x = ox + c * cw + 18; s += `<rect x="${x}" y="${y - 15}" width="60" height="30" rx="4" style="fill:${sel ? "var(--hi)" : "var(--panel)"};stroke:${sel ? "var(--hi)" : "var(--muted)"}" stroke-width="${sel ? 2 : 1}"/>` + T(x + 30, y + 1, `Reg_${k}`, "middle", 11, sel ? "fill:var(--panel)" : "fill:var(--ink)"); }
  }
  s += T(310, oy + 4 * ch + 26, en ? `D7…D0 = ${ROM[adr]}` : "CS̄ = 1: chip desabilitado, nada na via de dados", "middle", 15, en ? "fill:var(--hi)" : "fill:var(--muted)");
  s += T(310, oy + 4 * ch + 50, en ? `Reg = 4 × coluna + linha = 4 × ${col} + ${lin} = ${adr}` : "", "middle", 12, "fill:var(--muted)");
  $("#rom-svg").innerHTML = s + "</svg>";
  $("#rom-status").innerHTML = en ? `Endereço <b>${bin(adr, 4)}</b> (posição ${adr}): coluna C${col} e linha L${lin}. Só o Reg_${adr} conecta sua palavra à saída.` : "Ative o chip com CS̄ = 0 para ler.";
}
(function () { const b = $("#rom-addr"); [3, 2, 1, 0].forEach(i => b.appendChild(bitButton("A" + i, RM.a[i], v => { RM.a[i] = v; romRender(); }))); b.appendChild(bitButton("CS̄", RM.cs, v => { RM.cs = v; romRender(); })); romRender(); })();

const RAM = { m: ["10101100", "00110100", "10001111", "11010111", "00001000", "10010001", "11001111", "00010111"], a: [1, 1, 0], d: [1, 0, 1, 1, 0, 0, 0, 1], last: null, op: "" };
function ramRender() {
  const adr = RAM.a.reduce((s, b, i) => s + (b << i), 0);
  $("#ram-table").innerHTML = `<table><tr><th>Endereço</th><th>Conteúdo</th></tr>${RAM.m.map((w, i) => `<tr class="${i === adr ? "cur" : ""}"><td class="mono">${bin(i, 3)} (${i})</td><td class="mono" style="${RAM.last === i ? "color:var(--hi);font-weight:600" : ""}">${w}</td></tr>`).join("")}</table>`;
}
(function () {
  const a = $("#ram-addr"); [2, 1, 0].forEach(i => a.appendChild(bitButton("A" + i, RAM.a[i], v => { RAM.a[i] = v; ramRender(); })));
  const d = $("#ram-data"); [7, 6, 5, 4, 3, 2, 1, 0].forEach(i => { const bb = bitButton("D" + i, RAM.d[7 - i], v => { RAM.d[7 - i] = v; }); bb.style.minWidth = "44px"; d.appendChild(bb); });
  $("#ram-read").onclick = () => { const adr = RAM.a.reduce((s, b, i) => s + (b << i), 0); RAM.last = adr; $("#ram-status").className = "status ok"; $("#ram-status").innerHTML = `1. ${bin(adr, 3)} na via de endereços · 2. comando <b>read</b> · 3. cópia de <b class="mono">${RAM.m[adr]}</b> na via de dados. O conteúdo não muda.`; ramRender(); };
  $("#ram-write").onclick = () => { const adr = RAM.a.reduce((s, b, i) => s + (b << i), 0), w = RAM.d.join(""), old = RAM.m[adr]; RAM.m[adr] = w; RAM.last = adr; $("#ram-status").className = "status hl"; $("#ram-status").innerHTML = `1. ${bin(adr, 3)} na via de endereços · 2. <span class="mono">${w}</span> na via de dados · 3. comando <b>write</b>. O valor antigo (${old}) foi sobrescrito.`; ramRender(); };
  $("#ram-status").textContent = "Escolha um endereço e leia, ou monte um dado e escreva."; ramRender();
})();
function capCalc() {
  const p = (+$("#cap-p").value || 0) * +$("#cap-u").value, w = +$("#cap-w").value || 0, bits = p * w;
  const lg = Math.log2(p), lines = Math.ceil(lg - 1e-9);
  const fmt = v => v.toLocaleString("pt-BR");
  $("#cap-out").innerHTML = p && w ? `${fmt(p)} posições × ${w} bits = <b>${fmt(bits)} bits</b> = ${fmt(bits / 8)} bytes · endereço: <b>${lines} linha${lines === 1 ? "" : "s"}</b> (2^${lines} = ${fmt(2 ** lines)}${Number.isInteger(lg) ? "" : ", acima do necessário porque " + fmt(p) + " não é potência de 2"}).` : "Preencha posições e bits.";
}
["#cap-p", "#cap-u", "#cap-w"].forEach(id => $(id).addEventListener("input", capCalc)); capCalc();

// ===================================================== diagramas de estado
function stateSVG(m, cur, lastEdge, Wd, Hd) {
  const r = 26; let s = `<svg viewBox="0 0 ${Wd} ${Hd}" width="${Wd}" role="img" aria-label="Diagrama de estados"><defs><marker id="ar${m.id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink)"/></marker><marker id="arh${m.id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--hi)"/></marker></defs>`;
  m.edges.forEach(e => {
    const [a, b, lab, bend] = e, A = m.pos[a], B = m.pos[b];
    const hl = lastEdge && lastEdge[0] === a && lastEdge[1] === b && lastEdge[2] === e[4];
    const st = `style="stroke:${hl ? "var(--hi)" : "var(--ink)"}" stroke-width="${hl ? 3 : 1.6}" fill="none" marker-end="url(#${hl ? "arh" : "ar"}${m.id})"`;
    let lx, ly;
    if (a === b) {
      const ang = bend * Math.PI / 180, ux = Math.cos(ang), uy = Math.sin(ang), px = -uy, py = ux;
      const pt = t => [A[0] + r * (ux * Math.cos(t) + px * Math.sin(t)), A[1] + r * (uy * Math.cos(t) + py * Math.sin(t))];
      const [sx, sy] = pt(0.45), [ex, ey] = pt(-0.45);
      const c1 = [A[0] + (r + 34) * ux + 22 * px, A[1] + (r + 34) * uy + 22 * py], c2 = [A[0] + (r + 34) * ux - 22 * px, A[1] + (r + 34) * uy - 22 * py];
      s += `<path d="M${sx},${sy} C${c1} ${c2} ${ex},${ey}" ${st}/>`; lx = A[0] + (r + 44) * ux; ly = A[1] + (r + 44) * uy;
    } else {
      const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, px = -uy, py = ux;
      const mx = (A[0] + B[0]) / 2 + px * bend, my = (A[1] + B[1]) / 2 + py * bend;
      const ep = (c, t) => { const ddx = t[0] - c[0], ddy = t[1] - c[1], l = Math.hypot(ddx, ddy); return [c[0] + ddx / l * r, c[1] + ddy / l * r]; };
      const [sx, sy] = ep(A, [mx, my]), [ex, ey] = ep(B, [mx, my]);
      const cx = 2 * mx - (sx + ex) / 2, cy = 2 * my - (sy + ey) / 2;
      s += `<path d="M${sx},${sy} Q${cx},${cy} ${ex},${ey}" ${st}/>`;
      const off = bend ? (bend > 0 ? 16 : -16) : -14; lx = mx + px * off; ly = my + py * off;
    }
    s += `<rect x="${lx - 19}" y="${ly - 10}" width="38" height="20" rx="4" style="fill:var(--panel)" opacity=".92"/>` + T(lx, ly + 1, lab, "middle", 13, hl ? "fill:var(--hi)" : "fill:var(--ink)");
  });
  Object.entries(m.pos).forEach(([k, p]) => {
    const on = k === cur;
    s += `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" style="fill:${on ? "var(--hi)" : "var(--panel)"};stroke:${on ? "var(--hi)" : "var(--clk)"}" stroke-width="2.4"/>`;
    const sub = m.moore ? m.out[k] : null;
    s += T(p[0], p[1] - (sub != null ? 6 : 0), k, "middle", 14, on ? "fill:var(--panel)" : "fill:var(--clk)");
    if (sub != null) s += T(p[0], p[1] + 10, "Z=" + sub, "middle", 11, on ? "fill:var(--panel)" : "fill:var(--muted)");
  });
  return s + "</svg>";
}
const MEALY = { id: "me", moore: false, pos: { S0: [60, 110], S1: [210, 110], S2: [360, 110] },
  t: { S0: { 0: ["S0", 0], 1: ["S1", 0] }, S1: { 0: ["S2", 0], 1: ["S1", 0] }, S2: { 0: ["S0", 0], 1: ["S1", 1] } },
  edges: [["S0", "S0", "0/0", -90, 0], ["S0", "S1", "1/0", -20, 1], ["S1", "S1", "1/0", -90, 1], ["S1", "S2", "0/0", -20, 0], ["S2", "S1", "1/1", -24, 1], ["S2", "S0", "0/0", -70, 0]] };
const MOORE = { id: "mo", moore: true, out: { S0: 0, S1: 0, S2: 0, S3: 1 }, pos: { S0: [50, 120], S1: [170, 120], S2: [290, 120], S3: [410, 120] },
  t: { S0: { 0: "S0", 1: "S1" }, S1: { 0: "S2", 1: "S1" }, S2: { 0: "S0", 1: "S3" }, S3: { 0: "S2", 1: "S1" } },
  edges: [["S0", "S0", "0", -90, 0], ["S0", "S1", "1", -16, 1], ["S1", "S1", "1", -90, 1], ["S1", "S2", "0", -16, 0], ["S2", "S3", "1", -16, 1], ["S2", "S0", "0", -60, 0], ["S3", "S1", "1", 70, 1], ["S3", "S2", "0", -22, 0]] };
const MM = { x: 0, me: "S0", mo: "S0", eMe: null, eMo: null, hist: [], marks: [], labels: [], playing: false, xbtn: null };
const zMe = () => MEALY.t[MM.me][MM.x][1], zMo = () => MOORE.out[MM.mo];
function mmRec(clk, mark, lab) { MM.hist.push({ clk, x: MM.x, zme: zMe(), zmo: zMo() }); if (mark) MM.marks.push(MM.hist.length - 1); if (lab) MM.labels.push([MM.hist.length - 1, lab]); if (MM.hist.length > 200) { MM.hist.shift(); MM.marks = MM.marks.map(m => m - 1).filter(m => m >= 0); MM.labels = MM.labels.map(([k, l]) => [k - 1, l]).filter(([k]) => k >= 0); } }
function mmRender(msg) {
  $("#mm-mealy").innerHTML = stateSVG(MEALY, MM.me, MM.eMe, 420, 220);
  $("#mm-moore").innerHTML = stateSVG(MOORE, MM.mo, MM.eMo, 470, 250);
  $("#mm-status").innerHTML = (msg ? msg + "<br>" : "") + `X = <b>${MM.x}</b> · Mealy em ${MM.me}: Z = <b style="color:var(--hi)">${zMe()}</b> · Moore em ${MM.mo}: Z = <b style="color:var(--ok)">${zMo()}</b>`;
  $("#mm-scope").innerHTML = scopeSVG([{ name: "CLK", vals: MM.hist.map(r => r.clk), cls: "clk" }, { name: "X", vals: MM.hist.map(r => r.x), cls: "in" }, { name: "Z Mealy", vals: MM.hist.map(r => r.zme), cls: "q" }, { name: "Z Moore", vals: MM.hist.map(r => r.zmo), cls: "v" }], { id: "mm", marks: MM.marks, labels: MM.labels, maxCols: 44 });
}
function mmClock() {
  const x = MM.x, a = MM.me, b = MM.mo;
  mmRec(1, true, String(x));
  MM.eMe = [a, MEALY.t[a][x][0], x]; MM.eMo = [b, MOORE.t[b][x], x];
  MM.me = MEALY.t[a][x][0]; MM.mo = MOORE.t[b][x];
  mmRec(0);
  mmRender(`Borda com X = ${x}: Mealy ${a} → ${MM.me}, Moore ${b} → ${MM.mo}.${MM.mo === "S3" ? " Moore chegou em S3: agora Z = 1 por um ciclo inteiro." : ""}`);
}
function mmSetX(v) { MM.x = v; MM.xbtn.set(v); mmRec(0); mmRender(v && MM.me === "S2" ? "X = 1 estando em S2: a saída de Mealy já subiu, antes mesmo da borda." : ""); }
function mmReset() { Object.assign(MM, { me: "S0", mo: "S0", eMe: null, eMo: null, hist: [], marks: [], labels: [] }); mmRec(0); mmRender(); }
(function () {
  MM.xbtn = bitButton("X", 0, v => mmSetX(v)); $("#mm-x").appendChild(MM.xbtn);
  $("#mm-clk").onclick = mmClock; $("#mm-reset").onclick = mmReset;
  $("#mm-play").onclick = () => {
    if (MM.playing) return; const bits = $("#mm-seq").value.replace(/[^01]/g, "").split("").map(Number); if (!bits.length) return;
    MM.playing = true; let i = 0;
    const tick = () => { if (i >= bits.length) { MM.playing = false; return; } mmSetX(bits[i]); setTimeout(() => { mmClock(); i++; setTimeout(tick, 380); }, 380); };
    tick();
  };
  mmReset();
})();

// ===================================================== minimização por partição
const PM_PRESETS = {
  slide: { A: ["B", 0, "C", 0], B: ["D", 0, "E", 0], C: ["G", 0, "E", 0], D: ["H", 0, "F", 0], E: ["G", 0, "A", 0], F: ["G", 1, "A", 0], G: ["D", 0, "C", 0], H: ["H", 0, "A", 0] },
  insp: { A: ["B", 0, "C", 1], B: ["C", 0, "A", 1], C: ["D", 1, "B", 0], D: ["C", 0, "A", 1], E: ["D", 0, "C", 1] },
  ex: { A: ["B", 0, "C", 0], B: ["A", 0, "D", 1], C: ["D", 0, "A", 0], D: ["C", 0, "B", 1] } };
const PM = { tab: null, steps: [], k: 0 };
const GCOL = ["var(--clk)", "var(--hi)", "var(--ok)", "var(--violet)", "var(--bad)", "var(--muted)", "var(--ink)", "var(--clk)"];
function pmCompute() {
  const tab = PM_PRESETS[$("#pm-preset").value], S = Object.keys(tab);
  const steps = []; let g = {};
  const sig0 = s => tab[s][1] + "," + tab[s][3]; const m0 = {}; S.forEach(s => { const k = sig0(s); if (!(k in m0)) m0[k] = Object.keys(m0).length; g[s] = m0[k]; });
  steps.push({ g: { ...g }, why: "P1: agrupa estados com a mesma saída para X = 0 e X = 1." });
  for (let it = 0; it < 10; it++) {
    const ng = {}, map = {}; S.forEach(s => { const k = g[s] + "|" + g[tab[s][0]] + "," + g[tab[s][2]]; if (!(k in map)) map[k] = Object.keys(map).length; ng[s] = map[k]; });
    const changed = new Set(Object.values(ng)).size !== new Set(Object.values(g)).size;
    if (!changed) { steps.push({ g: { ...g }, why: "Nenhum grupo se dividiu: partição final.", final: true }); break; }
    const parts = [...new Set(Object.values(g))].map(gi => { const old = S.filter(s => g[s] === gi), subs = [...new Set(old.map(s => ng[s]))].map(n => S.filter(s => g[s] === gi && ng[s] === n)); return subs.length > 1 ? `{${old.join(", ")}} se divide em ${subs.map(x => "{" + x.join(", ") + "}").join(" e ")}` : null; }).filter(Boolean);
    steps.push({ g: { ...ng }, why: `P${steps.length + 1}: olhando em que grupo cai cada próximo estado, ${parts.join("; ")}.` });
    g = ng;
  }
  PM.tab = tab; PM.steps = steps; PM.k = 0; pmRender();
}
function pmRender() {
  const tab = PM.tab, st = PM.steps[PM.k], g = st.g, S = Object.keys(tab);
  const chip = s => `<span class="chip" style="border-color:${GCOL[g[s] % GCOL.length]};color:${GCOL[g[s] % GCOL.length]}">${s}<sub>${g[s] + 1}</sub></span>`;
  $("#pm-table").innerHTML = `<table><tr><th>EP</th><th>Grupo</th><th>X = 0</th><th>X = 1</th></tr>${S.map(s => `<tr><td><b>${s}</b></td><td>${chip(s)}</td><td>${tab[s][0]}/${tab[s][1]} → ${chip(tab[s][0])}</td><td>${tab[s][2]}/${tab[s][3]} → ${chip(tab[s][2])}</td></tr>`).join("")}</table>`;
  const groups = {}; S.forEach(s => (groups[g[s]] = groups[g[s]] || []).push(s));
  let html = PM.steps.slice(0, PM.k + 1).map((x, i) => `<div class="status ${i === PM.k ? "hl" : ""}">${x.why}</div>`).join("");
  html += `<div class="chips">${Object.values(groups).map(arr => `<span class="chip">{${arr.join(", ")}}</span>`).join("")}</div>`;
  if (st.final) {
    const rep = {}; Object.values(groups).forEach(arr => arr.forEach(s => rep[s] = arr[0]));
    const red = Object.values(groups).map(a => a[0]);
    html += `<div class="status ok"><b>${S.length} → ${red.length} estados.</b> ${Object.values(groups).filter(a => a.length > 1).map(a => a.join(" ≡ ")).join("; ") || "Nenhum estado equivalente."}</div>`;
    html += `<div class="tscroll"><table><tr><th>EP</th><th>X = 0</th><th>X = 1</th></tr>${red.map(s => `<tr><td><b>${s}</b></td><td>${rep[tab[s][0]]}/${tab[s][1]}</td><td>${rep[tab[s][2]]}/${tab[s][3]}</td></tr>`).join("")}</table></div>`;
  }
  $("#pm-steps").innerHTML = html;
  $("#pm-next").disabled = PM.k >= PM.steps.length - 1;
}
$("#pm-preset").onchange = pmCompute; $("#pm-next").onclick = () => { if (PM.k < PM.steps.length - 1) { PM.k++; pmRender(); } }; $("#pm-restart").onclick = () => { PM.k = 0; pmRender(); };
pmCompute();

// ===================================================== TREINO: formas de onda
const WV = { rows: [], ans: [], user: [], marks: [], wrong: [], qi: 0 };
function genSegs(n, minLen = 2, maxLen = 4, avoid) { const v = []; let cur = rnd(2); while (v.length < n) { const L = minLen + rnd(maxLen - minLen + 1); for (let i = 0; i < L && v.length < n; i++) v.push(cur); cur = 1 - cur; } return v; }
function wvNew() {
  const kind = $("#wv-kind").value; let rows = [], ans = [], marks = [];
  if (kind === "nor" || kind === "nand") {
    const N = 22; let S = Array(N).fill(0), R = Array(N).fill(0);
    let i = 1; while (i < N - 1) { const L = 1 + rnd(3); const c = Math.random() < 0.2 ? 0 : 1 + rnd(2); for (let k = 0; k < L && i < N; k++, i++) { S[i] = c === 1 ? 1 : 0; R[i] = c === 2 ? 1 : 0; } i += 1 + rnd(3); }
    let q = 0; ans = S.map((s, k) => { if (s) q = 1; else if (R[k]) q = 0; return q; });
    if (kind === "nor") rows = [{ name: "S", vals: S }, { name: "R", vals: R }];
    else rows = [{ name: "S", over: true, vals: S.map(v => 1 - v) }, { name: "R", over: true, vals: R.map(v => 1 - v) }];
  } else {
    const P = 7, fall = kind === "jkf" || kind === "t";
    const clk = []; for (let p = 0; p < P; p++) clk.push(...(fall ? [1, 1, 0, 0] : [0, 0, 1, 1]));
    const N = clk.length, per = k => Math.floor(k / 4);
    const pv = () => [...Array(P)].map(() => [rnd(2), rnd(2)]);
    const vals = pv();
    let ins = {};
    if (kind === "jk" || kind === "jkf") { ins.J = clk.map((_, k) => vals[per(k)][0]); ins.K = clk.map((_, k) => vals[per(k)][1]); }
    if (kind === "t") ins.T = clk.map((_, k) => vals[per(k)][0]);
    if (kind === "d") { ins.D = genSegs(N, 1, 4); }
    let clr = Array(N).fill(1);
    if (kind === "jkf") { const s = 9 + rnd(12); clr[s] = 0; clr[s + 1] = 0; }
    let q = 0;
    for (let k = 0; k < N; k++) {
      const edge = k > 0 && (fall ? clk[k - 1] === 1 && clk[k] === 0 : clk[k - 1] === 0 && clk[k] === 1);
      if (edge) marks.push(k);
      if (!clr[k]) q = 0;
      else if (edge) { const i = k - 1; if (ins.D) q = ins.D[i]; else if (ins.T) q = ins.T[i] ? 1 - q : q; else { const j = ins.J[i], kk = ins.K[i]; q = j && kk ? 1 - q : j ? 1 : kk ? 0 : q; } }
      ans.push(q);
    }
    rows = [{ name: "CLK", vals: clk, cls: "clk" }, ...Object.entries(ins).map(([k, v]) => ({ name: k, vals: v }))];
    if (kind === "jkf") rows.push({ name: "CLR", over: true, vals: clr, cls: "m" });
  }
  Object.assign(WV, { rows, ans, marks, user: Array(ans.length).fill(0), wrong: [] });
  $("#wv-status").className = "status"; $("#wv-status").textContent = "Desenhe Q e clique em Corrigir.";
  wvRender();
}
function wvRender(showAns) {
  const rows = [...WV.rows.map(r => ({ cls: "in", ...r })), { name: "Q", vals: showAns ? WV.ans : WV.user, cls: "q" }];
  $("#wv-scope").innerHTML = scopeSVG(rows, { id: "wv", marks: WV.marks, maxCols: 40, minCols: WV.ans.length, clickRow: rows.length - 1, wrong: WV.wrong, labels: WV.marks.map(k => [k, "↕"]) });
  $$("#wv-scope .slot").forEach(el => { const go = () => { const k = +el.dataset.k; for (let j = k; j < WV.user.length; j++) WV.user[j] ^= 1; WV.wrong = []; wvRender(); }; el.addEventListener("click", go); el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }); });
}
$("#wv-new").onclick = wvNew; $("#wv-kind").onchange = wvNew;
$("#wv-zero").onclick = () => { WV.user = WV.user.map(() => 0); WV.wrong = []; wvRender(); };
$("#wv-show").onclick = () => { WV.wrong = []; wvRender(true); $("#wv-status").className = "status hl"; $("#wv-status").textContent = "Esta é a resposta. Clique em Novo para tentar outro."; };
$("#wv-check").onclick = () => {
  WV.wrong = WV.user.map((v, k) => v !== WV.ans[k] ? k : -1).filter(k => k >= 0);
  const st = $("#wv-status");
  if (!WV.wrong.length) { st.className = "status ok"; st.innerHTML = "<b>Tudo certo!</b> Clique em Novo para outro exercício."; }
  else { st.className = "status bad"; st.innerHTML = `${WV.wrong.length} intervalo(s) errado(s), marcados em vermelho. Dica: ${$("#wv-kind").value.startsWith("n") ? "nos latches, Q obedece S/R na hora e mantém quando os dois estão inativos." : "nos flip-flops, Q só muda nas linhas tracejadas (bordas ativas), usando as entradas logo antes da borda. CLR̅ = 0 zera na hora."}`; }
  wvRender();
};
wvNew();

// ===================================================== TREINO: NAND e capacidade
const MN = { n: 4, N: 10, sel: [] };
function mnNew() {
  MN.n = 3 + rnd(2); do { MN.N = 3 + rnd(2 ** MN.n - 3); } while ((MN.N & (MN.N - 1)) === 0);
  MN.sel = Array(MN.n).fill(0);
  $("#mn-q").innerHTML = `Contador assíncrono com ${MN.n} FFs (CLR̅ ativo em 0) que deve contar de <b>0 a ${MN.N - 1}</b>. Quais saídas entram na NAND?`;
  const b = $("#mn-bits"); b.innerHTML = ""; for (let i = MN.n - 1; i >= 0; i--) b.appendChild(bitButton("Q" + i, 0, v => { MN.sel[i] = v; }));
  $("#mn-status").className = "status"; $("#mn-status").textContent = "Marque os Q que entram na NAND.";
}
$("#mn-new").onclick = mnNew;
$("#mn-check").onclick = () => {
  const ok = MN.sel.every((v, i) => v === ((MN.N >> i) & 1)), bits = [...Array(MN.n).keys()].filter(i => (MN.N >> i) & 1).reverse().map(i => "Q" + i);
  $("#mn-status").className = "status " + (ok ? "ok" : "bad");
  $("#mn-status").innerHTML = `${ok ? "<b>Correto.</b>" : "<b>Ainda não.</b>"} O estado proibido é ${MN.N} = ${bin(MN.N, MN.n)}₂, então a NAND recebe ${bits.join(", ")}.`;
};
mnNew();
const CQ = { p: 0, w: 0, lab: "" };
function cqNew() {
  const opts = [[256, "256"], [512, "512"], [1024, "1K"], [2048, "2K"], [4096, "4K"], [8192, "8K"], [16384, "16K"], [65536, "64K"], [1048576, "1M"]];
  const [p, lab] = opts[rnd(opts.length)], w = [4, 8, 16, 32][rnd(4)]; Object.assign(CQ, { p, w, lab });
  $("#cq-q").innerHTML = `Uma memória <b>${lab} × ${w}</b>. Quantos bits ela armazena e quantas linhas de endereço tem?`;
  $("#cq-bits").value = ""; $("#cq-lines").value = ""; $("#cq-status").className = "status"; $("#cq-status").textContent = "Responda e confira.";
}
$("#cq-new").onclick = cqNew;
$("#cq-check").onclick = () => {
  const bits = CQ.p * CQ.w, lines = Math.log2(CQ.p), okb = +$("#cq-bits").value === bits, okl = +$("#cq-lines").value === lines;
  $("#cq-status").className = "status " + (okb && okl ? "ok" : "bad");
  $("#cq-status").innerHTML = `${okb && okl ? "<b>Correto.</b>" : "<b>Confira:</b>"} ${CQ.lab} = ${CQ.p.toLocaleString("pt-BR")} posições → ${CQ.p.toLocaleString("pt-BR")} × ${CQ.w} = <b>${bits.toLocaleString("pt-BR")} bits</b>; ${CQ.p.toLocaleString("pt-BR")} = 2^${lines} → <b>${lines} linhas</b>.`;
};
cqNew();

