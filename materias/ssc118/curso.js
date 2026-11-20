/* SSC118 · Sistemas Digitais (Lógica Digital): metadados, banco de questões e flashcards.
   Questão: [capítulo, enunciado, [certa, erradas...], explicação]. A primeira opção é sempre a certa (o motor embaralha). */
const CURSO = {
  id: "ssc118",
  codigo: "SSC118",
  titulo: "Sistemas Digitais",
  pdf: "apostila-ssc118.pdf",
  capitulos: [
    { id: "fundamentos", n: 1, titulo: "Combinacional × sequencial", aula: "Aula 01" },
    { id: "latches", n: 2, titulo: "Latches", aula: "Aulas 01–02" },
    { id: "tempo", n: 3, titulo: "Tempo, pulsos e clock", aula: "Aula 02" },
    { id: "flipflops", n: 4, titulo: "Flip-flops", aula: "Aulas 02–03" },
    { id: "assincronos", n: 5, titulo: "Contadores assíncronos", aula: "Aula 04" },
    { id: "sincronos", n: 6, titulo: "Contadores síncronos", aula: "Aula 05" },
    { id: "registradores", n: 7, titulo: "Registradores", aula: "Aulas 06–07" },
    { id: "memorias", n: 8, titulo: "Memórias", aula: "Aula 06" },
    { id: "mef", n: 9, titulo: "Máquinas de estados", aula: "Aula 08" },
    { id: "revisao", n: 10, titulo: "Revisão e simulado", aula: "Tudo", revisao: true }
  ],
  quiz: [
  ["latches", "No latch RS com portas NOR, qual combinação é proibida?", ["S = R = 1", "S = R = 0", "S = 1, R = 0", "S = 0, R = 1"], "Com S = R = 1 as duas NOR têm um 1 na entrada e Q = Q̄ = 0: as saídas deixam de ser complementares."],
  ["latches", "Num latch RS com NAND, qual combinação faz o latch manter o valor?", ["S̄ = R̄ = 1", "S̄ = R̄ = 0", "S̄ = 0, R̄ = 1", "S̄ = 1, R̄ = 0"], "As entradas são ativas em 0. Com as duas em 1 nenhuma ordem é dada, e o latch mantém."],
  ["latches", "Por que o latch é chamado de circuito assíncrono?", ["A saída muda assim que as entradas mudam, sem esperar clock", "Porque usa portas NAND", "Porque tem duas saídas", "Porque só muda na borda de descida"], "Latch não tem clock: reage às entradas a qualquer instante (com um pequeno atraso)."],
  ["latches", "Para que um latch é usado junto de uma chave mecânica?", ["Eliminar a trepidação (bounce)", "Aumentar a tensão", "Dividir a frequência", "Gerar o clock"], "O primeiro contato já faz o set/reset; os quiques seguintes repetem a mesma ordem e a saída fica limpa."],
  ["tempo", "Qual o período de um clock de 25 MHz?", ["40 ns", "25 ns", "4 ns", "400 ns"], "T = 1/f = 1/(25 × 10⁶) = 40 × 10⁻⁹ s."],
  ["tempo", "O tempo de subida (tr) é medido entre:", ["10% e 90% da transição", "0% e 100%", "50% e 50%", "a borda e a saída"], "Por convenção, tr e tf usam 10% e 90%; a largura do pulso usa os pontos de 50%."],
  ["tempo", "O setup time (tS) é:", ["O tempo antes da borda em que a entrada deve ficar estável", "O tempo depois da borda em que a saída muda", "A largura mínima do pulso", "O atraso de propagação"], "Setup = antes da borda; hold = depois da borda."],
  ["tempo", "Um pulso fica 15 ns em alto num período de 60 ns. O duty cycle é:", ["25%", "15%", "40%", "75%"], "15/60 = 0,25."],
  ["flipflops", "No flip-flop JK, J = K = 1 na borda ativa faz a saída:", ["Comutar (inverter)", "Ir para 1", "Ir para 0", "Ficar inválida"], "É a grande vantagem do JK sobre o RS: o caso 11 vira comutação."],
  ["flipflops", "FF D de borda de subida com Q = 0. O clock fica parado em 1 e D muda várias vezes. Q:", ["Continua 0", "Acompanha D", "Vai para 1", "Fica indefinido"], "Sem borda, o flip-flop ignora D. Um latch (sensível a nível) acompanharia."],
  ["flipflops", "Como transformar um JK em T?", ["Ligar J = K = T", "J = T, K = T̄", "J = 1, K = 0", "J = Q, K = Q̄"], "Com J = K = 0 mantém; com J = K = 1 comuta. É exatamente o FF T."],
  ["flipflops", "Num FF comercial, CLR̅ = 0 faz:", ["Q = 0 imediatamente, sem esperar o clock", "Q = 0 na próxima borda", "Q = 1 imediatamente", "Nada, se o clock estiver parado"], "PRE e CLR são assíncronos e têm prioridade sobre o clock."],
  ["flipflops", "FF T com T = 1 recebe clock de 10 MHz. A frequência de Q é:", ["5 MHz", "10 MHz", "20 MHz", "2,5 MHz"], "Q comuta a cada borda ativa: um ciclo de Q leva dois ciclos de clock."],
  ["flipflops", "Uma bolinha antes do triângulo na entrada de clock indica:", ["Sensível à borda de descida", "Sensível a nível baixo", "Entrada assíncrona", "Clock invertido proibido"], "▷ = borda; ○▷ = borda de descida."],
  ["assincronos", "Contador assíncrono de 0 a 9 (década): a NAND recebe", ["Q3 e Q1", "Q3 e Q0", "Q2 e Q1", "Q3, Q0"], "O primeiro estado proibido é 10 = 1010: os bits em 1 são Q3 e Q1."],
  ["assincronos", "Quantos FFs são necessários para um contador MOD-12?", ["4", "3", "12", "6"], "2³ = 8 < 12 ≤ 2⁴ = 16."],
  ["assincronos", "Contador MOD-8 com clock de 16 kHz. A frequência do MSB é:", ["2 kHz", "8 kHz", "4 kHz", "128 kHz"], "f(MSB) = f(CLK)/módulo = 16/8."],
  ["assincronos", "Como obter contagem decrescente com o mesmo circuito assíncrono?", ["Lendo as saídas Q̄", "Trocando T por 0", "Ligando o clock no último FF", "Usando NOR no CLR"], "A contagem decrescente é o complemento da crescente."],
  ["assincronos", "Principal desvantagem do contador assíncrono:", ["Os atrasos se acumulam e aparecem estados falsos", "Precisa de muita lógica extra", "Não divide frequência", "Só conta até 9"], "Cada FF espera o anterior: N × tPD."],
  ["sincronos", "Contador síncrono binário de 4 bits com FFs T: T3 =", ["Q2·Q1·Q0", "Q2", "1", "Q3·Q2"], "O bit i comuta quando todos os bits abaixo dele valem 1."],
  ["sincronos", "O que caracteriza um contador síncrono?", ["O mesmo clock em todos os FFs", "Clock só no primeiro FF", "Não usar flip-flops", "Ser sempre decrescente"], "Todos mudam juntos; a lógica decide quem comuta."],
  ["sincronos", "Na tabela de excitação do JK, para ir de Q = 1 para Q = 0:", ["J = X, K = 1", "J = 0, K = 1", "J = 1, K = X", "J = X, K = 0"], "K = 1 garante a descida (reset ou comutação); J tanto faz."],
  ["sincronos", "Como forçar um contador para 1101 sem contar até lá?", ["Usando PRE nos bits 1 e CLR nos bits 0", "Dando 13 pulsos", "Desligando o clock", "Trocando os FFs por D"], "As entradas assíncronas carregam o valor na hora."],
  ["registradores", "Um registrador de 8 bits precisa de quantos flip-flops?", ["8", "3", "4", "16"], "Cada FF guarda 1 bit."],
  ["registradores", "Para converter 5 bits de série para paralelo são necessários:", ["5 pulsos de clock", "1 pulso", "10 pulsos", "32 pulsos"], "Um bit entra por pulso."],
  ["registradores", "Após uma transferência paralela X → Y, o registrador X:", ["Fica inalterado", "É zerado", "Recebe o conteúdo de Y", "Fica deslocado"], "A transferência copia; não move."],
  ["registradores", "No conversor paralelo → série com PRE, por que zerar antes de carregar?", ["O PRE só consegue colocar 1, então os 1s antigos ficariam", "Porque o clock exige", "Para economizar energia", "Não é necessário"], "Onde P = 0 o PRE fica inativo; o FF precisa já estar em 0."],
  ["memorias", "Uma memória 2K × 8 armazena:", ["16 384 bits", "16 000 bits", "2 048 bits", "8 192 bits"], "2 × 1024 × 8."],
  ["memorias", "Uma memória com 12 linhas de endereço tem quantas posições?", ["4096", "12", "1024", "144"], "2¹² = 4096."],
  ["memorias", "Qual ROM é apagada com luz ultravioleta?", ["EPROM", "EEPROM", "PROM", "Flash"], "EEPROM e Flash apagam eletricamente; PROM não apaga."],
  ["memorias", "Por que a DRAM precisa de refresh?", ["O capacitor de cada célula descarrega com o tempo", "Porque é não volátil", "Porque usa flip-flops", "Para trocar de endereço"], "A SRAM usa flip-flops e não precisa."],
  ["memorias", "Memória cache normalmente usa:", ["SRAM", "DRAM", "EPROM", "Fita magnética"], "SRAM é mais rápida (e mais cara)."],
  ["mef", "No modelo de Moore, a saída depende:", ["Só do estado atual", "Do estado e da entrada", "Só da entrada", "Do clock"], "Por isso, em Moore, a saída fica dentro do nó."],
  ["mef", "Num diagrama de Mealy, o rótulo “1/0” num arco significa:", ["Entrada 1 produz saída 0 nessa transição", "Estado 1 vai para estado 0", "Saída 1, entrada 0", "Clock 1, reset 0"], "Mealy: entrada/saída no arco."],
  ["mef", "Qual modelo responde mais rápido a uma mudança na entrada?", ["Mealy", "Moore", "Os dois iguais", "Nenhum"], "Em Mealy a entrada vai direto para a lógica de saída."],
  ["mef", "Dois estados são equivalentes quando:", ["Para toda entrada dão a mesma saída e vão para estados equivalentes", "Têm o mesmo nome", "São vizinhos no diagrama", "Têm a mesma codificação binária"], "Aí um deles é redundante e pode ser removido."],
  ["mef", "Uma MEF com 5 estados precisa de no mínimo quantos FFs?", ["3", "5", "2", "4"], "2² = 4 < 5 ≤ 2³ = 8."],
  ["fundamentos", "Num circuito combinacional, a saída depende:", ["Só das entradas no instante atual", "Das entradas e do estado anterior", "Só do clock", "Do número de flip-flops"], "Combinacional não tem memória: mesma entrada, mesma saída, sempre."],
  ["fundamentos", "O que um circuito sequencial tem que o combinacional não tem?", ["Memória e realimentação", "Portas NAND", "Mais de uma saída", "Entradas binárias"], "Os elementos de memória guardam o estado, que volta para a lógica pela realimentação."],
  ["fundamentos", "Um circuito que muda de estado sozinho, o tempo todo, é:", ["Astável", "Monoestável", "Biestável", "Combinacional"], "Astável não tem estado estável; é usado como oscilador (gerador de clock)."],
  ["fundamentos", "Latches e flip-flops são classificados como:", ["Biestáveis", "Astáveis", "Monoestáveis", "Combinacionais"], "Têm dois estados estáveis e só mudam com comando externo: guardam 1 bit."],
  ["fundamentos", "Qual exemplo exige um circuito sequencial?", ["Fechadura que abre após digitar 4-7-2", "Somador de 4 bits", "Decodificador de 7 segmentos", "Multiplexador 4:1"], "A fechadura precisa lembrar os dígitos já digitados."],
  ["latches", "Num latch NOR com Q = 1, as entradas vão para S = 0 e R = 0. Q fica:", ["1", "0", "indefinido", "inválido"], "S = R = 0 é o repouso: o latch mantém o último valor."],
  ["tempo", "Qual parâmetro diz a maior frequência de clock garantida pelo fabricante?", ["fMAX", "tPLH", "tH", "tw"], "fMAX é o limite de operação confiável."],
  ["registradores", "Num registrador de deslocamento de 3 bits, o primeiro bit que entra termina em:", ["Q2 (o último FF)", "Q0", "Q1", "Sai e se perde"], "A cada pulso ele anda uma casa; depois de 3 pulsos está no último FF."],
  ["sincronos", "Para um contador síncrono MOD-5 (0 a 4) com FFs T, T0 =", ["Q̄2", "1", "Q0", "Q2"], "T0 é 1 nos estados 0 a 3 e 0 no estado 4 (100): T0 = Q̄2."],
  ["mef", "No método da partição, a primeira divisão (P1) agrupa os estados por:", ["Mesmas saídas", "Mesmo próximo estado", "Ordem alfabética", "Mesma codificação"], "Depois, refina olhando os grupos dos próximos estados."]
],
  flash: {
  fundamentos: [
    ["Combinacional", "Saída depende só das entradas agora. Sem memória."],
    ["Sequencial", "Saída depende das entradas <b>e do estado</b>. Tem memória e realimentação."],
    ["Estado", "O que o circuito guarda sobre o passado, o suficiente para decidir o próximo passo."],
    ["Astável / Monoestável / Biestável", "0, 1 e 2 estados estáveis. Oscilador / temporizador / latch e flip-flop."],
    ["Latch × flip-flop", "Latch muda a qualquer momento (assíncrono). Flip-flop só na borda do clock (síncrono)."]
  ],
  latches: [
    ["Latch NOR: repouso e inválido", "Repouso S = R = 0. Inválido S = R = 1 (Q = Q̄ = 0)."],
    ["Latch NAND: repouso e inválido", "Repouso S̄ = R̄ = 1. Inválido S̄ = R̄ = 0 (Q = Q̄ = 1)."],
    ["Regra da NOR", "Qualquer 1 na entrada força a saída a 0."],
    ["Regra da NAND", "Qualquer 0 na entrada força a saída a 1."],
    ["Corrida (race)", "Sair do inválido retirando as duas ordens juntas: resultado imprevisível."],
    ["Debounce", "Latch elimina a trepidação da chave mecânica: o 1º contato já decide."]
  ],
  tempo: [
    ["f e T", "f = 1/T. 20 MHz → 50 ns."],
    ["Duty cycle", "Tempo em alto ÷ período."],
    ["tr e tf", "Subida/descida, medidos de 10% a 90%."],
    ["tw", "Largura do pulso, entre os pontos de 50%."],
    ["Setup (tS)", "Entrada estável <b>antes</b> da borda ativa."],
    ["Hold (tH)", "Entrada estável <b>depois</b> da borda ativa."],
    ["tPLH / tPHL", "Atraso da saída indo 0→1 / 1→0."]
  ],
  flipflops: [
    ["JK: 00 / 10 / 01 / 11", "Mantém / set / reset / comuta."],
    ["D", "Q<sub>próx</sub> = D. Base de registradores."],
    ["T", "Q<sub>próx</sub> = T ⊕ Q. T = 1 divide a frequência por 2."],
    ["JK → D", "J = D, K = D̄."],
    ["JK → T", "J = K = T."],
    ["D → T", "D = T ⊕ Q."],
    ["PRE̅ / CLR̅", "Assíncronos, ativos em 0, vencem o clock. Os dois em 0: proibido."],
    ["○▷ no clock", "Sensível à borda de descida."]
  ],
  assincronos: [
    ["Contador ripple", "Clock só no FF0; cada FF usa o Q anterior como clock."],
    ["MOD-N com NAND", "NAND com os bits que valem 1 em N (= n + 1) → CLR̅."],
    ["Década", "10 = 1010 → NAND(Q3, Q1)."],
    ["0 a 5", "6 = 110 → NAND(Q2, Q1)."],
    ["Frequência do MSB", "f<sub>CLK</sub> ÷ módulo."],
    ["Decrescente", "Mesmo circuito, lendo Q̄."],
    ["Desvantagem", "Atraso acumulado N·tPD e estados falsos (glitch)."]
  ],
  sincronos: [
    ["Síncrono", "Mesmo clock em todos os FFs; lógica decide quem comuta."],
    ["Ti do contador binário", "Ti = Q0·Q1·…·Q(i−1)."],
    ["Excitação T", "T = Q ⊕ Q<sub>próx</sub>."],
    ["Excitação JK", "0→0: 0X · 0→1: 1X · 1→0: X1 · 1→1: X0."],
    ["Parar a contagem", "Multiplique todos os T por EN."],
    ["Forçar um valor", "PRE nos bits 1, CLR nos bits 0."]
  ],
  registradores: [
    ["Registrador", "n bits = n FFs D."],
    ["Paralela × série", "1 pulso e n fios × n pulsos e 1 fio."],
    ["Com LOAD", "D = LOAD·novo + <span class=\"ov\">LOAD</span>·Q."],
    ["Deslocamento", "Q<sub>i</sub> → D<sub>i+1</sub>; um bit por pulso."],
    ["Paralelo → série", "CLR, depois Enable carrega P via PRE̅ = NAND(EN, P), depois desloca."]
  ],
  memorias: [
    ["Capacidade", "Posições × bits por palavra."],
    ["Linhas de endereço", "n linhas → 2ⁿ posições."],
    ["1K, 1M", "1K = 2¹⁰ = 1024 · 1M = 2²⁰."],
    ["2K × 8", "16 384 bits, 11 linhas de endereço."],
    ["PROM / EPROM / EEPROM / Flash", "Fusível 1 vez / apaga com UV / apaga elétrica / apaga por setores."],
    ["SRAM × DRAM", "Flip-flop, rápida, cache × capacitor, refresh, principal."]
  ],
  mef: [
    ["Moore", "Z = f(estado). Saída no nó (A/Z)."],
    ["Mealy", "Z = f(estado, entrada). Saída no arco (X/Z)."],
    ["Quem é mais rápido?", "Mealy: reage no mesmo ciclo."],
    ["Estados equivalentes", "Mesma saída e próximos equivalentes para toda entrada."],
    ["Partição", "P1 por saídas; refina pelos grupos dos próximos estados até estabilizar."],
    ["Nº de FFs", "Menor n com 2ⁿ ≥ nº de estados."]
  ]
}

};
