# Explicação do Bloco 3 — Acessibilidade (para estudar)

> Teste só com o teclado (Tab, Shift+Tab, Enter, Esc) e, se puder, com o Narrador do Windows (Ctrl+Win+Enter) ou o NVDA.

## 1. A ideia em uma frase
O app passou a funcionar para quem **não usa mouse**, quem **usa leitor de tela** e quem **enxerga pouco**. A Fase 1 arrumou a **estrutura** (o que o leitor de tela entende); a Fase 2 arrumou o **visual** (foco, contraste, tamanho de letra e quebra de texto), mudando o mínimo no CSS dos colegas.

## 2. Fase 1 — estrutura (sem mudar o visual)
| O quê | Por quê (WCAG) | Onde |
|---|---|---|
| Skip link "Ir para o conteúdo" | Quem usa teclado não precisa passar pelo menu inteiro em toda tela (2.4.1) | `App.jsx` |
| Foco vai para o título a cada troca de tela | Com rotas por hash o navegador não avisa que a tela mudou; o leitor de tela lê o título novo (2.4.3) | `App.jsx` |
| Um único `<h1>` por tela | O `<h1>` diz "onde estou"; dois confundem (1.3.1) | `VisaoGeralHeader.jsx` |
| Rótulo na busca da Visão Geral | Placeholder some ao digitar e nem todo leitor lê (1.3.1, 3.3.2) | `VisaoGeralSearchBar.jsx` |
| `aria-pressed` nas abas | O leitor diz "pressionado" na aba ativa (4.1.2) | `VisaoGeralFilterTabs.jsx` |
| Contagem anunciada ("N demandas exibidas") | Quem não vê a tela sabe o resultado da busca (4.1.3) | `VisaoGeralDemandList.jsx`, `Departamentos.jsx` |
| "Ctrl K" removido | Prometia um atalho que não existia | `VisaoGeralSearchBar.jsx` |

## 3. Bugs achados no teste do Edge e a causa
1. **O skip link aparecia por cima da marca "Demanda de aço".** Os dois ficavam no mesmo canto (`top: 8px; left: 8px`). Agora o skip link fica no topo, centralizado (no celular, à direita).
2. **O Enter no skip link "não fazia nada".** O foco ia para o `<main>`, e uma regra minha escondia o contorno. Pior: o skip link sumia, a marca aparecia no lugar e parecia focada. Agora o foco vai para o **título da tela**, com contorno verde visível.
3. **Com Shift+Tab, Enter na marca ia para Demandas.** O link apontava para `#inicio`, uma rota que não existe e caía em Demandas. Agora aponta para `#visao-geral`.
4. **A lupa do topo de Demandas** só levava o foco à busca, que já estava visível logo abaixo. Ela foi removida, e o ícone foi para **dentro** da barra de busca, como nas outras telas.

**Lição:** o teste automático e o navegador embutido não pegaram 1 e 2; o **teste humano com teclado** pegou. Por isso o enunciado pede teste manual.

## 4. Fase 2 — visual
- **Foco visível (2.4.7).** Uma regra só, `:focus-visible { outline: 2px solid #1b7766 }`, vale para tudo que recebe foco. `:focus-visible` aparece quando se usa o **teclado**; no clique com mouse o visual dos colegas continua igual. As 11 linhas `outline: none` dos colegas foram removidas, porque escondiam o foco.
- **Contraste (1.4.3 e 1.4.11).**
  - Texto precisa de **4,5:1** com o fundo; bordas e ícones, de **3:1**.
  - Um script calculou cada cor e trocou pela **mais próxima na mesma cor** que passa (ex.: cinza `#87938f` 3,18 → `#6b7773` 4,65). A paleta continua a mesma, só um pouco mais escura.
  - Os cards de Demandas ganharam borda visível.
- **Quebra de palavra.** `overflow-wrap: anywhere` faz um texto sem espaço ("fsdfsadff…") quebrar dentro do card em vez de estourar a largura e criar rolagem lateral.
- **Alvos de toque (2.5.8).** Tudo que se clica tem pelo menos 24 × 24 px (Sair e select de prioridade).
- **Menos movimento (2.3.3).** Quem configurou "reduzir animações" no sistema não vê transições.
- **Fonte mínima de 14 px (1.4.4).**
  - Fica num **arquivo separado**, `src/fonte-minima.css`, carregado por último no `main.jsx`.
  - Ele só "levanta" para 14 px o que era menor, usando `max(14px, tamanho original)`.
  - Foi feito assim para dar para desfazer sem perder o resto: basta apagar o arquivo e uma linha.

## 5. Trechos-chave
```css
:focus-visible { outline: 2px solid #1b7766; outline-offset: 2px; }
```
Uma regra só cobre botões, links, campos e selects. Antes eram duas regras, e só para botão e link.

```js
<button className="skip-link" type="button" onClick={() => tituloDaPagina.current?.focus()}>
```
É um **botão**, e não um link `#conteudo`, porque no nosso app mudar o hash troca de tela.

## 6. O que a equipe ainda precisa fazer (evidência)
- Rodar o **axe "depois"** com o mesmo procedimento do relatório "antes" e salvar em `docs/evidencias/depois/`.
- Rodar o **Lighthouse** no Edge.
- Fazer o teste **só com teclado** e com **leitor de tela** (Narrador ou NVDA), anotando quem fez e quando.

## 7. Perguntas que o professor pode fazer
1. **Para que serve o "Ir para o conteúdo"?** Para quem usa teclado pular o menu e ir direto ao conteúdo da tela (WCAG 2.4.1).
2. **Por que o foco vai para o título quando a tela muda?** Num app de uma página só, o navegador não avisa que a tela mudou. Movendo o foco para o `<h1>`, o leitor de tela lê o nome da tela nova (2.4.3).
3. **Qual a diferença entre `:focus` e `:focus-visible`?** `:focus-visible` só aparece quando faz sentido mostrar, como no uso por teclado; assim o contorno não aparece a cada clique de mouse.
4. **Como vocês escolheram as cores novas?** Um script calculou a razão de contraste de cada cor e escureceu cada uma só até passar de 4,5:1, mantendo a mesma cor.
5. **Por que a fonte ficou num arquivo separado?** Mudar todos os tamanhos mexe no layout dos colegas. Isolado, dá para desfazer sem perder o resto.
6. **O que é `overflow-wrap: anywhere`?** Permite quebrar uma palavra muito longa em qualquer ponto, para ela não sair do card.
7. **O axe garante que está acessível?** Não. Ele pega só parte dos problemas, por exemplo não pegou o skip link por cima da marca. Por isso também é preciso testar com teclado e leitor de tela.
8. **Por que tiraram a lupa do topo?** Ela não buscava nada, só levava o foco à busca, e o rótulo "Buscar demandas" enganava o leitor de tela. A lupa foi para dentro da barra de busca.
