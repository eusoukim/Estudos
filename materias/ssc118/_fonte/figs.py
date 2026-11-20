"""Biblioteca de figuras SVG para a apostila de Lógica Digital."""
import math

INK = "#1d2939"
NAVY = "#1f3a5f"
ORANGE = "#d9480f"
GREEN = "#2b8a3e"
RED = "#c92a2a"
BLUE = "#1c64b4"
GRAY = "#98a2b3"
LIGHT = "#eef2f7"
PURPLE = "#7048e8"

FONT = "Inter, DejaVu Sans, sans-serif"
MONO = "DejaVu Sans Mono, monospace"


def svg(w, h, body, cls="fig", padl=0):
    return (f'<svg class="{cls}" viewBox="{-padl} 0 {w+padl} {h}" width="{w+padl}" height="{h}" '
            f'xmlns="http://www.w3.org/2000/svg" font-family="{FONT}">'
            f'<defs>'
            f'<marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{INK}"/></marker>'
            f'<marker id="arrO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{ORANGE}"/></marker>'
            f'<marker id="arrB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{BLUE}"/></marker>'
            f'<pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="{RED}" stroke-width="2" opacity="0.45"/></pattern>'
            f'</defs>{body}</svg>')


def text(x, y, s, size=13, anchor="middle", color=INK, weight="normal", over=False, mono=False, italic=False):
    st = []
    if over:
        st.append("text-decoration:overline")
    if italic:
        st.append("font-style:italic")
    fam = f' font-family="{MONO}"' if mono else ""
    style = f' style="{";".join(st)}"' if st else ""
    return (f'<text x="{x}" y="{y}" font-size="{size}" text-anchor="{anchor}" fill="{color}" '
            f'font-weight="{weight}" dominant-baseline="middle"{fam}{style}>{s}</text>')


def line(pts, color=INK, w=1.6, dash=None, arrow=None):
    d = " ".join(f"{x},{y}" for x, y in pts)
    da = f' stroke-dasharray="{dash}"' if dash else ""
    m = f' marker-end="url(#{arrow})"' if arrow else ""
    return f'<polyline points="{d}" fill="none" stroke="{color}" stroke-width="{w}" stroke-linejoin="round"{da}{m}/>'


def dot(x, y, color=INK, r=3.2):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}"/>'


def pin(x, y, label, side="left", color=INK, over=False, size=13):
    """terminal: small hollow circle + label"""
    s = f'<circle cx="{x}" cy="{y}" r="4" fill="white" stroke="{color}" stroke-width="1.6"/>'
    if side == "left":
        s += text(x - 8, y, label, size, "end", color, "600", over)
    elif side == "right":
        s += text(x + 8, y, label, size, "start", color, "600", over)
    elif side == "top":
        s += text(x, y - 13, label, size, "middle", color, "600", over)
    else:
        s += text(x, y + 14, label, size, "middle", color, "600", over)
    return s


# ---------------------------------------------------------------- portas
def gate(kind, x, y, n_in=2, label=None, fill="white"):
    """Porta apontando para a direita. Área 60x40 (corpo). Retorna (svg, ins, out)."""
    h = 40
    bubble = kind in ("nand", "nor", "not", "xnor")
    base = kind.replace("n", "", 1) if kind in ("nand", "nor") else kind
    if kind == "not":
        body = f'<path d="M{x},{y+4} L{x+40},{y+20} L{x},{y+36} Z" fill="{fill}" stroke="{INK}" stroke-width="1.8"/>'
        out = (x + 48, y + 20)
        bx = x + 44
        ins = [(x, y + 20)]
    else:
        if base == "and":
            body = f'<path d="M{x},{y} H{x+32} A20,20 0 0 1 {x+32},{y+40} H{x} Z" fill="{fill}" stroke="{INK}" stroke-width="1.8"/>'
            tip = x + 52
        elif base in ("or",):
            body = (f'<path d="M{x},{y} Q{x+14},{y+20} {x},{y+40} Q{x+38},{y+40} {x+56},{y+20} '
                    f'Q{x+38},{y} {x},{y} Z" fill="{fill}" stroke="{INK}" stroke-width="1.8"/>')
            tip = x + 56
        elif base in ("xor", "xnor"):
            body = (f'<path d="M{x+6},{y} Q{x+20},{y+20} {x+6},{y+40} Q{x+42},{y+40} {x+60},{y+20} '
                    f'Q{x+42},{y} {x+6},{y} Z" fill="{fill}" stroke="{INK}" stroke-width="1.8"/>'
                    f'<path d="M{x},{y} Q{x+14},{y+20} {x},{y+40}" fill="none" stroke="{INK}" stroke-width="1.8"/>')
            tip = x + 60
        bx = tip + 4
        out = (tip + (8 if bubble else 0), y + 20)
        if n_in == 2:
            ys = [y + 11, y + 29]
        elif n_in == 3:
            ys = [y + 9, y + 20, y + 31]
        else:
            ys = [y + 20]
        inset = 4 if base in ("or", "xor", "xnor") else 0
        ins = [(x + inset, yy) for yy in ys]
    if bubble:
        body += f'<circle cx="{bx}" cy="{y+20}" r="4" fill="white" stroke="{INK}" stroke-width="1.8"/>'
    if label:
        body += text(x + 22, y + 20, label, 12, "middle", GRAY, "600")
    return body, ins, out


def box(x, y, w, h, pins, title=None, fill="white", stroke=INK):
    """Bloco genérico (flip-flop). pins: list of (side, frac, label, kind, key)
    kind: '' normal, 'clk' (triângulo), 'clkn' (triângulo + bolha), 'inv' (bolha), 'over' (rótulo barrado)
    Retorna svg, dict key->(x,y) do ponto de conexão externo."""
    s = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="{fill}" stroke="{stroke}" stroke-width="1.8"/>'
    pts = {}
    for side, frac, label, kind, key in pins:
        over = "over" in kind
        bub = "inv" in kind or kind == "clkn"
        if side == "L":
            px, py = x, y + h * frac
            ext = (px - (8 if bub else 0), py)
            if kind.startswith("clk"):
                s += f'<path d="M{px},{py-7} L{px+10},{py} L{px},{py+7}" fill="none" stroke="{INK}" stroke-width="1.6"/>'
                s += text(px + 13, py, label, 11, "start", INK, "600")
            else:
                s += text(px + 5, py, label, 12, "start", INK, "600", over)
            if bub:
                s += f'<circle cx="{px-4}" cy="{py}" r="4" fill="white" stroke="{INK}" stroke-width="1.6"/>'
        elif side == "R":
            px, py = x + w, y + h * frac
            ext = (px + (8 if bub else 0), py)
            s += text(px - 5, py, label, 12, "end", INK, "600", over)
            if bub:
                s += f'<circle cx="{px+4}" cy="{py}" r="4" fill="white" stroke="{INK}" stroke-width="1.6"/>'
        elif side == "T":
            px, py = x + w * frac, y
            ext = (px, py - (8 if bub else 0))
            s += text(px, py + 10, label, 10, "middle", INK, "600", over)
            if bub:
                s += f'<circle cx="{px}" cy="{py-4}" r="4" fill="white" stroke="{INK}" stroke-width="1.6"/>'
        else:  # B
            px, py = x + w * frac, y + h
            ext = (px, py + (8 if bub else 0))
            s += text(px, py - 10, label, 10, "middle", INK, "600", over)
            if bub:
                s += f'<circle cx="{px}" cy="{py+4}" r="4" fill="white" stroke="{INK}" stroke-width="1.6"/>'
        pts[key] = ext
    if title:
        s += text(x + w / 2, y - 12, title, 12, "middle", NAVY, "700")
    return s, pts


# ---------------------------------------------------------------- formas de onda
def waveform(signals, slot=22, row=38, left=70, top=26, marks=None, edges=None,
             shade=None, notes=None, slot_labels=None, right=20, hi=0.62):
    """signals: list of dict(name, vals, color, over, kind)
       vals por slot: 0, 1, 'x' (inválido / indefinido, hachurado), None (em branco)
       marks: lista de índices de slot para linhas verticais tracejadas
       edges: lista de (slot, cor) -> setas em bordas
       shade: lista de (slot_ini, slot_fim, cor, rotulo)
    """
    n = max(len(s["vals"]) for s in signals)
    W = left + n * slot + right
    H = top + len(signals) * row + (26 if slot_labels else 8)
    b = []
    if shade:
        for a, z, col, lab in shade:
            b.append(f'<rect x="{left+a*slot}" y="{top-14}" width="{(z-a)*slot}" height="{len(signals)*row+8}" fill="{col}" opacity="0.13"/>')
            if lab:
                b.append(text(left + (a + z) / 2 * slot, top - 18, lab, 10, "middle", col, "700"))
    if marks:
        for m in marks:
            b.append(line([(left + m * slot, top - 10), (left + m * slot, top + len(signals) * row - 8)], GRAY, 1, "3,3"))
    for i, sig in enumerate(signals):
        y0 = top + i * row + row * 0.5
        yh = y0 - row * hi / 2 - 0 + 0
        yl = y0 + row * hi / 2
        col = sig.get("color", INK)
        b.append(text(left - 12, y0, sig["name"], 13, "end", col, "700", sig.get("over", False)))
        b.append(line([(left, yl + 4), (left + n * slot, yl + 4)], "#e4e7ec", 1))
        vals = sig["vals"]
        pts = []
        prev = None
        for k, v in enumerate(vals):
            xa, xb = left + k * slot, left + (k + 1) * slot
            if v == "x":
                b.append(f'<rect x="{xa}" y="{yh}" width="{slot}" height="{yl-yh}" fill="url(#hatch)" stroke="none"/>')
                if pts:
                    b.append(line(pts, col, 2.2))
                    pts = []
                prev = "x"
                continue
            if v is None:
                if pts:
                    b.append(line(pts, col, 2.2))
                    pts = []
                prev = None
                continue
            yy = yh if v else yl
            if not pts:
                pts = [(xa, yy)]
            elif prev != v:
                pts.append((xa, yy))
            pts.append((xb, yy))
            prev = v
        if pts:
            b.append(line(pts, col, 2.2))
    if edges:
        for k, colr in edges:
            x = left + k * slot
            b.append(f'<path d="M{x-4},{top-4} L{x},{top-12} L{x+4},{top-4}" fill="none" stroke="{colr}" stroke-width="1.6"/>')
    if slot_labels:
        for k, lab in slot_labels:
            b.append(text(left + k * slot, top + len(signals) * row + 10, lab, 10, "middle", GRAY, "600"))
    if notes:
        for x, y, s, c in notes:
            b.append(text(x, y, s, 10, "middle", c, "700"))
    return svg(W, H, "".join(b))


def clock(nper, half=1, start=0, lead=0):
    """Clock com nper períodos; cada nível dura 'half' slots. start=0 -> começa em 0."""
    v = [start] * lead
    for _ in range(nper):
        a = start
        v += [a] * half + [1 - a] * half
    return v


# ---------------------------------------------------------------- diagramas de estado
def state_diagram(nodes, edges, w, h, r=26, node_color=BLUE):
    """nodes: dict name->(x,y,label,sub)  edges: list (a,b,label,bend, label_pos_offset)
    bend: curvatura (px). self-loop quando a==b; bend = ângulo em graus da alça."""
    b = []
    for e in edges:
        a, c, lab = e[0], e[1], e[2]
        bend = e[3] if len(e) > 3 else 0
        lofs = e[4] if len(e) > 4 else (0, 0)
        x1, y1 = nodes[a][0], nodes[a][1]
        x2, y2 = nodes[c][0], nodes[c][1]
        if a == c:
            ang = math.radians(bend)
            ux, uy = math.cos(ang), math.sin(ang)
            px, py = -uy, ux
            sx, sy = x1 + r * (ux * math.cos(0.45) + px * math.sin(0.45)), y1 + r * (uy * math.cos(0.45) + py * math.sin(0.45))
            ex, ey = x1 + r * (ux * math.cos(-0.45) + px * math.sin(-0.45)), y1 + r * (uy * math.cos(-0.45) + py * math.sin(-0.45))
            c1 = (x1 + (r + 34) * ux + 22 * px, y1 + (r + 34) * uy + 22 * py)
            c2 = (x1 + (r + 34) * ux - 22 * px, y1 + (r + 34) * uy - 22 * py)
            b.append(f'<path d="M{sx:.1f},{sy:.1f} C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {ex:.1f},{ey:.1f}" fill="none" stroke="{INK}" stroke-width="1.6" marker-end="url(#arr)"/>')
            lx, ly = x1 + (r + 40) * ux + lofs[0], y1 + (r + 40) * uy + lofs[1]
            b.append(f'<rect x="{lx-20}" y="{ly-9}" width="40" height="18" rx="4" fill="white" opacity="0.9"/>')
            b.append(text(lx, ly, lab, 12, "middle", ORANGE, "700"))
            continue
        dx, dy = x2 - x1, y2 - y1
        L = math.hypot(dx, dy)
        ux, uy = dx / L, dy / L
        px, py = -uy, ux
        mx, my = (x1 + x2) / 2 + px * bend, (y1 + y2) / 2 + py * bend
        # pontos na borda dos círculos, direção ao ponto de controle
        def edge_pt(cx, cy, tx, ty):
            ddx, ddy = tx - cx, ty - cy
            l = math.hypot(ddx, ddy)
            return cx + ddx / l * r, cy + ddy / l * r
        sx, sy = edge_pt(x1, y1, mx, my)
        ex, ey = edge_pt(x2, y2, mx, my)
        cx, cy = 2 * mx - (sx + ex) / 2, 2 * my - (sy + ey) / 2
        b.append(f'<path d="M{sx:.1f},{sy:.1f} Q{cx:.1f},{cy:.1f} {ex:.1f},{ey:.1f}" fill="none" stroke="{INK}" stroke-width="1.6" marker-end="url(#arr)"/>')
        off = (16 if bend > 0 else -16) if bend != 0 else -14
        lx, ly = mx + px * off + lofs[0], my + py * off + lofs[1]
        if lab:
            b.append(f'<rect x="{lx-20}" y="{ly-9}" width="40" height="18" rx="4" fill="white" opacity="0.9"/>')
            b.append(text(lx, ly, lab, 12, "middle", ORANGE, "700"))
    for name, nd in nodes.items():
        x, y, lab = nd[0], nd[1], nd[2]
        sub = nd[3] if len(nd) > 3 else None
        col = nd[4] if len(nd) > 4 else node_color
        b.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{col}" stroke="{NAVY}" stroke-width="2"/>')
        if sub:
            b.append(text(x, y - 6, lab, 14, "middle", "white", "700"))
            b.append(text(x, y + 9, sub, 11, "middle", "white", "600"))
        else:
            b.append(text(x, y, lab, 15, "middle", "white", "700"))
    return svg(w, h, "".join(b))


# ---------------------------------------------------------------- simuladores
def sim_sr_nor(S, R, q0=0):
    Q, Qn = [], []
    q = q0
    for s, r in zip(S, R):
        if s and r:
            Q.append(0); Qn.append(0); q = None
            continue
        if s:
            q = 1
        elif r:
            q = 0
        elif q is None:
            q = "x"
        if q == "x":
            Q.append("x"); Qn.append("x")
        else:
            Q.append(q); Qn.append(1 - q)
    return Q, Qn


def sim_sr_nand(Sn, Rn, q0=0):
    Q, Qn = [], []
    q = q0
    for s, r in zip(Sn, Rn):
        if s == 0 and r == 0:
            Q.append(1); Qn.append(1); q = None
            continue
        if s == 0:
            q = 1
        elif r == 0:
            q = 0
        elif q is None:
            q = "x"
        if q == "x":
            Q.append("x"); Qn.append("x")
        else:
            Q.append(q); Qn.append(1 - q)
    return Q, Qn


def sim_ff(kind, clk, ins, q0=0, edge="rise"):
    """kind: 'D','T','JK','SR'. ins: dict de listas. Retorna Q por slot.
    Amostra entradas no slot anterior à borda."""
    q = q0
    out = []
    for k in range(len(clk)):
        if k > 0:
            rising = clk[k - 1] == 0 and clk[k] == 1
            falling = clk[k - 1] == 1 and clk[k] == 0
            fire = rising if edge == "rise" else falling
            if fire and q != "x":
                i = k - 1
                if kind == "D":
                    q = ins["D"][i]
                elif kind == "T":
                    q = (1 - q) if ins["T"][i] else q
                elif kind == "JK":
                    j, kk = ins["J"][i], ins["K"][i]
                    if j and kk:
                        q = 1 - q
                    elif j:
                        q = 1
                    elif kk:
                        q = 0
                elif kind == "SR":
                    s, r = ins["S"][i], ins["R"][i]
                    if s and r:
                        q = "x"
                    elif s:
                        q = 1
                    elif r:
                        q = 0
        out.append(q)
    return out


def edges_of(clk, edge="rise"):
    r = []
    for k in range(1, len(clk)):
        if edge == "rise" and clk[k - 1] == 0 and clk[k] == 1:
            r.append(k)
        if edge == "fall" and clk[k - 1] == 1 and clk[k] == 0:
            r.append(k)
    return r
