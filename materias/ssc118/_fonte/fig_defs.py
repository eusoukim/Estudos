from figs import *

F = {}

# ======================================================== CAP 0/1
def roadmap():
    b = []
    items = [("1", "Sequencial ×\nCombinacional", 20), ("2", "Latches", 150), ("3", "Tempo &\nClock", 280),
             ("4", "Flip-Flops", 410), ("5", "Contadores\nassíncronos", 540)]
    items2 = [("6", "Contadores\nsíncronos", 540), ("7", "Registradores", 410), ("8", "Memórias", 280), ("9", "Máquinas de\nEstados", 150)]
    def node(n, lab, x, y, col):
        s = f'<rect x="{x}" y="{y}" width="112" height="56" rx="10" fill="{col}" stroke="{NAVY}" stroke-width="1.5"/>'
        s += f'<circle cx="{x+14}" cy="{y+14}" r="10" fill="{NAVY}"/>' + text(x + 14, y + 14, n, 11, "middle", "white", "700")
        ls = lab.split("\n")
        for i, l in enumerate(ls):
            s += text(x + 62, y + 28 + (i - (len(ls) - 1) / 2) * 15, l, 12.5, "middle", INK, "600")
        return s
    for i, (n, l, x) in enumerate(items):
        b.append(node(n, l, x, 20, "#e7f0fb"))
        if i < len(items) - 1:
            b.append(line([(x + 114, 48), (x + 128, 48)], NAVY, 2, arrow="arr"))
    b.append(line([(596, 78), (596, 112)], NAVY, 2, arrow="arr"))
    for i, (n, l, x) in enumerate(items2):
        b.append(node(n, l, x, 114, "#fdf0e6" if n != "9" else "#e9f7ec"))
        if i < len(items2) - 1:
            b.append(line([(x - 2, 142), (x - 16, 142)], NAVY, 2, arrow="arr"))
    b.append(text(20, 196, "Cada capítulo usa o anterior: o latch é feito de portas, o flip-flop é um latch com clock, contadores e registradores são grupos de flip-flops,", 11, "start", GRAY))
    b.append(text(20, 212, "memórias são grandes conjuntos de registradores, e a máquina de estados é a ideia geral por trás de tudo.", 11, "start", GRAY))
    return svg(672, 222, "".join(b))
F["mapa"] = roadmap()


def comb_vs_seq():
    b = []
    # combinacional
    b.append(text(150, 14, "Combinacional", 14, "middle", NAVY, "700"))
    b.append(f'<rect x="80" y="40" width="140" height="80" rx="8" fill="#e7f0fb" stroke="{NAVY}" stroke-width="1.8"/>')
    b.append(text(150, 72, "Portas lógicas", 13, "middle", INK, "600"))
    b.append(text(150, 90, "(só AND/OR/NOT...)", 11, "middle", GRAY))
    for y in (60, 80, 100):
        b.append(line([(20, y), (78, y)], INK, 1.6, arrow="arr"))
        b.append(line([(222, y), (280, y)], INK, 1.6, arrow="arr"))
    b.append(text(40, 130, "Entradas", 11, "middle", GRAY, "600"))
    b.append(text(258, 130, "Saídas", 11, "middle", GRAY, "600"))
    b.append(text(150, 160, "Saída = f(entradas AGORA)", 12, "middle", ORANGE, "700"))
    # sequencial
    ox = 330
    b.append(text(ox + 170, 14, "Sequencial", 14, "middle", NAVY, "700"))
    b.append(f'<rect x="{ox+60}" y="40" width="130" height="80" rx="8" fill="#e7f0fb" stroke="{NAVY}" stroke-width="1.8"/>')
    b.append(text(ox + 125, 72, "Portas lógicas", 13, "middle", INK, "600"))
    b.append(text(ox + 125, 90, "combinacionais", 11, "middle", GRAY))
    b.append(f'<rect x="{ox+230}" y="40" width="100" height="80" rx="8" fill="#fdf0e6" stroke="{ORANGE}" stroke-width="1.8"/>')
    b.append(text(ox + 280, 72, "Memória", 13, "middle", INK, "600"))
    b.append(text(ox + 280, 90, "(estado)", 11, "middle", GRAY))
    for y in (60, 80, 100):
        b.append(line([(ox, y), (ox + 58, y)], INK, 1.6, arrow="arr"))
    b.append(line([(ox + 192, 64), (ox + 228, 64)], INK, 1.6, arrow="arr"))
    b.append(text(ox + 210, 54, "próximo", 9, "middle", GRAY))
    b.append(line([(ox + 192, 100), (ox + 200, 100), (ox + 200, 30), (ox + 360, 30)], INK, 1.6, arrow="arr"))
    b.append(text(ox + 356, 44, "Saídas", 11, "end", GRAY, "600"))
    b.append(line([(ox + 332, 80), (ox + 345, 80), (ox + 345, 140), (ox + 40, 140), (ox + 40, 112), (ox + 58, 112)], ORANGE, 2, arrow="arrO"))
    b.append(text(ox + 195, 152, "realimentação: estado atual volta para a lógica", 11, "middle", ORANGE, "600"))
    b.append(line([(ox + 280, 172), (ox + 280, 122)], INK, 1.6, arrow="arr"))
    b.append(text(ox + 296, 176, "Clock", 11, "start", INK, "700"))
    b.append(text(ox + 20, 130, "Entradas", 11, "middle", GRAY, "600"))
    b.append(text(ox + 140, 190, "Saída = f(entradas, ESTADO guardado)", 12, "middle", ORANGE, "700"))
    return svg(700, 200, "".join(b))
F["comb_seq"] = comb_vs_seq()


def lamps():
    b = []
    cols = ["#adb5bd"] * 3
    seqs = [(1, "t₁"), (2, "t₂"), (3, "t₃")]
    for k, (on, t) in enumerate(seqs):
        ox = 20 + k * 175
        b.append(f'<rect x="{ox}" y="10" width="160" height="80" rx="10" fill="#f8f9fb" stroke="#d0d5dd"/>')
        b.append(text(ox + 80, 24, f"instante {t}", 11, "middle", GRAY, "600"))
        for i in range(3):
            lit = (i + 1) == on
            c = "#fab005" if lit else "#dee2e6"
            b.append(f'<circle cx="{ox+35+i*45}" cy="56" r="15" fill="{c}" stroke="{INK}" stroke-width="1.4"/>')
            b.append(text(ox + 35 + i * 45, 56, str(i + 1), 12, "middle", INK, "700"))
        if k < 2:
            b.append(line([(ox + 162, 50), (ox + 173, 50)], INK, 1.6, arrow="arr"))
    b.append(line([(548, 50), (566, 50)], RED, 2, arrow="arr"))
    b.append(f'<path d="M580,66 L580,44 Q580,30 594,30 L606,30 Q620,30 620,44 L620,66 Z" fill="{RED}"/>')
    b.append(f'<rect x="574" y="66" width="52" height="7" rx="2" fill="{RED}"/>')
    b.append(text(600, 90, "ALARME!", 12, "middle", RED, "700"))
    b.append(text(330, 112, "Olhando só o instante t₃ (lâmpada 3 acesa) não dá para saber se deve tocar: é preciso lembrar o que veio antes.", 11.5, "middle", INK))
    return svg(660, 122, "".join(b))
F["lampadas"] = lamps()


def classif():
    n = 30
    ast = clock(7, 2, 0, 2)[:n]
    trig = [0] * n; trig[5] = 1; trig[20] = 1
    mono = [0] * n
    for k in range(6, 13): mono[k] = 1
    for k in range(21, 28): mono[k] = 1
    S = [0] * n; S[5] = 1
    R = [0] * n; R[20] = 1
    bi = [0] * 6 + [1] * 15 + [0] * 9
    return waveform([
        dict(name="Astável", vals=ast, color=BLUE),
        dict(name="disparo", vals=trig, color=GRAY),
        dict(name="Monoestável", vals=mono, color=GREEN),
        dict(name="S (liga)", vals=S, color=GRAY),
        dict(name="R (desliga)", vals=R, color=GRAY),
        dict(name="Biestável", vals=bi, color=ORANGE),
    ], slot=17, row=30, left=100,
        notes=[(100 + 9.5 * 17, 100 + 0, "", GRAY)])
F["classif"] = classif()


# ======================================================== CAP 2 — LATCHES
def latch(kind="nor"):
    b = []
    g = kind
    s1, i1, o1 = gate(g, 140, 30)
    s2, i2, o2 = gate(g, 140, 130)
    b += [s1, s2]
    if kind == "nor":
        tin, bin_, tout, bout = ("R", False), ("S", False), ("Q", False), ("Q", True)
        tl, bl = "RESET", "SET"
    else:
        tin, bin_, tout, bout = ("S", True), ("R", True), ("Q", False), ("Q", True)
        tl, bl = "SET", "RESET"
    b.append(line([(40, i1[0][1]), i1[0]]))
    b.append(pin(40, i1[0][1], tin[0], "left", INK, tin[1]))
    b.append(text(14, i1[0][1] - 16, tl, 9, "start", GRAY, "700"))
    b.append(line([(40, i2[1][1]), i2[1]]))
    b.append(pin(40, i2[1][1], bin_[0], "left", INK, bin_[1]))
    b.append(text(14, i2[1][1] + 16, bl, 9, "start", GRAY, "700"))
    b.append(line([o1, (330, o1[1])]))
    b.append(pin(330, o1[1], tout[0], "right", INK, tout[1], 14))
    b.append(line([o2, (330, o2[1])]))
    b.append(pin(330, o2[1], bout[0], "right", INK, bout[1], 14))
    # realimentação
    b.append(line([(240, o1[1]), (240, 82), (118, 116), (118, i2[0][1]), i2[0]], RED, 2))
    b.append(dot(240, o1[1], RED))
    b.append(line([(262, o2[1]), (262, 118), (104, 84), (104, i1[1][1]), i1[1]], GREEN, 2))
    b.append(dot(262, o2[1], GREEN))
    return svg(380, 190, "".join(b))
F["latch_nor"] = latch("nor")
F["latch_nand"] = latch("nand")


def gate_symbols():
    b = []
    kinds = [("not", "NOT", "Y = A̅"), ("and", "AND", "Y = A·B"), ("or", "OR", "Y = A+B"),
             ("nand", "NAND", "Y = (A·B)̅"), ("nor", "NOR", "Y = (A+B)̅"), ("xor", "XOR", "Y = A⊕B")]
    for i, (k, nm, eq) in enumerate(kinds):
        x = 20 + i * 112
        s, ins, out = gate(k, x + 22, 26, 1 if k == "not" else 2)
        b.append(s)
        for p in ins:
            b.append(line([(x + 6, p[1]), p]))
        b.append(line([out, (out[0] + 12, out[1])]))
        b.append(text(x + 52, 12, nm, 13, "middle", NAVY, "700"))
        b.append(text(x + 52, 84, eq, 11, "middle", INK, "600"))
    return svg(690, 96, "".join(b))
F["portas"] = gate_symbols()


def wave_nor():
    R = [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0]
    S = [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0]
    Q, Qn = sim_sr_nor(S, R)
    return waveform([dict(name="S", vals=S), dict(name="R", vals=R),
                     dict(name="Q", vals=Q, color=RED), dict(name="Q", vals=Qn, color=BLUE, over=True)],
                    slot=24, shade=[(0, 2, NAVY, "reset"), (4, 6, GREEN, "set"), (6, 8, GRAY, "mantém"), (8, 10, NAVY, "reset"),
                                    (12, 15, GREEN, "set"), (18, 20, RED, "inválido"), (20, 24, RED, "indefinido")],
                    marks=[2, 4, 6, 8, 10, 12, 15, 16, 18, 20], top=34)
F["wave_nor"] = wave_nor()


def wave_nand():
    Sn = [1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1]
    Rn = [0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1]
    Q, Qn = sim_sr_nand(Sn, Rn)
    return waveform([dict(name="S", vals=Sn, over=True), dict(name="R", vals=Rn, over=True),
                     dict(name="Q", vals=Q, color=RED), dict(name="Q", vals=Qn, color=BLUE, over=True)],
                    slot=26, shade=[(14, 16, RED, "inválido")], marks=[2, 4, 6, 8, 9, 10, 12, 13, 14, 16, 18, 19], top=34)
F["wave_nand"] = wave_nand()


def bounce():
    n = 30
    raw = [1] * 6 + [0, 1, 0, 0, 1, 0, 1, 0] + [0] * 16
    clean = [1] * 6 + [0] * 24
    return waveform([dict(name="chave direta", vals=raw, color=RED),
                     dict(name="via latch", vals=clean, color=GREEN)], slot=16, left=110,
                    shade=[(6, 14, RED, "trepidação (bounce)")], top=34)
F["bounce"] = bounce()


# ======================================================== CAP 3 — TEMPO
def pulses_fig():
    b = []
    def wave(x0, y0, pts, col):
        return line([(x0 + a, y0 + c) for a, c in pts], col, 2.4)
    for ox, pos in ((0, True), (300, False)):
        b.append(text(ox + 140, 14, "Pulso positivo" if pos else "Pulso negativo", 13, "middle", NAVY, "700"))
        hi, lo = 40, 100
        a, c = (lo, hi) if pos else (hi, lo)
        b.append(wave(ox + 20, 0, [(0, a), (70, a), (70, c), (190, c), (190, a), (260, a)], INK))
        b.append(text(ox + 150, (hi + lo) / 2 if True else 0, "ação no nível ALTO" if pos else "ação no nível BAIXO", 11, "middle", GRAY, "600"))
        e1, e2 = (GREEN, "subida ↑"), (RED, "descida ↓")
        if not pos:
            e1, e2 = e2, e1
        b.append(f'<circle cx="{ox+90}" cy="70" r="8" fill="none" stroke="{e1[0]}" stroke-width="2"/>')
        b.append(f'<circle cx="{ox+210}" cy="70" r="8" fill="none" stroke="{e2[0]}" stroke-width="2"/>')
        b.append(text(ox + 90, 122, "borda de " + e1[1], 11, "middle", e1[0], "700"))
        b.append(text(ox + 210, 138, "borda de " + e2[1], 11, "middle", e2[0], "700"))
    return svg(590, 148, "".join(b))
F["pulsos"] = pulses_fig()


def clock_fig():
    b = []
    x0, yH, yL = 40, 40, 100
    pts = []
    x = x0
    pts.append((x, yL))
    for i in range(4):
        pts += [(x + 20, yL), (x + 20, yH), (x + 70, yH), (x + 70, yL), (x + 120, yL)]
        x += 100
    b.append(line(pts, BLUE, 2.4))
    b.append(text(20, yH, "1", 12, "middle", GRAY)); b.append(text(20, yL, "0", 12, "middle", GRAY))
    # período
    b.append(line([(160, 120), (260, 120)], ORANGE, 1.6, arrow="arrO"))
    b.append(line([(260, 120), (160, 120)], ORANGE, 1.6, arrow="arrO"))
    b.append(line([(160, 104), (160, 128)], ORANGE, 1, "3,3")); b.append(line([(260, 104), (260, 128)], ORANGE, 1, "3,3"))
    b.append(text(210, 136, "período T", 12, "middle", ORANGE, "700"))
    b.append(line([(160, 26), (210, 26)], GREEN, 1.6, arrow="arr")); b.append(line([(210, 26), (160, 26)], GREEN, 1.6, arrow="arr"))
    b.append(text(185, 14, "t(alto)", 11, "middle", GREEN, "700"))
    b.append(text(470, 50, "f = 1 / T", 15, "start", INK, "700"))
    b.append(text(470, 76, "duty cycle = t(alto) / T", 13, "start", INK, "600"))
    b.append(text(470, 98, "aqui: 50 / 100 = 50 %", 12, "start", GRAY))
    return svg(660, 146, "".join(b))
F["clock"] = clock_fig()


def pulse_params():
    b = []
    yL, yH = 150, 40
    amp = yL - yH
    # trapézio
    pts = [(30, yL), (100, yL), (150, yH), (330, yH), (390, yL), (470, yL)]
    b.append(line(pts, BLUE, 2.6))
    def lvl(p):
        return yL - p * amp
    for p, lab in ((0.1, "10%"), (0.5, "50%"), (0.9, "90%")):
        b.append(line([(30, lvl(p)), (470, lvl(p))], GRAY, 1, "3,4"))
        b.append(text(490, lvl(p), lab, 11, "start", GRAY, "600"))
    # tr
    xr1, xr2 = 100 + 50 * 0.1, 100 + 50 * 0.9
    xf1, xf2 = 330 + 60 * 0.1, 330 + 60 * 0.9
    b.append(line([(xr1, 180), (xr2, 180)], GREEN, 1.6, arrow="arr")); b.append(line([(xr2, 180), (xr1, 180)], GREEN, 1.6, arrow="arr"))
    b.append(line([(xr1, lvl(0.1)), (xr1, 186)], GREEN, 1, "2,2")); b.append(line([(xr2, lvl(0.9)), (xr2, 186)], GREEN, 1, "2,2"))
    b.append(text((xr1 + xr2) / 2, 198, "tr (subida)", 11, "middle", GREEN, "700"))
    b.append(line([(xf1, 180), (xf2, 180)], RED, 1.6, arrow="arr")); b.append(line([(xf2, 180), (xf1, 180)], RED, 1.6, arrow="arr"))
    b.append(line([(xf1, lvl(0.9)), (xf1, 186)], RED, 1, "2,2")); b.append(line([(xf2, lvl(0.1)), (xf2, 186)], RED, 1, "2,2"))
    b.append(text((xf1 + xf2) / 2, 198, "tf (descida)", 11, "middle", RED, "700"))
    xw1, xw2 = 125, 360
    b.append(line([(xw1, lvl(0.5)), (xw2, lvl(0.5))], ORANGE, 1.8, arrow="arrO")); b.append(line([(xw2, lvl(0.5)), (xw1, lvl(0.5))], ORANGE, 1.8, arrow="arrO"))
    b.append(f'<rect x="{(xw1+xw2)/2-62}" y="{lvl(0.5)-22}" width="124" height="16" fill="white"/>')
    b.append(text((xw1 + xw2) / 2, lvl(0.5) - 14, "tw (largura, a 50%)", 11, "middle", ORANGE, "700"))
    return svg(530, 208, "".join(b))
F["pulse_params"] = pulse_params()


def setup_hold():
    b = []
    # clock
    b.append(text(40, 40, "CLK", 13, "end", INK, "700"))
    b.append(line([(50, 60), (250, 60), (262, 20), (440, 20)], BLUE, 2.4))
    b.append(text(40, 110, "D", 13, "end", INK, "700"))
    b.append(f'<path d="M50,90 L120,90 L130,130 L50,130 M120,130 L130,90 L380,90 L390,130 L440,130 M380,90 L390,130 M380,130 L390,90 L440,90" fill="none" stroke="{INK}" stroke-width="2"/>')
    b.append(f'<rect x="150" y="84" width="106" height="52" fill="{GREEN}" opacity="0.15"/>')
    b.append(f'<rect x="256" y="84" width="70" height="52" fill="{ORANGE}" opacity="0.18"/>')
    b.append(line([(256, 10), (256, 160)], GRAY, 1, "3,3"))
    b.append(line([(150, 150), (256, 150)], GREEN, 1.6, arrow="arr")); b.append(line([(256, 150), (150, 150)], GREEN, 1.6, arrow="arr"))
    b.append(text(203, 166, "tS (setup)", 12, "middle", GREEN, "700"))
    b.append(line([(256, 150), (326, 150)], ORANGE, 1.6, arrow="arrO")); b.append(line([(326, 150), (256, 150)], ORANGE, 1.6, arrow="arrO"))
    b.append(text(291, 166, "tH (hold)", 12, "middle", ORANGE, "700"))
    b.append(text(256, 186, "D precisa ficar PARADO nessa janela em torno da borda ativa", 12, "middle", INK, "600"))
    return svg(470, 196, "".join(b))
F["setup_hold"] = setup_hold()


def tpd():
    b = []
    def one(ox, rise):
        s = []
        s.append(text(ox + 10, 30, "CLK", 12, "end", INK, "700"))
        s.append(line([(ox + 20, 46), (ox + 70, 46), (ox + 80, 14), (ox + 200, 14)], BLUE, 2.2))
        s.append(text(ox + 10, 100, "Q", 12, "end", INK, "700"))
        if rise:
            s.append(line([(ox + 20, 116), (ox + 120, 116), (ox + 130, 84), (ox + 200, 84)], RED, 2.2))
        else:
            s.append(line([(ox + 20, 84), (ox + 120, 84), (ox + 130, 116), (ox + 200, 116)], RED, 2.2))
        s.append(line([(ox + 75, 30), (ox + 75, 140)], GRAY, 1, "3,3"))
        s.append(line([(ox + 125, 100), (ox + 125, 140)], GRAY, 1, "3,3"))
        s.append(f'<rect x="{ox+75}" y="84" width="50" height="32" fill="{ORANGE}" opacity="0.15"/>')
        s.append(line([(ox + 75, 134), (ox + 125, 134)], ORANGE, 1.6, arrow="arrO")); s.append(line([(ox + 125, 134), (ox + 75, 134)], ORANGE, 1.6, arrow="arrO"))
        s.append(text(ox + 100, 152, "tPLH" if rise else "tPHL", 13, "middle", ORANGE, "700"))
        s.append(text(ox + 110, 170, "Q: 0 → 1 (Low→High)" if rise else "Q: 1 → 0 (High→Low)", 11, "middle", GRAY, "600"))
        return "".join(s)
    b.append(one(20, True)); b.append(one(270, False))
    b.append(text(240, 190, "medido entre os pontos de 50% das duas transições", 11, "middle", GRAY))
    return svg(490, 198, "".join(b))
F["tpd"] = tpd()


# ======================================================== CAP 4 — FLIP-FLOPS
def level_vs_edge():
    clk = clock(6, 3, 0, 1)[:36]
    D = [0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0]
    lat = []
    q = 0
    for c, d in zip(clk, D):
        if c:
            q = d
        lat.append(q)
    ff = sim_ff("D", clk, {"D": D})
    e = edges_of(clk)
    return waveform([dict(name="CLK", vals=clk, color=BLUE), dict(name="D", vals=D),
                     dict(name="Q latch", vals=lat, color=PURPLE), dict(name="Q flip-flop", vals=ff, color=RED)],
                    slot=17, left=96, marks=e, edges=[(k, ORANGE) for k in e], top=26)
F["nivel_borda"] = level_vs_edge()


def edge_detector():
    b = []
    s1, i1, o1 = gate("and", 250, 30)
    s2, i2, o2 = gate("not", 130, 50)
    b += [s1, s2]
    b.append(pin(40, 41, "CLK", "left"))
    b.append(line([(40, 41), i1[0]]))
    b.append(dot(90, 41))
    b.append(line([(90, 41), (90, 70), i2[0]]))
    b.append(line([o2, (215, 70), (215, 59), i1[1]]))
    b.append(text(150, 98, "atraso tpd da porta NOT", 10, "middle", GRAY, "600"))
    b.append(line([o1, (360, 50)]))
    b.append(pin(360, 50, "pulso estreito", "right", ORANGE))
    # ondas
    clk = [0] * 3 + [1] * 8 + [0] * 8 + [1] * 8 + [0] * 3
    inv = [1] * 4 + [0] * 8 + [1] * 8 + [0] * 8 + [1] * 2
    inv = inv[:30]
    out = [a & b_ for a, b_ in zip(clk, inv)]
    w = waveform([dict(name="CLK", vals=clk, color=BLUE), dict(name="NOT atrasado", vals=inv, color=GRAY),
                  dict(name="saída AND", vals=out, color=ORANGE)], slot=12, left=104, row=32, top=16)
    return svg(520, 110, "".join(b)) + w
F["detector"] = edge_detector()


def clocked_sr():
    b = []
    sa, ia, oa = gate("and", 150, 20)
    sb, ib, ob = gate("and", 150, 120)
    b += [sa, sb]
    b.append(pin(30, ia[0][1], "S", "left")); b.append(line([(30, ia[0][1]), ia[0]]))
    b.append(pin(30, ib[1][1], "R", "left")); b.append(line([(30, ib[1][1]), ib[1]]))
    b.append(pin(30, 90, "CLK", "left"))
    b.append(f'<rect x="56" y="74" width="62" height="32" rx="4" fill="#fff4e6" stroke="{ORANGE}" stroke-width="1.6"/>')
    b.append(text(87, 84, "detector", 10, "middle", ORANGE, "700")); b.append(text(87, 97, "de borda", 10, "middle", ORANGE, "700"))
    b.append(line([(30, 90), (56, 90)]))
    b.append(line([(118, 90), (130, 90)])); b.append(dot(130, 90))
    b.append(line([(130, 90), (130, ia[1][1]), ia[1]])); b.append(line([(130, 90), (130, ib[0][1]), ib[0]]))
    s, p = box(260, 20, 110, 140, [("L", 0.15, "S", "", "s"), ("L", 0.85, "R", "", "r"),
                                     ("R", 0.15, "Q", "", "q"), ("R", 0.85, "Q", "over", "qn")], fill="#e7f0fb")
    b.append(s)
    b.append(text(315, 80, "Latch SR", 13, "middle", NAVY, "700")); b.append(text(315, 98, "(NOR)", 11, "middle", GRAY))
    b.append(line([oa, (240, oa[1]), (240, p["s"][1]), p["s"]]))
    b.append(line([ob, (240, ob[1]), (240, p["r"][1]), p["r"]]))
    b.append(line([p["q"], (420, p["q"][1])])); b.append(pin(420, p["q"][1], "Q", "right"))
    b.append(line([p["qn"], (420, p["qn"][1])])); b.append(pin(420, p["qn"][1], "Q", "right", INK, True))
    b.append(text(220, 178, "As portas AND só deixam S e R passarem durante o pulso estreito gerado na borda.", 11, "middle", GRAY))
    return svg(470, 188, "".join(b), padl=30)
F["sr_clk"] = clocked_sr()


def ff_symbols():
    b = []
    defs = [("SR", [("L", .25, "S", "", "a"), ("L", .75, "R", "", "b")]),
            ("JK", [("L", .25, "J", "", "a"), ("L", .75, "K", "", "b")]),
            ("D", [("L", .25, "D", "", "a")]),
            ("T", [("L", .25, "T", "", "a")])]
    for i, (nm, ins) in enumerate(defs):
        x = 40 + i * 150
        pins = ins + [("L", .5, "", "clk", "c"), ("R", .25, "Q", "", "q"), ("R", .75, "Q", "over", "qn")]
        s, p = box(x, 30, 72, 84, pins, title=f"Flip-flop {nm}")
        b.append(s)
        for k in ("a", "b"):
            if k in p:
                b.append(line([(p[k][0] - 16, p[k][1]), p[k]]))
        b.append(line([(p["c"][0] - 16, p["c"][1]), p["c"]]))
        b.append(line([p["q"], (p["q"][0] + 14, p["q"][1])])); b.append(line([p["qn"], (p["qn"][0] + 14, p["qn"][1])]))
    # bordas
    s, p = box(250, 150, 72, 60, [("L", .5, "CLK", "clk", "c")]); b.append(s)
    b.append(line([(p["c"][0] - 16, p["c"][1]), p["c"]]))
    b.append(text(335, 180, "▷ sem bolinha = borda de SUBIDA ↑", 12, "start", GREEN, "700"))
    s, p = box(250, 224, 72, 60, [("L", .5, "CLK", "clkn", "c")]); b.append(s)
    b.append(line([(p["c"][0] - 16, p["c"][1]), p["c"]]))
    b.append(text(335, 254, "○▷ com bolinha = borda de DESCIDA ↓", 12, "start", RED, "700"))
    b.append(text(40, 180, "Como ler o símbolo:", 12, "start", NAVY, "700"))
    b.append(text(40, 200, "o triângulo ▷ na entrada", 11, "start", INK))
    b.append(text(40, 216, "de clock indica que o", 11, "start", INK))
    b.append(text(40, 232, "dispositivo é sensível", 11, "start", INK))
    b.append(text(40, 248, "à BORDA (flip-flop).", 11, "start", INK))
    return svg(640, 292, "".join(b))
F["ff_simbolos"] = ff_symbols()


def wave_jk():
    clk = clock(8, 2, 0)
    per = [(1, 0), (0, 0), (0, 1), (1, 1), (1, 1), (0, 0), (1, 0), (1, 1)]
    J, K = [], []
    for j, k in per:
        J += [j] * 4; K += [k] * 4
    Q = sim_ff("JK", clk, {"J": J, "K": K})
    e = edges_of(clk)
    labels = ["set", "mantém", "reset", "comuta", "comuta", "mantém", "set", "comuta"]
    return waveform([dict(name="CLK", vals=clk, color=BLUE), dict(name="J", vals=J), dict(name="K", vals=K),
                     dict(name="Q", vals=Q, color=RED)], slot=17, marks=e, edges=[(k, ORANGE) for k in e],
                    slot_labels=[(k + 0.0, l) for k, l in zip(e, labels)], top=26)
F["wave_jk"] = wave_jk()


def wave_t():
    clk = clock(8, 2, 0)
    per = [1, 1, 0, 1, 1, 0, 0, 1]
    T = []
    for t in per:
        T += [t] * 4
    Q = sim_ff("T", clk, {"T": T})
    e = edges_of(clk)
    return waveform([dict(name="CLK", vals=clk, color=BLUE), dict(name="T", vals=T), dict(name="Q", vals=Q, color=RED)],
                    slot=17, marks=e, edges=[(k, ORANGE) for k in e], top=26)
F["wave_t"] = wave_t()


def wave_d():
    clk = clock(8, 2, 0)
    D = [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0]
    Q = sim_ff("D", clk, {"D": D})
    e = edges_of(clk)
    return waveform([dict(name="CLK", vals=clk, color=BLUE), dict(name="D", vals=D), dict(name="Q", vals=Q, color=RED)],
                    slot=17, marks=e, edges=[(k, ORANGE) for k in e], top=26)
F["wave_d"] = wave_d()


def conversions():
    b = []
    # D a partir de JK
    b.append(text(150, 198, "D feito com JK:  J = D, K = D̅", 13, "middle", NAVY, "700"))
    s, p = box(150, 30, 72, 84, [("L", .25, "J", "", "j"), ("L", .5, "", "clk", "c"), ("L", .75, "K", "", "k"),
                                 ("R", .25, "Q", "", "q"), ("R", .75, "Q", "over", "qn")])
    b.append(s)
    b.append(pin(30, p["j"][1], "D", "left")); b.append(line([(30, p["j"][1]), p["j"]])); b.append(dot(70, p["j"][1]))
    g, i, o = gate("not", 80, p["k"][1] - 20); b.append(g)
    b.append(line([(70, p["j"][1]), (70, p["k"][1]), i[0]])); b.append(line([o, p["k"]]))
    b.append(pin(30, 136, "CLK", "left")); b.append(line([(30, 136), (138, 136), (138, p["c"][1]), p["c"]]))
    b.append(text(150, 160, "só sobram os casos \"set\" (D=1)", 11, "middle", GRAY, "600"))
    b.append(text(150, 175, "e \"reset\" (D=0)", 11, "middle", GRAY, "600"))
    # T a partir de D
    ox = 330
    b.append(text(ox + 150, 198, "T feito com D:  D = T ⊕ Q", 13, "middle", NAVY, "700"))
    g, i, o = gate("xor", ox + 70, 31); b.append(g)
    s, p = box(ox + 170, 30, 72, 84, [("L", .25, "D", "", "d"), ("L", .7, "", "clk", "c"),
                                      ("R", .25, "Q", "", "q"), ("R", .75, "Q", "over", "qn")])
    b.append(s)
    b.append(pin(ox + 20, i[0][1], "T", "left")); b.append(line([(ox + 20, i[0][1]), i[0]]))
    b.append(line([o, p["d"]]))
    b.append(line([p["q"], (ox + 290, p["q"][1])])); b.append(dot(ox + 270, p["q"][1]))
    b.append(pin(ox + 290, p["q"][1], "Q", "right"))
    b.append(line([(ox + 270, p["q"][1]), (ox + 270, 10 + 0), (ox + 50, 10), (ox + 50, i[1][1]), i[1]], RED, 1.8))
    b.append(pin(ox + 20, 136, "CLK", "left")); b.append(line([(ox + 20, 136), (ox + 158, 136), (ox + 158, p["c"][1]), p["c"]]))
    b.append(text(ox + 150, 160, "T=0: D=Q (mantém)", 11, "middle", GRAY, "600"))
    b.append(text(ox + 150, 175, "T=1: D=Q̅ (comuta)", 11, "middle", GRAY, "600"))
    return svg(680, 210, "".join(b), padl=30)
F["conversoes"] = conversions()


def ff_presetclear():
    b = []
    s, p = box(120, 50, 90, 100, [("L", .2, "J", "", "j"), ("L", .5, "CLK", "clkn", "c"), ("L", .8, "K", "", "k"),
                                   ("R", .2, "Q", "", "q"), ("R", .8, "Q", "over", "qn"),
                                   ("T", .5, "PRE", "inv", "pre"), ("B", .5, "CLR", "inv", "clr")])
    b.append(s)
    for k in ("j", "c", "k"):
        b.append(line([(p[k][0] - 30, p[k][1]), p[k]]))
    b.append(line([p["q"], (p["q"][0] + 20, p["q"][1])])); b.append(line([p["qn"], (p["qn"][0] + 20, p["qn"][1])]))
    b.append(line([p["pre"], (p["pre"][0], 14)])); b.append(pin(p["pre"][0], 14, "PRE", "right"))
    b.append(line([p["clr"], (p["clr"][0], 186)])); b.append(pin(p["clr"][0], 186, "CLR", "right"))
    b.append(text(270, 40, "Bolinha em PRE e CLR =", 12, "start", NAVY, "700"))
    b.append(text(270, 58, "ativas em nível BAIXO (0).", 12, "start", NAVY, "700"))
    b.append(text(270, 86, "PRE = 0 → Q = 1 na hora (ignora clock)", 12, "start", INK))
    b.append(text(270, 106, "CLR = 0 → Q = 0 na hora (ignora clock)", 12, "start", INK))
    b.append(text(270, 126, "PRE = CLR = 1 → funciona como JK normal", 12, "start", INK))
    b.append(text(270, 146, "PRE = CLR = 0 → proibido", 12, "start", RED, "700"))
    return svg(560, 200, "".join(b))
F["ff_preclr"] = ff_presetclear()


# ======================================================== CAP 5 — CONTADORES ASSÍNCRONOS
def ripple(n=4, nand_bits=None, title_bits=None):
    b = []
    xs = [80 + i * 160 for i in range(n)]
    vcc_y, clr_y = 18, 182
    for i, x in enumerate(xs):
        s, p = box(x, 60, 70, 80, [("L", .3, "T", "", "t"), ("L", .7, "CLK", "clkn", "c"),
                                   ("R", .3, "Q", "", "q"), ("R", .7, "Q", "over", "qn"),
                                   ("B", .5, "CLR", "inv", "clr")], title=f"FF{i}")
        b.append(s)
        b.append(line([p["t"], (x - 16, p["t"][1]), (x - 16, vcc_y)], GREEN, 1.6)); b.append(dot(x - 16, vcc_y, GREEN))
        b.append(line([p["clr"], (p["clr"][0], clr_y)], RED, 1.6)); b.append(dot(p["clr"][0], clr_y, RED))
        qx = x + 100
        if i < n - 1:
            b.append(line([p["q"], (qx, p["q"][1]), (qx, p["c"][1]), (xs[i + 1] - 8, p["c"][1])]))
        else:
            b.append(line([p["q"], (qx, p["q"][1])]))
        b.append(dot(qx, p["q"][1]))
        b.append(line([(qx, p["q"][1]), (qx, 46)]))
        lab = f"Q{i}" + (" (LSB)" if i == 0 else (" (MSB)" if i == n - 1 else ""))
        b.append(pin(qx, 46, lab, "top", NAVY))
        if i == 0:
            b.append(pin(30, p["c"][1], "CLK", "left")); b.append(line([(30, p["c"][1]), p["c"]]))
    b.append(line([(30, vcc_y), (xs[-1] - 16, vcc_y)], GREEN, 1.6)); b.append(pin(30, vcc_y, "Vcc (1)", "left", GREEN))
    W = xs[-1] + 150
    if nand_bits is None:
        b.append(line([(30, clr_y), (xs[-1] + 35, clr_y)], RED, 1.6)); b.append(pin(30, clr_y, "CLR", "left", RED))
        H = 200
    else:
        gx, gy = xs[-1] + 150, 205
        g, ins, out = gate("nand", gx, gy, len(nand_bits)); b.append(g)
        for k, bit in enumerate(nand_bits):
            qx = xs[bit] + 100
            yy = 116
            b.append(dot(qx, 84))
            b.append(line([(qx, 84), (qx + 18, 84), (qx + 18, ins[k][1]), ins[k]], PURPLE, 1.6)) if False else None
        # roteamento: desce por x = qx+12
        for k, bit in enumerate(nand_bits):
            qx = xs[bit] + 100
            vx = qx + 14 + k * 0
            b.append(line([(qx, 84), (vx, 84), (vx, ins[k][1]), ins[k]], PURPLE, 1.8))
        b.append(line([out, (out[0] + 14, out[1]), (out[0] + 14, clr_y), (xs[0] + 35, clr_y)], RED, 1.8))
        b.append(text(gx + 30, gy + 58, "detecta o estado proibido", 10, "middle", PURPLE, "700"))
        W = out[0] + 40
        H = 270
    return svg(W, H, "".join(b), padl=50)
F["ripple4"] = ripple(4)
F["mod6"] = ripple(3, nand_bits=[2, 1])


def wave_ripple():
    clk = clock(17, 1, 1)[:34]
    Qs = []
    src = clk
    for i in range(4):
        q = sim_ff("T", src, {"T": [1] * len(src)}, edge="fall")
        Qs.append(q)
        src = q
    cnt = [sum(Qs[i][k] << i for i in range(4)) for k in range(len(clk))]
    e = edges_of(clk, "fall")
    labs = [(k + 1, str(cnt[k])) for k in e if k + 1 <= len(clk)]
    labs = [(0.5, "0")] + [(k + 1, str(cnt[k])) for k in e]
    return waveform([dict(name="CLK", vals=clk, color=BLUE)] +
                    [dict(name=f"Q{i}", vals=Qs[i], color=[RED, ORANGE, GREEN, PURPLE][i]) for i in range(4)],
                    slot=18, row=34, marks=e, slot_labels=labs, top=20)
F["wave_ripple"] = wave_ripple()


def wave_mod6():
    # simula com glitch: quando chega em 6 fica 1 slot e zera
    half = 2
    clk = clock(9, half, 1)
    n = len(clk)
    cnt = 0
    vals = []
    glitch = []
    pending_clear = False
    for k in range(n):
        if pending_clear:
            cnt = 0; pending_clear = False
        if k > 0 and clk[k - 1] == 1 and clk[k] == 0:
            cnt += 1
            if cnt == 6:
                pending_clear = True
                glitch.append(k)
        vals.append(cnt)
    Q = [[(v >> i) & 1 for v in vals] for i in range(3)]
    clr = [0 if k in glitch else 1 for k in range(n)]
    labs = []
    e = edges_of(clk, "fall")
    labs = [(1, "0")] + [(k + 2, str(vals[min(k + 2, n - 1)])) for k in e if k + 2 < n]
    return waveform([dict(name="CLK", vals=clk, color=BLUE), dict(name="Q0", vals=Q[0], color=RED),
                     dict(name="Q1", vals=Q[1], color=ORANGE), dict(name="Q2", vals=Q[2], color=GREEN),
                     dict(name="CLR", vals=clr, color=PURPLE, over=True)],
                    slot=17, row=34, marks=e, slot_labels=labs, shade=[(g, g + 1, RED, "6!") for g in glitch], top=26)
F["wave_mod6"] = wave_mod6()


# ======================================================== CAP 6 — SÍNCRONOS
def sync8():
    b = []
    xs = [80, 270, 470]
    P = []
    for i, x in enumerate(xs):
        s, p = box(x, 60, 70, 80, [("L", .3, "T", "", "t"), ("L", .7, "CLK", "clk", "c"),
                                   ("R", .3, "Q", "", "q"), ("R", .7, "Q", "over", "qn")], title=f"FF{i}")
        b.append(s); P.append(p)
        b.append(line([p["c"], (x - 14, p["c"][1]), (x - 14, 180)], BLUE, 1.6)); b.append(dot(x - 14, 180, BLUE))
    b.append(line([(30, 180), (xs[-1] - 14, 180)], BLUE, 1.8)); b.append(pin(30, 180, "CLK", "left", BLUE))
    b.append(pin(30, 84, "1 (Vcc)", "left", GREEN)); b.append(line([(30, 84), P[0]["t"]], GREEN, 1.8))
    # Q0 -> T1
    b.append(line([P[0]["q"], P[1]["t"]]))
    b.append(dot(175, 84)); b.append(text(175, 74, "Q0", 12, "middle", NAVY, "700"))
    b.append(dot(230, 84))
    g, ins, out = gate("and", 380, 64); b.append(g)
    b.append(line([(230, 84), (230, 30), (362, 30), (362, ins[0][1]), ins[0]], RED, 1.8))
    b.append(line([P[1]["q"], (352, 84), (352, ins[1][1]), ins[1]]))
    b.append(dot(346, 84)); b.append(text(346, 74, "Q1", 12, "middle", NAVY, "700"))
    b.append(line([out, P[2]["t"]]))
    b.append(text(420, 120, "Q0·Q1", 11, "middle", GRAY, "700"))
    b.append(line([P[2]["q"], (590, 84)])); b.append(pin(590, 84, "Q2", "right", NAVY))
    b.append(text(310, 205, "T0 = 1      T1 = Q0      T2 = Q0 · Q1      — todos recebem o MESMO clock", 12, "middle", INK, "600"))
    return svg(640, 216, "".join(b), padl=50)
F["sync8"] = sync8()


def wave_sync8():
    clk = clock(9, 1, 0)
    n = len(clk)
    cnt = 0
    vals = []
    for k in range(n):
        if k > 0 and clk[k - 1] == 0 and clk[k] == 1:
            cnt = (cnt + 1) % 8
        vals.append(cnt)
    Q = [[(v >> i) & 1 for v in vals] for i in range(3)]
    e = edges_of(clk)
    labs = [(0.5, "0")] + [(k + 1, str(vals[k])) for k in e]
    return waveform([dict(name="CLK", vals=clk, color=BLUE), dict(name="Q0", vals=Q[0], color=RED),
                     dict(name="Q1", vals=Q[1], color=ORANGE), dict(name="Q2", vals=Q[2], color=GREEN)],
                    slot=22, row=34, marks=e, edges=[(k, ORANGE) for k in e], slot_labels=labs, top=24)
F["wave_sync8"] = wave_sync8()


def ripple_vs_sync_delay():
    # ilustração do atraso acumulado no assíncrono
    b = []
    b.append(text(20, 16, "Assíncrono (ripple): cada FF espera o anterior", 12, "start", NAVY, "700"))
    y0 = 40
    names = ["CLK", "Q0", "Q1", "Q2", "Q3"]
    for i, nm in enumerate(names):
        y = y0 + i * 26
        b.append(text(50, y, nm, 12, "end", INK, "700"))
        x = 80 + (0 if i == 0 else i * 22)
        if i == 0:
            b.append(line([(60, y - 8), (80, y - 8), (80, y + 8), (300, y + 8)], BLUE, 2))
        else:
            b.append(line([(60, y + 8), (x, y + 8), (x, y - 8), (300, y - 8)], RED, 2))
            b.append(line([(80 + (i - 1) * 22, y - 18), (80 + (i - 1) * 22, y + 10)], GRAY, 1, "2,2"))
    b.append(line([(80, 172), (146, 172)], ORANGE, 1.6, arrow="arrO")); b.append(line([(146, 172), (80, 172)], ORANGE, 1.6, arrow="arrO"))
    b.append(text(113, 186, "4 × tpd acumulado", 11, "middle", ORANGE, "700"))
    ox = 340
    b.append(text(ox + 10, 16, "Síncrono: todos mudam juntos", 12, "start", NAVY, "700"))
    for i, nm in enumerate(names):
        y = y0 + i * 26
        b.append(text(ox + 50, y, nm, 12, "end", INK, "700"))
        if i == 0:
            b.append(line([(ox + 60, y - 8), (ox + 80, y - 8), (ox + 80, y + 8), (ox + 300, y + 8)], BLUE, 2))
        else:
            b.append(line([(ox + 60, y + 8), (ox + 102, y + 8), (ox + 102, y - 8), (ox + 300, y - 8)], GREEN, 2))
    b.append(line([(ox + 80, 172), (ox + 102, 172)], ORANGE, 1.6, arrow="arrO")); b.append(line([(ox + 102, 172), (ox + 80, 172)], ORANGE, 1.6, arrow="arrO"))
    b.append(text(ox + 92, 186, "1 × tpd", 11, "middle", ORANGE, "700"))
    b.append(text(330, 206, "(exemplo: transição 0111 → 1000, em que todos os bits mudam)", 11, "middle", GRAY))
    return svg(660, 214, "".join(b))
F["atraso"] = ripple_vs_sync_delay()


# ======================================================== CAP 7 — REGISTRADORES
def reg_par():
    b = []
    xs = [80, 220, 360]
    for i, x in enumerate(xs):
        s, p = box(x, 50, 70, 80, [("L", .3, f"D", "", "d"), ("L", .7, "", "clk", "c"), ("R", .3, "Q", "", "q")], title="")
        b.append(s)
        b.append(line([(x - 20, 20), (x - 20, p["d"][1]), p["d"]])); b.append(pin(x - 20, 20, f"D{i}", "top"))
        b.append(line([p["q"], (x + 90, p["q"][1]), (x + 90, 165)])); b.append(pin(x + 90, 165, f"Q{i}", "bottom", NAVY))
        b.append(line([p["c"], (x - 10, p["c"][1]), (x - 10, 145)], BLUE)); b.append(dot(x - 10, 145, BLUE))
    b.append(line([(30, 145), (xs[-1] - 10, 145)], BLUE, 1.8)); b.append(pin(30, 145, "CLK", "left", BLUE))
    return svg(480, 190, "".join(b), padl=30)
F["reg_par"] = reg_par()


def reg_load():
    b = []
    b.append(f'<path d="M120,30 L170,45 L170,115 L120,130 Z" fill="#fff4e6" stroke="{ORANGE}" stroke-width="1.8"/>')
    b.append(text(145, 80, "MUX", 11, "middle", ORANGE, "700"))
    b.append(text(128, 55, "1", 11, "middle", INK, "700")); b.append(text(128, 105, "0", 11, "middle", INK, "700"))
    b.append(pin(40, 55, "Dᵢ (novo)", "left")); b.append(line([(40, 55), (120, 55)]))
    b.append(pin(145, 160, "LOAD", "bottom", ORANGE)); b.append(line([(145, 160), (145, 124)], ORANGE))
    s, p = box(220, 40, 70, 80, [("L", .5, "D", "", "d"), ("L", .8, "", "clk", "c"), ("R", .5, "Q", "", "q")])
    b.append(s)
    b.append(line([(170, 80), p["d"]]))
    b.append(line([p["q"], (360, 80)])); b.append(pin(360, 80, "Qᵢ", "right", NAVY)); b.append(dot(320, 80))
    b.append(line([(320, 80), (320, 20), (100, 20), (100, 105), (120, 105)], RED, 1.8))
    b.append(text(210, 12, "realimentação: se LOAD=0, D recebe o próprio Q (mantém)", 10.5, "middle", RED, "600"))
    b.append(pin(190, 150, "CLK", "left", BLUE)); b.append(line([(190, 150), (205, 150), (205, p["c"][1]), p["c"]], BLUE))
    return svg(430, 190, "".join(b), padl=40)
F["reg_load"] = reg_load()


def xfer():
    b = []
    for i in range(3):
        x = 60 + i * 140
        s, p = box(x, 20, 70, 50, [("R", .5, f"X{i}", "", "q")], fill="#e7f0fb"); b.append(s)
        s2, p2 = box(x, 120, 70, 60, [("L", .3, "D", "", "d"), ("L", .75, "", "clk", "c"), ("R", .3, f"Y{i}", "", "q")], fill="#fdf0e6"); b.append(s2)
        b.append(line([p["q"], (x + 90, p["q"][1]), (x + 90, 98), (x - 18, 98), (x - 18, p2["d"][1]), p2["d"]], INK, 1.6, arrow=None))
        b.append(line([p2["c"], (x - 8, p2["c"][1]), (x - 8, 200)], BLUE)); b.append(dot(x - 8, 200, BLUE))
    b.append(line([(20, 200), (332, 200)], BLUE, 1.8)); b.append(pin(20, 200, "TRANSFER", "bottom", BLUE))
    b.append(text(470, 45, "Registrador X (fonte)", 12, "start", NAVY, "700"))
    b.append(text(470, 150, "Registrador Y (destino)", 12, "start", ORANGE, "700"))
    b.append(text(470, 172, "1 pulso → copia tudo", 11, "start", GRAY))
    b.append(text(470, 188, "X não é alterado", 11, "start", GRAY))
    return svg(640, 222, "".join(b), padl=30)
F["xfer"] = xfer()


def shift3():
    b = []
    xs = [90, 240, 390]
    P = []
    for i, x in enumerate(xs):
        s, p = box(x, 40, 70, 80, [("L", .3, "D", "", "d"), ("L", .7, "CLK", "clkn", "c"), ("R", .3, "Q", "", "q")], title=f"FF{i}")
        b.append(s); P.append(p)
        b.append(line([p["c"], (x - 22, p["c"][1]), (x - 22, 150)], BLUE)); b.append(dot(x - 22, 150, BLUE))
    b.append(pin(40, 64, "Din", "left")); b.append(line([(40, 64), P[0]["d"]]))
    for i in range(2):
        b.append(line([P[i]["q"], P[i + 1]["d"]]))
        b.append(dot(xs[i] + 95, 64)); b.append(line([(xs[i] + 95, 64), (xs[i] + 95, 175)], NAVY, 1.4))
        b.append(pin(xs[i] + 95, 175, f"Q{i}", "bottom", NAVY))
    b.append(line([P[2]["q"], (520, 64)])); b.append(pin(520, 64, "Q2 (saída série)", "right", NAVY))
    b.append(dot(495, 64)); b.append(line([(495, 64), (495, 175)], NAVY, 1.4)); b.append(pin(495, 175, "Q2", "bottom", NAVY))
    b.append(line([(30, 150), (xs[-1] - 22, 150)], BLUE, 1.8)); b.append(pin(30, 150, "CLK", "left", BLUE))
    b.append(line([(150, 20), (420, 20)], ORANGE, 2, arrow="arrO"))
    b.append(text(285, 10, "a cada borda ↓ os bits andam uma casa para a direita", 11, "middle", ORANGE, "700"))
    return svg(650, 200, "".join(b), padl=20)
F["shift3"] = shift3()


def ps_conv():
    b = []
    xs = [110, 280, 450]
    P = []
    for i, x in enumerate(xs):
        s, p = box(x, 100, 70, 80, [("L", .3, "D", "", "d"), ("L", .7, "CLK", "clk", "c"), ("R", .3, "Q", "", "q"),
                                    ("T", .5, "PRE", "inv", "pre"), ("B", .5, "CLR", "inv", "clr")], fill="white")
        b.append(s); P.append(p)
        g, ins, out = gate("nand", x - 6, 20); b.append(g)
        b.append(line([out, (x + 70, out[1]), (x + 70, 70), (x + 35, 70), p["pre"]]))
        b.append(line([(x - 22, 6), (x - 22, ins[0][1]), ins[0]], ORANGE)); b.append(dot(x - 22, 6, ORANGE))
        b.append(line([(x - 40, ins[1][1]), ins[1]])); b.append(pin(x - 40, ins[1][1], f"P{i}", "left"))
        b.append(line([p["c"], (x - 14, p["c"][1]), (x - 14, 214)], BLUE)); b.append(dot(x - 14, 214, BLUE))
        b.append(line([p["clr"], (x + 35, 228)], RED)); b.append(dot(x + 35, 228, RED))
    b.append(line([(30, 6), (xs[-1] - 22, 6)], ORANGE, 1.8)); b.append(pin(30, 6, "Enable", "left", ORANGE))
    for i in range(2):
        b.append(line([P[i]["q"], (xs[i] + 88, P[i]["q"][1]), (xs[i] + 88, 150), (xs[i + 1] - 20, 150), (xs[i + 1] - 20, P[i + 1]["d"][1]), P[i + 1]["d"]]))
    b.append(line([(60, P[0]["d"][1]), P[0]["d"]])); b.append(pin(60, P[0]["d"][1], "0", "left"))
    b.append(line([P[2]["q"], (590, P[2]["q"][1])])); b.append(pin(590, P[2]["q"][1], "Saída série", "right", NAVY))
    b.append(line([(30, 214), (xs[-1] - 14, 214)], BLUE, 1.8)); b.append(pin(30, 214, "CLK", "left", BLUE))
    b.append(line([(30, 228), (xs[-1] + 35, 228)], RED, 1.8)); b.append(pin(30, 228, "CLR", "left", RED))
    return svg(690, 240, "".join(b), padl=50)
F["ps"] = ps_conv()


# ======================================================== CAP 8 — MEMÓRIAS
def mem_bus():
    b = []
    b.append(f'<rect x="220" y="30" width="160" height="110" rx="8" fill="#e7f0fb" stroke="{NAVY}" stroke-width="2"/>')
    b.append(text(300, 75, "MEMÓRIA", 15, "middle", NAVY, "700"))
    b.append(text(300, 96, "2ⁿ posições × m bits", 12, "middle", INK, "600"))
    b.append(line([(40, 70), (218, 70)], BLUE, 5, arrow=None)); b.append(f'<path d="M206,60 L220,70 L206,80 Z" fill="{BLUE}"/>')
    b.append(text(120, 54, "Via de Endereços (n fios)", 12, "middle", BLUE, "700"))
    b.append(text(120, 88, "\"qual posição?\"", 11, "middle", GRAY))
    b.append(line([(395, 70), (565, 70)], GREEN, 5)); b.append(f'<path d="M560,60 L574,70 L560,80 Z" fill="{GREEN}"/>')
    b.append(f'<path d="M396,60 L382,70 L396,80 Z" fill="{GREEN}"/>')
    b.append(text(480, 54, "Via de Dados (m fios)", 12, "middle", GREEN, "700"))
    b.append(text(480, 88, "o conteúdo (ida e volta)", 11, "middle", GRAY))
    b.append(line([(300, 190), (300, 142)], ORANGE, 3)); b.append(f'<path d="M290,152 L300,140 L310,152 Z" fill="{ORANGE}"/>')
    b.append(text(300, 204, "Controle: leitura/escrita (R/W), seleção do chip (CS)", 12, "middle", ORANGE, "700"))
    return svg(600, 214, "".join(b))
F["mem_bus"] = mem_bus()


def rom_matrix():
    b = []
    ox, oy, cw, ch = 170, 80, 92, 54
    b.append(f'<rect x="{ox}" y="10" width="{4*cw}" height="34" rx="5" fill="#fdf0e6" stroke="{ORANGE}" stroke-width="1.6"/>')
    b.append(text(ox + 2 * cw, 27, "Decodificador de COLUNA  ←  A3 A2", 12, "middle", ORANGE, "700"))
    b.append(f'<rect x="20" y="{oy}" width="110" height="{4*ch}" rx="5" fill="#e7f0fb" stroke="{BLUE}" stroke-width="1.6"/>')
    b.append(text(75, oy + 2 * ch - 10, "Decodif.", 12, "middle", BLUE, "700"))
    b.append(text(75, oy + 2 * ch + 6, "de LINHA", 12, "middle", BLUE, "700"))
    b.append(text(75, oy + 2 * ch + 24, "← A1 A0", 12, "middle", BLUE, "700"))
    for c in range(4):
        x = ox + c * cw + cw / 2
        hl = c == 1
        b.append(line([(x, 44), (x, oy + 4 * ch)], ORANGE if hl else "#f3c9a6", 2.6 if hl else 1.4))
        b.append(text(x, 60, f"C{c} ({c>>1}{c&1})", 10.5, "middle", ORANGE, "700"))
    for r in range(4):
        y = oy + r * ch + ch / 2
        hl = r == 3
        b.append(line([(130, y), (ox + 4 * cw, y)], BLUE if hl else "#b6cdea", 2.6 if hl else 1.4))
        b.append(text(150, y - 8, f"L{r}", 10.5, "middle", BLUE, "700"))
        b.append(text(150, y + 7, f"({r>>1}{r&1})", 9.5, "middle", BLUE, "600"))
        for c in range(4):
            x = ox + c * cw + 18
            k = 4 * c + r
            sel = (c == 1 and r == 3)
            b.append(f'<rect x="{x}" y="{y-16}" width="56" height="32" rx="4" fill="{"#ffe066" if sel else "white"}" stroke="{INK if sel else GRAY}" stroke-width="{2.2 if sel else 1.2}"/>')
            b.append(text(x + 28, y, f"Reg_{k}", 11, "middle", INK, "700" if sel else "500"))
    b.append(text(300, oy + 4 * ch + 20, "Endereço A3A2A1A0 = 0111 → coluna C1 (A3A2 = 01) e linha L3 (A1A0 = 11) → só o Reg_7 é habilitado", 11.5, "middle", INK, "600"))
    b.append(text(300, oy + 4 * ch + 38, "Regra deste layout: número do registrador = 4 × coluna + linha", 11, "middle", GRAY))
    return svg(600, oy + 4 * ch + 48, "".join(b))
F["rom"] = rom_matrix()


# ======================================================== CAP 9 — MEF
def mef_block(mealy=False):
    b = []
    b.append(f'<rect x="120" y="40" width="130" height="80" rx="8" fill="#e7f0fb" stroke="{NAVY}" stroke-width="1.8"/>')
    b.append(text(185, 72, "Lógica de", 12, "middle", INK, "600")); b.append(text(185, 88, "próximo estado", 12, "middle", INK, "600"))
    b.append(f'<rect x="290" y="40" width="100" height="80" rx="8" fill="#fdf0e6" stroke="{ORANGE}" stroke-width="1.8"/>')
    b.append(text(340, 72, "Memória", 12, "middle", INK, "600")); b.append(text(340, 88, "(flip-flops)", 11, "middle", GRAY))
    b.append(f'<rect x="440" y="40" width="110" height="80" rx="8" fill="#e9f7ec" stroke="{GREEN}" stroke-width="1.8"/>')
    b.append(text(495, 72, "Lógica de", 12, "middle", INK, "600")); b.append(text(495, 88, "saída", 12, "middle", INK, "600"))
    b.append(line([(30, 70), (118, 70)], INK, 1.8, arrow="arr")); b.append(text(60, 58, "Entradas", 12, "middle", INK, "700"))
    b.append(line([(252, 80), (288, 80)], INK, 1.8, arrow="arr"))
    b.append(line([(392, 80), (438, 80)], INK, 1.8, arrow="arr")); b.append(text(415, 68, "estado", 10, "middle", GRAY, "600"))
    b.append(line([(410, 80), (410, 150), (100, 150), (100, 100), (118, 100)], ORANGE, 1.8, arrow="arrO"))
    b.append(dot(410, 80, ORANGE))
    b.append(text(260, 164, "estado atual realimentado", 11, "middle", ORANGE, "600"))
    b.append(line([(552, 80), (610, 80)], INK, 1.8, arrow="arr")); b.append(text(585, 66, "Saídas", 12, "middle", INK, "700"))
    b.append(line([(340, 185), (340, 122)], BLUE, 1.6, arrow="arrB")); b.append(text(356, 186, "Clock", 11, "start", BLUE, "700"))
    if mealy:
        b.append(line([(80, 70), (80, 20), (495, 20), (495, 38)], RED, 2, arrow="arr"))
        b.append(dot(80, 70, RED))
        b.append(text(290, 12, "MEALY: a entrada vai DIRETO para a lógica de saída", 11.5, "middle", RED, "700"))
    else:
        b.append(text(290, 18, "MOORE: a saída depende SÓ do estado", 11.5, "middle", GREEN, "700"))
    return svg(630, 196, "".join(b))
F["moore_bloco"] = mef_block(False)
F["mealy_bloco"] = mef_block(True)

F["sd_mod4"] = state_diagram({"A": (70, 50, "A", "00"), "D": (250, 50, "D", "11"), "B": (70, 160, "B", "01"), "C": (250, 160, "C", "10")},
                             [("A", "B", "", 0), ("B", "C", "", 0), ("C", "D", "", 0), ("D", "A", "", 0)], 320, 210, r=28)

F["sd_mealy"] = state_diagram({"A": (80, 60, "A"), "C": (300, 60, "C"), "B": (80, 230, "B"), "D": (300, 230, "D")},
                              [("A", "C", "1/1", -8), ("A", "D", "0/0", 18, (-14, -16)), ("D", "A", "0/0", 18, (14, 16)),
                               ("B", "B", "0/1", 180), ("B", "A", "1/0", 0, (-10, 0)), ("C", "C", "0/1", 0),
                               ("C", "D", "1/0", 0, (12, 0)), ("D", "B", "1/1", 0)], 400, 290)

F["sd_101_mealy"] = state_diagram({"S0": (60, 110, "S0"), "S1": (210, 110, "S1"), "S2": (360, 110, "S2")},
                                  [("S0", "S0", "0/0", -90), ("S0", "S1", "1/0", -20), ("S1", "S1", "1/0", -90),
                                   ("S1", "S2", "0/0", -20), ("S2", "S1", "1/1", -24), ("S2", "S0", "0/0", -70)], 420, 230)

F["sd_101_moore"] = state_diagram({"S0": (60, 110, "S0", "0"), "S1": (190, 110, "S1", "0"), "S2": (320, 110, "S2", "0"), "S3": (450, 110, "S3", "1", ORANGE)},
                                  [("S0", "S0", "0", -90), ("S0", "S1", "1", -16), ("S1", "S1", "1", -90),
                                   ("S1", "S2", "0", -16), ("S2", "S3", "1", -16), ("S2", "S0", "0", -60),
                                   ("S3", "S1", "1", 70), ("S3", "S2", "0", -22)], 510, 270)

F["sd_lamp"] = state_diagram({"I": (60, 90, "S0", "início"), "U": (200, 90, "S1", "viu 1"), "D": (340, 90, "S2", "viu 1-2"), "T": (480, 90, "S3", "ALARME", RED)},
                             [("I", "U", "L1", -12), ("U", "D", "L2", -12), ("D", "T", "L3", -12), ("U", "I", "L3", -12, (0, 4)),
                              ("D", "U", "L1", -12, (0, 4)), ("I", "I", "L2,L3", -90), ("U", "U", "L1", -90)], 540, 170)

