# Auditoria automática "DEPOIS" — axe-core (04/10/2026)

**O que é:** evidência real do estado da branch `fix/acessibilidade` (PR #4, commit `c664734`, "fix(a11y): contraste em fundos cinza e rolagem em 360 px nos Detalhes"), **depois das correções do Bloco 3**. Dados completos em `axe_depois.json`. Para comparar, veja `RELATORIO_AXE_ANTES.md`.
**Como foi feita:** axe-core 4.13.0 em Chromium headless (Playwright), sobre o **build de produção** (`vite build` + `vite preview`). Regras: WCAG 2.0/2.1/2.2 A e AA + boas práticas, as mesmas do "antes". Executada pelo assistente em ambiente de nuvem, **não** pela equipe.

## O que mudou no método em relação ao "antes" (leia antes de comparar números)
- No "antes" não havia login. Agora o app exige sessão, então as telas foram auditadas **logadas**, com dois perfis: `user01` (setor TI) e `admin` (gerência), mais a tela de login sem sessão.
- A DM-2048 deixou de existir no seed. As telas de detalhe e de atualização usam a **DM-2006** (status "Aguardando", o selo mais longo).
- Por isso são **26 combinações** (login + 6 rotas × 2 perfis, em 1280 e 360 px) contra 12 no "antes". Os números não são de rotas idênticas.

## Limites (leia antes de citar)
- Ferramenta automática encontra só uma parte dos problemas. **Não substitui** teclado, leitor de tela e revisão manual.
- **Não é Lighthouse.** Recomenda-se que a equipe também rode o Lighthouse e anexe o relatório.
- "Foco visível" abaixo é **heurística** (existe contorno ou outro estilo ao focar). Ela confirma que há indicador, **não** confirma cor, espessura nem contraste dele. Isso foi conferido olhando, no Edge, pelo autor do PR (skip link, buscas e botões com contorno verde).
- Reflow medido só por `scrollWidth > clientWidth`. Zoom 400% **não testado**.
- **Não executado:** teste com leitor de tela (Narrador ou NVDA), teste em celular real, Lighthouse.

## Resultado resumido
| | Antes (03/10) | Depois (04/10) |
|---|---|---|
| Combinações auditadas | 12 | 26 |
| Ocorrências de violação | **190** (contraste 188, tamanho de alvo 2) | **0** |
| Rotas com violação | 11 de 12 | 0 de 26 |
| Elementos focáveis sem indicador de foco (heurística) | 12 | **0** |
| Rolagem horizontal | 0 | **0** |

## Itens "incompletos" (o axe não conseguiu decidir)
12 ocorrências, todas em 360 px, todas a mesma: **contraste dos itens do menu lateral** ("Demandas" e "Departamentos"). O axe não consegue determinar a cor de fundo porque a área do menu rola na horizontal e um item cobre parcialmente o outro. **Pendente de conferência manual.** A cor desses textos foi medida por script durante a Fase 2 (acima de 4,5:1 sobre o fundo do menu).

## Correções que o axe apontou e que foram feitas depois da primeira rodada
A primeira rodada do "depois" (commit `85863d5`) deu **6 ocorrências**:
- 2 textos com contraste de 4,24:1 e 4,26:1 sobre fundo cinza ("Selecione o setor da demanda" e a mensagem "Você pode consultar esta demanda…"): cores trocadas por tons com 4,63:1 e 4,70:1.
- Rolagem lateral em 360 px na tela de Detalhes da DM-2006 (382 px de largura para 360), causada pelo selo de status longo com a fonte de 14 px: a linha e o selo passaram a quebrar.
A segunda rodada, no commit `c664734`, deu **0**.

## O que o axe NÃO prova (conferido por outros meios)
Conferido pelo assistente de código no navegador embutido, **não pelo axe**: um único `<h1>` por tela, foco no título a cada troca de rota, skip link funcional, busca da Visão Geral com rótulo, `aria-pressed` nas abas e contagens anunciadas por `aria-live`. Conferido a mão no Edge pelo autor: ordem do Tab, Enter no skip link, Shift+Tab até "Demanda de aço", contorno verde nas buscas. O diálogo (foco e Esc) **não** foi reauditado aqui.
