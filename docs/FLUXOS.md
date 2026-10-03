# Fluxos e máquina de estados

> Kit final de 03/10/2026. Fontes: documento técnico de 15/09, Atas 15/09, 22/09 e 29/09, chat de 02/10 e decisões de 03/10 (`docs/REQUISITOS_REGRAS_DE_NEGOCIO.md`). Itens de 03/10 são **propostas** a registrar em ata. Os diagramas usam Mermaid (renderizam no GitHub; **não foram renderizados por quem escreveu**, conferir ao subir).

## 1. Fluxo da demanda
```mermaid
flowchart TD
  A["Usuário abre nova demanda<br/>(origem e data automáticas; destino em lista)"] --> P["Pendente de aceite<br/>(sem prioridade; setor tem 72 h)"]
  P --> Q{"Setor aceita?"}
  Q -- "Sim: define a prioridade<br/>e confirma no pop-up" --> E["Em andamento<br/>(prazo conforme a prioridade)"]
  Q -- "Não: informa o motivo" --> T["Em triagem (com o Gerenciamento)"]
  E --> G["Aguardando (processamento interno)<br/>o prazo continua correndo"]
  G --> E
  E --> D["Concluída (final, sem alterações)"]
  E -- "setor devolve com motivo" --> T
  T --> R{"Gerenciamento decide"}
  R -- "redireciona a outro setor" --> P
  R -- "nenhum setor tem competência<br/>(justificativa)" --> N["Não aplicável (final)"]
  R -- "cancela (justificativa)" --> C["Cancelada (final)"]
```
O gerenciamento **não** define prioridade e o setor **nunca** envia direto a outro setor.

## 2. Máquina de estados
```mermaid
stateDiagram-v2
  state "Pendente de aceite" as PA
  state "Em andamento" as EA
  state "Aguardando (proc. interno)" as AG
  state "Em triagem" as TR
  state "Concluída" as CO
  state "Não aplicável" as NA
  state "Cancelada" as CA
  [*] --> PA
  PA --> EA: aceita + prioridade
  PA --> TR: recusa (motivo)
  EA --> AG
  AG --> EA
  EA --> CO
  AG --> CO
  EA --> TR: devolve (motivo)
  AG --> TR: devolve (motivo)
  TR --> PA: gerência redireciona
  TR --> NA: gerência (justificativa)
  PA --> CA: gerência (justificativa)
  EA --> CA: gerência (justificativa)
  AG --> CA: gerência (justificativa)
  TR --> CA: gerência (justificativa)
  CO --> [*]
  NA --> [*]
  CA --> [*]
```

## 3. Quem vê o quê
```mermaid
flowchart LR
  U{"Usuário logado"} -- admin --> ADM["Gerenciamento:<br/>vê tudo e os prazos de todos;<br/>redireciona, cancela, marca não aplicável, cobra;<br/>não define prioridade"]
  U -- "user01 a user04" --> DEP["Departamento (independente)"]
  DEP --> EXE["Demandas recebidas (destino = meu setor):<br/>vê tudo e só os meus prazos;<br/>aceita, define prioridade, recusa, conclui"]
  DEP --> ORI["Demandas que eu abri:<br/>só status e setor atual"]
```

## 4. Navegação
```mermaid
flowchart LR
  L["Login"] --> S["Barra lateral (itens por perfil)"]
  S --> VG["Visão Geral (por perfil)"]
  S --> DM["Demandas: abas Recebidas / Solicitadas"]
  S --> DP["Departamentos"]
  S --> ND["Nova Demanda"]
  S --> SA["Sair → Login"]
  DP -- "Acessar setor" --> DM
  DM --> DT["Detalhe"]
  VG -- "Abrir" --> DT
  DT --> AT["Atualizar"]
  ND -- "pop-up de confirmação / erro / offline" --> DM
```
Sem login, qualquer rota vai ao Login. Demanda sem permissão ou inexistente mostra a mesma mensagem.

## 5. Fluxo de envio (Ata 15/09, chat 02/10)
```mermaid
flowchart TD
  P["Preenche o formulário"] --> R["Rascunho salvo no dispositivo"]
  R --> V{"Dados válidos?"}
  V -- Não --> M["Mensagens claras e foco no 1º erro"]
  M --> P
  V -- Sim --> N{"Há conexão?"}
  N -- Não --> Q["Guarda em 'Pendentes de envio' e avisa"]
  Q --> W["Ao reconectar, envia"]
  N -- Sim --> E["Envio com estado de carregamento"]
  W --> E
  E --> OK{"Sucesso?"}
  OK -- Sim --> C["Pop-up de confirmação com o número"]
  OK -- Não --> ER["Erro e tentar de novo (dados mantidos)"]
  ER --> E
```
