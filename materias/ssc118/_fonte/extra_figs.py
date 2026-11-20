from figs import *


def ex_nor(answer=False):
    S = [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0]
    R = [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0]
    Q, Qn = sim_sr_nor(S, R)
    if not answer:
        Q = [None] * len(S); Qn = [None] * len(S)
    return waveform([dict(name="S", vals=S), dict(name="R", vals=R),
                     dict(name="Q", vals=Q, color=RED), dict(name="Q", vals=Qn, color=BLUE, over=True)],
                    slot=26, marks=list(range(1, len(S))), top=16)


def ex_jk(answer=False):
    clk = clock(9, 2, 1)  # começa em 1, bordas de descida em 2,6,...
    n = len(clk)
    per = [(1, 0), (1, 1), (0, 0), (1, 1), (0, 1), (1, 1), (1, 0), (1, 1), (0, 0)]
    J, K = [], []
    for j, k in per:
        J += [j] * 4; K += [k] * 4
    CLR = [1] * n
    for k in (27, 28):  # pulso de clear assíncrono com Q = 1
        CLR[k] = 0
    q = 0
    Q = []
    for k in range(n):
        if CLR[k] == 0:
            q = 0
        elif k > 0 and clk[k - 1] == 1 and clk[k] == 0:
            j, kk = J[k - 1], K[k - 1]
            q = (1 - q) if (j and kk) else (1 if j else (0 if kk else q))
        Q.append(q)
    e = edges_of(clk, "fall")
    if not answer:
        Q = [None] * n
    return waveform([dict(name="CLK", vals=clk, color=BLUE), dict(name="J", vals=J), dict(name="K", vals=K),
                     dict(name="CLR", vals=CLR, color=PURPLE, over=True), dict(name="Q", vals=Q, color=RED)],
                    slot=16, marks=e, edges=None, top=18, slot_labels=[(k, "↓") for k in e])


def mealy_vs_moore_wave():
    xs = [1, 0, 1, 0, 1, 1, 0, 1, 0]
    clk = clock(len(xs), 2, 0)
    n = len(clk)
    X = []
    for v in xs:
        X += [v] * 4
    # shift X by 1 slot so changes occur during low phase after edge
    X = [xs[0]] * 1 + X[:-1]
    sm, smo = 0, 0  # mealy state S0..S2, moore state S0..S3
    tm = {0: {0: 0, 1: 1}, 1: {0: 2, 1: 1}, 2: {0: 0, 1: 1}}
    tmo = {0: {0: 0, 1: 1}, 1: {0: 2, 1: 1}, 2: {0: 0, 1: 3}, 3: {0: 2, 1: 1}}
    Zm, Zmo = [], []
    for k in range(n):
        if k > 0 and clk[k - 1] == 0 and clk[k] == 1:
            x = X[k - 1]
            sm = tm[sm][x]
            smo = tmo[smo][x]
        Zm.append(1 if (sm == 2 and X[k] == 1) else 0)
        Zmo.append(1 if smo == 3 else 0)
    e = edges_of(clk)
    return waveform([dict(name="CLK", vals=clk, color=BLUE), dict(name="X", vals=X),
                     dict(name="Z Mealy", vals=Zm, color=ORANGE), dict(name="Z Moore", vals=Zmo, color=GREEN)],
                    slot=17, left=84, marks=e, edges=[(k, ORANGE) for k in e], top=24,
                    slot_labels=[(k * 4 + 2.5, str(v)) for k, v in enumerate(xs)])


def ex_shift(answer=False):
    clk = clock(4, 2, 1)
    n = len(clk)
    bits = [1, 0, 1, 1]
    Din = []
    for b_ in bits:
        Din += [b_] * 4
    Din = [bits[0]] + Din[:-1]
    q = [0, 0, 0, 0]
    Qs = [[], [], [], []]
    for k in range(n):
        if k > 0 and clk[k - 1] == 1 and clk[k] == 0:
            q = [Din[k - 1]] + q[:3]
        for i in range(4):
            Qs[i].append(q[i])
    e = edges_of(clk, "fall")
    if not answer:
        Qs = [[None] * n for _ in range(4)]
    return waveform([dict(name="CLK", vals=clk, color=BLUE), dict(name="Din", vals=Din)] +
                    [dict(name=f"Q{i}", vals=Qs[i], color=[RED, ORANGE, GREEN, PURPLE][i]) for i in range(4)],
                    slot=20, row=32, marks=e, top=14, slot_labels=[(k, "↓") for k in e])
