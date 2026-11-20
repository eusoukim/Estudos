/* Estudos · motor comum
   Fornece: utilitários para laboratórios (bits, LEDs, osciloscópio, portas), tela dividida,
   navegação por capítulo, progresso salvo, quiz, flashcards, revisão de erros, simulado e catálogo. */

// ===================================================== utilitários (globais, usados pelos labs)
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const h = (tag, attrs = {}, html = "") => { const e = document.createElement(tag); for (const k in attrs) { if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); } if (html) e.innerHTML = html; return e; };
const ov = s => `<tspan style="text-decoration:overline">${s}</tspan>`;
const ovh = s => `<span class="ov">${s}</span>`;
const store = {
  get(k, d) { try { const v = localStorage.getItem("estudos:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("estudos:" + k, JSON.stringify(v)); } catch (e) { } }
};
const rnd = n => Math.floor(Math.random() * n);
const bin = (v, n) => v.toString(2).padStart(n, "0");
function shuffle(a) { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function hashStr(s) { let x = 5381; for (const c of s) x = ((x << 5) + x + c.charCodeAt(0)) | 0; return (x >>> 0).toString(36); }

function bitButton(name, val, onChange, opts = {}) {
  const b = h("button", { class: "bit", type: "button", "aria-pressed": String(!!val) });
  if (opts.id) b.id = opts.id;
  const render = () => { b.innerHTML = `<span class="nm">${name}</span><span class="v">${b.dataset.v}</span>`; b.setAttribute("aria-pressed", b.dataset.v === "1"); };
  b.dataset.v = val ? "1" : "0"; render();
  b.addEventListener("click", () => { b.dataset.v = b.dataset.v === "1" ? "0" : "1"; render(); onChange(+b.dataset.v); });
  b.set = v => { b.dataset.v = v ? "1" : "0"; render(); };
  return b;
}
function led(name) {
  const d = h("div", { class: "led" }, `<i></i><span>${name}</span>`);
  d.set = v => { d.classList.toggle("on", v === 1); d.classList.toggle("x", v === "x"); };
  return d;
}

// osciloscópio: rows [{name, vals, cls, over}], vals por coluna: 0, 1, 'x', null
const COLOR = { clk: "var(--clk)", in: "var(--ink)", q: "var(--hi)", qn: "var(--violet)", v: "var(--ok)", bad: "var(--bad)", m: "var(--muted)" };
function scopeSVG(rows, opts = {}) {
  const maxCols = opts.maxCols || 36;
  const n0 = Math.max(...rows.map(r => r.vals.length), 0);
  const start = Math.max(0, n0 - maxCols);
  const N = Math.max(opts.minCols || 16, Math.min(maxCols, n0));
  const L = 84, Wd = 720, RH = opts.rowH || 34, top = 14;
  const cw = (Wd - L - 12) / N;
  const H = top + rows.length * RH + (opts.labels ? 22 : 8);
  let s = `<svg viewBox="0 0 ${Wd} ${H}" role="img" aria-label="Osciloscópio">`;
  s += `<defs><pattern id="hx${opts.id || ""}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" style="stroke:var(--bad)" stroke-width="2" opacity=".5"/></pattern></defs>`;
  (opts.marks || []).forEach(m => { const k = m - start; if (k < 0 || k > N) return; const x = L + k * cw; s += `<line x1="${x}" y1="${top - 6}" x2="${x}" y2="${top + rows.length * RH - 6}" style="stroke:var(--muted)" stroke-dasharray="3 4" opacity=".6"/>`; });
  rows.forEach((r, i) => {
    const y0 = top + i * RH + RH / 2, yh = y0 - RH * 0.3, yl = y0 + RH * 0.3;
    const col = COLOR[r.cls || "in"];
    s += `<text x="${L - 12}" y="${y0 + 4}" text-anchor="end" font-size="14" font-weight="600" style="fill:${col}">${r.over ? ov(r.name) : r.name}</text>`;
    s += `<line x1="${L}" y1="${yl + 5}" x2="${Wd - 12}" y2="${yl + 5}" style="stroke:var(--line)"/>`;
    let pts = [], prev = null, path = "";
    const flush = () => { if (pts.length) path += `<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" style="stroke:${col}" stroke-width="2.4" stroke-linejoin="round"/>`; pts = []; };
    for (let k = 0; k < N; k++) {
      const v = r.vals[start + k], xa = L + k * cw, xb = xa + cw;
      if (v === undefined || v === null) { flush(); prev = null; continue; }
      if (v === "x") { flush(); s += `<rect x="${xa}" y="${yh}" width="${cw}" height="${yl - yh}" fill="url(#hx${opts.id || ""})"/>`; prev = "x"; continue; }
      const y = v ? yh : yl;
      if (!pts.length) pts.push([xa, y]); else if (prev !== v) pts.push([xa, y]);
      pts.push([xb, y]); prev = v;
    }
    flush(); s += path;
    if (opts.wrong && r.cls === "q") opts.wrong.forEach(k => { const kk = k - start; if (kk >= 0) s += `<rect x="${L + kk * cw}" y="${yh - 3}" width="${cw}" height="${yl - yh + 6}" style="fill:var(--bad)" opacity=".22"/>`; });
    if (opts.clickRow === i) for (let k = 0; k < N; k++) s += `<rect class="slot" data-k="${start + k}" x="${L + k * cw}" y="${yh - 6}" width="${cw}" height="${yl - yh + 12}" fill="transparent" tabindex="0" aria-label="intervalo ${k + 1}"/>`;
  });
  if (opts.labels) opts.labels.forEach(([k, t]) => { const kk = k - start; if (kk < 0) return; s += `<text x="${L + kk * cw}" y="${H - 6}" text-anchor="middle" font-size="12" style="fill:var(--muted)">${t}</text>`; });
  if (!n0) s += `<text x="${(L + Wd) / 2}" y="${H / 2}" text-anchor="middle" font-size="14" style="fill:var(--muted)">Mexa nos controles: cada evento grava uma coluna aqui.</text>`;
  return s + "</svg>";
}
function gatePath(kind, x, y) {
  const bub = kind === "nand" || kind === "nor" || kind === "not";
  let d, tip;
  if (kind === "and" || kind === "nand") { d = `M${x},${y} H${x + 32} A20,20 0 0 1 ${x + 32},${y + 40} H${x} Z`; tip = x + 52; }
  else { d = `M${x},${y} Q${x + 14},${y + 20} ${x},${y + 40} Q${x + 38},${y + 40} ${x + 56},${y + 20} Q${x + 38},${y} ${x},${y} Z`; tip = x + 56; }
  let s = `<path d="${d}" class="gate"/>`;
  if (bub) s += `<circle cx="${tip + 4}" cy="${y + 20}" r="4" class="gate"/>`;
  return { s, out: [tip + (bub ? 8 : 0), y + 20], in: [[x + (kind.includes("or") ? 4 : 0), y + 11], [x + (kind.includes("or") ? 4 : 0), y + 29]] };
}
const W = (pts, v, id) => `<polyline ${id ? `id="${id}"` : ""} points="${pts.map(p => p.join(",")).join(" ")}" fill="none" class="${v ? "w1" : "w0"}" stroke-width="${v ? 3 : 2}" stroke-linejoin="round"/>`;
const T = (x, y, t, a = "middle", sz = 14, cls = "fill:var(--ink)") => `<text x="${x}" y="${y}" text-anchor="${a}" font-size="${sz}" font-weight="600" style="${cls}" dominant-baseline="middle">${t}</text>`;

// ===================================================== quiz
// questão: [cap, enunciado, [certa, erradas...], explicação]
const qid = q => hashStr(q[1]);
function renderQuiz(box, qs, onAnswer) {
  box.innerHTML = "";
  qs.forEach(qq => {
    const [, stem, opts, expl] = qq;
    const q = h("div", { class: "q" }); q.appendChild(h("div", { class: "stem" }, stem));
    const os = h("div", { class: "opts" }), ex = h("div", { class: "expl" }); ex.hidden = true;
    shuffle(opts.map((o, i) => [o, i === 0])).forEach(([o, right]) => {
      const b = h("button", { class: "opt", type: "button" }, o);
      if (right) b.dataset.r = 1;
      b.onclick = () => {
        if (q.dataset.done) return; q.dataset.done = 1;
        b.classList.add(right ? "right" : "wrong");
        if (!right) [...os.children].forEach(c => { if (c.dataset.r) c.classList.add("right"); });
        ex.hidden = false; ex.innerHTML = (right ? "<b>Certo.</b> " : "<b>Não.</b> ") + expl;
        onAnswer && onAnswer(qq, right);
      };
      os.appendChild(b);
    });
    q.append(os, ex); box.appendChild(q);
  });
}

// ===================================================== página da matéria
const Estudos = {};
Estudos.iniciarMateria = function (C) {
  const K = "m:" + C.id;
  const P = Object.assign({ lidos: {}, erros: [], acertos: 0, respostas: 0, ultimo: null }, store.get(K, {}));
  const save = () => store.set(K, P);
  const caps = C.capitulos, byId = Object.fromEntries(caps.map(c => [c.id, c]));
  const wide = () => matchMedia("(min-width: 901px)").matches;

  // registra resposta
  const registrar = (q, ok) => {
    const id = qid(q);
    P.respostas++; if (ok) P.acertos++;
    P.erros = P.erros.filter(e => e !== id); if (!ok) P.erros.push(id);
    save(); atualizarErros();
  };

  // ---------- barra superior
  const top = $("#top");
  top.innerHTML = `<a class="back" href="../../index.html">← Matérias</a>
    <div class="title"><small>${C.codigo}</small>${C.titulo}</div>
    <div class="capnav"><button class="btn small" id="cap-prev" aria-label="Capítulo anterior">‹</button>
      <select id="cap-sel" aria-label="Capítulo">${caps.map(c => `<option value="${c.id}">${c.n}. ${c.titulo}</option>`).join("")}</select>
      <button class="btn small" id="cap-next" aria-label="Próximo capítulo">›</button></div>
    <div class="grow"></div>
    <div class="seg" role="group" aria-label="Modo de exibição">
      <button type="button" data-mode="ap">Apostila</button><button type="button" data-mode="split" class="only-wide">Dividido</button><button type="button" data-mode="pr">Prática</button></div>
    ${C.pdf ? `<a class="btn small" href="${C.pdf}" download>PDF</a>` : ""}`;

  // ---------- modo de exibição
  let mode = store.get("modo", "split");
  const setMode = m => {
    if (m === "split" && !wide()) m = "ap";
    mode = m; document.body.dataset.mode = m === "split" ? "" : m;
    $$(".seg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.mode === m));
    if (wide()) store.set("modo", m);
  };
  $$(".seg button").forEach(b => b.onclick = () => setMode(b.dataset.mode));
  setMode(wide() ? mode : "ap");
  addEventListener("resize", () => { if (!wide() && mode === "split") setMode("ap"); });

  // ---------- divisória arrastável
  const split = $("#split"), div = $("#divider");
  const setSplit = p => { p = Math.min(75, Math.max(25, p)); split.style.setProperty("--split", p + "%"); store.set("split", p); };
  setSplit(store.get("split", 52));
  div.addEventListener("pointerdown", e => {
    div.setPointerCapture(e.pointerId); div.classList.add("drag");
    const mv = ev => { const r = split.getBoundingClientRect(); setSplit((ev.clientX - r.left) / r.width * 100); };
    const up = () => { div.classList.remove("drag"); div.removeEventListener("pointermove", mv); div.removeEventListener("pointerup", up); };
    div.addEventListener("pointermove", mv); div.addEventListener("pointerup", up);
  });
  div.addEventListener("keydown", e => { const cur = store.get("split", 52); if (e.key === "ArrowLeft") setSplit(cur - 3); if (e.key === "ArrowRight") setSplit(cur + 3); });

  // ---------- apostila: ids nas seções, rodapé de cada capítulo
  $$(".ap-cap").forEach(sec => {
    const cap = sec.dataset.cap, i = caps.findIndex(c => c.id === cap), nx = caps[i + 1];
    $$("h2", sec).forEach(h2 => { const m = h2.textContent.match(/^(\d+\.\d+)/); if (m) h2.id = "s" + m[1].replace(".", "-"); });
    const head = $(".chap-head", sec);
    if (head) { const b = h("button", { class: "btn small", type: "button", style: "margin-top:10px" }, "Praticar este capítulo →"); b.onclick = () => { if (!wide()) setMode("pr"); else if (mode === "ap") setMode("split"); $("#pr").scrollTo(0, 0); }; head.appendChild(b); }
    const f = h("div", { class: "ap-foot" });
    const lido = h("button", { class: "btn", type: "button" });
    const pinta = () => { lido.innerHTML = P.lidos[cap] ? "✓ Estudado" : "Marcar como estudado"; lido.classList.toggle("primary", !!P.lidos[cap]); };
    lido.onclick = () => { P.lidos[cap] = !P.lidos[cap]; save(); pinta(); }; pinta();
    f.appendChild(lido);
    if (nx) { const a = h("a", { class: "btn primary", href: "#" + nx.id }, `${nx.n}. ${nx.titulo} →`); f.appendChild(a); }
    sec.appendChild(f);
  });

  // ---------- prática: cabeçalho, botões "ver na apostila", quiz e flashcards
  $$(".pr-cap").forEach(sec => {
    const cap = sec.dataset.cap, c = byId[cap];
    sec.prepend(h("div", { class: "pr-head" }, `<h2>Prática · ${c.n}. ${c.titulo}</h2><span class="hint">${c.aula || ""}</span>`));
    $$(".lab[data-ref]", sec).forEach(lab => {
      const ref = lab.dataset.ref, b = h("button", { class: "ref-btn", type: "button", title: "Rolar a apostila até a seção " + ref }, "§" + ref + " na apostila");
      b.onclick = () => irPara(ref);
      $(".lab-h h2", lab).appendChild(b);
    });
    const qs = C.quiz.filter(q => q[0] === cap);
    if (qs.length) {
      const card = h("div", { class: "card" }, `<div class="row" style="justify-content:space-between"><h3>Teste rápido</h3><div class="row"><span class="score"></span><button class="btn small" type="button">Refazer</button></div></div><div class="qbox"></div>`);
      let ok = 0, n = 0; const sc = $(".score", card);
      const run = () => { ok = 0; n = 0; sc.textContent = `${qs.length} perguntas`; renderQuiz($(".qbox", card), shuffle(qs), (q, r) => { n++; if (r) ok++; sc.textContent = `${ok}/${n} certas`; registrar(q, r); }); };
      $("button", card).onclick = run; run(); sec.appendChild(card);
    }
    const deck = (C.flash || {})[cap];
    if (deck && deck.length) sec.appendChild(flashcards(deck));
  });

  function irPara(ref) {
    if (!wide() && mode === "pr") setMode("ap");
    if (wide() && mode === "pr") setMode("split");
    const el = document.getElementById("s" + ref.replace(".", "-"));
    if (!el) return;
    const pane = $("#ap");
    pane.scrollTo({ top: el.offsetTop - 12, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    el.classList.remove("flash-target"); void el.offsetWidth; el.classList.add("flash-target");
  }

  function flashcards(deck) {
    const card = h("div", { class: "card" }, `<div class="row" style="justify-content:space-between"><h3>Flashcards</h3><span class="score"></span></div>
      <div class="flash" tabindex="0" role="button" aria-label="Virar cartão"><span class="side"></span><div class="txt"></div></div>
      <div class="row"><button class="btn small" type="button" data-a="prev">← Anterior</button><button class="btn small" type="button" data-a="flip">Virar</button><button class="btn small" type="button" data-a="next">Próximo →</button><button class="btn small" type="button" data-a="mix">Embaralhar</button></div>`);
    let d = [...deck], i = 0, back = false;
    const fc = $(".flash", card);
    const draw = () => { fc.classList.toggle("back", back); $(".side", fc).textContent = back ? "resposta" : "pergunta"; $(".txt", fc).innerHTML = d[i][back ? 1 : 0]; $(".score", card).textContent = `${i + 1}/${d.length}`; };
    const act = a => { if (a === "flip") back = !back; if (a === "next") { i = (i + 1) % d.length; back = false; } if (a === "prev") { i = (i - 1 + d.length) % d.length; back = false; } if (a === "mix") { d = shuffle(d); i = 0; back = false; } draw(); };
    fc.onclick = () => act("flip"); fc.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act("flip"); } if (e.key === "ArrowRight") act("next"); if (e.key === "ArrowLeft") act("prev"); };
    $$("button", card).forEach(b => b.onclick = () => act(b.dataset.a));
    draw(); return card;
  }

  // ---------- revisão: erros e simulado (no último capítulo marcado com revisao:true)
  const rev = caps.find(c => c.revisao);
  let atualizarErros = () => { };
  if (rev) {
    const sec = $(`.pr-cap[data-cap="${rev.id}"]`);
    // simulado
    const sim = h("div", { class: "lab" }, `<div class="lab-h"><h2><span class="tag">Simulado</span>Prova com tempo</h2><div class="row"><label class="ctl" for="sim-n">Questões</label><select id="sim-n"><option>10</option><option selected>15</option><option>20</option></select><span class="timer" id="sim-t"></span></div></div>
      <div class="lab-b"><p class="hint">Questões sorteadas de todos os capítulos, sem resposta na hora. Um minuto por questão. Ao entregar, você vê a nota, a correção e quais capítulos revisar. As que errar vão para a revisão dos erros.</p>
      <div class="row"><button class="btn primary" type="button" id="sim-go">Começar simulado</button><button class="btn" type="button" id="sim-end" hidden>Entregar</button></div><div id="sim-box"></div><div id="sim-res"></div></div>`);
    sec.appendChild(sim);
    let timer = null, qs = [], resp = {};
    const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    const entregar = () => {
      clearInterval(timer); $("#sim-end").hidden = true; $("#sim-go").hidden = false; $("#sim-go").textContent = "Novo simulado";
      let ok = 0; const porCap = {};
      $$("#sim-box .q").forEach((qel, k) => {
        const q = qs[k], esc = resp[k], certo = esc === 0;
        if (certo) ok++;
        porCap[q[0]] = porCap[q[0]] || [0, 0]; porCap[q[0]][1]++; if (certo) porCap[q[0]][0]++;
        $$(".opt", qel).forEach(b => { b.disabled = true; b.style.background = ""; b.style.borderColor = ""; if (+b.dataset.i === 0) b.classList.add("right"); else if (+b.dataset.i === esc) b.classList.add("wrong"); });
        const ex = $(".expl", qel); ex.hidden = false; ex.innerHTML = (certo ? "<b>Certo.</b> " : esc == null ? "<b>Em branco.</b> " : "<b>Errado.</b> ") + q[3];
        registrar(q, certo);
      });
      const nota = (ok / qs.length * 10).toFixed(1);
      const fracos = Object.entries(porCap).filter(([, [a, t]]) => a < t).map(([c]) => `<a href="#${c}">${byId[c].n}. ${byId[c].titulo}</a>`);
      $("#sim-res").innerHTML = `<div class="status ${ok / qs.length >= .7 ? "ok" : "bad"}"><b>Nota ${nota.replace(".", ",")}</b> · ${ok} de ${qs.length} certas. ${fracos.length ? "Revise: " + fracos.join(", ") + "." : "Acertou tudo!"}</div>`;
      $("#sim-res").scrollIntoView({ block: "nearest" });
    };
    $("#sim-go").onclick = () => {
      const n = +$("#sim-n").value; qs = shuffle(C.quiz).slice(0, n); resp = {};
      $("#sim-res").innerHTML = ""; $("#sim-go").hidden = true; $("#sim-end").hidden = false;
      const box = $("#sim-box"); box.innerHTML = "";
      qs.forEach((q, k) => {
        const el = h("div", { class: "q" }, `<div class="stem">${k + 1}. ${q[1]}</div>`), os = h("div", { class: "opts" });
        shuffle(q[2].map((o, i) => [o, i])).forEach(([o, i]) => { const b = h("button", { class: "opt", type: "button" }, o); b.dataset.i = i; b.onclick = () => { if (b.disabled) return; resp[k] = i; $$(".opt", os).forEach(x => x.classList.remove("right")); b.classList.add("right"); b.style.background = "var(--clk-soft)"; b.style.borderColor = "var(--clk)"; $$(".opt", os).forEach(x => { if (x !== b) { x.style.background = ""; x.style.borderColor = ""; } }); b.classList.remove("right"); }; os.appendChild(b); });
        el.append(os, h("div", { class: "expl" })); $(".expl", el).hidden = true; box.appendChild(el);
      });
      let t = n * 60; $("#sim-t").textContent = fmt(t); clearInterval(timer);
      timer = setInterval(() => { t--; $("#sim-t").textContent = fmt(t); if (t <= 0) entregar(); }, 1000);
    };
    $("#sim-end").onclick = entregar;
    // erros
    const er = h("div", { class: "lab" }, `<div class="lab-h"><h2><span class="tag">Revisão</span>Questões que você errou</h2><span class="score" id="er-n"></span></div><div class="lab-b"><p class="hint">Toda questão errada (nos testes rápidos ou no simulado) entra aqui e só sai quando você acertar.</p><div id="er-box"></div><div class="row"><button class="btn small" type="button" id="er-re">Atualizar lista</button></div></div>`);
    sec.appendChild(er);
    atualizarErros = () => { const n = P.erros.length; $("#er-n").textContent = n ? `${n} pendente${n > 1 ? "s" : ""}` : "nenhuma pendente"; };
    const desenhaErros = () => {
      const lista = C.quiz.filter(q => P.erros.includes(qid(q)));
      if (!lista.length) { $("#er-box").innerHTML = `<div class="status ok">Nenhum erro pendente. Faça um simulado para testar.</div>`; return; }
      renderQuiz($("#er-box"), lista, (q, r) => registrar(q, r));
    };
    $("#er-re").onclick = desenhaErros; desenhaErros(); atualizarErros();
  }

  // ---------- navegação por capítulo
  const sel = $("#cap-sel");
  function route() {
    let id = (location.hash || "").slice(1);
    if (!byId[id]) id = P.ultimo && byId[P.ultimo] ? P.ultimo : caps[0].id;
    $$(".ap-cap").forEach(s => s.hidden = s.dataset.cap !== id);
    $$(".pr-cap").forEach(s => s.hidden = s.dataset.cap !== id);
    sel.value = id; P.ultimo = id; P.ultimoTitulo = `${byId[id].n}. ${byId[id].titulo}`; save();
    const i = caps.findIndex(c => c.id === id);
    $("#cap-prev").disabled = i === 0; $("#cap-next").disabled = i === caps.length - 1;
    $("#ap").scrollTo(0, 0); $("#pr").scrollTo(0, 0);
    document.title = `${byId[id].titulo} · ${C.codigo}`;
  }
  sel.onchange = () => location.hash = sel.value;
  $("#cap-prev").onclick = () => { const i = caps.findIndex(c => c.id === sel.value); if (i > 0) location.hash = caps[i - 1].id; };
  $("#cap-next").onclick = () => { const i = caps.findIndex(c => c.id === sel.value); if (i < caps.length - 1) location.hash = caps[i + 1].id; };
  addEventListener("hashchange", route);
  route();
};

// ===================================================== catálogo
Estudos.catalogo = function (lista) {
  const g = $("#cat-grid");
  g.innerHTML = lista.map(m => {
    if (m.embreve) return `<div class="mat soon"><span class="code">${m.codigo}</span><h2>${m.titulo}</h2><p>${m.descricao}</p><div class="meta"><span>em breve</span></div></div>`;
    const P = store.get("m:" + m.id, {}), lidos = Object.values(P.lidos || {}).filter(Boolean).length;
    const pct = Math.round(lidos / m.capitulos * 100), acc = P.respostas ? Math.round(P.acertos / P.respostas * 100) : null;
    const cont = P.ultimo ? `<span class="go">Continuar: ${P.ultimoTitulo || P.ultimo} →</span>` : `<span class="go">Começar →</span>`;
    return `<a class="mat" href="${m.caminho}${P.ultimo ? "#" + P.ultimo : ""}"><div class="mat-top"><span class="code">${m.codigo}</span><span class="code">${m.periodo || ""}</span></div><h2>${m.titulo}</h2><p>${m.descricao}</p>
      <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Capítulos estudados"><i style="width:${pct}%"></i></div>
      <div class="meta"><span>${lidos}/${m.capitulos} capítulos estudados</span><span>${acc == null ? "sem respostas ainda" : acc + "% de acerto"}</span></div>${cont}</a>`;
  }).join("");
};
