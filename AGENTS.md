# AGENTS.md — contrato para qualquer agente de código neste projeto

Projeto "Demanda de Aço" (PBL, Programação Web). Front-end React 19 + Vite, sem back-end; dados em JSON (semente) + `localStorage`. Entrega: **terça 06/10/2026, à noite**. Todos do grupo precisam explicar o código.

## Quando ler o quê (não leia tudo para uma pergunta simples ou ajuste trivial)
| Situação | Leia |
|---|---|
| Início de uma sessão de trabalho | `docs/CONTEXTO_E_PREFERENCIAS.md` |
| Executar um bloco ou mexer em regra de negócio | `docs/PROMPT_BLOCOS.md`, `docs/REQUISITOS_REGRAS_DE_NEGOCIO.md` |
| Implementar, corrigir ou refatorar código | [`docs/ENGINEERING.md`](docs/ENGINEERING.md) |
| Alterar formulários, login, storage, offline/rede ou fluxos de falha | [`docs/ERROR_HANDLING.md`](docs/ERROR_HANDLING.md) |
| Planejar e validar uma alteração, ou declarar algo concluído | [`docs/VERIFICATION.md`](docs/VERIFICATION.md) |
| Texto de mensagens ao usuário | `docs/MENSAGENS_VALIDACAO.md` |

## Contrato
1. **Escopo.** Faça o que foi pedido. Achados fora do escopo viram **sugestão** no fim da resposta; não os implemente.
2. **Autorização.** Não faça commit, push, deploy, exclusão de dados nem mudanças fora da pasta do projeto sem pedido explícito. Aqui o `git` não está no PATH: o usuário commita pelo GitHub Desktop; entregue **mensagens de commit sugeridas**. Nunca altere o `main`.
3. **Trabalho existente.** Preserve alterações locais e as telas dos colegas (layout e classes CSS). Sem comandos destrutivos.
4. **Decisões.** Se faltar informação que mude comportamento, dados, segurança ou escopo, pergunte (poucas perguntas, com sugestão de padrão). O que já está decidido em `docs/` não se pergunta de novo.
5. **Honestidade.** Nunca invente resultado de teste, auditoria, print ou ata. O que não foi executado: "não executado". Não escreva "corrigido", "testado" ou "compatível" sem evidência.
6. **Aprendizado.** O usuário precisa entender: explique o porquê em linguagem simples; ao fim de cada bloco gere `docs/EXPLICACAO_BLOCO<N>.md`.
7. **Idioma.** Português do Brasil em código comentado, commits e documentação.
8. **Ao concluir:** informe arquivos alterados, comportamento resultante, verificações feitas e resultados, limitações e sugestões fora do escopo (modelo em `docs/VERIFICATION.md`).

Em caso de conflito: pedido atual do usuário > este arquivo > documentos de `docs/`.
