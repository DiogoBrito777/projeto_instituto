# Auditoria e testes "depois": o que existe e o que não foi executado

> Atualizado em 04/10/2026, depois da rodada final de testes do autor (Bruno Diogo). Decisão do autor: nenhuma correção de código antes da apresentação (06/10).

**Já existe nesta pasta:**
- `RELATORIO_AXE_DEPOIS.md` + `axe_depois.json`: axe-core 4.13.0 gerado **pelo assistente, em ambiente de nuvem, não pela equipe**, sobre o Bloco 3. **0 violações nas 26 combinações.** 12 itens "incompletos" (contraste do menu em 360 px).
- Prints do autor: Lighthouse (Visão Geral e Nova Demanda, `admin`, desktop: 100/100), NVDA + Edge InPrivate, 360 px no DevTools, zoom de 200% no Chrome, celular Android (rodada anterior ao PR #9).
- `celular/`: **ainda não existe**; o autor vai criar a pasta e salvar os prints da rodada final no celular.

**Não executado (motivo: falta de tempo antes da apresentação):**
- nova rodada do axe no código atual;
- Lighthouse nas demais telas (Login, Demandas, Detalhes, Atualizar) e no mobile;
- NVDA na rodada de reteste (Visão Geral, Demandas, Nova Demanda);
- zoom de 400% e 500%;
- dados corrompidos no `localStorage` pelo F12;
- reabrir o aviso de limite de 500 caracteres;
- Voz de Acesso.

**Executado, com falha:** no celular real (acesso pelo IP da rede), o envio da Nova Demanda trava em "Enviando…" (falha F1, `docs/DOCUMENTACAO.md`, seção 23).

Detalhes item a item em `docs/TESTES_PENDENTES.md`.
