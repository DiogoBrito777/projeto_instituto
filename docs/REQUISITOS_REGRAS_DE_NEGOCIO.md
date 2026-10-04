# Regras de negócio, perfis e acesso — Demanda de Aço

> **Versão final do kit — 03/10/2026.** Origem: conversa de alinhamento de 03/10 + Atas 08/09 e 15/09. **Nenhum item aqui foi votado em ata**: são propostas a registrar. Nada foi testado.
> Cada requisito traz a **faixa**: **N** = núcleo (entregar), **R** = regras (entregar se houver tempo), **F** = futuro (especificado, não será implementado agora; ver seção 12).

## 1. Perfis e logins de teste (senha = usuário)
| Usuário | Perfil | Departamento |
|---|---|---|
| `admin` | gerenciamento | — (origem das demandas que ele abre: "Gerenciamento") |
| `user01` | departamento | tecnologia (TI) |
| `user02` | departamento | hidraulica |
| `user03` | departamento | administrativo |
| `user04` | departamento | eletrica |

Um login por departamento nesta entrega. Responsável individual e grupos de acesso: **futuro**.

## 2. Regras de negócio (RN)
**Acesso e visibilidade**
- **RN01 (N)** Sem login só existe a tela de login. Sair encerra a sessão.
- **RN02 (N)** **Departamentos são independentes.** A operação interna de uma demanda (histórico, notas, devolução, justificativas, prazos, prioridade) só é visível ao **setor executor** (`destino`) e ao **gerenciamento**.
- **RN03 (N)** Quem **abriu** a demanda (`origem`) vê apenas: número, título, o que enviou, datas, **status** e **setor atual** (quando está em triagem, o setor atual é "Gerenciamento"). Se a demanda mudar de setor, ele vê o novo local. Sem ações.
- **RN04 (N)** Acesso por URL segue as mesmas regras. Sem permissão ou inexistente: "Demanda não encontrada ou sem permissão."
- **RN05 (N)** O gerenciamento vê tudo e **não define prioridade**.
- **RN06 (N)** Cada setor vê **somente os seus prazos**; o gerenciamento vê os de todos.

**Criação**
- **RN07 (N)** Nova demanda: **origem e data/hora são automáticas**, conforme o perfil logado. Destino em lista (não inclui o próprio setor). Tipo de atendimento depende do destino. O gerenciamento também pode abrir demandas.
- **RN08 (N)** Quem abre **não escolhe prioridade**. Se houver urgência, escreve na descrição.

**Aceite e prioridade**
- **RN09 (R)** Demanda nova entra no setor destino como **Pendente de aceite**, sem prioridade. O setor tem **72 h para aceitar**; depois disso, selo "Aceite atrasado".
  - *Nota (04/10): **proposta: 48h (hoje 72h), a confirmar em ata** (proposta 14 do rascunho de 03/10). A lista e a Visão Geral já usam 48 h (`LIMITE_ACEITE_HORAS` em `src/domain/atencao.js`), com o selo "Atrasada para aceite"; nenhuma outra consequência além do selo.*
- **RN10 (R)** Para aceitar, o setor **deve definir a prioridade** (Urgente, Alta, Média ou Baixa). Um **pop-up de confirmação** resume prioridade e prazo. Depois do aceite a **prioridade fica travada**.
- **RN11 (R)** O setor pode **recusar**, com motivo obrigatório: a demanda vai para **Em triagem**.
- **RN12 (R)** Para quem abriu, "Pendente de aceite" aparece como "Não aceita pelo setor".

**Prazos**
- **RN13 (R)** Prazo de resolução, corrido, contado do **aceite**: Urgente 24 h · Alta 48 h · Média 72 h · Baixa 7 dias.
- **RN14 (R)** O setor executor pode **registrar um novo prazo**, com **justificativa obrigatória** e pop-up de confirmação; fica no histórico (visível à gerência). A prioridade continua travada.
- **RN15 (R)** "A expirar": restar 25% do prazo ou menos. "Vencida": passou do prazo.
- **RN16 (R)** **"Aguardando (processamento interno)"** não pausa o prazo. Acima de **7 dias** nesse status, selo "Aguardando há mais de 7 dias" (cada setor vê o seu; a gerência vê todos).
- **RN17 (R)** Demanda **Em triagem há mais de 72 h** recebe selo para a gerência.
  - *Nota (04/10): **proposta: 24h (hoje 72h), a confirmar em ata** (proposta 14 do rascunho de 03/10). Contadas desde a recusa. A lista e a Visão Geral já usam 24 h (`LIMITE_TRIAGEM_HORAS`), com o selo "Atrasada para triagem", só para a gerência.*

**Triagem e encerramento**
- **RN18 (R)** Só o **gerenciamento** redireciona (muda o destino; volta a Pendente de aceite e o prazo de aceite reinicia). Setor **nunca** envia direto a outro setor. "Atribuir responsável" vira "Redirecionar para outro departamento", só da gerência.
- **RN19 (R)** Só o gerenciamento marca **Não aplicável** (nenhum setor tem competência) ou **Cancelada**, sempre com justificativa. Setor não cancela.
- **RN20 (R)** **Concluída, Não aplicável e Cancelada são finais**: nenhuma alteração por ninguém.
- **RN21 (R)** A gerência pode **cobrar posição** escrevendo no histórico da demanda; o setor executor lê e responde no histórico.
- **RN22 (N)** Toda ação relevante gera item no histórico (autor, perfil, data, texto).

**Futuro**
- **RN23 (F)** Chat solicitante ↔ setor, com aviso "apenas informações básicas". **RN24 (F)** Reabrir = nova demanda que cita a anterior (só com o que o solicitante já vê). **RN25 (F)** "Visualizada pelo setor". **RN26 (F)** Responsável individual / grupos de acesso.

## 3. Matriz de permissões
| Ação | Setor executor | Setor só-origem | Gerenciamento |
|---|---|---|---|
| Ver demanda completa | ✔ | ✘ | ✔ |
| Ver status e setor atual | ✔ | ✔ | ✔ |
| Aceitar + definir prioridade (pendente) | ✔ | ✘ | ✘ |
| Recusar (motivo) | ✔ | ✘ | — |
| Mudar status em andamento/aguardando/concluir | ✔ | ✘ | ✘ |
| Registrar novo prazo (justificativa) | ✔ | ✘ | ✘ |
| Redirecionar (em triagem) | ✘ | ✘ | ✔ |
| Não aplicável / Cancelar (justificativa) | ✘ | ✘ | ✔ |
| Cobrar posição | ✘ | ✘ | ✔ |
| Criar demanda | ✔ | — | ✔ |
| Qualquer ação em demanda final | ✘ | ✘ | ✘ |

## 4. Status e transições
Status (7): **Pendente de aceite · Em andamento · Aguardando (processamento interno) · Em triagem · Concluída · Não aplicável · Cancelada**.

| De | Para | Quem | Exige |
|---|---|---|---|
| (nova) | Pendente de aceite | sistema | — |
| Pendente de aceite | Em andamento | setor | prioridade |
| Pendente de aceite | Em triagem | setor | motivo |
| Em andamento | Aguardando | setor | — |
| Aguardando | Em andamento | setor | — |
| Em andamento / Aguardando | Concluída | setor | — |
| Em andamento / Aguardando | Em triagem | setor | motivo |
| Em triagem | Pendente de aceite | gerência | novo destino |
| Em triagem | Não aplicável | gerência | justificativa |
| Pendente, Andamento, Aguardando, Triagem | Cancelada | gerência | justificativa |

## 5. Prioridades
Quatro níveis: Urgente, Alta, Média, Baixa (o Git hoje tem três: acrescentar **Urgente** em dados, ordenação e estilos). Antes do aceite: "Não definida". Ordenação da lista (Ata 15/09): prioridade → mais recente → nome; **Pendentes de aceite** aparecem em seção própria, no topo.

## 6. Dashboard (Visão Geral) por perfil
- **Todos os perfis** têm Visão Geral, filtrada pelo perfil.
- **Setor:** Recebidas abertas · Pendentes de aceite · A expirar · Resolvidas · Solicitadas por mim em aberto.
- **Gerência:** Abertas (todas) · Pendentes de aceite · Em triagem · A expirar · Vencidas · Aguardando > 7 dias · Concluídas. Pode filtrar por setor.
- Números **sempre calculados** da store (nada digitado em JSON).
- **Lista de demandas:** abas **Recebidas** e **Solicitadas** (gerência: **Todas** e **Solicitadas por mim**).

## 7. Requisitos funcionais
| ID | Requisito | Faixa |
|---|---|---|
| RF-R01 | Login, sessão, Sair, guarda de rotas | N |
| RF-R02 | Visibilidade por perfil e por URL (RN02–RN06) | N |
| RF-R03 | Nova demanda com origem/data automáticas e destino em lista | N |
| RF-R04 | Lista com abas Solicitadas/Recebidas e filtro por departamento | N |
| RF-R05 | Detalhe e Atualizar lendo `:id`; resumo para quem é só origem | N |
| RF-R06 | Dashboard calculado por perfil | N |
| RF-R07 | Aceite com prioridade, pop-up e travamento | R |
| RF-R08 | Prazos, "a expirar", "vencida" e selos | R |
| RF-R09 | Recusar, redirecionar, Não aplicável, Cancelar | R |
| RF-R10 | Concluir e travar | R |
| RF-R11 | Novo prazo com justificativa | R |
| RF-R12 | Cobrança no histórico | R |
| RF-R13 | Chat, reabrir com citação, "visualizada" | F |

## 8. Critérios de aceitação (resumo)
- **CA-R01** `user01` abre por URL uma demanda entre Hidráulica e Elétrica → "Demanda não encontrada ou sem permissão".
- **CA-R02** `admin` não encontra nenhum campo para definir prioridade.
- **CA-R03** Setor só conclui o aceite com prioridade definida; após o pop-up, a prioridade não pode ser alterada.
- **CA-R04** Setor recusa sem motivo → bloqueado, mensagem junto ao campo.
- **CA-R05** `admin` redireciona demanda em triagem → status Pendente de aceite, novo destino, prazo de aceite reinicia, registrado no histórico.
- **CA-R06** Quem abriu vê só status e setor atual, inclusive após redirecionamento, sem motivo, prazo ou prioridade.
- **CA-R07** Demanda Concluída/Não aplicável/Cancelada: nenhum botão de ação para nenhum perfil.
- **CA-R08** Novo prazo sem justificativa → bloqueado; com justificativa → registrado no histórico.
- **CA-R09** Setor vê só seus prazos; gerência vê os de todos.
- **CA-R10** Sair apaga a sessão; Voltar do navegador não reabre telas protegidas.
- **CA-R11** Nenhuma tela oferece enviar demanda direto a outro setor.

## 9. Casos de teste
| ID | Cenário | Esperado | Resultado |
|---|---|---|---|
| CT-R01 | Abrir sem login | Vai ao login | ☐ |
| CT-R02 | Login errado e certo (5 usuários) | Erro acessível / entra | ☐ |
| CT-R03 | `user01` lista Recebidas e Solicitadas | Só o que lhe cabe | ☐ |
| CT-R04 | URL de demanda alheia | CA-R01 | ☐ |
| CT-R05 | Aceitar sem e com prioridade | CA-R03 | ☐ |
| CT-R06 | Recusar e redirecionar | CA-R04, CA-R05 | ☐ |
| CT-R07 | Visão de quem abriu | CA-R06 | ☐ |
| CT-R08 | Demanda final | CA-R07 | ☐ |
| CT-R09 | Novo prazo | CA-R08 | ☐ |
| CT-R10 | Prazos por perfil | CA-R09 | ☐ |
| CT-R11 | Sair + Voltar | CA-R10 | ☐ |
| CT-R12 | Procurar atalho setor→setor | CA-R11 | ☐ |
| CT-R13 | Teclado: login, aceite, recusa, pop-ups | Tudo operável | ☐ |
| CT-R14 | Leitor de tela: erros e resultados | Anunciado | ☐ |

`☐` = a equipe preenche com evidência real. Funções puras (permissões, transições, prazos) também têm testes automáticos (`npm test`).

## 10. Dados de exemplo
- Remapear as origens legadas do mock (Financeiro, Compras, Facilities…) para os 4 departamentos.
- Datas **relativas ao momento do seed**. Funções de prazo recebem o "agora" como parâmetro (testável).
- Incluir: pendente de aceite normal e atrasada; em andamento no prazo, a expirar e vencida; aguardando há mais de 7 dias; em triagem; concluída; não aplicável; cancelada; ao menos 1 demanda aberta por cada setor para outro.

## 11. Cobertura da lista de ajustes do grupo (02/10)
| Pedido | Onde |
|---|---|
| Origem automática, destino em lista | RN07 / RF-R03 |
| Filtro por departamento | RF-R04 |
| Responsável = setor; solicitante com departamento | RN02, RF-R05 |
| "Atribuir responsável" escolhe departamento | RN18 (vira Redirecionar, só gerência) |
| Departamentos → demandas do setor | RF-R04 |
| Leitor de tela, teclado, WCAG/eMAG | Bloco 3 + evidências |
| Pop-up de confirmação de envio; salvar para enviar com conexão | Bloco 2 |
| Mensagens de validação | `MENSAGENS_VALIDACAO.md` |
| Carregando, vazio, sucesso, erro | Blocos 1 e 2 |

## 12. Fora desta entrega (justificativa para o professor)
Especificado e **não implementado** (se for o caso ao final, marcar aqui o que ficou): chat, reabrir com citação, "visualizada", responsável individual. Motivo: prazo de 3 dias úteis e prioridade ao fluxo principal e à acessibilidade; as regras estão documentadas para a próxima etapa.

## 13. Limitações
Perfis em `sessionStorage` e dados em `localStorage` são editáveis pelo DevTools: **simulação, não segurança**. Antes do back-end: autenticação e autorização no servidor, auditoria do histórico, concorrência, notificações reais.
