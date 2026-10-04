# 10 — Processo: branches, PRs e organização

## (a) O que faz
O trabalho foi dividido em **blocos**, cada um numa branch e num PR (pull request), com CHANGELOG e um arquivo de explicação (`docs/EXPLICACAO_BLOCO*.md`). Os commits e pushes foram feitos pelo GitHub Desktop.

## (b) Onde está registrado
- `docs/CHANGELOG.md`: uma entrada por bloco e por ajuste, com o que mudou e como foi verificado.
- `docs/PROMPT_BLOCOS.md`: o plano dos blocos.
- `docs/CONVENCOES.md`: formato das mensagens de commit.
- `docs/DOCUMENTACAO.md`: seção 16 (mapa defeito → bloco) e ADR-09 (um PR por bloco).

## (c) Branches e PRs
| Bloco | Branch | PR |
|---|---|---|
| 1 — Fundação (dados, regras, login) | `feat/fundacao` | não consta nos docs |
| 2A/2B — Telas ligadas aos dados e Nova Demanda | `feat/telas-nova-demanda` | não consta nos docs |
| 3 — Acessibilidade | `fix/acessibilidade` | **#4** (citado em `RELATORIO_AXE_DEPOIS.md`) |
| 4A — Aceite e recusa | `feat/bloco4-aceite` | **#5** (relato do autor) |
| 4B — Fila de triagem e atenção | `feat/bloco4b-fila-triagem` | **#6** (relato do autor) |
| 4C — Ações da gerência | `feat/bloco4c-acoes-gerencia` | **#7** (relato do autor) |
| Fix visual "card gordo" | `fix/visual-cards` | não consta nos docs (provavelmente #8; **confirmar no GitHub**) |
| Ajustes do teste manual | `fix/ajustes-teste-manual` | **#9** |

- **Ordem de merge:** cada branch foi criada em cima da anterior (4A → 4B → 4C → visual → ajustes). Por isso o merge segue a mesma ordem. As datas de merge **não constam** nos docs: confirmar no GitHub.
- **Revisores de cada PR:** não consta nos docs. Preencher: ____________.

## (d) Como mostrar em 1 minuto
1. Abrir o GitHub do projeto → aba "Pull requests" → mostrar a sequência #4 a #9.
2. Abrir um PR e mostrar a descrição e os commits por tema.
3. Abrir `docs/CHANGELOG.md` e mostrar uma entrada com "Verificação".

## (e) Perguntas prováveis
- **Por que blocos pequenos?** Para revisar e testar aos poucos; se algo quebrar, sabemos em qual bloco foi.
- **Usaram IA?** Sim, permitido pelo professor desde que todos expliquem (ADR-06). O código foi revisado e testado; o que não foi testado está escrito.
- **Como evitaram perder trabalho?** Cada ferramenta parte do `main` atual e entrega em branch/PR (lição da seção 12 da DOCUMENTACAO).

## (f) O que não está pronto / limitações
- Números de PR dos Blocos 1 e 2, revisores e datas de merge: **não constam** nos documentos do repositório.
- As decisões de regra de 03/10 em diante ainda precisam ser votadas em ata (`docs/ATAS_RASCUNHO_27-09_e_02-10.md`).
