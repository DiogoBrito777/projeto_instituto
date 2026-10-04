# Auditoria "depois" — o que já existe e o que falta

> Este arquivo dizia que a auditoria "depois" não tinha sido executada. **Isso mudou:** atualizado em 04/10/2026.

**Já existe:** `RELATORIO_AXE_DEPOIS.md` + `axe_depois.json`, nesta pasta.
- axe-core 4.13.0, gerado **pelo assistente, em ambiente de nuvem, não pela equipe**, sobre a branch `fix/acessibilidade` (Bloco 3);
- **0 violações nas 26 combinações** (login + 6 rotas × 2 perfis, em 1280 e 360 px);
- 12 itens "incompletos": contraste do menu lateral em 360 px, pendente de conferência manual.

**Ainda falta (pendente):**
- nova rodada do axe **pela equipe**, de preferência depois dos Blocos 4A a 4C;
- Lighthouse;
- teste com leitor de tela (Narrador ou NVDA);
- celular real;
- zoom de 400%.

Para cada um, anotar quem executou e quando. Passo a passo em `docs/TESTES_PENDENTES.md`, seção 3.
