/* Gera o PDF da apostila de uma matéria a partir da própria página do site.
   Uso (com um servidor local na raiz do repositório, ex.: python3 -m http.server 8765):
     node ferramentas/gerar_pdf.js <id-da-materia> [porta]
   Saída: materias/<id>/apostila-<id>.pdf */
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const id = process.argv[2], porta = process.argv[3] || "8765";
  if (!id) { console.error("informe o id da matéria"); process.exit(1); }
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.emulateMedia({ colorScheme: "light" });
  await p.goto(`http://localhost:${porta}/materias/${id}/index.html`, { waitUntil: "networkidle" });
  const titulo = await p.evaluate(() => CURSO.titulo);
  await p.addStyleTag({ content: `
    .top,.pane-pr,.divider,.ap-foot,.chap-head .btn{display:none!important}
    html,body{height:auto!important;background:#fff!important}
    .split{display:block!important;height:auto!important}
    .pane{overflow:visible!important}
    .pane-ap{background:#fff!important}
    .apostila{max-width:none;padding:0;font-size:12pt}
    .ap-cap{display:block!important;break-before:page}
    .ap-cap:first-of-type{break-before:auto}
    figure,.callout,pre,table,.chap-head{break-inside:avoid}
    h2,h3{break-after:avoid}
    .capa{height:250mm;display:flex;flex-direction:column;justify-content:center;gap:18px;break-after:page}
    .capa h1{font-family:var(--f-display);font-weight:400;font-size:52pt;line-height:.95;text-transform:uppercase}
    .capa .faixa{background:var(--mat);border:3px solid #121212;box-shadow:8px 8px 0 #121212;padding:18px 22px;border-radius:10px}
  ` });
  await p.evaluate(t => {
    document.querySelectorAll(".ap-cap").forEach(s => s.hidden = false);
    const c = document.createElement("section"); c.className = "capa";
    c.innerHTML = `<span class="sticker">Apostila de estudo</span><div class="faixa"><h1>${t}</h1></div><p style="font-family:var(--f-body);font-size:13pt;max-width:60ch">Do básico ao nível de prova, com figuras, código em C, exemplos resolvidos e exercícios com gabarito. Versão para imprimir; a versão interativa está no site.</p>`;
    document.querySelector(".apostila").prepend(c);
  }, titulo);
  await p.waitForTimeout(800);
  const out = path.join(__dirname, "..", "materias", id, `apostila-${id}.pdf`);
  await p.pdf({ path: out, format: "A4", printBackground: true, margin: { top: "16mm", bottom: "18mm", left: "15mm", right: "15mm" },
    displayHeaderFooter: true, headerTemplate: "<div></div>",
    footerTemplate: `<div style="width:100%;font-size:8px;font-family:sans-serif;color:#777;padding:0 15mm;display:flex;justify-content:space-between"><span>${titulo}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>` });
  await b.close();
  console.log("ok:", out);
})();
