# Verificação — testes e evidências para declarar uma tarefa concluída

Leia ao **planejar e validar** alterações. Regra de ouro: **sem evidência, não diga "corrigido", "testado" ou "compatível"**; diga "não executado".

## 1. Comandos reais do projeto
`npm install` · `npm run lint` · `npm run build` · `npm test` (após o Bloco 1) · `npm run dev` (teste manual).
**Linha de base do `main` de 03/10:** lint sem avisos, build OK, **sem testes**. Qualquer aviso novo é **seu**; corrija. O que já falhava antes: registre como "preexistente".

## 2. Testes proporcionais ao risco
| Mudança | Verificação mínima |
|---|---|
| Regras (permissão, transição, prazo) | Testes unitários (`vitest`) **incluindo caminhos negativos** (ex.: `user01` **não** vê demanda de outro setor; gerência **não** define prioridade; estado final não muda) |
| Storage | Testes com backend de armazenamento **falso injetado** (sem `jsdom`): seed, primeira carga, JSON corrompido, quota cheia, versão de chave |
| Telas / fluxos | Checklist manual no navegador, com os 5 logins; registrar o que foi visto |
| Formulários | Vazio, limite, válido, offline, falha simulada (`?falha=1`), recarregar a página |
| Acessibilidade | axe automático + teclado + leitor de tela (seção 4) |
| Mudança só de documentação | Conferir links e consistência com os requisitos |

## 3. Falha nova × preexistente × não executada
Em todo relatório separe: **falha nova** (causada por você: corrigir), **falha preexistente** (anote, não conserte sem pedido) e **verificação não executada** (diga por quê). Analise a saída real; não presuma sucesso.

## 4. Evidência de acessibilidade (peso alto na nota)
- **Antes:** já existe em `docs/evidencias/antes/` (axe-core 4.13.0 sobre o build do `main` de 03/10; 6 rotas × 1280/360 px).
- **Depois:** existe a rodada feita pelo assistente (`docs/evidencias/depois/RELATORIO_AXE_DEPOIS.md`, registrada como tal); a rodada da equipe, com o mesmo procedimento, está pendente. Também: Lighthouse no Edge ou no Chrome, **teste só com teclado** (Tab/Shift+Tab/Enter/Espaço/Esc) e **leitor de tela** (NVDA/VoiceOver), anotando **quem executou e quando**.
- Auditoria automática cobre só parte; os itens manuais continuam abertos até alguém executá-los.

## 5. Definição de pronto (por tarefa)
☐ Comportamento esperado e critérios de aceitação definidos · ☐ Lint, build e testes rodados e resultados lidos · ☐ Caminhos de falha relevantes testados · ☐ Checklist manual feito (ou "não executado") · ☐ Acessibilidade da tela conferida · ☐ `docs/CHANGELOG.md` atualizado · ☐ `docs/EXPLICACAO_BLOCO<N>.md` escrito · ☐ Mensagens de commit sugeridas · ☐ Sem `console.log` de depuração nem código comentado.

## 6. Modelo do relatório final
```
Arquivos alterados: ...
Comportamento resultante: ...
Requisitos/CA cobertos: ...
Verificações: lint [resultado] · build [resultado] · test [N passaram, M falharam] · manual [o que foi feito / não executado]
Falhas: novas [...] · preexistentes [...] · não executadas [... por quê]
Limitações: ...
Sugestões fora do escopo: ...
Commits sugeridos: ...
```

## 7. Revisão da documentação (20/10/2026)
Revisão de todos os textos explicativos do repositório, conferidos contra o código de `src/`. Só documentação: nenhum arquivo de `src/` foi alterado, nenhum arquivo foi movido e o `.gitignore` não mudou. O `docs/PROMPT_BLOCOS.md` não foi editado.

**Verificações**
- `npm test`: 12 arquivos, 245 testes passaram (antes e depois da revisão; é o número citado na documentação).
- `npm run lint`: código de saída 0, sem avisos nem erros impressos.
- `npm run build`: não executado (a revisão não mudou código).
- Fatos conferidos no código: 13 demandas no seed (DM-2001 a DM-2013); usuários `admin` e `user01` a `user04`; chaves `demanda-de-aco:v1:demandas`, `:contador` e `:sessao`; atrasos de 150 ms (leitura) e 250 ms (gravação), 2 s com `?lento=1`; `?falha=1` só nas gravações; prazos de aceite de 48 h (24 h após redirecionamento) e de triagem de 24 h em `src/domain/atencao.js`; tag `v1.0-pbl` existente.
- Links internos e caminhos citados: conferidos por script. Os únicos caminhos inexistentes eram `docs/evidencias/depois/celular/` (agora "sem print no repositório") e os de `docs/estudo/` e `docs/GUIA_DE_ESTUDO.md`, que só aparecem em entradas antigas do CHANGELOG.

**O que foi alterado**
- Frases defensivas e termos como "honestidade", "sem esconder" e "nada foi inventado": retirados (README, LEIAME, DOCUMENTACAO, TESTES_PENDENTES, ATAS_RASCUNHO, EXPLICACAO_BLOCO4B, AGENTS, CONTEXTO_E_PREFERENCIAS).
- "O enunciado proíbe back-end": trocado por "o enunciado pede dados simulados" (DOCUMENTACAO, ADR-02, §20 e §20.4).
- Frases do tipo "todos precisam saber explicar o código": retiradas (ADR-01, ADR-06, CONVENCOES, AGENTS, CONTEXTO_E_PREFERENCIAS).
- Afirmações sem evidência: retiradas ou reescritas (README, "funciona no celular" e "pela Vercel funciona"; DOCUMENTACAO §14; EXPLICACAO_BLOCO3).
- Divergências com o código: corrigidas (FLUXOS, 72 h → 48 h; ERROR_HANDLING, `navigator.onLine` e o rascunho marcados como não implementados; MENSAGENS, mensagens de conexão marcadas como não implementadas; ADR-03, `cobrancas[]`; usuário `ti` → `user01` no TC01; números das próximas demandas, DM-2014).
- Contradições entre a DOCUMENTACAO, os REQUISITOS e o TESTES_PENDENTES: resolvidas a favor do registro de testes (TC01, TC03, TC05, TC14, TC16, CT-R05, CT-R08, §18 e checklist da §15).
- RF12 e US13 (notificação por e-mail simulada): nova linha na §18, "Adiado: implementação futura", e na matriz (§6), "não implementado". No código não há e-mail, nem simulado; só existem o pop-up de confirmação ao enviar e o aviso "Precisa de atenção" na Visão Geral.
- RNF08 (até 1 s com 100 demandas): nova linha na matriz como "não executado".
- Nomes: "Bruno Diogo" e "Bruno" trocados por "o autor" na DOCUMENTACAO, no TESTES_PENDENTES e no NAO_EXECUTADO_AINDA. Os nomes continuam no CHANGELOG, nos arquivos TESTE_MANUAL e nas atas.
- "Dono do projeto": retirado (EXPLICACAO_BLOCO4C e duas entradas do CHANGELOG); fica só a decisão, sem atribuir autoria.
- Datas: "terça, 06/10, à noite" trocado por "antes da apresentação", sem data.
- Prints que não estão na pasta: registrados como "sem print no repositório".
- Glossário novo em `docs/LEIAME.md` (Blocos 1 a 4, Blocos A a D de teste, rodada final, PR #9, assistente, navegador embutido, autor, kit de 03/10, [PROPOSTA]).
- Passada de estilo: 19 trechos com exagero, defesa ou afirmação absoluta reescritos em tom neutro.
- Três linhas editadas fora do Code, no chat com o Claude, com autorização, e conferidas pelo Code: `DOCUMENTACAO.md:7` (o Lighthouse foi executado em Visão Geral e Nova Demanda, `admin`, desktop; nas demais telas e no mobile, não executado; prints em `docs/evidencias/depois/`), `DOCUMENTACAO.md:435` e `TESTES_PENDENTES.md:20` ("Decisão do autor:" → "Decisão:"). Na mesma lógica, o Code trocou "decisão do autor" por "decisão" em `DOCUMENTACAO.md:292`, `evidencias/depois/NAO_EXECUTADO_AINDA.md:3` e `CHANGELOG.md:399` e `:432`.

**Origem da justificativa do RF12**
- A justificativa ("o envio real de e-mail depende de back-end, que está fora do escopo") vem da própria documentação: `DOCUMENTACAO.md`, seção 3 (fora do escopo: back-end e e-mail real) e seção 1 (limites).
- A decisão sobre a versão simulada não consta em ata. **Pendente de confirmação do grupo.**

**Não executado**
- `npm run build`.
- Consulta aos PRs no GitHub para saber quem revisou cada um: o `gh` não está instalado nesta máquina. O ADR-06 registra a informação como pendência.
- Renderização dos diagramas Mermaid editados (`FLUXOS.md`): não conferida.

**Classificação dos arquivos (decisão de mover: pendente; nada foi movido)**

| Arquivo | Classe | Quem referencia | O que quebra se mover |
|---|---|---|---|
| README, LEIAME, DOCUMENTACAO, REQUISITOS, FLUXOS, MENSAGENS_VALIDACAO, CHANGELOG, TESTES_PENDENTES, `evidencias/`, `wireframes/`, PR template | A (entrega) | — | — |
| CONVENCOES.md | A (processo) | CLAUDE.md, CHANGELOG, ENGINEERING, PROMPT_BLOCOS, ADR-09, LEIAME | referências nesses arquivos |
| ERROR_HANDLING.md | A | AGENTS, LEIAME, ENGINEERING, TESTES_PENDENTES 1.1, TESTE_MANUAL_BLOCO1 e 5 comentários em `src/` | os comentários de `src/` |
| ATAS_RASCUNHO | A se revisadas pelo grupo; senão B | DOCUMENTACAO §11 e §12, CONTEXTO, wireframes/LEIAME, LEIAME | 4 referências |
| EXPLICACAO_BLOCO1 a 4C | B (estudo) | CLAUDE.md, AGENTS, CONVENCOES, VERIFICATION §5, LEIAME, DOCUMENTACAO §14, §22 e ADR-09, TESTES_PENDENTES | referências na DOCUMENTACAO e no LEIAME; caminho no CLAUDE.md |
| CLAUDE.md | C | — | precisa ficar na raiz para ser lido pelo Claude Code |
| AGENTS.md | C | CLAUDE.md, LEIAME | caminho no CLAUDE.md |
| PROMPT_BLOCOS.md | C | CLAUDE.md, AGENTS, CONTEXTO, LEIAME, CHANGELOG | CLAUDE.md e AGENTS |
| CONTEXTO_E_PREFERENCIAS.md | C | CLAUDE.md, AGENTS, LEIAME, CHANGELOG | CLAUDE.md e AGENTS |
| ENGINEERING.md | C | AGENTS, LEIAME e o comentário de `src/components/Dialogo.jsx` | o comentário de `src/` |
| VERIFICATION.md | C | AGENTS, LEIAME | AGENTS; este relatório iria junto |

Nenhum script, nem o `package.json` nem o `.gitignore`, referencia `docs/`. Pasta sugerida para B e C: `_interno/`.

**Pendente de decisão do grupo (lacunas; nenhum conteúdo foi preenchido)**
1. RF12: confirmar se a versão simulada fica adiada e registrar a decisão em ata.
2. RNF08: medir ou registrar como adiado.
3. RNF07 / eMAG: mapear os números exatos do eMAG 3.1 (DOCUMENTACAO §9).
4. Enunciado, Atas 08/09, 15/09, 22/09 e 29/09 e documento técnico de 15/09: citados como fonte, mas fora do repositório.
5. Quem revisou cada PR (ADR-06 e ADR-09).
6. Divisão de tarefas oficial (DOCUMENTACAO §12).
7. Deploy na Vercel: sem decisão (ADR) nem entrada no CHANGELOG.
8. DOCUMENTACAO §10, "Registro de defeitos corrigidos": vazio.
9. DOCUMENTACAO §14: perguntas da retrospectiva sem resposta.
10. `src/data/demandas.json` e `src/data/VisaoGeral.json`: sem uso, aguardando aprovação para remover.
11. Duas regras de prazo de aceite no código: 72 h em `src/domain/prazos.js` (usada só nos testes) e 48 h em `src/domain/atencao.js` (usada nas telas).
12. Tag `v1.0-pbl`: aponta para o PR #14 e não inclui as revisões de documentação posteriores.
13. CHANGELOG: o material de estudo aparece com 14 arquivos (04/10) e com 21 arquivos (06/10).
14. Data da apresentação: indefinida nos documentos.
