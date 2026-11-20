# Estudos — instruções para o Claude

Site estático de cursos de estudo, publicado pelo GitHub Pages a partir da branch `main` (pasta raiz).
O dono não programa: ele pede mudanças em português na conversa. Responda em português do Brasil.

## Estrutura

```
index.html                 catálogo de matérias (lê materias/catalogo.js)
assets/engine.css          estilo comum (tokens claro/escuro, tela dividida, apostila, componentes de lab)
assets/engine.js           motor comum: utilitários de lab, tela dividida, capítulos, progresso,
                           quiz, flashcards, revisão de erros, simulado, catálogo
assets/icone.svg
materias/catalogo.js       lista de matérias (um objeto por matéria)
materias/<id>/index.html   GERADO — não editar à mão
materias/<id>/curso.js     metadados, capítulos, banco de questões (quiz) e flashcards
materias/<id>/labs.js      laboratórios interativos da matéria (opcional)
materias/<id>/figs/*.svg   GERADO — figuras da apostila
materias/<id>/apostila-<id>.pdf
materias/<id>/_fonte/      fontes da matéria + gerar.py
```

## Como a página de matéria funciona

- Esquerda: `<section class="ap-cap" data-cap="ID">` (um por capítulo), dentro de `.apostila`.
- Direita: `<section class="pr-cap" id="v-ID" data-cap="ID">` com os labs do capítulo.
- O motor mostra só o capítulo do `#hash`, acrescenta teste rápido (questões de `CURSO.quiz` com o mesmo
  capítulo) e flashcards (`CURSO.flash[ID]`) em cada painel de prática, e simulado + revisão de erros no
  capítulo com `revisao: true`.
- Um `.lab` com `data-ref="2.4"` ganha o botão "§2.4 na apostila", que rola até o `<h2>` que começa com "2.4".
- Questão: `["capitulo", "enunciado", ["certa", "errada", ...], "explicação"]`. A certa é sempre a 1ª.
- Progresso fica em `localStorage` (`estudos:m:<id>`). Mudar o enunciado de uma questão muda o id dela.

## Editar SSC118

1. Edite as fontes em `materias/ssc118/_fonte/` (`c1.html`–`c3.html` = texto da apostila, `pratica.html` =
   painéis de prática, `fig_defs.py`/`extra_figs.py` = figuras) ou `curso.js`/`labs.js`.
2. Rode `python3 -I materias/ssc118/_fonte/gerar.py` (precisa de `bs4`) para regenerar `index.html` e `figs/`.
3. Teste localmente: `python3 -m http.server` na raiz e abra no navegador (Playwright está disponível).
4. Commit em português, push na `main`. O Pages atualiza em 1–2 minutos.

## Adicionar uma matéria nova

1. Leia os PDFs/slides que o dono enviar e escreva a apostila no mesmo estilo (progressiva, didática,
   caixas `callout key/warn/ex/try/deep/intuit`, `chap-head` em cada capítulo, seções `<h2>N.M Título</h2>`,
   exercícios com gabarito no último capítulo).
2. Crie `materias/<id>/` copiando a estrutura de `ssc118` (o `gerar.py` serve de modelo: troque `CAPS`,
   os arquivos de texto e as figuras). Labs são opcionais: sem `labs.js`, cada painel de prática fica só
   com teste rápido e flashcards, e isso já funciona. Inclua um `pratica.html` com um `.pr-cap` por capítulo
   (pode ficar vazio por dentro).
3. Escreva `curso.js` com capítulos (ids iguais aos `data-cap`), pelo menos 4 questões por capítulo e flashcards.
4. Gere também o PDF da apostila, se fizer sentido.
5. Acrescente a matéria em `materias/catalogo.js`.
6. Teste desktop (1400px), celular (390px) e modo escuro; confira o console sem erros.

## Cuidados

- Tudo é público (repositório e site). Não coloque dados pessoais nem os PDFs originais dos professores.
- Sem dependências de build: HTML/CSS/JS puros; fontes do Google Fonts.
- Mantenha os textos sem travessões decorativos e sem jargão desnecessário; o público é o próprio aluno.
