# 06 — Aceite, recusa, triagem e Atualizar (regras de negócio)

## (a) O que faz
A demanda nasce "Pendente de aceite". O setor de destino **aceita**, escolhendo a prioridade que define o prazo, ou **recusa** com motivo, e aí a demanda vai para a **triagem** da gerência. A gerência **redireciona** para outro setor, marca **Não aplicável** ou **cancela**, sempre com justificativa. Depois de aceita, o setor atualiza o status até **Concluída**.

## (b) Onde está no código
| Arquivo | Função |
|---|---|
| `src/domain/status.js` | `STATUS` (os 7 status), `estaFinal`, `proximosStatus`, `podeTransicionar` |
| `src/domain/permissoes.js` | `ehGerencia`, `ehExecutor`, `ehSolicitante`, `setorResponsavel`, `podeVer`, `podeVerDetalhes`, `resumoParaSolicitante`, `podeAceitar`, `podeRecusar`, `podeRedirecionar`, `podeCancelar` |
| `src/domain/acoes.js` | `aceitarDemanda`, `recusarDemanda`, `redirecionarDemanda`, `marcarNaoAplicavel`, `cancelarDemanda`, `salvarAtualizacao`, `statusParaEdicao`, `podeEditar`, `motivoDaTriagem` |
| `src/domain/prioridades.js` | `PRIORIDADES`, `PRAZO_EM_HORAS`, `descreverPrazo` |
| `src/domain/prazos.js` | `prazoResolucao`, `vencida`, `aExpirar`, `aguardandoMuito` |
| `src/domain/atencao.js` | `LIMITE_ACEITE_HORAS` (48), `LIMITE_TRIAGEM_HORAS` (24), `LIMITE_ACEITE_REDIRECIONADA_HORAS` (24), `prazoDeAceite`, `estaAtrasada`, `seloDeAtencao` |
| `src/pages/DetalhesDemanda.jsx` | botões "Aceitar ou recusar", "Atualizar demanda" e "Triar demanda"; campo "Aceitar até" |
| `src/pages/AtualizarDemanda.jsx` | modo aceite (aceitar/recusar) e modo de atualização (status, tipo, observação) |
| `src/pages/TriagemDemanda.jsx` | modo triagem (`FormularioTriagem`): redirecionar, Não aplicável, Cancelar |

## (c) As regras, uma por uma
| Regra | O que diz | Onde |
|---|---|---|
| **RN02** | Histórico, prazos e prioridade só para o setor executor e a gerência | `podeVerDetalhes` |
| **RN03** | Quem abriu vê só o resumo: número, título, descrição, tipo, datas, status e "Setor atual" | `resumoParaSolicitante` |
| **RN09** | Nasce Pendente de aceite, sem prioridade. Texto atual: 72 h para aceitar. **Proposta em uso: 48 h** (a confirmar em ata); depois disso, selo "Atrasada para aceite" | `LIMITE_ACEITE_HORAS`, `estaAtrasada` |
| **RN10** | Para aceitar, o setor **escolhe a prioridade**, que fica travada | `aceitarDemanda` (erro `prioridade-ausente`) |
| **RN11** | Recusar exige motivo (até 500 caracteres); a demanda vai para **Em triagem** e passa a ser da gerência | `recusarDemanda`, `setorResponsavel` |
| **RN12** | Para quem abriu, "Pendente de aceite" aparece como "Não aceita pelo setor" | `resumoParaSolicitante` (ver o achado A15) |
| **RN13** | O prazo de resolução conta **a partir do aceite**: Urgente 24 h, Alta 48 h, **Média 72 h**, Baixa 7 dias | `PRAZO_EM_HORAS`, `calcularPrazoResolucao` |
| **RN17** | Triagem parada recebe selo. Texto atual: 72 h. **Proposta em uso: 24 h**, contadas da recusa | `LIMITE_TRIAGEM_HORAS` |
| **RN18** | Só a gerência redireciona, só em triagem: escolhe o setor, o tipo e uma **justificativa obrigatória**. Volta a Pendente de aceite e o novo setor tem **24 h** | `redirecionarDemanda`, `prazoAposRedirecionar` |
| **RN19** | Só a gerência marca Não aplicável (só em triagem) ou Cancela, com justificativa | `marcarNaoAplicavel`, `cancelarDemanda` |
| **RN20** | Concluída, Não aplicável e Cancelada são **finais**: ninguém altera | `estaFinal` |
| **RN22** | Toda ação vira um item no histórico (autor, perfil, data, texto) | função `evento` em `acoes.js` |

**Atualizar** (`salvarAtualizacao`): o setor executor muda o status (Em andamento ↔ Aguardando, ou para Concluída), o tipo de atendimento e uma observação de até 500 caracteres. A regra roda de novo na hora de gravar.

## (d) Demonstração em 1 minuto
1. `user04` (Elétrica) → DM-2002 → "Aceitar ou recusar" → aceitar sem prioridade dá erro; com prioridade Alta abre o pop-up "48 horas" → confirmar → Em andamento.
2. `admin` → DM-2013 → "Triar demanda" → aparecem o motivo e quem recusou → redirecionar para Hidráulica, "Vazamento", com justificativa.
3. `user02` → DM-2013 → "Aceitar até" = 24 h depois do redirecionamento.

## (e) Perguntas de revisão
- **Quem define a prioridade?** O setor que executa, no aceite (RN10). A gerência não define (RN05).
- **Por que a justificativa no redirecionamento?** Cada redirecionamento dá mais 24 h; sem motivo registrado, o prazo poderia ser esticado sem ninguém saber por quê.
- **Uma demanda concluída pode ser reaberta?** Não (RN20). Reabrir com citação é trabalho futuro (RN24).
- **Onde as regras são garantidas?** Em funções puras, com testes, que rodam também na hora de gravar. Esconder botão não basta.
- **O setor que recusou continua vendo?** Não: em triagem a demanda é da gerência (`setorResponsavel`); quem abriu vê "Setor atual: Gerenciamento".

## (f) O que não está pronto / limitações
- **Novo prazo com justificativa (RN14) e cobrança no histórico (RN21): sem tela.** As permissões existem (`podeRegistrarPrazo`, `podeCobrar`).
- **Devolver à triagem** uma demanda já aceita: a transição existe em `status.js`, mas não há tela.
- **A16:** na tela Atualizar, o select de status corta "Pendente de aceit" (`max-width: 170px` em `DetalhesDemanda.css`).
- **A15:** o texto "Não aceita pelo setor" (RN12) confunde quem abriu; a proposta é "Aguardando aceite do setor".
- `src/domain/prazos.js` ainda tem `prazoAceite`/`aceiteAtrasado` com 72 h (texto atual da RN09); as telas usam `atencao.js` (48 h).
- As regras de 03/10 em diante **ainda não foram votadas em ata** (propostas 12 a 15).
