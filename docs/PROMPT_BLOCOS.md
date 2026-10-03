# Prompt do agente — Demanda de Aço — execução por BLOCOS (kit final de 03/10/2026)

**Uso:** peça ao agente **um bloco por vez**. Antes de editar, ele mostra o plano e espera aprovação. Fim de cada bloco: lint, build, test, CHANGELOG, `docs/EXPLICACAO_BLOCO<N>.md`, resumo para o PR, sugestão de commits.
**Prazo real:** a entrega é terça, 06/10 (noite). O tempo de desenvolvimento é sábado e parte do domingo. Ordem de prioridade: Bloco 1 → 2 → 3 → 4. O que não couber é registrado como adiado (`DOCUMENTACAO.md`, seção 18).

## Regras gerais (valem para todos os blocos)
1. A base é o `main` atual. **Não reescreva telas existentes** (`VisaoGeral*`, `DetalhesDemanda`, `AtualizarDemanda`, `Sidebar`, `Demandas`, `Departamentos`, `NovaDemanda`): mantenha layout e classes CSS e apenas ligue aos dados e às regras.
2. Leia antes: `docs/REQUISITOS_REGRAS_DE_NEGOCIO.md` (fonte das regras), `docs/DOCUMENTACAO.md` (seção 7: defeitos), `docs/FLUXOS.md`, `docs/MENSAGENS_VALIDACAO.md` (textos prontos: não invente mensagens), `docs/evidencias/antes/RELATORIO_AXE_ANTES.md`.
3. Português do Brasil. Nunca invente evidência: o que não foi executado fica "não executado".
4. Código simples e comentado **no porquê** (ver `docs/CONVENCOES.md`). A pessoa que vai apresentar precisa entender cada arquivo.
5. Regras de permissão, transição e prazo ficam em **funções puras** (sem React, sem localStorage), com testes `vitest`. A interface só chama essas funções. Nunca "esconder botão" sem a função e o teste.
6. Funções de prazo recebem o `agora` por parâmetro.
7. Dependências novas só com justificativa (`vitest` como devDependency é esperado).
8. Antes de encerrar: `npm run lint`, `npm run build`, `npm test`; sem avisos novos.

## Modelo de dados (todos os blocos)
- `departamentos.json`: 4 setores (`tecnologia`, `hidraulica`, `administrativo`, `eletrica`); **acrescente** `tiposAtendimento` (lista) por setor; remova contadores fixos (`demandasAbertas` passa a ser calculado).
- `usuarios.json`: `admin` (perfil `gerenciamento`) e `user01` (tecnologia), `user02` (hidraulica), `user03` (administrativo), `user04` (eletrica); senha igual ao usuário.
- Demanda: `id, titulo, descricao, tipo, origem, destino, prioridade ("Não definida"|"Baixa"|"Média"|"Alta"|"Urgente"), status, criadaEm, aceitaEm, prazo, redirecionadaEm, aguardandoDesde, solicitante, historico[]`. `origem` pode ser `gerenciamento`.
- Histórico: `{id, data, autor, perfil, tipo, texto}`.
- Status (7) e transições: `REQUISITOS_REGRAS_DE_NEGOCIO.md`, seção 4. Prazos: Urgente 24 h, Alta 48 h, Média 72 h, Baixa 7 dias; aceite em 72 h.
- Seed: remapear origens legadas para os 4 setores; **datas relativas ao momento do seed**; cobrir os casos da seção 10 dos requisitos.
- IDs: `crypto.randomUUID()` ou contador persistido, **nunca** `Date.now().slice(-4)`.
- Storage: chaves versionadas; primeira carga = `getItem(...) === null`; `try/catch` em leitura e escrita; função "Resetar dados"; atraso simulado curto (200–300 ms) só em gravações; falha simulável com `?falha=1` para demonstrar o estado de erro.

---
## BLOCO 1 — Fundação · branch `feat/fundacao`
Entregar: (a) JSONs e seed; (b) `src/services/storage.js` e hooks; (c) `src/domain/status.js`, `prioridades.js`, `prazos.js`, `permissoes.js` com testes (`podeVer`, `resumoParaSolicitante`, `podeAceitar`, `podeRecusar`, `podeRedirecionar`, `podeCancelar`, `podeRegistrarPrazo`, `proximosStatus`, `estaFinal`, `prazoAceite`, `prazoResolucao`, `aExpirar`, `vencida`, `aceiteAtrasado`, `aguardandoMuito`); (d) login (`Login.jsx`, `auth.js`, sessão em `sessionStorage`), **Sair** funcional, guarda de rotas em `App.jsx`, Sidebar mostrando o usuário logado e itens conforme o perfil. Corrija avisos de lint `setState` em `useEffect` ao escrever os hooks.
Telas existentes: só o mínimo para compilar.
Aceite: `npm test` verde; RN01, RN02–RN06 cobertas por teste; CT-R01, CT-R02, CT-R11.

## BLOCO 2 — Telas e Nova Demanda · branch `feat/telas-nova-demanda`
- `Demandas`: dados da store; abas **Recebidas** e **Solicitadas** (gerência: **Todas** e **Solicitadas por mim**); filtro por departamento (travado ao próprio setor); **todos** os cards abrem o detalhe; seção "Pendentes de aceite" no topo; ordenação prioridade → mais recente → nome; estados de carregando, vazio e erro. Acrescente o nível **Urgente** (dados, ordenação, estilo).
- `DetalhesDemanda` e `AtualizarDemanda`: ler `:id`; guarda RN04; quem é só origem vê **apenas** o resumo (`resumoParaSolicitante`), nunca histórico, prazo, prioridade; remover tudo fixo em "DM-2048"; "Responsável" mostra setor; campos de setor em lista, não texto livre.
- `Departamentos`: "Acessar setor" abre as demandas daquele setor.
- `VisaoGeral`: layout atual mantido; números **calculados** (seção 6 dos requisitos); unificar `VisaoGeral.json` na store; corrigir `alta-prioridade` (é prioridade, não status).
- `NovaDemanda`: origem e data automáticas pelo perfil (campo visível, travado); destino em lista (sem o próprio setor); tipo depende do destino; título (60) e descrição (500) com contador; validação com `docs/MENSAGENS_VALIDACAO.md`, foco no primeiro erro, `aria-describedby`; status inicial **Pendente de aceite**; **pop-up (diálogo acessível)** de confirmação com o número; online/offline com aviso `aria-live`; fila **"Pendentes de envio"** (lista + "Enviar agora"); rascunho preservado.
Aceite: CT-R03, CT-R04, CT-R07; abrir 3 demandas diferentes mostra dados diferentes; criar, recarregar e continuar lá; offline guarda e envia ao voltar.

## BLOCO 3 — Acessibilidade · branch `fix/acessibilidade`
Corrigir o que o axe e a leitura de código apontaram (`DOCUMENTACAO.md` G10–G14, G20):
- **Contraste:** ajustar as cores que reprovam (lista em `RELATORIO_AXE_ANTES.md`) para ≥ 4,5:1 mantendo a identidade visual; centralizar em variáveis CSS; conferir selos (badges), rótulos cinza, avatar e "Ctrl K".
- **Foco visível** em todos os campos, `select` e botões (`:focus-visible` com contorno claro); revisar todo `outline: none/0`.
- Um único `<h1>` por tela; foco movido ao título ao trocar de rota; **skip link**; `aria-live` em resultados e erros.
- Rótulo na busca da Visão Geral; `aria-pressed` nas abas de filtro; remover o "Ctrl K" decorativo (ou implementar).
- Diálogos: foco entra e fica preso, Esc fecha, foco volta ao botão de origem, rótulos e papéis corretos.
- Alvo de toque mínimo no `select` de prioridade; `prefers-reduced-motion`.
- **Não** gere nem invente auditoria "depois": deixe `docs/evidencias/depois/` para a equipe rodar o mesmo procedimento do relatório "antes".
Aceite: itens acima verificáveis; CT-R13, CT-R14 ficam para teste manual.

## BLOCO 4 — Regras de aceite e prazos (só se houver tempo) · branch `feat/regras-aceite`
Ligar as funções do Bloco 1 à interface, nesta ordem (cada subitem pode virar um commit):
1. **Aceitar** com prioridade obrigatória, pop-up de confirmação (`MENSAGENS_VALIDACAO.md`) e prioridade travada.
2. Exibir prazo (só ao setor executor e à gerência), "a expirar", "vencida", "aceite atrasado".
3. **Recusar** com motivo → Em triagem; gerência **Redirecionar** ("Atribuir responsável" vira "Redirecionar para outro departamento", só gerência).
4. **Concluir** e travar: demanda final sem nenhuma ação para ninguém.
5. Selo "Aguardando há mais de 7 dias" e **novo prazo com justificativa** (pop-up; vai ao histórico).
6. Gerência: **Não aplicável** e **Cancelar** (justificativa) e cobrança escrita no histórico.
Aceite: CA-R02 a CA-R09, CA-R11; CT-R05, CT-R06, CT-R08 a CT-R10, CT-R12.

## Proibições
- Reescrever telas dos colegas ou trocar de framework.
- Dar a um setor qualquer meio de enviar demanda direto a outro setor.
- Mostrar histórico, prazo, prioridade ou justificativas a quem é apenas origem.
- Implementar o que está marcado como **Futuro** (chat, reabrir, "visualizada", responsável individual).
- Inventar resultados de teste, auditorias ou atas.
