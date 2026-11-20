"""Gera materias/aed/index.html e as figuras em materias/aed/figs/.

Uso (a partir da raiz do repositório):
    python3 -I materias/aed/_fonte/gerar.py

Fontes:
  c1.html … c4.html   texto da apostila (um <section class="chapter"> por capítulo).
                      Marcadores: {{fig:chave|legenda|largura}} e {{Xn}} (X com barra em cima).
                      Código C em <pre><code class="c">…</code></pre> recebe destaque de sintaxe.
  fig_defs.py         figuras (SVG gerado em Python; aedfigs.py tem as primitivas).
  pratica.html        painel de prática de cada capítulo (<section class="pr-cap" data-cap=...>).
"""
import html
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
MATERIA = os.path.dirname(AQUI)
sys.path.insert(0, AQUI)

from bs4 import BeautifulSoup  # noqa: E402
from fig_defs import F  # noqa: E402

CAPS = ["tads", "pilhas", "filas", "listas", "arvores", "abb", "avl", "rubronegra", "heap", "revisao"]
FONTS = ("https://fonts.googleapis.com/css2?family=Archivo+Black&family=IBM+Plex+Sans:wght@400;500;600;700"
         "&family=JetBrains+Mono:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700"
         "&family=Space+Grotesk:wght@500;600;700&display=swap")

# ---------------------------------------------------------------- destaque de C
KW = set("if else while for do return break continue switch case default sizeof typedef struct union enum const static".split())
TY = set("int float double char bool void long short unsigned size_t".split())
TOK = re.compile(r'/\*.*?\*/|//[^\n]*|"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|^[ \t]*#[^\n]*|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b|.', re.S | re.M)


def realca_c(src):
    out = []
    for m in TOK.finditer(src):
        t = m.group(0)
        e = html.escape(t, quote=False)
        if t.startswith("/*") or t.startswith("//"):
            out.append(f'<span class="cm">{e}</span>')
        elif t.lstrip().startswith("#"):
            out.append(f'<span class="pp">{e}</span>')
        elif t[0] in "\"'":
            out.append(f'<span class="st">{e}</span>')
        elif t[0].isdigit() or t in ("NULL", "true", "false"):
            out.append(f'<span class="nu">{e}</span>')
        elif t in KW:
            out.append(f'<span class="kw">{e}</span>')
        elif t in TY or (len(t) > 1 and t.isupper() and t.replace("_", "").isalnum() and not t.isdigit() and t not in ("MAX",)):
            out.append(f'<span class="ty">{e}</span>')
        else:
            out.append(e)
    return "".join(out)


# ---------------------------------------------------------------- figuras
os.makedirs(os.path.join(MATERIA, "figs"), exist_ok=True)
for k, s in F.items():
    with open(os.path.join(MATERIA, "figs", k + ".svg"), "w") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n' + s)

# ---------------------------------------------------------------- apostila
texto = "".join(open(os.path.join(AQUI, f"c{i}.html")).read() for i in range(1, 5))
texto = re.sub(r"\{\{(\w+?)n\}\}", lambda m: f'<span class="ov">{m.group(1)}</span>', texto)
texto = re.sub(r'<pre><code class="c">(.*?)</code></pre>',
               lambda m: '<pre><code class="c">' + realca_c(html.unescape(m.group(1))) + "</code></pre>", texto, flags=re.S)

soup = BeautifulSoup(texto, "html.parser")
secoes = soup.find_all("section", class_="chapter")
assert len(secoes) == len(CAPS), len(secoes)

partes = []
for i, (cap, sec) in enumerate(zip(CAPS, secoes), start=1):
    corpo = "".join(str(c) for c in sec.contents)
    cont = [0]

    def fig(m, i=i, cont=cont):
        p = m.group(1).split("|")
        chave, leg = p[0], p[1]
        larg = f' style="max-width:{p[2]}"' if len(p) > 2 else ""
        cont[0] += 1
        alt = re.sub(r"<[^>]+>", "", leg).replace('"', "'")
        return (f'<figure><div class="fig"><img src="figs/{chave}.svg" alt="{alt}" loading="lazy"{larg}></div>'
                f'<figcaption><b>Figura {i}.{cont[0]}.</b> {leg}</figcaption></figure>')

    corpo = re.sub(r"\{\{fig:(.*?)\}\}", fig, corpo, flags=re.S)
    partes.append(f'<section class="ap-cap" data-cap="{cap}" hidden>\n{corpo}\n</section>')

apostila = "\n".join(partes)
pratica = open(os.path.join(AQUI, "pratica.html")).read()

pagina = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>AED · Algoritmos e Estruturas de Dados</title>
<meta name="description" content="Apostila e laboratórios interativos de algoritmos e estruturas de dados, com código em C.">
<link rel="icon" href="../../assets/icone.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="../../assets/engine.css">
<style>:root{{--mat:#3ddc97}}</style>
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
