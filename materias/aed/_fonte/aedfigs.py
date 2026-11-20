"""Primitivas de figuras (SVG) para a apostila de AED, no estilo neo-brutalista do site."""
import math

INK = "#121212"
MAT = "#3ddc97"      # cor da matéria
YEL = "#ffd23f"      # novo / destaque
RED = "#e23b3b"
BLUE = "#2f5bff"
GRAY = "#8a8478"
PAPER = "#fffdf6"
SOFT = "#efe7d6"
FONT = "JetBrains Mono, IBM Plex Mono, DejaVu Sans Mono, monospace"
SANS = "Space Grotesk, IBM Plex Sans, DejaVu Sans, sans-serif"


def svg(w, h, body):
    return (f'<svg viewBox="0 0 {w} {h}" width="{w}" height="{h}" xmlns="http://www.w3.org/2000/svg" font-family="{FONT}">'
            f'<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
            f'<path d="M0,0 L10,5 L0,10 z" fill="{INK}"/></marker>'
            f'<marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
            f'<path d="M0,0 L10,5 L0,10 z" fill="{RED}"/></marker>'
            f'<marker id="ab" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
            f'<path d="M0,0 L10,5 L0,10 z" fill="{BLUE}"/></marker></defs>{body}</svg>')


def text(x, y, s, size=14, anchor="middle", color=INK, weight="700", sans=False, italic=False):
    fam = f' font-family="{SANS}"' if sans else ""
    st = ' font-style="italic"' if italic else ""
    return (f'<text x="{x}" y="{y}" font-size="{size}" text-anchor="{anchor}" fill="{color}" font-weight="{weight}"'
            f' dominant-baseline="middle"{fam}{st}>{s}</text>')


def rect(x, y, w, h, fill=PAPER, sw=2.5, rx=4, shadow=False, stroke=INK, dash=None):
    s = ""
    if shadow:
        s += f'<rect x="{x+4}" y="{y+4}" width="{w}" height="{h}" rx="{rx}" fill="{INK}"/>'
    d = f' stroke-dasharray="{dash}"' if dash else ""
    s += f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>'
    return s


def arrow(pts, color=INK, w=2.2, dash=None, head=True):
    mk = {INK: "a", RED: "ar", BLUE: "ab"}.get(color, "a")
    d = " ".join(f"{x},{y}" for x, y in pts)
    da = f' stroke-dasharray="{dash}"' if dash else ""
    m = f' marker-end="url(#{mk})"' if head else ""
    return f'<polyline points="{d}" fill="none" stroke="{color}" stroke-width="{w}" stroke-linejoin="round"{da}{m}/>'


def curve(x1, y1, cx, cy, x2, y2, color=INK, w=2.2, dash=None):
    mk = {INK: "a", RED: "ar", BLUE: "ab"}.get(color, "a")
    da = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<path d="M{x1},{y1} Q{cx},{cy} {x2},{y2}" fill="none" stroke="{color}" stroke-width="{w}"{da} marker-end="url(#{mk})"/>'


def null_mark(x, y):
    """símbolo de NULL (terra)"""
    return (f'<line x1="{x}" y1="{y-9}" x2="{x}" y2="{y+9}" stroke="{INK}" stroke-width="2.5"/>'
            f'<line x1="{x+5}" y1="{y-6}" x2="{x+5}" y2="{y+6}" stroke="{INK}" stroke-width="2.5"/>'
            f'<line x1="{x+10}" y1="{y-3}" x2="{x+10}" y2="{y+3}" stroke="{INK}" stroke-width="2.5"/>')


# ---------------------------------------------------------------- vetor
def array(x, y, vals, cw=46, ch=40, fills=None, idx=True, idx0=0, labels=None, label_side="top", empty="", shadow=True):
    """Desenha um vetor. labels: {indice: texto} com seta apontando para a célula."""
    s = ""
    if shadow:
        s += f'<rect x="{x+4}" y="{y+4}" width="{cw*len(vals)}" height="{ch}" fill="{INK}"/>'
    for i, v in enumerate(vals):
        f = (fills or {}).get(i, PAPER if v not in (None, "") else SOFT)
        s += rect(x + i * cw, y, cw, ch, f, rx=0)
        s += text(x + i * cw + cw / 2, y + ch / 2 + 1, "" if v is None else v, 15)
        if idx:
            s += text(x + i * cw + cw / 2, y + ch + 14, i + idx0, 11, color=GRAY, weight="600")
    for i, lab in (labels or {}).items():
        cx = x + i * cw + cw / 2
        if label_side == "top":
            s += text(cx, y - 34, lab, 12, color=BLUE)
            s += arrow([(cx, y - 25), (cx, y - 4)], BLUE)
        else:
            s += text(cx, y + ch + 46, lab, 12, color=BLUE)
            s += arrow([(cx, y + ch + 37), (cx, y + ch + 6)], BLUE)
    return s


# ---------------------------------------------------------------- nós encadeados
def node(x, y, val, fill=PAPER, kind="simples", w=None, h=40, shadow=True):
    """Nó [info|prox] (simples) ou [ant|info|prox] (dupla). Retorna svg e pontos de ancoragem."""
    pw = 22
    if kind == "dupla":
        w = w or 104
        s = ""
        if shadow:
            s += f'<rect x="{x+4}" y="{y+4}" width="{w}" height="{h}" fill="{INK}"/>'
        s += rect(x, y, pw, h, SOFT, rx=0) + rect(x + pw, y, w - 2 * pw, h, fill, rx=0) + rect(x + w - pw, y, pw, h, SOFT, rx=0)
        s += text(x + w / 2, y + h / 2 + 1, val, 15)
        s += f'<circle cx="{x+w-pw/2}" cy="{y+h/2}" r="3.5" fill="{INK}"/><circle cx="{x+pw/2}" cy="{y+h/2}" r="3.5" fill="{INK}"/>'
        return s, {"next": (x + w - pw / 2, y + h / 2), "prev": (x + pw / 2, y + h / 2), "l": (x, y + h / 2),
                   "r": (x + w, y + h / 2), "top": (x + w / 2, y), "bot": (x + w / 2, y + h), "w": w}
    w = w or 82
    s = ""
    if shadow:
        s += f'<rect x="{x+4}" y="{y+4}" width="{w}" height="{h}" fill="{INK}"/>'
    s += rect(x, y, w - pw, h, fill, rx=0) + rect(x + w - pw, y, pw, h, SOFT, rx=0)
    s += text(x + (w - pw) / 2, y + h / 2 + 1, val, 15)
    s += f'<circle cx="{x+w-pw/2}" cy="{y+h/2}" r="3.5" fill="{INK}"/>'
    return s, {"next": (x + w - pw / 2, y + h / 2), "l": (x, y + h / 2), "r": (x + w, y + h / 2),
               "top": (x + w / 2, y), "bot": (x + w / 2, y + h), "w": w}


def ptr_label(x, y, lab, color=BLUE):
    return text(x, y, lab, 12, color=color)


def linked(x, y, vals, gap=40, fills=None, kind="simples", head="L", circular=False, tail_null=True, head_ptr=True,
           tail_label=None, sentinel=False):
    """Lista encadeada horizontal. Retorna (svg, largura)."""
    s = ""
    xs = []
    cur = x + (70 if head_ptr else 0)
    anchors = []
    for i, v in enumerate(vals):
        f = (fills or {}).get(i, PAPER)
        if sentinel and i == 0:
            f = SOFT
        ns, a = node(cur, y, v, f, kind)
        s += ns
        anchors.append(a)
        xs.append(cur)
        cur += a["w"] + gap
    if head_ptr and anchors:
        s += rect(x, y + 6, 40, 28, PAPER, rx=3) + text(x + 20, y - 10, head, 12, color=BLUE)
        s += f'<circle cx="{x+20}" cy="{y+20}" r="3.5" fill="{INK}"/>'
        s += arrow([(x + 20, y + 20), (anchors[0]["l"][0] - 2, y + 20)])
    for i in range(len(anchors) - 1):
        a, b = anchors[i], anchors[i + 1]
        if kind == "dupla":
            s += arrow([(a["next"][0], a["next"][1] - 6), (b["l"][0] - 2, b["l"][1] - 6)])
            s += arrow([(b["prev"][0], b["prev"][1] + 6), (a["r"][0] + 2, a["r"][1] + 6)])
        else:
            s += arrow([a["next"], (b["l"][0] - 2, b["l"][1])])
    last = anchors[-1]
    if circular:
        fx = anchors[0]
        yy = y + 40 + 26
        s += arrow([last["next"], (last["next"][0], yy), (fx["bot"][0], yy), (fx["bot"][0], fx["bot"][1] + 2)])
        if kind == "dupla":
            yy2 = y - 26
            s += arrow([fx["prev"], (fx["prev"][0], yy2), (last["top"][0], yy2), (last["top"][0], last["top"][1] - 2)])
    elif tail_null:
        nx = last["r"][0] + 22
        s += arrow([last["next"], (nx, last["next"][1])], head=False) + null_mark(nx, last["next"][1])
        if kind == "dupla":
            fx = anchors[0]
            px, py = fx["prev"]
            s += arrow([(px, py), (px, py + 34)], head=False) + text(px, py + 44, "NULL", 10, color=INK)
    if tail_label:
        s += text(last["top"][0], y - 34, tail_label, 12, color=BLUE) + arrow([(last["top"][0], y - 26), (last["top"][0], y - 4)], BLUE)
    return s, cur + 40, anchors


# ---------------------------------------------------------------- árvores
def T(k, l=None, r=None, **kw):
    return {"k": k, "l": l, "r": r, **kw}


def layout(t, dx=52, dy=74, x0=30, y0=34):
    pos = {}
    order = [0]

    def walk(n, d):
        if n is None:
            return
        walk(n["l"], d + 1)
        pos[id(n)] = (x0 + order[0] * dx, y0 + d * dy)
        order[0] += 1
        walk(n["r"], d + 1)
    walk(t, 0)
    return pos, order[0]


def tree(t, ox=0, oy=0, dx=52, dy=74, r=19, show_null=False, labels=None):
    """Desenha árvore binária. Atributos do nó: fill, color ('r'/'b'), fb (rótulo ao lado), tri (subárvore triângulo), mark."""
    pos, n = layout(t, dx, dy, 30 + ox, 34 + oy)
    s = ""

    def edges(nd):
        nonlocal s
        if nd is None:
            return
        x, y = pos[id(nd)]
        for side in ("l", "r"):
            c = nd[side]
            if c is not None:
                cx, cy = pos[id(c)]
                hot = c.get("hot")
                s += (f'<line x1="{x}" y1="{y}" x2="{cx}" y2="{cy}" stroke="{RED if hot else INK}" stroke-width="{3.4 if hot else 2.4}"/>')
                edges(c)
            elif show_null and not nd.get("tri"):
                cx = x + (-dx * 0.45 if side == "l" else dx * 0.45)
                cy = y + dy * 0.62
                s += f'<line x1="{x}" y1="{y}" x2="{cx}" y2="{cy}" stroke="{INK}" stroke-width="1.6"/>'
                s += f'<rect x="{cx-9}" y="{cy-7}" width="18" height="14" fill="{INK}" rx="2"/>' + text(cx, cy + 1, "NIL", 7, color="#fff")
    edges(t)

    def nodes(nd):
        nonlocal s
        if nd is None:
            return
        x, y = pos[id(nd)]
        if nd.get("tri"):
            s += (f'<path d="M{x},{y-18} L{x+24},{y+24} L{x-24},{y+24} Z" fill="{nd.get("fill", SOFT)}" stroke="{INK}" stroke-width="2.4" stroke-linejoin="round"/>'
                  + text(x, y + 10, nd["k"], 13))
        else:
            col = nd.get("color")
            fill = {"r": RED, "b": INK}.get(col, nd.get("fill", PAPER))
            tc = "#fff" if col in ("r", "b") else INK
            s += f'<circle cx="{x+3}" cy="{y+3}" r="{r}" fill="{INK}"/>'
            s += f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{INK}" stroke-width="2.5"/>'
            if nd.get("ring"):
                s += f'<circle cx="{x}" cy="{y}" r="{r+6}" fill="none" stroke="{BLUE}" stroke-width="2.4" stroke-dasharray="4 3"/>'
            s += text(x, y + 1, nd["k"], 14, color=tc)
            if "fb" in nd:
                s += (f'<rect x="{x+r-2}" y="{y-r-12}" width="{max(22, 9*len(str(nd["fb"]))+8)}" height="18" rx="4" fill="{YEL}" stroke="{INK}" stroke-width="1.8"/>'
                      + text(x + r - 2 + max(22, 9 * len(str(nd["fb"])) + 8) / 2, y - r - 2, nd["fb"], 11))
            if "lab" in nd:
                s += text(x, y + r + 14, nd["lab"], 11, color=BLUE)
        nodes(nd["l"])
        nodes(nd["r"])
    nodes(t)
    W = 60 + (n - 1) * dx + ox
    depth = max(p[1] for p in pos.values())
    return s, W + 30, depth + 40 + (30 if show_null else 0), pos


def tree_fig(t, title=None, **kw):
    s, w, h, _ = tree(t, oy=(26 if title else 0), **kw)
    if title:
        s = text(w / 2, 16, title, 13, sans=True) + s
    return svg(w, h + (26 if title else 0), s)


def side_by_side(parts, gap=60, arrow_lab=None, titles=None, arrows=True):
    """parts: lista de (svg_body, w, h). Coloca lado a lado com setas grandes entre eles."""
    s = ""
    x = 0
    if titles:
        parts = [(b, max(w, len(t) * 7.6 + 16), h) for (b, w, h), t in zip(parts, titles)]
    H = max(p[2] for p in parts) + (30 if titles else 0)
    for i, (body, w, h) in enumerate(parts):
        ty = 30 if titles else 0
        if titles:
            s += text(x + w / 2, 14, titles[i], 13, sans=True)
        s += f'<g transform="translate({x},{ty})">{body}</g>'
        x += w
        if i < len(parts) - 1 and not arrows:
            x += gap
        elif i < len(parts) - 1:
            mid = ty + H / 2 - 10
            s += f'<path d="M{x+8},{mid-9} L{x+gap-18},{mid-9} L{x+gap-18},{mid-18} L{x+gap-4},{mid} L{x+gap-18},{mid+18} L{x+gap-18},{mid+9} L{x+8},{mid+9} Z" fill="{MAT}" stroke="{INK}" stroke-width="2.2"/>'
            if arrow_lab:
                s += text(x + gap / 2, mid + 34, arrow_lab[i], 11, color=INK)
            x += gap
    return svg(x, H + 20, s)


def tree_part(t, **kw):
    s, w, h, _ = tree(t, **kw)
    return (s, w, h)
