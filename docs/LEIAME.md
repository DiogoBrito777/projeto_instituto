# Guia da pasta `docs/`

Esta pasta tem muitos arquivos porque o projeto foi feito com apoio de IA, em blocos, e cada passo ficou registrado. Aqui está o que cada grupo de arquivos é e para quem serve.

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
| `TESTES_PENDENTES.md` | Testes que ainda não foram feitos ou não têm evidência, registrados sem esconder |
| `ATAS_RASCUNHO_27-09_e_02-10.md` | Rascunhos de ata feitos depois das reuniões, a partir do chat, para revisão de quem participou |
| `evidencias/` | Relatórios do axe (antes e depois) e capturas de teste (celular, 360 px, Lighthouse, NVDA, zoom) |
| `wireframes/` | Capturas do Figma Make e do Figma Design, com a linha do tempo de como o layout surgiu |

## 4. Estudo (para a apresentação)

| Arquivo | Para que serve |
|---|---|
| `GUIA_DE_ESTUDO.md` | Resumo do projeto e das perguntas que podem aparecer |
| `estudo/` | Material por tema, perguntas rápidas, roteiro da apresentação e falhas conhecidas |

## Observações

- Parte das regras e dos prazos ainda é **proposta**, aguardando votação do grupo. Os documentos dizem isso onde acontece.
- Se um documento e o app divergirem, vale o que o app faz hoje. Uma diferença conhecida: os prazos de aceite e triagem no app são 48 h e 24 h (propostas), e alguns documentos antigos ainda dizem 72 h.
