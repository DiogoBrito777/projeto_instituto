# Guia da pasta `docs/`

Os arquivos estão em três grupos (o produto, como o trabalho foi conduzido e o registro do processo); cada tabela diz para que serve cada arquivo.

**Se você quer entender o produto, comece por:** `DOCUMENTACAO.md`, `REQUISITOS_REGRAS_DE_NEGOCIO.md` e `FLUXOS.md`.

## 1. O produto (o que o sistema é e como deve se comportar)

| Arquivo | Para que serve |
|---|---|
| `DOCUMENTACAO.md` | Documento principal: visão do produto, requisitos, backlog, decisões de arquitetura (ADR), testes e limitações |
| `REQUISITOS_REGRAS_DE_NEGOCIO.md` | Perfis, regras de negócio (RN) e requisitos, com o que é núcleo e o que é futuro |
| `FLUXOS.md` | Fluxo da demanda e máquina de estados (status e transições) |
| `MENSAGENS_VALIDACAO.md` | Catálogo dos textos de instrução e de erro mostrados nas telas |

## 2. Como o trabalho foi conduzido (instruções dadas à IA)

Usamos IA para construir o projeto. Estes arquivos são as regras que ela devia seguir.

| Arquivo | Para que serve |
|---|---|
| `AGENTS.md` e `CLAUDE.md` (na raiz) | Regras gerais para ferramentas de IA que trabalham no repositório, e o que ler em cada situação |
| `CONTEXTO_E_PREFERENCIAS.md` | Contexto do projeto e preferências do grupo, para a IA continuar o trabalho sem o histórico da conversa |
| `PROMPT_BLOCOS.md` | Plano de trabalho dividido em blocos, um por vez, com plano aprovado antes de editar |
| `ENGINEERING.md` | Como diagnosticar, implementar e revisar mudanças |
| `VERIFICATION.md` | Como verificar: sem evidência, não se diz "testado" |
| `CONVENCOES.md` | Padrão de commits, comentários e registro de mudanças |
| `ERROR_HANDLING.md` | Princípios de validação, falhas e mensagens |

## 3. Registro do processo (o que foi feito e o que falta)

| Arquivo | Para que serve |
|---|---|
| `CHANGELOG.md` | Uma entrada por bloco ou pull request: o que mudou e por quê |
| `EXPLICACAO_BLOCO1.md` até `EXPLICACAO_BLOCO4C.md` | Explicação de cada bloco, escrita para estudar o código |
| `TESTES_PENDENTES.md` | Testes ainda não feitos ou sem evidência |
| `ATAS_RASCUNHO_27-09_e_02-10.md` | Rascunhos de ata feitos depois das reuniões, a partir do chat, para revisão de quem participou |
| `evidencias/` | Relatórios do axe (antes e depois) e capturas de teste (celular, 360 px, Lighthouse, NVDA, zoom) |
| `wireframes/` | Capturas do Figma Make e do Figma Design, com a linha do tempo de como o layout surgiu |

## Observações

- Parte das regras e dos prazos ainda é **proposta**, aguardando votação do grupo. Os documentos dizem isso onde acontece.
- Se um documento e o app divergirem, vale o que o app faz hoje. Os prazos de aceite (48 h; 24 h após redirecionamento) e de triagem (24 h) são propostas ainda não votadas em ata (RN09, RN17, RN18).

## Glossário

- **Bloco 1 a 4:** etapas de desenvolvimento, cada uma com uma branch e um pull request (ADR-09 em `DOCUMENTACAO.md`; `CHANGELOG.md`). Bloco 1: dados, regras e login. Bloco 2A: telas ligadas aos dados. Bloco 2B: Nova Demanda. Bloco 3: acessibilidade. Blocos 4A, 4B e 4C: aceite e recusa, fila de atenção e ações da gerência. "2C" é a parte do Bloco 2 que não foi implementada (aviso de conexão e fila "Pendentes de envio").
- **Blocos A a D (testes):** grupos de testes manuais da rodada final, sem relação com os Blocos 1 a 4. A: demandas encerradas e em andamento, e ordenação. B: Nova Demanda só com teclado. C: falha simulada (`?falha=1`) e "Resetar dados". D: celular Android real.
- **Rodada final:** testes manuais feitos pelo autor em 04/10/2026, depois do PR #9: retestes 1 a 12 e Blocos A a D (`TESTES_PENDENTES.md`, seção 0).
- **PR #9:** pull request da branch `fix/ajustes-teste-manual`, com os 9 ajustes que saíram da bateria de testes manuais do autor (`CHANGELOG.md`, "Ajustes do teste manual").
- **Assistente:** a ferramenta de IA usada nas correções (Claude Code e Claude; ADR-06). "Conferido pelo assistente" quer dizer que a conferência foi feita pela ferramenta, e não pela equipe.
- **Navegador embutido:** o navegador do aplicativo usado pelo assistente nas conferências. Não substitui o teste no Edge: não mostra a cor e a espessura do contorno de foco e bloqueia a colagem de texto (`CHANGELOG.md`, Blocos 2B e 3).
- **Autor:** integrante do grupo que fez as correções com apoio de IA (ADR-06) e executou os testes manuais citados em `evidencias/` e em `TESTES_PENDENTES.md` (o nome está nos arquivos `TESTE_MANUAL_*.md` e no `CHANGELOG.md`).
- **Kit de 03/10:** primeira versão dos documentos de requisitos, fluxos e plano de trabalho, de 03/10/2026.
- **[PROPOSTA]:** regra ou decisão ainda não votada em ata.
