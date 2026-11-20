"""Gera materias/ssc118/index.html e as figuras em materias/ssc118/figs/.

Uso (a partir da raiz do repositório):
    python3 -I materias/ssc118/_fonte/gerar.py

Fontes:
  c1.html, c2.html, c3.html  texto da apostila (um <section class="chapter"> por capítulo).
                             Marcadores: {{fig:chave|legenda|largura}} e {{Xn}} (X com barra em cima).
  fig_defs.py, extra_figs.py figuras (SVG gerado em Python; figs.py tem as primitivas).
  pratica.html               painel de prática de cada capítulo (<section class="pr-cap" data-cap=...>).
"""
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
MATERIA = os.path.dirname(AQUI)
sys.path.insert(0, AQUI)

from bs4 import BeautifulSoup  # noqa: E402
from fig_defs import F  # noqa: E402
from extra_figs import ex_nor, ex_jk, mealy_vs_moore_wave, ex_shift  # noqa: E402

F["ex_nor_q"] = ex_nor(False)
F["ex_nor_a"] = ex_nor(True)
F["ex_jk_q"] = ex_jk(False)
F["ex_jk_a"] = ex_jk(True)
F["mm_wave"] = mealy_vs_moore_wave()
F["ex_shift_q"] = ex_shift(False)
F["ex_shift_a"] = ex_shift(True)

CAPS = ["fundamentos", "latches", "tempo", "flipflops", "assincronos", "sincronos",
        "registradores", "memorias", "mef", "revisao"]

# ---------------------------------------------------------------- figuras
os.makedirs(os.path.join(MATERIA, "figs"), exist_ok=True)
for k, s in F.items():
    with open(os.path.join(MATERIA, "figs", k + ".svg"), "w") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n' + s.replace('class="fig" ', "", 1))

# ---------------------------------------------------------------- apostila
texto = "".join(open(os.path.join(AQUI, n)).read() for n in ("c1.html", "c2.html", "c3.html"))
texto = re.sub(r"\{\{(\w+?)n\}\}", lambda m: f'<span class="ov">{m.group(1)}</span>', texto)

soup = BeautifulSoup(texto, "html.parser")
secoes = soup.find_all("section", class_="chapter")
assert len(secoes) == len(CAPS), len(secoes)

partes = []
for i, (cap, sec) in enumerate(zip(CAPS, secoes), start=1):
    html = "".join(str(c) for c in sec.contents)
    cont = [0]

    def fig(m, i=i, cont=cont):
        p = m.group(1).split("|")
        chave, leg = p[0], p[1]
        larg = f' style="max-width:{p[2]}"' if len(p) > 2 else ""
        cont[0] += 1
        alt = re.sub(r"<[^>]+>", "", leg).replace('"', "'")
        return (f'<figure><div class="fig"><img src="figs/{chave}.svg" alt="{alt}" loading="lazy"{larg}></div>'
                f'<figcaption><b>Figura {i}.{cont[0]}.</b> {leg}</figcaption></figure>')

    html = re.sub(r"\{\{fig:(.*?)\}\}", fig, html, flags=re.S)
    partes.append(f'<section class="ap-cap" data-cap="{cap}" hidden>\n{html}\n</section>')

apostila = "\n".join(partes)
pratica = open(os.path.join(AQUI, "pratica.html")).read()

pagina = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>SSC118 · Sistemas Digitais</title>
<meta name="description" content="Apostila e laboratórios interativos de circuitos sequenciais (SSC118).">
<link rel="icon" href="../../assets/icone.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Space+Grotesk:wght@500;600;700&display=swap">
<link rel="stylesheet" href="../../assets/engine.css">
</head>
<body>
<header class="top" id="top"></header>
<main class="split" id="split">
  <div class="pane pane-ap" id="ap"><article class="apostila">
{apostila}
  </article></div>
  <div class="divider" id="divider" role="separator" aria-orientation="vertical" aria-label="Arraste para redimensionar" tabindex="0"></div>
  <div class="pane pane-pr" id="pr"><div class="pr-inner">
{pratica}
  </div></div>
</main>
<script src="../../assets/engine.js"></script>
<script src="curso.js"></script>
<script src="labs.js"></script>
<script>Estudos.iniciarMateria(CURSO);</script>
</body>
</html>
"""
with open(os.path.join(MATERIA, "index.html"), "w") as f:
    f.write(pagina)
print("ok:", len(F), "figuras,", len(CAPS), "capítulos")
