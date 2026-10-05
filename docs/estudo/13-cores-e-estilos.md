# 13 — Cores e estilos

> Termos: **CSS** = a linguagem das cores, tamanhos e posições. **Classe** = um "apelido" dado a um elemento para o CSS achá-lo. **`className`** = em JSX, é o nome da classe (no HTML comum seria `class`). **Variável CSS** = uma cor com nome (ex.: `--color-primary`), definida uma vez e usada em vários lugares.

## 1. Onde ficam os estilos
| Arquivo | Para quê |
|---|---|
| `src/index.css` | base da página, **contorno de foco** (`:focus-visible`), "Ir para o conteúdo" (`.skip-link`), foco no título, menos animação |
| `src/App.css` | formulário da Nova Demanda, tela Demandas (cards, filtros, abas, busca), Departamentos, selos de atenção |
| `src/pages/VisaoGeral.css` | toda a Visão Geral (regras dentro de `.visao-geral`), com **variáveis de cor** |
| `src/pages/DetalhesDemanda.css` | Detalhes, Atualizar, Triagem e o visual dos pop-ups |
| `src/pages/Login.css` | tela de login |
| `src/components/Sidebar.css` | menu lateral (e o menu no celular) |
| `src/fonte-minima.css` | "levanta" para 14 px todo texto que era menor; carregado **por último** em `src/main.jsx` |

**Como o React usa:** o JSX coloca a classe no elemento (`<button className="submit-button">`) e o CSS diz como ela fica (`.submit-button { background: #1b7766; }`). Algumas classes mudam conforme o dado, por exemplo ``className={`demand-status demand-status--${statusModifier(exibida.status)}`}`` em `src/pages/Demandas.jsx`.

## 2. Onde as cores estão definidas (a verdade do código)
- **Variáveis CSS:** só em `src/pages/VisaoGeral.css`, **25 variáveis** (ex.: `--color-primary: #1f4b3f`, `--color-border: #868a85`, `--tone-ambar-fg: #946308`).
- **Cores fixas** (escritas direto, como `#1b7766`): **280** em 6 arquivos, sendo 172 diferentes.
  - `App.css`: 146;
  - `DetalhesDemanda.css`: 75;
  - `VisaoGeral.css`: 22;
  - `Sidebar.css`: 14;
  - `Login.css`: 12;
  - `index.css`: 11.
- **Nenhuma cor nos `.jsx`.**
- **Não existe uma "cor principal" única para o app todo.** O verde do app aparece como `#1b7766` (botão de envio, abas ativas, contorno de foco) e, na Visão Geral, como `--color-primary: #1f4b3f`. Os botões dos pop-ups usam `#147968`.

## 3. Cores de status (onde cada uma é definida)
| Onde aparece | Como escolhe a cor | Cores |
|---|---|---|
| Cards da tela **Demandas** (texto do status) | `statusModifier` em `Demandas.jsx`: status final → `done`; Pendente de aceite ou "Não aceita pelo setor" → `pending`; o resto (Em andamento, Aguardando, Em triagem) → `progress` | `App.css`: `.demand-status--done` `#16745e` (verde), `--pending` `#b44444` (vermelho), `--progress` `#a95c1b` (laranja) |
| Cards da **Visão Geral** (chip) | `chaveDeCor` em `VisaoGeral.jsx` e `TOM_POR_STATUS` em `VisaoGeralDemandCard.jsx`: Pendente → âmbar; status final (Concluída, Cancelada, Não aplicável) → verde; o resto → azul | `VisaoGeral.css`: `.badge--ambar`, `.badge--verde`, `.badge--azul` (variáveis `--tone-*`) |
| **Detalhes** (chip do status) | uma cor só para todos os status | `DetalhesDemanda.css`: `.detail-status` (`#256ec6` sobre `#edf5ff`) |
| Selos de atenção (Demandas) | `seloDeAtencao` (`src/domain/atencao.js`) | `App.css`: `.attention-tag` (âmbar) e `.attention-tag--late` (vermelho) |
| Selos de atenção (Visão Geral) | o mesmo `seloDeAtencao` | `VisaoGeral.css`: `.badge--ambar` / `.badge--vermelho` + `.demand-card__selo` |
| Chips dos cards de número | `tom` em `indicadoresVisaoGeral` (`listas.js`) | `.badge--ambar` ("48 h para aceitar", "25% do prazo"), `.badge--vermelho` ("Prazo passou"), `.badge--verde` (Concluídas) |

*Observação:* na Visão Geral, Cancelada e Não aplicável aparecem com o verde de "concluída". É escolha do código (`chaveDeCor`); o texto do chip diz o status certo.

## 4. Contraste, foco e fonte
- **Contraste:**
  - texto precisa de **4,5:1** com o fundo; bordas de campos, botões e cards precisam de **3:1** (WCAG 1.4.3 e 1.4.11);
  - no Bloco 3, as cores de texto foram escurecidas para passar de 4,5:1;
  - no PR #9, as bordas que davam ~1,2:1 passaram a `#6d968c` (3,29:1, em Demandas) e `#868a85` (3,51:1, na Visão Geral; 3,19:1 sobre o fundo cinza de Departamentos).
- **Contorno de foco:** `:focus-visible { outline: 2px solid #1b7766; outline-offset: 2px; }` em `src/index.css` (5,4:1). Na busca de Demandas o foco também muda a borda do campo (o "anel duplo": borda + contorno). Na barra lateral escura o contorno é claro (`#9fdccf`).
- **Fonte mínima de 14 px** (não 16): `src/fonte-minima.css` aplica `max(14px, tamanho original)` aos textos que eram menores. A busca de Demandas tem 16 px (ajuste do PR #9).

## 5. Por que o tema claro/escuro ficou para o futuro
São 280 cores fixas em 6 arquivos, e só a Visão Geral usa variáveis. O contraste foi calculado contra o branco; no escuro **teria de ser refeito** e o axe rodado nos dois temas. Estimativa: muito trabalho.

O plano (DOCUMENTACAO, seção 20.7):
1. trocar as cores por cerca de 20 variáveis;
2. criar o tema escuro;
3. recalcular o contraste;
4. testar os dois temas.

## 6. "Quero mudar a cor de um botão: onde mexo?"
1. Descubra a classe do botão: F12 → clique com o botão direito no botão → "Inspecionar" → veja o `class`.
2. Procure a classe nos CSS. Exemplos reais:
   - "Criar Nova Demanda" → `.submit-button` em `src/App.css` (`background: #1b7766`; no hover, `#125e51`);
   - "Nova demanda" da Visão Geral → `.visao-geral .btn-primary` em `src/pages/VisaoGeral.css` (`background: var(--color-primary)`): mudar `--color-primary` muda **todos** os usos dessa variável na Visão Geral;
   - botões dos pop-ups → `.detail-button--primary` em `src/pages/DetalhesDemanda.css` (`#147968`).
3. Troque a cor e **confira o contraste** do texto branco sobre a nova cor (precisa de 4,5:1 ou mais).
4. Rode `npm run build` e veja no navegador.
