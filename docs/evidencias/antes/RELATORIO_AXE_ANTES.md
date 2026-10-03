# Auditoria automática "ANTES" — axe-core (03/10/2026)

**O que é:** evidência real do estado do `main` do GitHub de 03/10/2026 (zip `GIT_03-10_projeto_instituto-main`), **antes de qualquer correção**. Dados completos em `axe_antes.json`.
**Como foi feita:** axe-core 4.13.0 em Chromium headless (Playwright), sobre o **build de produção** (`vite build` + `vite preview`). Regras: WCAG 2.0/2.1/2.2 A e AA + boas práticas. 6 rotas × 2 larguras (1280 e 360 px). Executada pelo assistente em ambiente de nuvem, **não** pela equipe.

## Limites (leia antes de citar)
- Ferramenta automática encontra só uma parte dos problemas. **Não substitui** teclado, leitor de tela e revisão manual.
- **Não é Lighthouse.** Recomenda-se que a equipe também rode o Lighthouse no Chrome e anexe o relatório.
- "Foco visível" abaixo é **heurística** (compara estilo antes/depois do foco) e pode gerar falso positivo (ex.: foco desenhado no contêiner). **Conferir olhando.**
- Reflow medido só por `scrollWidth > clientWidth`. Zoom 400% **não testado**.
- Rotas de detalhe testadas só com a DM-2048 (única que existe hoje).

## Resultado resumido
| Rota | 1280 px | 360 px |
|---|---|---|
| #visao-geral | 1 regra: contraste (12 ocorrências) | 1 regra: contraste (11) |
| #demandas | contraste (36) | contraste (35) |
| #nova-demanda | contraste (1) | **0 violações** |
| #departamentos | contraste (8) | contraste (7) |
| #demanda/DM-2048 | contraste (20) | contraste (19) |
| #demanda/DM-2048/editar | contraste (20) + **tamanho de alvo (1)** | contraste (19) + tamanho de alvo (1) |

Nenhuma rota apresentou rolagem horizontal (1280 e 360 px).

## Achados
1. **Contraste insuficiente (WCAG 1.4.3, mín. 4,5:1)** em todas as telas. Principais (cor do texto sobre fundo → razão):
   - `#91a09c` sobre branco → **2,72** (meta do detalhe, "Criado em")
   - `#9a9da2` sobre branco → **2,72** (código no card da Visão Geral); `#9a9da2` sobre `#f4f4f2` → **2,47** ("Ctrl K")
   - `#8a9b97` / `#839893` sobre branco → 2,91 / 3,05 (rótulos e "eyebrow" do detalhe)
   - `#87938f` / `#86938f` sobre branco → 3,18 (origem/solicitante e data nos cards)
   - `#7f8d89` sobre branco → 3,45 (ID do card)
   - Selos (badges) de Visão Geral, Departamentos e Detalhe: âmbar 3,27 · vermelho 3,91 · verde 3,87 / 3,71 · laranja 3,28 · azul (status) 4,11 · prioridade 3,37
   - Avatar do perfil `#effaf7` sobre `#17816e` → 4,47 (quase)
   - Total: 24 combinações de cor distintas reprovadas.
2. **Tamanho do alvo (WCAG 2.5.8)**: `select[name="prioridade"]` na tela Atualizar.
3. **Foco visível (heurística, a conferir)**: sem indicador detectado em campo de busca (Visão Geral, Demandas, Departamentos), `select` de ordenação (Demandas) e `select`s de status e prioridade (Atualizar).
4. **Não detectado pelo axe, mas visto no código:** dois `<h1>` na Visão Geral; busca da Visão Geral sem rótulo; diálogo sem gestão de foco/Esc; sem skip link. Esses itens exigem verificação manual.

## Para o relatório "depois"
Repetir exatamente este procedimento após as correções e comparar. Guardar o JSON do depois em `docs/evidencias/depois/`.
