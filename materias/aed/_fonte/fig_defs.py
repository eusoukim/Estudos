from aedfigs import *

F = {}

# ======================================================== 1. TAD
def tad_camadas():
    b = ""
    cols = [("Programa do usuário", "main.c", "usa só as operações:\npilha_empilhar(p, 7);\nx = pilha_desempilhar(p);", YEL),
            ("Interface", "pilha.h", "o QUE existe:\ntypedef struct pilha PILHA;\nPILHA *pilha_criar(void);\nbool pilha_empilhar(...);", MAT),
            ("Implementação", "pilha.c", "o COMO é feito:\nstruct pilha {\n  int itens[MAX];\n  int topo;\n};", SOFT)]
    for i, (t, f, body, c) in enumerate(cols):
        x = 20 + i * 250
        b += rect(x, 20, 210, 190, c, shadow=True, rx=8)
        b += text(x + 105, 44, t, 15, sans=True) + text(x + 105, 66, f, 12, color=INK, weight="600")
        b += f'<line x1="{x+12}" y1="80" x2="{x+198}" y2="80" stroke="{INK}" stroke-width="1.5" stroke-dasharray="4 3"/>'
        for j, ln in enumerate(body.split("\n")):
            b += text(x + 14, 100 + j * 19, ln.replace("<", "&lt;"), 11.5, "start", INK, "600" if j == 0 else "500")
        if i < 2:
            b += arrow([(x + 214, 115), (x + 246, 115)])
    b += text(380, 238, "O usuário só enxerga a interface. A implementação pode mudar sem quebrar o programa dele.", 12.5, sans=True, weight="600")
    return svg(780, 254, b)
F["tad_camadas"] = tad_camadas()

# ======================================================== 2. PILHA
def stack_col(x, y, vals, top_lab=True, fill_top=MAT, cw=70, ch=34, cap=5, title=None):
    s = ""
    if title:
        s += text(x + cw / 2, y - 18, title, 12, sans=True)
    # contorno de "copo"
    s += f'<polyline points="{x-6},{y} {x-6},{y+cap*ch+6} {x+cw+6},{y+cap*ch+6} {x+cw+6},{y}" fill="none" stroke="{INK}" stroke-width="3"/>'
    for i, v in enumerate(vals):
        yy = y + (cap - 1 - i) * ch + 3
        f = fill_top if i == len(vals) - 1 else PAPER
        s += rect(x, yy, cw, ch - 4, f, rx=3) + text(x + cw / 2, yy + (ch - 4) / 2 + 1, v, 15)
    if vals and top_lab:
        yy = y + (cap - len(vals)) * ch + (ch - 4) / 2 + 3
        s += arrow([(x + cw + 46, yy), (x + cw + 10, yy)], BLUE) + text(x + cw + 50, yy, "topo", 12, "start", BLUE)
    elif top_lab:
        s += text(x + cw / 2, y + cap * ch / 2, "vazia", 12, color=GRAY)
    return s


def pilha_ops():
    seq = [([], "criar"), (["A"], "push(A)"), (["A", "B"], "push(B)"), (["A", "B", "C"], "push(C)"), (["A", "B"], "pop() → C"), (["A", "B", "D"], "push(D)")]
    b = ""
    for i, (v, lab) in enumerate(seq):
        x = 20 + i * 132
        b += stack_col(x, 30, v, top_lab=(i in (3, 5)), cap=4)
        b += text(x + 35, 186, lab, 12.5, color=INK)
    return svg(80 + 6 * 132, 204, b)
F["pilha_ops"] = pilha_ops()


def pilha_seq():
    b = array(30, 60, ["A", "B", "C", None, None, None], fills={2: MAT}, labels={2: "topo = 2"})
    b += text(30, 140, "itens[0..MAX-1]: o topo é o índice do último elemento; vazia ⇔ topo == -1; cheia ⇔ topo == MAX-1", 12, "start", INK, "600", sans=True)
    return svg(760, 160, b)
F["pilha_seq"] = pilha_seq()


def pilha_enc():
    s, w, an = linked(20, 60, ["C", "B", "A"], head="topo", fills={0: MAT})
    s += text(20, 130, "cada push cria um nó NO INÍCIO; pop remove o primeiro nó: tudo O(1), sem limite fixo", 12, "start", INK, "600", sans=True)
    return svg(max(w, 720), 150, s)
F["pilha_enc"] = pilha_enc()

# ======================================================== 3. FILA
def fila_problema():
    b = text(20, 22, "fila sequencial \"ingênua\": início e fim só andam para a direita", 13, "start", sans=True)
    b += array(30, 80, [None, None, None, "D", "E", "F"], fills={3: MAT, 5: YEL}, labels={3: "início", 5: "fim"})
    b += text(30, 160, "Sobrou espaço à esquerda, mas a fila parece cheia. Solução: tratar o vetor como um anel (fila circular).", 12, "start", RED, "600", sans=True)
    return svg(760, 180, b)
F["fila_problema"] = fila_problema()


def fila_circular():
    b = ""
    cx, cy, R1, R2 = 170, 160, 70, 128
    n = 8
    vals = {2: "B", 3: "C", 4: "D", 5: "E"}
    for i in range(n):
        a0 = -math.pi / 2 + i * 2 * math.pi / n
        a1 = a0 + 2 * math.pi / n
        p = [(cx + R2 * math.cos(a0), cy + R2 * math.sin(a0)), (cx + R2 * math.cos(a1), cy + R2 * math.sin(a1)),
             (cx + R1 * math.cos(a1), cy + R1 * math.sin(a1)), (cx + R1 * math.cos(a0), cy + R1 * math.sin(a0))]
        f = MAT if i == 2 else (YEL if i == 5 else (PAPER if i in vals else SOFT))
        b += (f'<path d="M{p[0][0]:.1f},{p[0][1]:.1f} A{R2},{R2} 0 0 1 {p[1][0]:.1f},{p[1][1]:.1f} L{p[2][0]:.1f},{p[2][1]:.1f} '
              f'A{R1},{R1} 0 0 0 {p[3][0]:.1f},{p[3][1]:.1f} Z" fill="{f}" stroke="{INK}" stroke-width="2.5"/>')
        am = (a0 + a1) / 2
        b += text(cx + (R1 + R2) / 2 * math.cos(am), cy + (R1 + R2) / 2 * math.sin(am), vals.get(i, ""), 16)
        b += text(cx + (R2 + 16) * math.cos(am), cy + (R2 + 16) * math.sin(am), i, 11, color=GRAY, weight="600")
    b += text(cx, cy - 8, "MAX = 8", 12, color=GRAY) + text(cx, cy + 12, "qtd = 4", 12, color=GRAY)
    b += text(360, 60, "início = 2 (próximo a sair)", 13, "start", INK, sans=True)
    b += f'<rect x="340" y="52" width="14" height="14" fill="{MAT}" stroke="{INK}" stroke-width="2"/>'
    b += text(360, 90, "fim = 5 (último que entrou)", 13, "start", INK, sans=True)
    b += f'<rect x="340" y="82" width="14" height="14" fill="{YEL}" stroke="{INK}" stroke-width="2"/>'
    b += text(340, 140, "avançar:  i = (i + 1) % MAX", 13, "start", BLUE)
    b += text(340, 170, "depois do índice 7 vem o 0", 12, "start", GRAY, "600", sans=True)
    b += text(340, 210, "vazia ⇔ qtd == 0", 12.5, "start")
    b += text(340, 234, "cheia ⇔ qtd == MAX", 12.5, "start")
    return svg(640, 310, b)
F["fila_circular"] = fila_circular()


def fila_enc():
    s, w, an = linked(20, 70, ["A", "B", "C", "D"], head="início", fills={0: MAT, 3: YEL}, tail_label="fim")
    s += text(20, 140, "entra no fim (O(1) graças ao ponteiro fim), sai do início (O(1))", 12, "start", INK, "600", sans=True)
    return svg(max(w, 560), 160, s)
F["fila_enc"] = fila_enc()


def deque_fig():
    b = array(140, 70, ["B", "C", "D", "E"], cw=56, fills={0: MAT, 3: YEL}, idx=False)
    b += arrow([(40, 80), (130, 80)]) + arrow([(130, 102), (40, 102)])
    b += text(85, 64, "insere início", 11, color=INK, weight="600") + text(85, 120, "remove início", 11, color=INK, weight="600")
    b += arrow([(372, 80), (460, 80)]) + arrow([(460, 102), (372, 102)])
    b += text(416, 64, "remove fim", 11, color=INK, weight="600") + text(416, 120, "insere fim", 11, color=INK, weight="600")
    b += text(252, 30, "Deque: as duas pontas aceitam inserir e remover", 13, sans=True)
    return svg(500, 150, b)
F["deque"] = deque_fig()

# ======================================================== 4. LISTAS
def lista_seq_ins():
    b = text(20, 20, "inserir 25 na posição 2 (lista ordenada): desloca o final uma casa para a direita", 13, "start", sans=True)
    b += array(30, 50, [10, 20, 30, 40, 50, None], fills={2: SOFT, 3: SOFT, 4: SOFT})
    for i in (4, 3, 2):
        x = 30 + i * 46 + 23
        b += curve(x, 50, x + 23, 26, x + 44, 48, RED, 2)
    b += text(330, 70, "→", 22)
    b += array(360, 50, [10, 20, 25, 30, 40, 50], fills={2: YEL})
    b += text(30, 126, "custo: até n deslocamentos ⇒ O(n). Acesso ao i-ésimo: O(1).", 12, "start", INK, "600", sans=True)
    return svg(660, 144, b)
F["lista_seq_ins"] = lista_seq_ins()


def lista_simples():
    s, w, _ = linked(20, 40, [3, 8, 12, 20], head="L")
    return svg(w, 100, s)
F["lista_simples"] = lista_simples()


def lista_ins():
    b = text(20, 18, "inserir 10 depois do nó 8:  novo->prox = p->prox;  p->prox = novo;", 13, "start", sans=True)
    s, w, an = linked(20, 60, [3, 8, 12, 20], head="L", fills={1: MAT})
    b += s
    a8, a12 = an[1], an[2]
    nx, ny = (a8["r"][0] + a12["l"][0]) / 2 - 41, 150
    ns, na = node(nx, ny, 10, YEL)
    b += ns
    b += arrow([na["next"], (a12["bot"][0], a12["bot"][1] + 2)], RED, 2.6)
    b += arrow([(a8["next"][0], a8["next"][1] + 6), (a8["next"][0], ny + 20), (na["l"][0] - 2, ny + 20)], RED, 2.6, dash="0")
    b += text(a8["top"][0], 44, "p", 12, color=BLUE)
    b += text(nx + 41, 210, "novo", 12, color=BLUE)
    b += text(560, 160, "1º liga o novo ao seguinte", 11.5, "start", RED, "600", sans=True)
    b += text(560, 180, "2º liga p ao novo", 11.5, "start", RED, "600", sans=True)
    b += text(560, 200, "(a ordem importa!)", 11.5, "start", RED, "600", sans=True)
    return svg(max(w, 760), 226, b)
F["lista_ins"] = lista_ins()


def lista_dupla():
    s, w, _ = linked(40, 50, [3, 8, 12], kind="dupla", head="L")
    return svg(w + 20, 110, s)
F["lista_dupla"] = lista_dupla()


def lista_circ():
    s, w, _ = linked(20, 40, [3, 8, 12, 20], head="L", circular=True)
    s += text(20, 140, "o último aponta para o primeiro: dá para percorrer tudo a partir de qualquer nó", 12, "start", INK, "600", sans=True)
    return svg(max(w, 640), 156, s)
F["lista_circ"] = lista_circ()


def lista_cabeca():
    s, w, _ = linked(20, 50, ["cab", 3, 8, 12], head="L", sentinel=True)
    s += text(20, 120, "nó-cabeça (sentinela): não guarda dado útil; a lista nunca fica \"sem primeiro nó\"", 12, "start", INK, "600", sans=True)
    s += text(20, 140, "⇒ inserir e remover no início viram o mesmo código do meio", 12, "start", INK, "600", sans=True)
    return svg(max(w, 640), 156, s)
F["lista_cabeca"] = lista_cabeca()


def gnode(x, y, tipo, val, fill=PAPER):
    """nó de lista generalizada: [tipo | info/sub | prox]"""
    s = f'<rect x="{x+4}" y="{y+4}" width="116" height="40" fill="{INK}"/>'
    s += rect(x, y, 26, 40, SOFT, rx=0) + rect(x + 26, y, 68, 40, fill, rx=0) + rect(x + 94, y, 22, 40, SOFT, rx=0)
    s += text(x + 13, y + 21, tipo, 12)
    s += text(x + 60, y + 21, val, 14)
    s += f'<circle cx="{x+105}" cy="{y+20}" r="3.5" fill="{INK}"/>'
    return s


def lista_gen():
    b = text(20, 18, "L = (a, (b, c), d)     tipo: A = átomo, S = sublista", 13, "start", sans=True)
    b += rect(20, 56, 40, 28, PAPER, rx=3) + text(40, 44, "L", 12, color=BLUE) + f'<circle cx="40" cy="70" r="3.5" fill="{INK}"/>'
    b += arrow([(40, 70), (88, 70)])
    xs = [90, 260, 430]
    b += gnode(xs[0], 50, "A", "a") + gnode(xs[1], 50, "S", "•", MAT) + gnode(xs[2], 50, "A", "d")
    b += arrow([(xs[0] + 105, 70), (xs[1] - 2, 70)]) + arrow([(xs[1] + 105, 70), (xs[2] - 2, 70)])
    b += arrow([(xs[2] + 105, 70), (xs[2] + 130, 70)], head=False) + null_mark(xs[2] + 130, 70)
    # sublista
    b += f'<circle cx="{xs[1]+60}" cy="70" r="4" fill="{INK}"/>'
    b += arrow([(xs[1] + 60, 74), (xs[1] + 60, 148)])
    b += gnode(xs[1], 150, "A", "b") + gnode(xs[1] + 170, 150, "A", "c")
    b += arrow([(xs[1] + 105, 170), (xs[1] + 168, 170)])
    b += arrow([(xs[1] + 275, 170), (xs[1] + 300, 170)], head=False) + null_mark(xs[1] + 300, 170)
    return svg(640, 210, b)
F["lista_gen"] = lista_gen()


def matriz_esparsa():
    b = text(20, 18, "Matriz 4×5 com 5 valores não nulos, em listas cruzadas", 13, "start", sans=True)
    # matriz à esquerda
    M = {(0, 1): 7, (1, 3): 2, (2, 0): 5, (2, 3): 9, (3, 4): 4}
    for i in range(4):
        for j in range(5):
            v = M.get((i, j), 0)
            b += rect(20 + j * 30, 40 + i * 30, 30, 30, MAT if v else PAPER, rx=0, sw=1.8)
            b += text(35 + j * 30, 56 + i * 30, v, 13, color=INK if v else GRAY, weight="700" if v else "500")
    b += text(95, 172, "matriz \"cheia\": 20 posições", 11.5, color=GRAY, weight="600", sans=True)
    # estrutura cruzada
    ox, oy, sx, sy = 260, 60, 100, 62
    for j in range(5):
        b += rect(ox + 60 + j * sx, oy - 24, 44, 24, SOFT, rx=3) + text(ox + 82 + j * sx, oy - 12, f"c{j}", 11)
    for i in range(4):
        b += rect(ox, oy + 16 + i * sy, 40, 28, SOFT, rx=3) + text(ox + 20, oy + 30 + i * sy, f"l{i}", 11)
    for (i, j), v in M.items():
        x, y = ox + 52 + j * sx, oy + 10 + i * sy
        b += f'<rect x="{x+3}" y="{y+3}" width="60" height="40" fill="{INK}"/>'
        b += rect(x, y, 60, 40, PAPER, rx=0)
        b += text(x + 30, y + 13, f"[{i},{j}]", 10, color=GRAY, weight="600") + text(x + 30, y + 29, v, 14)
    # setas de linha
    rows = {}
    for (i, j) in sorted(M):
        rows.setdefault(i, []).append(j)
    for i, js in rows.items():
        y = oy + 30 + i * sy
        prev = ox + 40
        for j in js:
            x = ox + 52 + j * sx
            b += arrow([(prev, y), (x - 2, y)])
            prev = x + 60
    cols = {}
    for (i, j) in sorted(M, key=lambda t: (t[1], t[0])):
        cols.setdefault(j, []).append(i)
    for j, is_ in cols.items():
        x = ox + 70 + j * sx + 12
        prev = oy
        for i in is_:
            y = oy + 10 + i * sy
            b += arrow([(x, prev), (x, y - 2)], BLUE, 1.8)
            prev = y + 40
    b += text(ox + 4, oy + 4 * sy + 26, "→ próximo na linha     ", 11.5, "start", INK, "600", sans=True)
    b += text(ox + 170, oy + 4 * sy + 26, "↓ próximo na coluna", 11.5, "start", BLUE, "600", sans=True)
    return svg(ox + 60 + 5 * sx + 10, oy + 4 * sy + 44, b)
F["matriz_esparsa"] = matriz_esparsa()

# ======================================================== 5. ÁRVORES
def arvore_termos():
    t = T("A", T("B", T("D"), T("E", T("H"))), T("C", None, T("F", T("G"))))
    s, w, h, pos = tree(t, dx=64, ox=70)
    for i in range(4):
        s += text(10, 34 + i * 74, f"nível {i}", 11, "start", GRAY, "600")
        s += f'<line x1="70" y1="{34+i*74}" x2="{w}" y2="{34+i*74}" stroke="{GRAY}" stroke-width="1" stroke-dasharray="3 5" opacity=".6"/>'
    return svg(w + 10, h + 10, s)
F["arvore_termos"] = arvore_termos()


def bin_tipos():
    a = T(1, T(2, T(4), T(5)), T(3, T(6), T(7)))
    b = T(1, T(2, T(4), T(5)), T(3, T(6)))
    c = T(1, None, T(2, None, T(3, None, T(4))))
    return side_by_side([tree_part(a, dx=40, dy=60), tree_part(b, dx=40, dy=60), tree_part(c, dx=40, dy=60)], gap=30,
                        titles=["cheia (perfeita)", "completa", "degenerada"], arrows=False)
F["bin_tipos"] = bin_tipos()


def percursos():
    t = T("A", T("B", T("D"), T("E")), T("C", None, T("F")))
    s, w, h, _ = tree(t, dx=60)
    s2 = text(w + 20, 40, "pré-ordem (R E D):  A B D E C F", 13, "start", INK)
    s2 += text(w + 20, 70, "em-ordem  (E R D):  D B E A C F", 13, "start", INK)
    s2 += text(w + 20, 100, "pós-ordem (E D R):  D E B F C A", 13, "start", INK)
    s2 += text(w + 20, 130, "em nível (largura): A B C D E F", 13, "start", INK)
    s2 += text(w + 20, 170, "R = raiz, E = subárvore esquerda,", 11.5, "start", GRAY, "600", sans=True)
    s2 += text(w + 20, 188, "D = subárvore direita", 11.5, "start", GRAY, "600", sans=True)
    return svg(w + 340, h + 10, s + s2)
F["percursos"] = percursos()

# ======================================================== 6. ABB
def abb_ex(hot_path=False):
    def N(k, l=None, r=None):
        return T(k, l, r)
    t = N(50, N(30, N(20, N(10)), N(40, N(35))), N(70, N(60), N(80, None, N(90))))
    if hot_path:  # busca 35
        t["fill"] = YEL; t["l"]["fill"] = YEL; t["l"]["hot"] = True
        t["l"]["r"]["fill"] = YEL; t["l"]["r"]["hot"] = True; t["l"]["r"]["l"]["fill"] = MAT; t["l"]["r"]["l"]["hot"] = True
    return t
F["abb_ex"] = tree_fig(abb_ex(), dx=52)
F["abb_busca"] = tree_fig(abb_ex(True), dx=52)


def abb_rem():
    # caso 1: folha
    a1 = T(50, T(30, T(20, fill=RED)), T(70))
    a2 = T(50, T(30), T(70))
    # caso 2: um filho
    b1 = T(50, T(30, T(20, T(10)), None, fill=RED), T(70))
    b2 = T(50, T(20, T(10)), T(70))
    # caso 3: dois filhos (sucessor)
    c1 = T(50, T(30), T(70, T(60, None, T(65)), T(80)), fill=RED)
    c1["r"]["l"]["fill"] = YEL
    c2 = T(60, T(30), T(70, T(65), T(80)), fill=YEL)
    p = [tree_part(x, dx=40, dy=58) for x in (a1, a2, b1, b2, c1, c2)]
    r1 = side_by_side(p[0:2], gap=56, titles=["1) remover 20 (folha)", ""])
    r2 = side_by_side(p[2:4], gap=56, titles=["2) remover 30 (um filho)", ""])
    r3 = side_by_side(p[4:6], gap=56, titles=["3) remover 50 (dois filhos)", "sucessor 60 sobe"])
    return r1, r2, r3
F["abb_rem1"], F["abb_rem2"], F["abb_rem3"] = abb_rem()


def abb_degen():
    a = T(10, None, T(20, None, T(30, None, T(40, None, T(50)))))
    b = T(30, T(20, T(10)), T(40, None, T(50)))
    return side_by_side([tree_part(a, dx=40, dy=50), tree_part(b, dx=46, dy=60)], gap=60,
                        titles=["inserindo 10,20,30,40,50: altura 5", "mesmas chaves em outra ordem: altura 3"])
F["abb_degen"] = abb_degen()

# ======================================================== 7. AVL
def avl_fb():
    t = T(40, T(20, T(10, fb=0), T(30, fb=0), fb=0), T(60, None, T(70, fb=0), fb=-1), fb=1)
    return tree_fig(t, dx=56)
F["avl_fb"] = avl_fb()


def rot(kind):
    if kind == "dir":  # LL -> rotação à direita
        before = T("C", T("B", T("A", T("T1", tri=True), T("T2", tri=True), fill=YEL), T("T3", tri=True), fill=MAT), T("T4", tri=True), fb=+2, fill=RED)
        after = T("B", T("A", T("T1", tri=True), T("T2", tri=True), fill=YEL), T("C", T("T3", tri=True), T("T4", tri=True), fill=RED), fill=MAT, fb=0)
        return side_by_side([tree_part(before, dx=44, dy=62), tree_part(after, dx=44, dy=62)], gap=70, titles=["caso LL: FB(C) = +2, FB(B) = +1", "rotação simples à direita em C"])
    if kind == "esq":
        before = T("A", T("T1", tri=True), T("B", T("T2", tri=True), T("C", T("T3", tri=True), T("T4", tri=True), fill=YEL), fill=MAT), fb=-2, fill=RED)
        after = T("B", T("A", T("T1", tri=True), T("T2", tri=True), fill=RED), T("C", T("T3", tri=True), T("T4", tri=True), fill=YEL), fill=MAT, fb=0)
        return side_by_side([tree_part(before, dx=44, dy=62), tree_part(after, dx=44, dy=62)], gap=70, titles=["caso RR: FB(A) = −2, FB(B) = −1", "rotação simples à esquerda em A"])
    # LR: dupla
    s0 = T("C", T("A", T("T1", tri=True), T("B", T("T2", tri=True), T("T3", tri=True), fill=YEL), fill=MAT), T("T4", tri=True), fb=+2, fill=RED)
    s1 = T("C", T("B", T("A", T("T1", tri=True), T("T2", tri=True), fill=MAT), T("T3", tri=True), fill=YEL), T("T4", tri=True), fill=RED)
    s2 = T("B", T("A", T("T1", tri=True), T("T2", tri=True), fill=MAT), T("C", T("T3", tri=True), T("T4", tri=True), fill=RED), fill=YEL, fb=0)
    return side_by_side([tree_part(s0, dx=40, dy=58), tree_part(s1, dx=40, dy=58), tree_part(s2, dx=40, dy=58)], gap=56,
                        titles=["caso LR: FB(C)=+2, FB(A)=−1", "1) esquerda em A", "2) direita em C"])
F["rot_dir"] = rot("dir")
F["rot_esq"] = rot("esq")
F["rot_dupla"] = rot("dupla")


def avl_seq():
    p1 = T(10, None, T(20, None, T(30, fill=YEL, fb=0), fb=-1), fb=-2, fill=RED)
    p2 = T(20, T(10, fb=0), T(30, fb=0), fb=0, fill=MAT)
    p3 = T(20, T(10, fb=0), T(30, None, T(40, None, T(50, fill=YEL), fb=-1), fb=-2, fill=RED), fb=-2)
    p4 = T(20, T(10, fb=0), T(40, T(30, fb=0), T(50, fb=0), fb=0, fill=MAT), fb=-1)
    parts = [tree_part(x, dx=38, dy=56) for x in (p1, p2, p3, p4)]
    return side_by_side(parts, gap=46, titles=["insere 10,20,30", "rot. esq. em 10", "insere 40, 50", "rot. esq. em 30"])
F["avl_seq"] = avl_seq()

# ======================================================== 8. RUBRO-NEGRA
def rn_ex():
    t = T(13, T(8, T(1, None, T(6, color="r"), color="b"), T(11, color="b"), color="r"),
          T(17, T(15, color="b"), T(25, T(22, color="r"), T(27, color="r"), color="b"), color="r"), color="b")
    s, w, h, _ = tree(t, dx=56, show_null=True)
    return svg(w + 10, h + 10, s)
F["rn_ex"] = rn_ex()


def rn_casos():
    # caso 1: tio vermelho -> recolore
    a = T("G", T("P", T("N", color="r", ring=True), None, color="r"), T("U", color="r"), color="b")
    a2 = T("G", T("P", T("N", color="r"), None, color="b"), T("U", color="b"), color="r", ring=True)
    r1 = side_by_side([tree_part(a, dx=46, dy=62), tree_part(a2, dx=46, dy=62)], gap=60,
                      titles=["caso 1: tio U vermelho", "recolore P, U e G; continua no avô"])
    # caso 3 (linha reta) -> rotação + troca de cores
    b = T("G", T("P", T("N", color="r", ring=True), T("T3", tri=True), color="r"), T("U", color="b"), color="b")
    b2 = T("P", T("N", color="r"), T("G", T("T3", tri=True), T("U", color="b"), color="r"), color="b")
    r3 = side_by_side([tree_part(b, dx=46, dy=62), tree_part(b2, dx=46, dy=62)], gap=60,
                      titles=["caso 3: tio preto, N em linha reta", "rotação no avô + troca cores de P e G"])
    # caso 2 (zigue-zague)
    c = T("G", T("P", T("T1", tri=True), T("N", color="r", ring=True), color="r"), T("U", color="b"), color="b")
    c2 = T("G", T("N", T("P", T("T1", tri=True), None, color="r"), None, color="r"), T("U", color="b"), color="b")
    r2 = side_by_side([tree_part(c, dx=46, dy=62), tree_part(c2, dx=46, dy=62)], gap=60,
                      titles=["caso 2: tio preto, N em zigue-zague", "rotação no pai ⇒ vira o caso 3"])
    return r1, r2, r3
F["rn_caso1"], F["rn_caso2"], F["rn_caso3"] = rn_casos()

# ======================================================== 9. HEAP
def heap_fig(vals, hl=None, hot=None, title=None, arr_y=None):
    hl = hl or {}
    nodes = [T(v, fill=hl.get(i, PAPER)) for i, v in enumerate(vals)]
    for i, nd in enumerate(nodes):
        if 2 * i + 1 < len(vals):
            nd["l"] = nodes[2 * i + 1]
        if 2 * i + 2 < len(vals):
            nd["r"] = nodes[2 * i + 2]
    for (i, j) in (hot or []):
        nodes[j]["hot"] = True
    for i, nd in enumerate(nodes):
        nd["lab"] = f"[{i}]"
    s, w, h, _ = tree(nodes[0], dx=46, dy=64)
    ay = h + 18
    s += array(20, ay, vals, cw=40, fills=hl)
    W = max(w, 40 + 40 * len(vals) + 10)
    return s, W, ay + 64


def heap_basico():
    s, w, h = heap_fig([90, 70, 80, 40, 50, 60, 30, 10, 20])
    s += text(w + 10, 60, "filho esq. de i:  2i + 1", 13, "start", BLUE)
    s += text(w + 10, 86, "filho dir. de i:  2i + 2", 13, "start", BLUE)
    s += text(w + 10, 112, "pai de i:  (i − 1) / 2", 13, "start", BLUE)
    s += text(w + 10, 150, "heap máximo: pai ≥ filhos", 13, "start", INK)
    s += text(w + 10, 174, "árvore completa ⇒ vetor sem buracos", 12, "start", GRAY, "600", sans=True)
    return svg(w + 300, h, s)
F["heap_basico"] = heap_basico()


def heap_sobe():
    p = []
    seqs = [([90, 70, 80, 40, 50, 60, 30, 10, 20, 85], {9: YEL}, [(4, 9)], "insere 85 no fim"),
            ([90, 70, 80, 40, 85, 60, 30, 10, 20, 50], {4: YEL}, [(1, 4)], "85 > 50: troca"),
            ([90, 85, 80, 40, 70, 60, 30, 10, 20, 50], {1: YEL}, [], "85 > 70: troca; 85 < 90: para")]
    for v, hl, hot, t in seqs:
        s, w, h = heap_fig(v, hl, hot)
        p.append((s, w, h))
    return side_by_side(p, gap=40, titles=[x[3] for x in seqs])
F["heap_sobe"] = heap_sobe()


def heap_desce():
    p = []
    seqs = [([20, 70, 80, 40, 50, 60, 30, 10], {0: YEL}, "remove 90: último (20) vai para a raiz"),
            ([80, 70, 20, 40, 50, 60, 30, 10], {2: YEL}, "troca com o MAIOR filho (80)"),
            ([80, 70, 60, 40, 50, 20, 30, 10], {5: YEL}, "troca com 60; vira folha: para")]
    for v, hl, t in seqs:
        s, w, h = heap_fig(v, hl)
        p.append((s, w, h))
    return side_by_side(p, gap=40, titles=[x[2] for x in seqs])
F["heap_desce"] = heap_desce()

# ======================================================== gabarito
F["gab_abb"] = tree_fig(T(45, T(20, T(10), T(30, None, T(35))), T(70, T(50, None, T(60)), T(90))), dx=50)
F["gab_avl"] = tree_fig(T(30, T(20, T(10, fb=0), T(25, fb=0), fb=0), T(40, None, T(50, fb=0), fb=-1), fb=0), dx=50)
_s, _w, _h = heap_fig([95, 60, 90, 40, 50, 80, 30])
F["gab_heap"] = svg(_w + 10, _h, _s)
