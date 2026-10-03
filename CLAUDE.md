# Claude Code — Demanda de Aço

Leia **`AGENTS.md`** (contrato geral e quando ler cada documento) e, ao iniciar uma sessão, `docs/CONTEXTO_E_PREFERENCIAS.md`.

Específico para o Claude Code:
- Execute **só o bloco pedido** de `docs/PROMPT_BLOCOS.md`. Antes de editar, mostre o plano e espere aprovação.
- Sem commit nem push (o `git` não está no PATH). Ao final do bloco: `npm run lint`, `npm run build`, `npm test`, entrada em `docs/CHANGELOG.md`, `docs/EXPLICACAO_BLOCO<N>.md`, resumo para o PR e mensagens de commit sugeridas (formato em `docs/CONVENCOES.md`).
- Não reescreva telas existentes; ligue-as aos dados mantendo layout e classes CSS.
- Regras de permissão, transição e prazo: funções puras com teste.
