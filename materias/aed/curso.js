/* AED · Algoritmos e Estruturas de Dados: metadados, banco de questões e flashcards.
   Questão: [capítulo, enunciado, [certa, erradas...], explicação]. A primeira opção é sempre a certa (o motor embaralha). */
const CURSO = {
  id: "aed",
  codigo: "AED",
  titulo: "Algoritmos e Estruturas de Dados",
  cor: "#3ddc97",
  pdf: "apostila-aed.pdf",
  capitulos: [
    { id: "tads", n: 1, titulo: "Tipos Abstratos de Dados", aula: "TAD em C" },
    { id: "pilhas", n: 2, titulo: "Pilhas", aula: "LIFO" },
    { id: "filas", n: 3, titulo: "Filas e Deques", aula: "FIFO" },
    { id: "listas", n: 4, titulo: "Listas", aula: "seq., encadeadas, gen., cruzadas" },
    { id: "arvores", n: 5, titulo: "Árvores e Árvores Binárias", aula: "percursos" },
    { id: "abb", n: 6, titulo: "Árvore Binária de Busca", aula: "ABB" },
    { id: "avl", n: 7, titulo: "Árvores AVL", aula: "rotações" },
    { id: "rubronegra", n: 8, titulo: "Árvores Rubro-Negras", aula: "cores" },
    { id: "heap", n: 9, titulo: "Fila de Prioridade e Heap", aula: "heap binário" },
    { id: "revisao", n: 10, titulo: "Revisão e simulado", aula: "tudo", revisao: true }
  ],
  quiz: [
    ["tads", "Um TAD é definido principalmente por:", ["Suas operações (o que se pode fazer com ele)", "O tipo de vetor que usa", "A linguagem de programação", "O tamanho em bytes"], "A representação fica escondida; o que define o TAD é o contrato das operações."],
    ["tads", "Em C, para esconder os campos de uma struct do usuário do TAD, o .h deve conter:", ["typedef struct ponto PONTO; sem listar os campos", "A struct completa com todos os campos", "Só #define", "As variáveis globais"], "É a struct opaca: o usuário só manipula ponteiros e usa as funções."],
    ["tads", "Por que uma função de apagar recebe PONTO ** em vez de PONTO *?", ["Para poder colocar NULL no ponteiro do usuário depois do free", "Porque free exige dois ponteiros", "Para copiar a struct", "Para alocar mais memória"], "Evita que o usuário fique com um ponteiro pendurado."],
    ["tads", "Qual erro causa vazamento de memória?", ["Fazer malloc e nunca chamar free", "Chamar free duas vezes", "Ler um ponteiro NULL", "Usar sizeof"], "Free duplo e acesso a NULL são outros erros (comportamento indefinido / falha)."],
    ["tads", "Qual cresce mais devagar?", ["O(log n)", "O(n)", "O(n log n)", "O(n²)"], "Para n = 1 milhão, log₂ n ≈ 20."],
    ["pilhas", "Pilha vazia: push(1), push(2), pop, push(3). O topo é:", ["3", "1", "2", "a pilha está vazia"], "Depois do pop sobra 1; push(3) coloca 3 no topo."],
    ["pilhas", "Na pilha em vetor com topo = índice do último, a pilha está vazia quando:", ["topo == -1", "topo == 0", "topo == MAX", "topo == MAX - 1"], "topo == MAX − 1 significa cheia."],
    ["pilhas", "Na pilha encadeada, push e pop acontecem:", ["No início da lista, em O(1)", "No fim da lista, em O(n)", "No meio da lista", "Em qualquer posição"], "O topo é o primeiro nó."],
    ["pilhas", "Quanto vale a pós-fixa 8 2 / 3 *?", ["12", "0,75", "48", "5"], "8 / 2 = 4; 4 * 3 = 12. O primeiro desempilhado é o operando da direita."],
    ["pilhas", "A forma pós-fixa de (A + B) * C é:", ["A B + C *", "A B C + *", "A + B C *", "* + A B C"], "Os parênteses fazem o + sair antes do *."],
    ["pilhas", "Contar parênteses abertos e fechados basta para saber se ([)] está balanceada?", ["Não: as quantidades batem, mas a ordem está errada", "Sim", "Sim, desde que use colchetes", "Só se a expressão for curta"], "A pilha verifica a ordem de fechamento."],
    ["filas", "Numa fila, o primeiro elemento a sair é:", ["O primeiro que entrou (FIFO)", "O último que entrou", "O de maior valor", "Qualquer um"], "Fila = First In, First Out."],
    ["filas", "Numa fila circular com MAX = 8, depois do índice 7 o próximo é:", ["0", "8", "1", "-1"], "(7 + 1) % 8 = 0."],
    ["filas", "Por que a fila circular costuma ter um contador qtd?", ["Porque inicio == fim acontece tanto vazia quanto cheia", "Para economizar memória", "Para ordenar os elementos", "Porque o C exige"], "Alternativa: deixar sempre uma posição vazia."],
    ["filas", "Na fila encadeada, ao remover o último elemento, é preciso:", ["Fazer fim = NULL", "Fazer inicio = fim", "Não fazer nada além do free", "Percorrer a lista"], "Senão fim aponta para memória liberada."],
    ["filas", "Para recuar um índice num vetor circular sem gerar número negativo:", ["(i - 1 + MAX) % MAX", "(i - 1) % MAX", "i - 1", "(i + 1) % MAX"], "Usado para inserir no início de um deque."],
    ["filas", "Um deque usado só por uma ponta (insere e remove do mesmo lado) se comporta como:", ["Pilha", "Fila", "Lista ordenada", "Heap"], "Inserindo de um lado e removendo do outro, seria fila."],
    ["listas", "Na lista sequencial ordenada, inserir um elemento custa:", ["O(n), por causa dos deslocamentos", "O(1)", "O(log n)", "O(n²)"], "A busca do lugar pode ser O(log n), mas abrir espaço é O(n)."],
    ["listas", "Busca binária pode ser usada em:", ["Lista sequencial ordenada", "Lista encadeada ordenada", "Qualquer lista", "Lista sequencial não ordenada"], "Precisa de ordem e de acesso direto ao meio."],
    ["listas", "Para inserir novo depois de p numa lista simples, a ordem correta é:", ["novo->prox = p->prox; depois p->prox = novo;", "p->prox = novo; depois novo->prox = p->prox;", "Tanto faz", "novo->prox = p; depois p->prox = novo;"], "Na ordem errada, perde-se o resto da lista."],
    ["listas", "Qual a vantagem do nó-cabeça?", ["Elimina os casos especiais de inserir/remover no início", "Ocupa menos memória", "Permite busca binária", "Torna a lista circular"], "Sempre existe um nó antes do primeiro elemento."],
    ["listas", "Na lista duplamente encadeada, remover um nó do qual se tem o ponteiro custa:", ["O(1)", "O(n)", "O(log n)", "Depende do tamanho do nó"], "O nó conhece o anterior; não precisa procurar."],
    ["listas", "Em L = (a, (b, c), d), a cauda de L é:", ["((b, c), d)", "(b, c)", "d", "(a, (b, c))"], "Cauda = lista sem o primeiro elemento."],
    ["listas", "Matrizes esparsas costumam ser representadas com:", ["Listas cruzadas (cada nó na lista da linha e da coluna)", "Pilhas", "Heaps", "Listas generalizadas"], "Só os não nulos são guardados."],
    ["arvores", "Numa árvore, um nó sem filhos é chamado de:", ["Folha", "Raiz", "Nó interno", "Ancestral"], "A raiz é o nó sem pai."],
    ["arvores", "Quantos nós tem, no máximo, uma árvore binária de altura 3 (em arestas)?", ["15", "8", "7", "16"], "2^(h+1) − 1 = 2⁴ − 1."],
    ["arvores", "O percurso que visita a raiz entre as subárvores esquerda e direita é:", ["Em-ordem", "Pré-ordem", "Pós-ordem", "Em nível"], "Em-ordem: esquerda, raiz, direita."],
    ["arvores", "Para liberar todos os nós de uma árvore, usa-se:", ["Pós-ordem", "Pré-ordem", "Em-ordem", "Qualquer percurso"], "Os filhos precisam ser liberados antes do pai."],
    ["arvores", "O percurso em nível usa qual estrutura auxiliar?", ["Fila", "Pilha", "Heap", "Lista generalizada"], "Visita nível por nível, da esquerda para a direita."],
    ["arvores", "Em representação de árvore completa em vetor (índice 0), os filhos de i ficam em:", ["2i + 1 e 2i + 2", "2i e 2i + 1", "i + 1 e i + 2", "i / 2"], "O pai fica em (i − 1) / 2."],
    ["abb", "Na ABB, o percurso em-ordem produz:", ["As chaves em ordem crescente", "As chaves na ordem de inserção", "A raiz primeiro", "As folhas primeiro"], "É um bom teste para saber se a árvore é ABB."],
    ["abb", "Um novo elemento numa ABB é sempre inserido como:", ["Folha", "Raiz", "Pai da raiz antiga", "Nó com dois filhos"], "A busca termina num NULL, onde o nó entra."],
    ["abb", "Ao remover um nó com dois filhos usando o sucessor, o sucessor é:", ["O menor elemento da subárvore direita", "O maior elemento da subárvore direita", "O filho esquerdo", "A raiz"], "Um passo à direita, depois tudo à esquerda."],
    ["abb", "Inserir 1, 2, 3, 4, 5 nessa ordem numa ABB vazia gera:", ["Uma árvore degenerada de altura 4", "Uma árvore completa", "Uma árvore de altura 2", "Um erro"], "Cada chave vai para a direita da anterior."],
    ["abb", "O custo da busca numa ABB é:", ["O(h), entre O(log n) e O(n)", "Sempre O(log n)", "Sempre O(1)", "Sempre O(n)"], "Depende da altura h, que depende da ordem de inserção."],
    ["avl", "Numa AVL, o fator de balanceamento de todo nó deve estar em:", ["{−1, 0, +1}", "{0}", "{−2, ..., +2}", "{0, 1}"], "FB = altura(esq) − altura(dir)."],
    ["avl", "Nó com FB = +2 e filho esquerdo com FB = +1. A correção é:", ["Rotação simples à direita no nó", "Rotação simples à esquerda no nó", "Rotação dupla esquerda-direita", "Recolorir"], "Caso LL: sinais iguais, rotação simples para o lado contrário do peso."],
    ["avl", "Nó com FB = +2 e filho esquerdo com FB = −1. A correção é:", ["Rotação à esquerda no filho, depois à direita no nó", "Rotação simples à direita", "Rotação simples à esquerda", "Nenhuma"], "Caso LR: sinais opostos, rotação dupla."],
    ["avl", "Inserir 10, 20, 30 numa AVL vazia provoca:", ["Rotação simples à esquerda em 10", "Rotação simples à direita em 30", "Rotação dupla", "Nenhuma rotação"], "10 fica com FB −2 e 20 com −1: caso RR."],
    ["avl", "Quantas rotações (simples ou duplas) uma inserção na AVL faz no máximo?", ["Uma", "Duas", "O(log n)", "Nenhuma"], "Na remoção podem ser várias, até O(log n)."],
    ["rubronegra", "Qual NÃO é uma propriedade da árvore rubro-negra?", ["Todo nó vermelho tem um filho vermelho", "A raiz é preta", "Os NIL são pretos", "Todo caminho até os NIL tem a mesma quantidade de pretos"], "É o contrário: um nó vermelho tem filhos pretos."],
    ["rubronegra", "Na inserção rubro-negra, o novo nó entra com a cor:", ["Vermelha", "Preta", "Do pai", "Do tio"], "Vermelho não altera a altura negra."],
    ["rubronegra", "Pai vermelho e tio vermelho: o que se faz?", ["Recolore pai e tio de preto e o avô de vermelho", "Rotação no avô", "Rotação no pai", "Remove o tio"], "É o caso 1; o problema pode subir para o avô."],
    ["rubronegra", "A altura de uma rubro-negra com n nós é no máximo:", ["2 log₂(n + 1)", "log₂ n", "n", "1,44 log₂ n"], "1,44 log₂ n é o limite da AVL."],
    ["rubronegra", "Comparada à AVL, a rubro-negra:", ["Faz menos rotações em atualizações, mas pode ser um pouco mais alta", "É sempre mais baixa", "Não usa rotações", "Não garante O(log n)"], "Por isso é a escolha comum em bibliotecas."],
    ["heap", "Num heap máximo, o maior elemento está:", ["Na raiz (índice 0)", "Na última posição", "Numa folha qualquer", "No filho esquerdo da raiz"], "Todo pai é ≥ que os filhos."],
    ["heap", "Inserir num heap: coloca no fim e…", ["Sobe trocando com o pai enquanto for maior", "Desce trocando com o maior filho", "Ordena o vetor", "Rotaciona"], "Sift-up, O(log n)."],
    ["heap", "Remover o máximo: o último vai para a raiz e…", ["Desce trocando com o maior filho", "Desce trocando com o menor filho", "Sobe até a raiz", "Fica parado"], "No heap mínimo, troca com o menor filho."],
    ["heap", "Construir um heap a partir de um vetor qualquer, descendo de n/2 − 1 até 0, custa:", ["O(n)", "O(n log n)", "O(log n)", "O(n²)"], "A maioria dos nós está perto das folhas e desce pouco."],
    ["heap", "O heap é uma árvore binária de busca?", ["Não: só exige pai ≥ filhos, sem ordem entre esquerda e direita", "Sim", "Só o heap mínimo", "Só quando está cheio"], "A em-ordem de um heap não sai ordenada."],
    ["heap", "Heapsort é:", ["O(n log n) e não estável", "O(n²) e estável", "O(n) e estável", "O(log n)"], "E ordena no próprio vetor, com O(1) de memória extra."]
  ],
  flash: {
    tads: [
      ["TAD", "Tipo definido pelas operações; a representação fica escondida."],
      ["Struct opaca", "<code>typedef struct x X;</code> no .h; campos só no .c."],
      ["malloc / free", "malloc pode dar NULL; todo malloc precisa de um free."],
      ["Ponteiro pendurado", "Ponteiro que aponta para memória já liberada."],
      ["O(log n)", "Corta o problema pela metade a cada passo."]
    ],
    pilhas: [
      ["LIFO", "Last In, First Out: só o topo é acessível."],
      ["Pilha em vetor", "vazia ⇔ topo == −1 · cheia ⇔ topo == MAX − 1"],
      ["Pilha encadeada", "push e pop no início da lista, O(1)."],
      ["Pós-fixa: operador", "Desempilha b (topo), depois a; empilha a op b."],
      ["Parênteses", "Abre: empilha. Fecha: topo tem que combinar. Fim: pilha vazia."],
      ["Infixa → pós-fixa", "Antes de empilhar um operador, tira os de precedência ≥."]
    ],
    filas: [
      ["FIFO", "First In, First Out: entra no fim, sai do início."],
      ["Avançar no anel", "i = (i + 1) % MAX"],
      ["Recuar no anel", "i = (i − 1 + MAX) % MAX"],
      ["Vazia × cheia", "Contador qtd, ou uma posição sempre livre."],
      ["Fila encadeada", "Ponteiros início e fim; ao esvaziar, fim = NULL."],
      ["Deque", "Insere e remove nas duas pontas; encadeado = lista dupla."]
    ],
    listas: [
      ["Sequencial", "Acesso O(1); inserir/remover O(n) (desloca)."],
      ["Encadeada", "Inserir/remover O(1) dado o local; acesso O(n)."],
      ["Ordem das ligações", "Liga o novo ao seguinte ANTES de ligar o anterior ao novo."],
      ["Nó-cabeça", "Sentinela no início: sem casos especiais."],
      ["Circular", "Último aponta para o primeiro; guardar o último dá O(1) nas pontas."],
      ["Dupla", "ant e prox; remove dado o nó em O(1)."],
      ["Generalizada", "Elementos são átomos ou sublistas; cabeça, cauda, profundidade."],
      ["Cruzada", "Nó em duas listas (linha e coluna): matriz esparsa."]
    ],
    arvores: [
      ["Folha", "Nó sem filhos."],
      ["Altura × nível", "Altura: até a folha mais funda abaixo. Nível: distância até a raiz."],
      ["Máximo de nós (altura h)", "2^(h+1) − 1 (contando h em arestas)."],
      ["Pré / em / pós", "RED / ERD / EDR (R = raiz, E = esq., D = dir.)"],
      ["Em nível", "Usa fila."],
      ["Liberar a árvore", "Pós-ordem."],
      ["Reconstruir", "Pré (ou pós) + em-ordem."]
    ],
    abb: [
      ["Propriedade", "Esq < nó < dir em TODA a subárvore."],
      ["Em-ordem", "Sai em ordem crescente."],
      ["Inserção", "Sempre como folha."],
      ["Remoção, 2 filhos", "Sucessor = menor da direita (ou predecessor = maior da esquerda)."],
      ["Custo", "O(h): log n no melhor caso, n no pior (degenerada)."]
    ],
    avl: [
      ["FB", "altura(esq) − altura(dir) ∈ {−1, 0, +1}"],
      ["+2 e filho +1", "LL: rotação simples à direita."],
      ["−2 e filho −1", "RR: rotação simples à esquerda."],
      ["+2 e filho −1", "LR: esquerda no filho, direita no nó."],
      ["−2 e filho +1", "RL: direita no filho, esquerda no nó."],
      ["Inserção × remoção", "Inserção: ≤ 1 rotação. Remoção: até O(log n)."]
    ],
    rubronegra: [
      ["5 propriedades", "Cor; raiz preta; NIL preto; sem V-V; mesma altura negra."],
      ["Novo nó", "Entra vermelho."],
      ["Caso 1", "Tio vermelho: recolore pai/tio/avô e sobe."],
      ["Caso 2", "Tio preto, zigue-zague: rotação no pai → caso 3."],
      ["Caso 3", "Tio preto, linha reta: rotação no avô + troca cores."],
      ["Altura", "≤ 2 log₂(n + 1)."]
    ],
    heap: [
      ["Heap máximo", "Árvore completa com pai ≥ filhos."],
      ["Índices", "esq 2i+1 · dir 2i+2 · pai (i−1)/2"],
      ["Inserir", "No fim + sobe. O(log n)."],
      ["Remover máximo", "Último na raiz + desce pelo maior filho. O(log n)."],
      ["Construir", "Desce de n/2 − 1 até 0. O(n)."],
      ["Heapsort", "O(n log n), in-place, não estável."]
    ]
  }
};
