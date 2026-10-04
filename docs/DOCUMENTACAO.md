# Demanda de Aço — Documentação do Produto (PBL Problema 1)

> **Documento vivo — kit final de 03/10/2026.** Base analisada: repositório do GitHub (`main`) com as telas Visão Geral, Detalhes e Atualizar (React 19 + Vite, 6 rotas por hash). Diagnóstico da seção 7 vem da **leitura do código**; `npm run lint` e `npm run build` passam. *Quando o kit foi escrito (03/10)*, o app não tinha sido aberto no navegador e nenhuma auditoria ou teste manual tinha sido feito. **Atualização (04/10):**
> - o app passou a ser aberto e conferido no navegador a cada bloco (registros em `docs/CHANGELOG.md`);
> - há auditoria axe "antes" e "depois" (seção 19);
> - há testes manuais feitos pelo autor (Bruno Diogo) nos Blocos 1, 2A e 2B (`docs/evidencias/depois/` e CHANGELOG);
> - **o Lighthouse ainda não foi executado**;
> - o que falta testar está em `docs/TESTES_PENDENTES.md`.
> Campos `☐` são evidências que a equipe precisa gerar. Nada aqui foi inventado.
> Itens marcados **[PROPOSTA]** vieram da conversa de 03/10 e precisam ser votados e registrados em ata.
> Fontes: enunciado, Atas 08/09, 15/09, 22/09 e 29/09, documento técnico de 15/09, chat do grupo (até 02/10), código do Git de 03/10 e `docs/REQUISITOS_REGRAS_DE_NEGOCIO.md`.

---
## 1. Visão do produto
- **Problema:** demandas chegam por seis caminhos (e-mail, mensagem, papel, ligação, corredor, "eu avisei alguém") e ninguém sabe quem recebeu, para onde foi nem o que aconteceu.
- **Objetivo:** serviço web único para **registrar** uma demanda, **confirmar** que o envio deu certo e **acompanhar** o que aconteceu depois, de forma acessível e responsiva.
- **Hipóteses (a validar):** H1 abrir uma demanda em poucos campos reduz abandono; H2 o setor executor é quem melhor define a prioridade; H3 o gerenciamento só precisa agir quando o destino está errado ou a demanda está parada; H4 usuários com leitor de tela e só teclado conseguem concluir o fluxo principal.
- **Limites:** sem back-end, sem e-mail real, sem autenticação real; dados simulados em JSON + `localStorage`.

## 2. Stakeholders e personas
| Quem | Necessidade | Implicação |
|---|---|---|
| Kaoru (diretoria) | Primeira versão navegável, com evidências | Entregáveis e rastreabilidade |
| Bia | Usa leitor de tela | Semântica, rótulos, `aria-live` |
| Rafael | Sem mouse | Teclado completo, foco visível |
| Dona Célia | Celular, rede instável | Responsivo, não perder o formulário |
| Gerenciamento | Triar demandas com destino errado e cobrar as paradas, sem definir prioridade | Perfil `gerenciamento` (RN04–RN09) |
| Departamento executor | Priorizar, atualizar status, devolver o que não é seu | Perfil `departamento` (RN02–RN06) |

## 3. Escopo do MVP
- **Dentro (núcleo):** login (mock) com perfis (`admin` e `user01`–`user04`), nova demanda (origem/data automáticas, offline, pop-up), lista com abas Solicitadas/Recebidas, filtro por departamento, detalhe por ID, dashboard por perfil, estados (carregando, vazio, sucesso, erro), acessibilidade. **Dentro (regras, se houver tempo):** aceite com prioridade, prazos por prioridade, recusa/triagem, redirecionar, concluir e travar, cancelar/não aplicável.
- **Fora:** back-end, e-mail real, autenticação/autorização reais, acompanhamento público (descartado na Ata 22/09). **Especificado e adiado (futuro):** chat solicitante↔setor, reabrir com citação, "visualizada pelo setor", responsável individual/grupos de acesso.
- **[PROPOSTA]** Perfis e triagem passam a fazer parte do escopo (antes "níveis de acesso detalhados" estavam fora). Base: Ata 15/09 (RF login; gerenciamento só roteia e resolve conflitos) e Ata 08/09 (prioridade definida pelo setor executor).

## 4. Requisitos
**Funcionais**
| ID | Requisito | Fonte |
|---|---|---|
| RF01 | Login com usuário e senha (mock), erro acessível, **Sair** funcional | Ata 15/09, 22/09 |
| RF02 | Cadastrar demanda: origem automática (travada para departamento), destino em lista, tipo dependente do destino, título e descrição | Ata 15/09, 22/09, chat 02/10 |
| RF03 | Data/hora da solicitação preenchida automaticamente; dados persistidos | Ata 08/09, 15/09 |
| RF04 | Listar demandas, ordenadas por prioridade, depois data (recente), depois nome | Ata 15/09 |
| RF05 | Buscar demandas e filtrar por departamento | Ata 22/09, chat 02/10 |
| RF06 | Detalhe: status, linha do tempo, nova mensagem, responsável = **setor**, solicitante com departamento | Ata 08/09, 15/09, 22/09, chat 02/10 |
| RF07 | Prioridade definida pelo setor executor; gerenciamento não altera | Ata 08/09, 15/09; **[PROPOSTA]** 03/10 |
| RF08 | Visão Geral com indicadores calculados dos dados reais | Ata 15/09, 22/09 |
| RF09 | Departamentos: "Acessar setor" abre as demandas daquele setor | Chat 02/10 |
| RF10 | Mostrar status de conexão (online/offline) e do envio | Ata 15/09 |
| RF11 | Guardar a demanda até confirmar o envio; confirmar com pop-up; tela "Pendentes de envio" | Ata 15/09, chat 02/10 |
| RF12 | Notificação por e-mail (**simulada**) ao solicitante e ao departamento | Ata 08/09, 15/09 |
| RF13 | **[PROPOSTA]** Visibilidade por perfil: departamentos independentes; operação interna só do setor executor e da gerência; quem abriu vê só status e setor atual; acesso por URL segue a regra | 03/10 (RN02–RN06) |
| RF14 | **[PROPOSTA]** Aceite com prioridade obrigatória e travada; recusa com motivo (triagem); gerência redireciona, marca Não aplicável ou Cancela com justificativa; concluídas/canceladas imutáveis | 03/10 (RN09–RN12, RN18–RN20) |
| RF15 | **[PROPOSTA]** Prazos por prioridade (Urgente 24 h, Alta 48 h, Média 72 h, Baixa 7 dias), novo prazo com justificativa, selos (a expirar, vencida, aceite atrasado, aguardando > 7 dias) e cobrança no histórico | 03/10 (RN13–RN17, RN21) |

**Não funcionais**
| ID | Requisito | Fonte |
|---|---|---|
| RNF01 | Navegação integral por teclado, com foco visível e ordem lógica | Enunciado, Ata 15/09 |
| RNF02 | Compatível com leitor de tela (semântica, rótulos, mensagens anunciadas) | Enunciado, Ata 15/09 |
| RNF03 | Nenhuma perda do formulário em caso de falha técnica | Ata 15/09 |
| RNF04 | Responsivo (celular a desktop), sem rolagem horizontal | Enunciado |
| RNF05 | HTML semântico; rótulos, instruções e validações claras | Enunciado |
| RNF06 | Estados de carregamento, lista vazia, sucesso e erro | Enunciado |
| RNF07 | Aplicar critérios WCAG/eMAG selecionados e auditar (automática e manual) | Enunciado |
| RNF08 | Resposta em até 1 s para filtros/ordenação com 100 demandas simuladas (meta a medir) | Equipe |
| RNF09 | Regras de permissão em funções puras com teste (não só ocultar botões) | **[PROPOSTA]** |

## 5. Backlog priorizado
| ID | História | Prior. | Reqs |
|---|---|---|---|
| US01 | Como **solicitante**, quero abrir uma demanda com poucos campos para registrar rápido o problema | P1 | RF02, RF03 |
| US02 | Como **solicitante**, quero mensagens de erro claras nos campos para corrigir sem frustração | P1 | RNF05 |
| US03 | Como **solicitante**, quero ver confirmação (ou erro) do envio para saber se deu certo | P1 | RF10, RF11, RNF06 |
| US04 | Como **Dona Célia**, quero que o formulário seja guardado se a rede cair para não perder o que digitei | P1 | RF10, RF11, RNF03 |
| US05 | Como **departamento**, quero listar e filtrar as demandas do meu setor em ordem de prioridade | P1 | RF04, RF05, RF07 |
| US06 | Como **departamento**, quero abrir qualquer demanda e atualizar status e histórico | P1 | RF06 |
| US07 | Como **usuário**, quero acessar um setor e ver só as demandas dele | P1 | RF09 |
| US08 | Como **Rafael**, quero usar tudo só com teclado, vendo onde está o foco | P1 | RNF01 |
| US09 | Como **Bia**, quero que o leitor de tela entenda telas, campos e avisos | P1 | RNF02 |
| US10 | Como **usuário de celular**, quero uma interface que se adapte à tela | P1 | RNF04 |
| US11 | Como **gerenciamento**, quero ver tudo e acompanhar os indicadores | P2 | RF08 |
| US12 | Como **usuário**, quero entrar com login e sair, para ter meu departamento associado | P1* | RF01, RF13 |
| US13 | Como **solicitante**, quero ser avisado por e-mail (simulado) do andamento | P3 | RF12 |
| US14 | Como **setor executor**, quero aceitar definindo a prioridade, ou recusar com motivo, para organizar meu trabalho | P2 | RF14 |
| US15 | Como **gerenciamento**, quero redirecionar, marcar não aplicável ou cancelar com justificativa, para resolver o que está parado ou no setor errado | P2 | RF14 |
| US16 | Como **gerenciamento**, quero ver os prazos de todos e cobrar posição no histórico; como **setor**, quero ver só os meus prazos | P2 | RF15 |
| US17 | Como **departamento**, quero que outros setores não vejam as minhas demandas internas | P1* | RF13, RNF09 |

\* Subiu para P1 porque os perfis são base para a demonstração das demais histórias. **[PROPOSTA]**

### Critérios de aceitação (P1)
- **US01:** *Dado* que estou logado, *quando* abro "Nova demanda", *então* a origem vem preenchida e travada (departamento); *e* o destino é uma lista; *e* o tipo só lista opções do destino; *e* a data/hora é registrada automaticamente.
- **US02:** *Dado* um campo obrigatório vazio, *quando* tento enviar, *então* aparece mensagem em texto próximo ao campo dizendo o que fazer, o foco vai ao primeiro erro e o leitor de tela anuncia.
- **US03:** *Quando* envio com sucesso, *então* vejo botão em carregamento, depois confirmação com o número da demanda; *quando* falha, vejo erro com opção de tentar de novo.
- **US04:** *Dado* que estou offline, *quando* envio, *então* a demanda é guardada localmente, aparece "salva, será enviada ao reconectar" e, ao recarregar, os dados continuam.
- **US05:** *Quando* abro a lista, *então* a ordem padrão é prioridade → mais recente → nome; *e* busca e filtro por departamento funcionam; *e* sem resultados aparece "lista vazia" com orientação.
- **US06:** *Quando* abro **qualquer** demanda da lista, *então* vejo os dados **dela** (não de outra), status, histórico cronológico e campo de mensagem; *e* ao mudar o status o histórico registra a mudança.
- **US07:** *Quando* escolho um setor em Departamentos, *então* a lista mostra apenas as demandas daquele setor.
- **US08:** *Quando* navego só com Tab/Shift+Tab/Enter/Espaço/Esc, *então* alcanço e uso todas as funções, com foco sempre visível e sem armadilhas.
- **US09:** *Quando* uso NVDA/VoiceOver, *então* títulos, regiões, rótulos, estados e mensagens de status são anunciados corretamente.
- **US10:** *Quando* a largura é 360 px, *então* não há rolagem horizontal e os alvos de toque são utilizáveis.
- **US12:** *Quando* clico em **Sair**, *então* a sessão termina, volto ao login e o botão Voltar do navegador não reabre telas protegidas.
- **US17:** *Dado* o usuário de TI, *quando* abre por URL uma demanda entre Hidráulica e Elétrica, *então* vê "Demanda não encontrada ou sem permissão".

Critérios de US14–US16 e regras de negócio: `docs/REQUISITOS_REGRAS_DE_NEGOCIO.md`, seção 8 (CA-R01 a CA-R11).

## 6. Matriz de rastreabilidade
✅ atende · 🟡 parcial · ❌ não atende.
- **"Em 03/10":** status por **leitura do código** do Git de 03/10, antes das correções (diagnóstico da seção 7). Mantido como histórico.
- **"Em 04/10":** status do código atual (branch `fix/ajustes-teste-manual`), com a evidência que existe.
- "Teste da equipe pendente" quer dizer que só há testes automáticos e/ou conferência do assistente; o roteiro está em `docs/TESTES_PENDENTES.md`.

| Necessidade (fonte) | Req. | História | Tela / componente | Teste | Em 03/10 | Em 04/10 |
|---|---|---|---|---|---|---|
| Registrar rápido (enunciado) | RF02, RF03 | US01 | `NovaDemanda.jsx` | TC01 | 🟡 tipo é select fixo; origem/destino texto livre; não grava | 🟡 grava; origem e data automáticas; destino em lista; tipo depende do destino. No computador passou no reteste 7 e no Bloco B do autor (04/10). **No celular real o envio trava em "Enviando…" (falha F1, seção 23)** |
| Validação clara (enunciado) | RNF05 | US02 | `NovaDemanda.jsx` | TC02 | 🟡 só `required` nativo | ✅ mensagens do catálogo junto do campo, foco no 1º erro, "(obrigatório)" nos rótulos; limite de caracteres com aviso |
| Saber se o envio deu certo (enunciado) | RF10, RF11 | US03 | `NovaDemanda.jsx` | TC03 | ❌ só aviso "Cadastro simulado" | 🟡 "Enviando…", pop-up com o número e erro simulado (`?falha=1`) ✅; **status de conexão (RF10) não existe** (seção 20) |
| Não perder formulário (Ata 15/09) | RNF03 | US04 | storage | TC04 | ❌ | 🟡 o formulário continua preenchido se o envio falha; **some ao recarregar**; sem fila offline (2C adiada) |
| Lista ordenada (Ata 15/09) | RF04, RF05 | US05 | `Demandas.jsx` | TC05, TC06 | 🟡 busca e ordenações existem; padrão é por data; sem filtro por departamento | ✅ "Atenção primeiro" e as ordenações escolhidas; busca única; filtros de departamento e de status |
| Detalhe e histórico (Ata 08/09, 22/09) | RF06 | US06 | `DetalhesDemanda.jsx`, `AtualizarDemanda.jsx` | TC07 | 🟡 layout pronto; **fixo na DM-2048**, histórico fixo | 🟡 abre pelo ID, histórico real, resumo para quem abriu ✅; "nova mensagem" (chat) adiada |
| Acessar setor (chat 02/10) | RF09 | US07 | `Departamentos.jsx` | TC08 | ❌ link vai a `#demandas` sem filtrar | ✅ `evidencias/depois/TESTE_MANUAL_BLOCO2A.md` |
| Só teclado (Rafael) | RNF01 | US08 | global | TC09 | 🟡 a auditar | 🟡 skip link, foco no título, foco visível, pop-ups com foco preso e Esc; o autor conferiu parte no Edge (relatório axe "depois"); falta a volta completa |
| Leitor de tela (Bia) | RNF02 | US09 | global | TC10 | 🟡 a auditar | 🟡 NVDA 2026.2 + Edge InPrivate, 2 ou 3 rodadas (relato do autor; resultado por tela a registrar); comando de voz não executado |
| Celular (Dona Célia) | RNF04 | US10 | global | TC11 | 🟡 há `@media` em 4 CSS; a testar | 🟡 360 px passou no reteste 6 (04/10). Celular real Android (Bloco D, `user03`): login, Visão Geral, Demandas, Departamentos e Nova Demanda abrem, sem rolagem lateral e com alvos de toque OK; **o envio da Nova Demanda falhou (F1, seção 23)**; sem aviso de conexão |
| Visão geral (Ata 15/09, 22/09) | RF08 | US11 | `VisaoGeral.jsx` + `VisaoGeral*.jsx` | TC12 | 🟡 tela pronta; números fixos em outro JSON | ✅ números calculados; todos os cards levam à lista filtrada; aviso "Precisa de atenção" (seção 22) |
| Login e Sair (Ata 15/09) | RF01 | US12 | `Login.jsx` | TC13 | ❌ não existe; "Sair" sem ação | ✅ login simulado, Sair, guarda de rotas; `TESTE_MANUAL_BLOCO1.md` |
| Perfis e visibilidade (03/10) | RF13 | US17 | `permissoes.js` | TC15 | ❌ | ✅ funções puras com testes automáticos; CT-R03, CT-R04 e CT-R07 em `TESTE_MANUAL_BLOCO2A.md` |
| Aceite/triagem/encerramento (03/10) | RF14 | US14, US15 | Detalhes, Atualizar, Triagem | TC16 | ❌ | ✅ aceite com prioridade, recusa, redirecionar (com justificativa), Não aplicável, Cancelar, concluir; testes automáticos e conferência do assistente; teste da equipe pendente |
| Prazos e cobrança (03/10) | RF15 | US16 | Detalhe/Visão Geral | TC17 | ❌ | 🟡 prazos por prioridade, selos (a expirar, vencida, atrasada para aceite/triagem) ✅; **novo prazo com justificativa e cobrança no histórico sem tela** (adiados, seção 18) |
| Estados (enunciado) | RNF06 | US03, US05 | todas | TC14 | 🟡 só lista vazia | ✅ carregando, vazio, sucesso e erro (dados corrompidos e `?falha=1`) |

## 7. Diagnóstico do estado atual (Git de 03/10)
**Pontos positivos (vistos no código):** `lang="pt-BR"`; `document.title` por página; `<label>` nos campos principais; `aria-current` no menu e nas migalhas (breadcrumb); `<nav>` com rótulo; `aria-live` na contagem de resultados e `role="status"` no aviso do formulário; `<time dateTime>` nos cards; paginação com `aria-label`; diálogo com `role="dialog"`, `aria-modal` e `aria-labelledby`; `:focus-visible` global em links e botões; `@media` nos 4 CSS; README com passo a passo; build e lint passando.

**Defeitos e melhorias** (G = leitura do Git de 03/10; severidade preliminar)
| ID | Descrição | Gravidade | História / Req. | Bloco |
|---|---|---|---|---|
| G01 | Nova Demanda não grava nada: só exibe "Cadastro simulado"; sem loading, erro, confirmação nem fila offline | Alta | US01–US04 / RF02, RF03, RF10, RF11 | 2 |
| G02 | Origem e destino são texto livre; tipo é lista fixa e não depende do destino | Alta | US01 / RF02 | 2 |
| G03 | Não há camada de dados: Detalhe e Atualizar usam a DM-2048 fixa (única `localStorage` é a chave `demanda-DM-2048`) e **ignoram o ID da URL** | Alta | US06 / RF06 | 1, 2 |
| G04 | Na lista, só o card da DM-2048 é link; os demais são `<article>` sem ação | Alta | US06 | 2 |
| G05 | Dois conjuntos de dados incompatíveis: `demandas.json` (DM-2048…) e `VisaoGeral.json` (DM-1000…, contadores digitados, data fixa de 16/06/2026); "Abrir" na Visão Geral vai a `#demanda/DM-100x` e mostra a DM-2048; `alta-prioridade` modelada como status | Alta | US11 / RF08 | 1, 2 |
| G06 | "Acessar setor" aponta para `#demandas` sem filtrar; lista sem filtro por departamento | Alta | US05, US07 / RF05, RF09 | 2 |
| G07 | Sem login, sem perfis, "Sair" sem ação, usuário "Márcio Almeida / Gestor" fixo; qualquer pessoa vê tudo | Alta | US12, US17 / RF01, RF13 | 1 |
| G08 | Sem triagem (devolver, redirecionar, não aplicável) e sem cobrança de posição | Alta | US14–US16 / RF14, RF15 | 4 |
| G09 | Status do app (Pendente / Em andamento / Concluído) ≠ máquina de estados do documento técnico (6) ≠ proposta (7). Decidir e registrar | Média | RF06 | 1 |
| G10 | Dois `<h1>` na Visão Geral (topbar e cabeçalho do painel) | Média | WCAG 1.3.1 / RNF02 | 3 |
| G11 | Visão Geral: busca só com `placeholder`; atalho "Ctrl K" é decorativo; abas de filtro sem `aria-pressed`; "Ordenar: Recentes" é texto fixo | Média | WCAG 1.3.1, 3.3.2, 4.1.2 | 3 |
| G12 | Diálogo "Atribuir responsável": não move o foco, não prende o foco, não fecha com Esc, fecha só por clique no fundo | Média | WCAG 2.1.1, 2.4.3 | 4, 3 |
| G13 | `outline: none`/`0` em campos: `App.css` (~130, 312, 344, 586), `DetalhesDemanda.css` (~363, 426, 448, 466, 501, 526), `VisaoGeral.css` (~236). **A conferir** se há foco alternativo visível | Média | WCAG 2.4.7 | 3 |
| G14 | Sem skip link; foco não é movido ao trocar de rota por hash | Média | WCAG 2.4.1, 2.4.3 | 3 |
| G15 | Sem estados de carregamento e erro; sem indicador online/offline | Média | RNF06, RF10 | 2 |
| G16 | Atualizar: Departamento, Origem, Solicitante e Categoria são texto livre; deveriam ser listas | Média | RF06 | 2 |
| G17 | Ordenação padrão só por data; falta prioridade → data → nome | Média | RF04 | 2 |
| G18 | Contador "12 demandas ativas" fixo e inclui concluídas; datas simuladas de 2025; histórico fixo | Baixa | RF05, RF06 | 1, 2 |
| G19 | Botão "Criar" no topo só move o foco para "Origem" | Baixa | US01 | 2 |
| G20 | **Contraste medido pelo axe: 24 combinações de cor abaixo de 4,5:1 em todas as telas** (ver `evidencias/antes/`); alvo de toque pequeno em `select[name=prioridade]` (Atualizar). Alvos de toque restantes e possível colisão de nomes de classes CSS entre `App.css` e `VisaoGeral.css`: verificar no navegador | Média | RNF01, RNF04 | 3 |

## 8. Decisões de arquitetura (ADR)
- **ADR-01 React + Vite.** Decidido na Ata 29/09 por votação. *Motivo:* domínio da equipe, componentes reutilizáveis. *Custo:* quem não conhece React; código gerado por IA exige que todos saibam explicar.
- **ADR-02 JSON como seed + `localStorage` como persistência.** *Contexto:* o enunciado proíbe back-end real e aceita "JSON ou solução equivalente"; Ata 15/09 exige não perder o formulário. *Decisão:* JSON lido uma vez (primeira carga = `getItem(...) === null`); leitura/escrita seguintes no `localStorage`, chave **versionada**, `try/catch`, botão "Resetar dados". Camada assíncrona simulada, com falha simulável (`?falha=1`) para demonstrar o estado de erro. *Limites:* dados só no navegador, editáveis pelo DevTools, cerca de 5 MB, sem sincronização. *Troca futura:* só a camada `storage` muda com um back-end.
- **ADR-03 Um JSON por entidade** (`demandas`, `departamentos`, `usuarios`), não por página, porque as telas compartilham dados. Cada demanda ganha `origem`, `destino`, `tipo`, `prioridade`, `status`, `cobrancas[]`, `historico[]`. `VisaoGeral.json` deixa de ser fonte própria: os números são calculados. *(Atende a "mais de um JSON" da Ata 29/09.)*
- **ADR-04 Roteamento por hash.** Simples e sem dependência. Exige gerenciar foco e título a cada mudança (G14).
- **ADR-05 Acompanhamento público descartado** (Ata 22/09).
- **ADR-06 Uso de IA** na estrutura e no código, permitido pelo professor desde que todos expliquem. Registrar as ferramentas (Figma Make, Antigravity, Claude Code) e quem revisou cada PR.
- **ADR-07 [PROPOSTA] Perfis `gerenciamento` e `departamento`.** Logins `admin` e `user01`–`user04` (senha = usuário). Departamentos independentes; gerência vê tudo e não define prioridade; setor nunca envia direto a outro setor. Regras em funções puras (`src/domain/permissoes.js`, `prazos.js`) com teste. *Limite:* perfil em `sessionStorage` é simulação, não segurança.
- **ADR-08 [PROPOSTA] Status (7):** Pendente de aceite, Em andamento, Aguardando (processamento interno), Em triagem, Concluída, Não aplicável, Cancelada. Finais e imutáveis: Concluída, Não aplicável, Cancelada. Transições em `src/domain/status.js` (ver `REQUISITOS_REGRAS_DE_NEGOCIO.md`, seção 4).
- **ADR-09 Entrega em blocos, uma branch e um PR por bloco**, com CHANGELOG, `docs/EXPLICACAO_*.md` e revisão por pares (ver `docs/CONVENCOES.md`).
- **Pendentes de votação (registrar em ata):** perfis e regras de aceite/prazo/triagem (todos propostos em 03/10); lista de status; prazos por prioridade; limites de caracteres (título 60, descrição 500).

## 9. Acessibilidade — critérios selecionados (WCAG 2.2 / eMAG)
| WCAG | Aplicação | Verificação |
|---|---|---|
| 1.3.1 Informação e relações | Landmarks, labels, um `<h1>` por tela | axe + leitor de tela |
| 1.4.3 Contraste mínimo | Texto, badges, botões | Lighthouse / contraste manual |
| 1.4.10 Reflow | 320–360 px sem rolagem horizontal | Teste manual com zoom 400% |
| 2.1.1 Teclado | Todas as funções, inclusive diálogos (Esc) | Teste manual (US08) |
| 2.4.1 Contornar blocos | Skip link ao conteúdo | Manual |
| 2.4.2 / 3.1.1 | Título por página e `lang` | Já atende; reconferir |
| 2.4.3 / 2.4.7 Ordem e foco visível | Foco ao trocar de rota; indicador visível | Manual |
| 3.3.1 / 3.3.2 / 3.3.3 | Erro identificado, rótulos, sugestão | Manual com leitor de tela |
| 4.1.2 / 4.1.3 | Nome/papel/valor; avisos de status | axe + leitor de tela |

eMAG: usar as recomendações equivalentes por tema (marcação, comportamento, conteúdo/informação, formulários). **Mapear os números exatos no eMAG 3.1 e citar no relatório.**

**Procedimento "antes/depois":** (1) rodar Lighthouse e axe **no estado atual, antes de corrigir**, e guardar relatórios e prints em `docs/evidencias/antes/`; (2) corrigir G10–G14 (Bloco 3); (3) rodar de novo e guardar em `docs/evidencias/depois/`; (4) teste manual só com teclado e com NVDA (Windows) ou VoiceOver.
Evidências: `☐ lighthouse-antes` `☒ axe-antes` (assistente, `docs/evidencias/antes/`) `☐ lighthouse-depois` `☒ axe-depois` (assistente, na nuvem, `docs/evidencias/depois/`; rodada pela equipe pendente) `☐ gravação com teclado` `☐ gravação com leitor de tela`.

## 10. Plano de testes
| ID | Cenário | Passos | Esperado | Resultado |
|---|---|---|---|---|
| TC01 | Nova demanda — campos | Abrir Nova Demanda como `ti` | Origem travada em TI; destino em lista; tipo depende do destino | ☐ (sem registro da equipe; conferido só pelo assistente, CHANGELOG 2B) |
| TC02 | Validação | Enviar vazio | Mensagens claras, foco no 1º erro, anunciadas | ☐ (parcial: o teste da 2B pelo autor achou a falha do limite de caracteres, corrigida, e o reteste passou, conforme relato do autor; não há registro do envio vazio nem do anúncio por leitor de tela) |
| TC03 | Envio com sucesso/erro | Enviar; repetir com `?falha=1` | Loading → confirmação / erro com retry | ☐ (conferido só pelo assistente, CHANGELOG 2B) |
| TC04 | Offline | DevTools → Offline, enviar, recarregar, reconectar | Dados mantidos; aviso; envio ao reconectar | ☐ (não implementado: 2C adiada) |
| TC05 | Ordenação | Abrir lista | Prioridade → data → nome | ☐ |
| TC06 | Filtro/lista vazia | Buscar termo inexistente | Mensagem de lista vazia | ☐ |
| TC07 | Detalhe | Abrir 3 demandas diferentes; trocar status; enviar mensagem | Dados de cada uma; histórico atualizado e persistido | ☐ (parcial: Detalhes e Atualizar passaram, com reteste, em `evidencias/depois/TESTE_MANUAL_BLOCO2A.md`; "enviar mensagem" é o chat, adiado) |
| TC08 | Departamentos | Acessar setor | Só demandas do setor | ☒ passou — `evidencias/depois/TESTE_MANUAL_BLOCO2A.md` |
| TC09 | Teclado | Percorrer tudo com Tab | Tudo alcançável; foco visível; sem armadilha | ☐ (parcial: Bloco 1 "parcial"; no Bloco 3 o autor conferiu no Edge o skip link, Tab, Enter, Shift+Tab e o contorno, segundo `RELATORIO_AXE_DEPOIS.md`; falta percorrer tudo, inclusive os Blocos 4A a 4C) |
| TC10 | Leitor de tela | NVDA no fluxo "abrir demanda" | Tudo anunciado com sentido | ☐ (não executado) |
| TC11 | Responsivo | 360, 768 e 1280 px | Sem rolagem horizontal | ☐ (parcial: Sair em 360 px passou no reteste do autor, com DevTools; o axe "depois" mediu 0 rolagem em 360 e 1280, mas é automático; falta 768 px) |
| TC12 | Visão Geral | Comparar números com a lista | Indicadores batem com os dados | ☒ passou — `evidencias/depois/TESTE_MANUAL_BLOCO2A.md` (a contagem acompanhou a conclusão da DM-2012) |
| TC13 | Login/Sair | Credencial errada; Sair; botão Voltar | Erro acessível; sessão encerrada | ☐ (parcial: Sair passou em `evidencias/depois/TESTE_MANUAL_BLOCO1.md`; credencial errada e Voltar depois de Sair sem registro) |
| TC14 | Estados | Simular atraso e falha | Loading, vazio, sucesso e erro visíveis | ☐ |
| TC15 | Perfis | 5 usuários; URL de demanda alheia | CT-R01 a CT-R04, CT-R07, CT-R11 | ☐ (parcial: ver CT-R02, R03, R04, R07 e R11 em `REQUISITOS_REGRAS_DE_NEGOCIO.md`, seção 9; CT-R01 sem registro) |
| TC16 | Aceite, recusa e encerramento | Aceitar com/sem prioridade; recusar; redirecionar; concluir | CT-R05, CT-R06, CT-R08 | ☐ (conferido só pelo assistente, CHANGELOG 4A e 4C; teste da equipe pendente) |
| TC17 | Prazos e cobrança | Novo prazo; prazos por perfil | CT-R09, CT-R10 | ☐ (novo prazo e cobrança ainda não têm tela) |

`☒` = feito, com a fonte ao lado. `☐` = não feito ou só em parte: a observação diz o que falta.

Casos detalhados de regras de negócio (CT-R01…CT-R14): `docs/REQUISITOS_REGRAS_DE_NEGOCIO.md`, seção 9.
**Registro de defeitos corrigidos** (preencher): `ID | commit da correção | evidência antes | evidência depois`.

## 11. Limitações conhecidas (não esconder na apresentação)
Sem back-end; dados e perfis só no navegador e editáveis (não é segurança); e-mail apenas simulado; login fictício; sem sincronização entre dispositivos; teste com leitor de tela restrito ao que a equipe executar; layout mudou durante o desenvolvimento (seção 12); setores fixos em 4 (TI, Hidráulica, Administrativo, Elétrica), em `departamentos.json`: **cadastro de novos setores é funcionalidade futura**, e até lá um pedido de área fora deles segue devolução à triagem → redirecionar ou "Não aplicável" (proposta em `ATAS_RASCUNHO_27-09_e_02-10.md`, item 11). **Detalhes, tabela do que um back-end substituiria e trabalho futuro: seção 20.**

## 12. Lacunas de processo a corrigir
- **Atas faltantes:** reuniões de 27/09 e 02/10 (rascunhos retroativos em `docs/ATAS_RASCUNHO_27-09_e_02-10.md`, a confirmar com os presentes) e a decisão de 03/10 sobre perfis, triagem e cobrança.
- **Ata 08/09** com ano 2025: corrigir para 2026.
- **Divisão de tarefas** em 3 versões (Ata 22/09, chat 22/09, Ata 29/09): manter **uma** oficial.
- **Mudanças de layout** devem virar issue ou ata.
- **Repositório:** issues por história, commits com a referência (`US0X`/`RF`), PRs com revisão por pares, README com versão entregue (tag `v1.0-pbl`), `docs/` no repositório.
- **Trabalho paralelo perdido:** uma versão feita com agente a partir de snapshot antigo reescreveu telas já feitas pelo grupo. Lição para a retrospectiva: toda ferramenta de IA parte do `main` atual e entrega em branch/PR.

## 13. Fluxo principal consolidado
`Login → perfil`
→ **Gerenciamento:** Visão Geral (todas as demandas, "sem posição", triagem) → redirecionar ou "Não aplicável" → **cobrar** setores.
→ **Departamento:** Departamentos/Demandas do setor (prioridade → data → nome) → Detalhe (definir prioridade, status, histórico, mensagem; **devolver à triagem**; responder cobrança).
→ **Qualquer perfil:** Nova Demanda (origem automática, destino, tipo, descrição) → confirmação; sem rede: guarda localmente e envia depois.
Estados em todas as telas: carregando · vazio · sucesso · erro. Diagramas em `docs/FLUXOS.md`.

## 14. Retrospectiva (rascunho a partir dos registros; o grupo revisa e completa)
> Escrito a partir do CHANGELOG, das evidências e dos relatos do autor. **Não é a opinião do grupo** até ser discutido; cada pessoa pode acrescentar ou discordar.

**O que deu certo**
- Entrega em blocos pequenos (1 → 2A/2B → 3 → 4A/4B/4C), um PR por bloco, com CHANGELOG e um `EXPLICACAO_BLOCO*.md` para estudar.
- Regras de negócio em funções puras com teste automático (de 61 testes no Bloco 1 para 245 agora). Mudanças de regra, como os prazos de 48 h e de 24 h, ficaram baratas e seguras.
- Teste manual do autor no Edge depois de cada bloco. Ele achou falhas que os testes automáticos e o navegador embutido não acharam: Sair sumindo no celular, campo travado no Atualizar, limite de caracteres, skip link por cima da marca e o "card gordo".
- Honestidade nas evidências: o que não foi feito está escrito como "não executado" (`docs/TESTES_PENDENTES.md`).

**O que não deu certo**
- Atas de 27/09 e 02/10 escritas depois, como rascunho; as decisões de 03/10 em diante ainda não foram votadas.
- Documentos que se contradiziam (axe "depois" existente e "não existe"; testes "não executados" e "passou"). Foram corrigidos em 04/10.
- Requisitos que mudaram no meio (prazo de aceite de 72 h → 48 h; redirecionamento com teto de 48 h → 24 h fixas; justificativa no redirecionar) exigiram retrabalho.
- Parte do que estava no escopo ficou para depois por falta de tempo (seção 18): modo offline, novo prazo, cobrança.

**O que faríamos diferente**
- Definir o modelo de dados, os perfis e os status **antes** das telas.
- Votar em ata no mesmo dia cada decisão de regra.
- Rodar o teste manual curto (`docs/TESTES_PENDENTES.md`, seção 2) a cada PR, e não só no fim.
- Instalar desde o começo uma biblioteca de teste de interface, para testar cliques e foco, e não só as regras.
- Registrar toda mudança de layout em ata ou issue; um responsável por consolidar os documentos.

**Perguntas para o grupo completar**
- Hipótese sobre usuários que precisou ser revista: `☐`
- Barreira de acessibilidade mais difícil de perceber. Candidatas: foco escondido com `outline: none`; skip link que "não fazia nada"; aviso de limite que voltava. `☐`
- Requisito ambíguo e como ficou testável. Exemplos: "demanda parada" virou a fila de atenção, com 48 h e 24 h; "quem define prioridade". `☐`

## 15. Checklist pré-demonstração
☐ Todos instalam, rodam e explicam o projeto · ☐ Tag da versão entregue · ☐ Cada critério de aceitação com evidência real · ☐ Limitações (seção 11) registradas · ☐ Cenário de usuário com **ao menos uma falha** demonstrada (sugestão: envio offline → aviso → reconexão) · ☐ Recursos de terceiros e de IA identificados · ☐ Os 5 usuários de teste documentados no README.

## 16. Mapa defeito → bloco de correção
| Bloco | Branch | Conteúdo | Defeitos |
|---|---|---|---|
| 1 Fundação | `feat/fundacao` | Dados, seed, domínio (status, permissões, prazos) com testes, login/perfis/Sair | G03, G05, G07, G09, G18 |
| 2 Telas e Nova Demanda | `feat/telas-nova-demanda` | Telas por ID, abas, filtro, dashboard por perfil, Nova Demanda (offline, pop-up, pendentes) | G01, G02, G03, G04, G05, G06, G15, G16, G17, G19 |
| 3 Acessibilidade | `fix/acessibilidade` | Contraste, foco, h1, rótulos, diálogo, skip link; auditoria depois | G10, G11, G12, G13, G14, G20 |
| 4 Regras (se houver tempo) | `feat/regras-aceite` | Aceite com prioridade, prazos, recusa/triagem, redirecionar, concluir/travar, cancelar | G08 |
| Docs | `docs/fechamento` | README, atas, retrospectiva, escopo entregue × adiado, tag | Seções 12, 14, 15 |

## 17. Rastreio da lista de ajustes do grupo (02/10, 21h)
Cobertura item a item em `docs/REQUISITOS_REGRAS_DE_NEGOCIO.md`, seção 11.

## 18. Escopo entregue × adiado (atualizado em 04/10, com honestidade)
| Item | Entregue? | Justificativa se adiado |
|---|---|---|
| Núcleo (Blocos 1–3): login simulado e Sair, dados no navegador, telas ligadas aos dados, Nova Demanda com validação e pop-up, acessibilidade (foco, contraste, skip link, fonte de 14 px) | ☒ entregue | — |
| Regras do Bloco 4: aceite com prioridade e recusa (4A), fila de atenção (4B), redirecionar com justificativa, Não aplicável e Cancelar (4C), concluir pela tela Atualizar | ☒ entregue | Regras ainda **não votadas em ata** (propostas 12 a 15 do rascunho de 03/10) |
| Ajustes do teste manual (PR #9): cards clicáveis, paginação, busca, contraste das bordas, menu no celular, "(obrigatório)", confirmação do reset | ☒ entregue | Reteste do autor pendente (`TESTES_PENDENTES.md`, R.1 a R.9) |
| Novo prazo com justificativa (RN14, RF-R11, CT-R09) | ☐ adiado | Prioridade ao fluxo principal no prazo de 3 dias. A permissão já existe e é testada (`podeRegistrarPrazo`); falta a tela |
| Cobrança no histórico (RN21, RF-R12) | ☐ adiado | Mesmo motivo. A permissão existe (`podeCobrar`) e o seed tem um exemplo de cobrança (DM-2011); falta a tela |
| Devolver à triagem uma demanda já aceita (Em andamento/Aguardando → Em triagem) | ☐ adiado | A transição está prevista em `status.js`; a tela só oferece a recusa de uma demanda pendente |
| Envio da Nova Demanda no celular real, acessando pelo IP da rede | ☐ não funciona (falha F1, seção 23) | Achado no teste de 04/10, à noite; não corrigido por falta de tempo antes da apresentação. Causa não confirmada |
| Status de conexão, fila "Pendentes de envio" e rascunho guardado (RF10, RNF03, "2C") | ☐ adiado | Sem back-end, nada no app depende da rede depois de carregado (seção 20). Num sistema real seriam necessários aviso de conexão e fila com service worker |
| Chat, reabrir com citação, "visualizada", responsável individual | ☐ adiado | Prazo; especificados em `REQUISITOS_REGRAS_DE_NEGOCIO.md` (RN23 a RN26) |
| Tema escuro/claro | ☐ futuro | Custo alto e risco para o contraste já validado (seção 20) |
| Testes automáticos de interface (cliques, foco) | ☐ não feito | Não há biblioteca para isso no projeto (jsdom/Testing Library); os 245 testes cobrem as regras |
| NVDA na rodada de reteste, nova rodada do axe, Lighthouse nas demais telas, zoom de 400% e 500%, dados corrompidos pelo F12, reabrir o aviso de limite de 500 caracteres, Voz de Acesso | ☐ **não executado** | Falta de tempo antes da apresentação (decisão do autor, 04/10/2026). Detalhes em `TESTES_PENDENTES.md`, seção 0 |

## 19. Evidência real já existente
- **Axe "antes":** `docs/evidencias/antes/RELATORIO_AXE_ANTES.md` e `axe_antes.json`. Auditoria automática (axe-core 4.13.0) do `main` de 03/10, **antes** das correções. Achado dominante: contraste (24 combinações reprovadas) em todas as telas.
- **Axe "depois":** `docs/evidencias/depois/RELATORIO_AXE_DEPOIS.md` e `axe_depois.json`.
  - Feita no Bloco 3 (branch `fix/acessibilidade`), gerada **pelo assistente, em ambiente de nuvem, não pela equipe**.
  - **0 violações nas 26 combinações** (login + 6 rotas × 2 perfis, em 1280 e 360 px).
  - 12 itens "incompletos": contraste do menu lateral em 360 px, a conferir a mão.
- **Testes manuais do autor:** `docs/evidencias/depois/TESTE_MANUAL_BLOCO1.md` e `TESTE_MANUAL_BLOCO2A.md`. O teste da 2B tem registro escrito só no CHANGELOG, mas tem prints (tabela abaixo).

**Evidências relatadas pelo autor (Bruno Diogo) em 04/10, com os prints que existem na pasta** (conferido em 04/10). Onde não há arquivo, está escrito.
| Evidência | Resultado relatado | Arquivo esperado |
|---|---|---|
| Lighthouse, Visão Geral, `admin`, desktop | 100/100 | `docs/evidencias/depois/lighthouse_visao-geral_admin_desktop.png` |
| Lighthouse, Nova Demanda, `admin`, desktop | 100/100 | `docs/evidencias/depois/lighthouse_nova-demanda_admin_desktop.png` |
| Leitor de tela: NVDA 2026.2 + Edge InPrivate | Testado 2 ou 3 vezes; resultado por tela a registrar | `docs/evidencias/depois/nvda_edge-inprivate_visao-geral.png`, `docs/evidencias/depois/nvda_edge-inprivate_nova-demanda.png` |
| 360 px no DevTools (Samsung Galaxy A55), antes do PR #9 | Achados (menu com rolagem e itens cortados), corrigidos no PR #9 | `docs/evidencias/depois/devtools-360px_galaxy-a55_visao-geral.png`, `docs/evidencias/depois/devtools-360px_galaxy-a55_demandas.png` |
| Zoom de 200% no Chrome (1920 × 1080, escala 100%) | OK | `docs/evidencias/depois/zoom-200_chrome_1920x1080_visao-geral.png` |
| Celular real Android, pela rede Wi-Fi (`npm run dev -- --host`), antes do PR #9 | Visão Geral, Demandas, Departamentos e Nova Demanda abriram; achados corrigidos no PR #9 | `docs/evidencias/depois/celular-android_visao-geral.jpeg`, `docs/evidencias/depois/celular-android_demandas.jpeg`, `docs/evidencias/depois/celular-android_departamentos.jpeg`, `docs/evidencias/depois/celular-android_nova-demanda.jpeg` |
| **Rodada final do autor, 04/10/2026:** retestes 1 a 12 do PR #9 | Todos passaram (detalhes em `docs/TESTES_PENDENTES.md`, seção 0). O passo 1 do reteste 10 está **sem print** | Prints com o autor, ainda não salvos em `docs/evidencias/` |
| Bloco A: encerrada sem ações, em andamento com ações, ordenação | Passou | Prints com o autor, ainda não salvos |
| Bloco B: Nova Demanda só com teclado, tipo "Outros", DM-2015 → Elétrica, DM-2016 → Administrativo, pop-up com foco em "Ver demanda", Esc devolve o foco | Passou, **por relato do autor**; sem print de cada passo (a captura exige mouse); há prints do resultado | Prints do resultado com o autor, ainda não salvos |
| Bloco C, parte 1: falha simulada `?falha=1` | Passou: mensagem "Não foi possível enviar. Seus dados continuam salvos. Tente novamente.", formulário mantido, nenhuma demanda criada | Print com o autor, ainda não salvo |
| Bloco C, parte 2: Resetar dados com confirmação | Passou: "Voltar" não apaga; confirmar volta ao exemplo (`admin`: Abertas 10, Pendentes de aceite 2, aviso "2 aguardando triagem · 2 pendentes de aceite"). Em dois prints o `?falha=1` ainda estava no endereço; o reset funcionou mesmo assim | Prints com o autor, ainda não salvos |
| Bloco D, parte 1: celular Android real (Chrome, `user03`) | Telas abrem, sem rolagem lateral, o teclado não esconde o campo, alvos de toque OK. **Falhou o envio da Nova Demanda** (F1, seção 23), reproduzido 2 vezes (19:47 e 19:48) | `docs/evidencias/depois/celular/` (**pasta ainda não existe; o autor vai criá-la e salvar os prints**) |
| Falha do Bloco 1 (antes da correção) | Sair escondido em 360 px | **Sem print do estado anterior** (defeito corrigido; não reproduzível sem voltar o código). Registro escrito em `docs/evidencias/depois/TESTE_MANUAL_BLOCO1.md` |
| Falhas dos Blocos 2A e 2B (antes da correção) | Campo travado no Atualizar; limite "2400/60" e "3072/500" | `docs/evidencias/antes/teste-manual_bloco2a_atualizar-sem-campo.png`, `docs/evidencias/antes/teste-manual_bloco2b_limite-titulo-2400-60.png`, `docs/evidencias/antes/teste-manual_bloco2b_limite-descricao-3072-500.png` |
| axe | 0 violações nas 26 combinações, **na rodada antiga** (Bloco 3, assistente na nuvem). **Nova rodada no código atual: não executada** | `docs/evidencias/depois/RELATORIO_AXE_DEPOIS.md` e `axe_depois.json` (existem). Para a nova rodada, sugestão de nome: `docs/evidencias/depois/axe_rodada2_<data>.json` (ainda não existe) |

> Os prints ficam só em `docs/evidencias/antes/` e `docs/evidencias/depois/`.

- **Pendentes:** nova rodada do axe no código atual; Lighthouse nas outras telas e em mobile; resultado do NVDA por tela; comando de voz; reteste do PR #9. Roteiro em `docs/TESTES_PENDENTES.md`.

## 20. Limitações e trabalho futuro: simulação sem back-end
> O enunciado proíbe back-end real e aceita "JSON ou solução equivalente" (ADR-02). Tudo abaixo é **simulação para a demonstração**, não um sistema seguro.

### 20.1 De onde vêm os dados
- **`src/data/seed-demandas.json`:** as 13 demandas de exemplo.
  - Criado no Bloco 1 (CHANGELOG, "Arquivos novos"); a DM-2013 foi acrescentada no Bloco 4B.
  - Não há script que o gere: o `package.json` só tem `dev`, `build`, `lint`, `preview` e `test`. O arquivo foi escrito à mão, com as datas no formato "há X horas" (`criadaHaHoras`, `haHoras`…).
  - **Quem digitou cada linha não é possível determinar pelo código; ver o histórico do arquivo no GitHub.**
- **`src/data/usuarios.json`:** os 5 logins de teste (senha = usuário).
- **`src/data/departamentos.json`:** os 4 setores e os tipos de atendimento.
- **`src/data/demandas.json` e `src/data/VisaoGeral.json`:** dados antigos das telas dos colegas. **Nenhum arquivo do código os importa mais** (desde a 2A); mantidos até o grupo aprovar a remoção.

### 20.2 Como os dados andam no app
1. `src/services/seed.js` importa o `seed-demandas.json` e troca cada "há X horas" por uma data real, calculada **a partir do momento da carga**.
2. `src/services/storage.js` é o único lugar que mexe no armazenamento. Nenhuma tela chama `localStorage` direto.
   - **Primeira carga:** a chave não existe, então grava a semente.
   - **Depois:** lê e grava sempre no `localStorage`.
3. As telas leem pelo hook `useDemandas` e gravam por `obterStorage().criarDemanda(...)` / `atualizarDemanda(...)`. A regra (`src/domain/acoes.js`) é conferida de novo na hora de gravar.

| O quê | Onde fica | Quem escreve | Quem lê |
|---|---|---|---|
| Demandas | `localStorage`, chave `demanda-de-aco:v1:demandas` | `storage.js` (semente, Nova Demanda, aceite, recusa, triagem, atualização) | todas as telas, via `useDemandas` |
| Contador do próximo número (DM-20xx) | `localStorage`, chave `demanda-de-aco:v1:contador` | `storage.js` ao criar | `storage.js` |
| Sessão (usuário logado; **a senha nunca é gravada**) | `sessionStorage`, chave `demanda-de-aco:v1:sessao` | `auth.js` ao entrar; apagada ao Sair | `auth.js` / `useSessao` |
| Filtros, busca, ordenação e página | **não são guardados**: ficam só na memória da tela. Status, filtro do painel, setor e aba podem vir no endereço (`#demandas?status=…`, `?filtro=…`) | a própria tela | a própria tela |

- **"Resetar dados"** (na tela de login, com confirmação desde o PR #9, e na mensagem de dados com problema):
  - apaga as chaves de demandas e de contador;
  - a próxima leitura recria a semente com **datas novas, relativas a agora**;
  - não mexe na sessão.
- **Nada altera os arquivos JSON.** O navegador não consegue escrever em arquivos do projeto; o JSON é só a semente.
- **`?falha=1`:** gancho de teste só com esse parâmetro exato, na parte de busca do endereço, antes do `#` (`http://localhost:5173/?falha=1#nova-demanda`).
  - `storage.js` confere `falha === '1'` e faz **as gravações** falharem de propósito, para mostrar o estado de erro.
  - A leitura não falha.
  - Dentro do hash (`#nova-demanda?falha=1`) não funciona.

### 20.3 Por que assim
- ADR-02 (JSON + `localStorage`, chave versionada, `try/catch`, "Resetar dados", falha simulável), ADR-03 (um JSON por entidade) e ADR-07 (perfis em `sessionStorage` como simulação).
- **Atende os requisitos?** Atende ao enunciado ("sem back-end real, JSON ou equivalente"), à Ata 15/09 (dados persistidos; o formulário não se perde quando o envio falha) e à seção 10 dos requisitos (datas relativas, para sempre haver demandas a expirar e vencidas).
- **Não atende** ao "não perder o formulário ao recarregar" nem ao "status de conexão" (RF10). Os dois foram adiados (seção 18).

### 20.4 O que é inseguro (e por que é aceitável só aqui)
- **Senhas em texto puro** no `usuarios.json`. Elas vão junto no JavaScript entregue ao navegador, e qualquer pessoa as lê pelo DevTools.
- **Permissões só no navegador:** quem edita a chave `demanda-de-aco:v1:sessao` ou `demanda-de-aco:v1:demandas` pelo DevTools pode se passar por outro perfil ou mudar qualquer demanda.
- **Sem criptografia**, sem validação no servidor, sem registro confiável de quem fez o quê: o histórico pode ser editado.
- **Dados presos a um navegador:** outro computador não vê as mesmas demandas.
- **Por que é aceitável:** é um protótipo de interface para uma disciplina, com dados fictícios, sem dados pessoais reais, e o enunciado proíbe back-end. As regras ficaram em funções puras (`src/domain/`) justamente para serem levadas a um servidor depois.

### 20.5 O que um back-end real substituiria
| Hoje (simulação) | Num sistema real |
|---|---|
| `usuarios.json` com senha em texto | Banco de usuários com senha guardada como hash (ex.: bcrypt/argon2) |
| Sessão no `sessionStorage` | Autenticação com token (ex.: JWT com validade, ou cookie de sessão `HttpOnly`) |
| Permissões conferidas só no navegador | As mesmas regras de `src/domain/` rodando **no servidor** em cada pedido |
| `localStorage` (um navegador só) | Banco de dados (ex.: PostgreSQL), compartilhado por todos |
| Contador de números no navegador | Número gerado pelo banco, sem repetição |
| Relógio do navegador para prazos | Relógio do servidor; tarefa agendada para marcar atrasos |
| `?falha=1` | Erros reais de rede/servidor, com nova tentativa |
| Histórico editável | Histórico só de acréscimo, com auditoria |
| — | Fila de envio offline (service worker) e aviso de conexão |

### 20.6 Outros limites conhecidos
- **Rotas por hash** (`#demandas`, ADR-04): simples e sem servidor, mas o foco e o título precisam ser trocados à mão a cada tela (já feito).
- **Prazos dependem do relógio do navegador.** A semente é relativa ao momento do reset, então os números mudam sozinhos com as horas. Exemplo: a DM-2004 vence 8 h depois do reset e "Vencidas" passa de 2 para 3. **Antes de demonstrar, use "Resetar dados".**
- **Zoom de 400% e 500%: não executados.** O assistente só emulou 320 px no navegador embutido, o que não substitui o zoom real; o autor conferiu 200% no Chrome. No zoom de 500% pode haver rolagem lateral da página inteira, porque o `index.css` (código anterior) tem `min-width: 320px` no `html` e no `body`.
- **Sem biblioteca de teste de interface:** os 245 testes cobrem regras e storage, não cliques nem foco.
- **Setores fixos em 4** (seção 11).

### 20.7 Trabalho futuro: tema escuro/claro (levantamento de 04/10; **não implementado**)
- **Hoje:**
  - **25 variáveis de cor**, todas em `VisaoGeral.css`;
  - **280 cores fixas** (172 diferentes) em **6 arquivos CSS**: `App.css` 146, `DetalhesDemanda.css` 75, `VisaoGeral.css` 22, `Sidebar.css` 14, `Login.css` 12, `index.css` 11;
  - nenhuma cor nos `.jsx`.
- **Risco:** o contraste validado (4,5:1 e 3:1) foi calculado contra o branco; no tema escuro **teria de ser refeito**, e o axe teria de rodar **nos dois temas**.
- **Trabalho estimado:** muito.
- **Plano em 4 passos:**
  1. trocar as cores fixas por cerca de 20 tokens em `:root`, sem mudar o visual;
  2. criar o tema escuro com `prefers-color-scheme` e um botão (`[data-theme]`) guardado no navegador;
  3. recalcular o contraste de cada par de cores por script;
  4. rodar o axe e um teste manual nos dois temas.

## 21. Personas × o que atende, evidência e o que ficou para o futuro
| Persona | O que o app faz | Evidência | Futuro / não executado |
|---|---|---|---|
| **Rafael (só teclado)** | Ordem do Tab segue a tela; o 1º Tab mostra "Ir para o conteúdo"; o foco vai para o título a cada troca de tela; contorno verde em tudo que recebe foco; pop-ups com foco preso, Esc para fechar e foco de volta ao botão de origem; cards da Visão Geral são links | Conferência do assistente a cada bloco (CHANGELOG); o autor conferiu no Edge skip link, Tab, Enter, Shift+Tab e contorno (`evidencias/depois/RELATORIO_AXE_DEPOIS.md`); **Bloco B (04/10): Nova Demanda inteira só com teclado passou** (relato do autor) | Volta completa só com teclado em todas as telas, inclusive as dos Blocos 4A a 4C (`TESTES_PENDENTES.md`, 1.6, 2.1, 4A.1, 4C.1) |
| **Bia (leitor de tela / assistente por voz)** | Um `<h1>` por tela; rótulos ligados aos campos; erros ligados por `aria-describedby`; contagens e avisos em `role="status"`; pop-ups com `role="dialog"`; selos em texto, não só cor | **NVDA 2026.2 + Edge InPrivate, testado 2 ou 3 vezes (relato do autor)**; prints esperados na seção 19 | Resultado por tela a registrar. **Comando de voz (ex.: Voz de Acesso do Windows): não executado** |
| **Dona Célia (celular, rede instável)** | Telas sem rolagem lateral de 320 a 1280 px; menu quebra linha; botões de 24 px ou mais; o formulário continua preenchido se o envio falha (`?falha=1`) | 360 px passou no reteste 6 (04/10). Celular real Android (Bloco D, `user03`): telas abrem, sem rolagem lateral, teclado não esconde o campo, alvos de toque OK; **o envio da Nova Demanda trava em "Enviando…" (F1, seção 23)** | **F1 não corrigida.** **Não há detecção de offline**: o código não usa `navigator.onLine` nem os eventos `online`/`offline`; não há aviso de conexão; o texto digitado **some ao recarregar**. Justificativa: sem back-end, depois que a página carrega nada depende da rede (os dados ficam no navegador). Num sistema real seriam necessários aviso de conexão e rascunho/fila de envio com service worker (seção 18) |

## 22. O aviso "Precisa de atenção" (para a apresentação)
- **O que mostra:** no topo da Visão Geral, uma faixa com "N aguardando triagem" e "N pendentes de aceite". Cada número é um link que abre a lista de Demandas já filtrada. **Só aparece se houver pelo menos uma.**
- **Por que existe:** essas demandas estão **paradas esperando alguém agir**.
  - Pendente de aceite: o setor ainda não aceitou nem recusou. Prazo de 48 h, ou 24 h depois de um redirecionamento.
  - Em triagem: a gerência ainda não redirecionou, marcou Não aplicável nem cancelou. Prazo de 24 h.
  - Nas outras demandas alguém já está trabalhando.
- **Quem vê o quê:**
  - a gerência vê triagem e pendentes de todos (ou do setor que escolheu no filtro);
  - um setor vê só as pendentes que ele recebeu, e nunca a triagem, que é da gerência;
  - quem só abriu a demanda não vê o aviso.
- **Ordem de atenção:** na lista da Visão Geral e em Demandas (opção padrão "Atenção primeiro"):
  1. vêm primeiro as demandas em triagem e as pendentes de aceite, **a mais antiga primeiro** (a que está parada há mais tempo);
  2. depois vem o resto, na ordem de antes: prioridade e data em Demandas, mais recentes na Visão Geral;
  3. se a pessoa escolher outro "Ordenar por", vale a escolha dela.
- **Selos nos cards:** "Aguardando aceite há X", "Em triagem · parada há X", "Atrasada para aceite" e "Atrasada para triagem". São escritos em texto, não só em cor. Quem só abriu não vê tempo parado (RN03).
- **Onde está no código:** `src/domain/atencao.js` (prazos e selos) e `src/domain/listas.js` (`avisoDeAtencao`, `ordenarPorAtencao`), com testes. Explicação completa em `docs/EXPLICACAO_BLOCO4B.md`.

## 23. Falhas conhecidas (encontradas no teste de 04/10/2026; não corrigidas por falta de tempo)
> Decisão do autor: **nenhuma correção de código antes da apresentação (terça, 06/10, à noite).** A "origem no código" foi conferida por leitura, **sem alterar e sem depurar**. Onde não deu para confirmar, está escrito.

| # | Sintoma | Onde acontece | Impacto | Origem no código | Status |
|---|---|---|---|---|---|
| **F1** | O envio da Nova Demanda trava em "Enviando…". Reproduzido 2 vezes (19:47 e 19:48). No computador funciona | Celular real, acessando por `http://<IP-da-rede>:5173` (`npm run dev -- --host`) | **Alto no celular:** a pessoa não consegue registrar demanda pelo IP da rede | **Causa não investigada.** *Hipótese não confirmada:* `src/pages/NovaDemanda.jsx` (`handleSubmit`) chama `crypto.randomUUID()`, e o navegador só oferece essa função em contexto seguro (HTTPS ou `localhost`); pelo IP com `http` ela não existe. Isso daria um erro depois de `setEnviando(true)`, e o botão ficaria em "Enviando…". Se for isso, aceite, recusa, triagem e Atualizar no celular também falhariam (usam `crypto.randomUUID()` em `contextoDaAcao`), mas eles **não foram testados no celular** | Não corrigido por falta de tempo |
| **A13** | O erro antigo "Escolha primeiro o destino." pode continuar no campo Tipo depois de escolher o Destino | Nova Demanda, depois de enviar vazio | Baixo: a mensagem fica errada até mexer no Tipo ou enviar de novo | **Não confirmado se ainda ocorre.** Pela leitura: `atualizar` em `src/pages/NovaDemanda.jsx` limpa só o erro do campo alterado (`[name]: undefined`); trocar o Destino não limpa o erro do Tipo (`tipo-sem-destino`) | Não corrigido por falta de tempo |
| **A14** | Barras de busca com ~metade da largura em tela larga e 100% em tela estreita | Visão Geral, Demandas, Departamentos | Baixo (visual) | Em Demandas, `.search-field` tem `width: min(100%, 430px)` em `src/App.css`. Na Visão Geral (`.visao-geral .search-bar`) e em Departamentos (`.department-search`) não há largura definida: **causa não investigada** | Não corrigido por falta de tempo |
| **A15** | Quem abriu vê "Não aceita pelo setor" para uma demanda que está Pendente de aceite no destino; a frase sugere recusa | Detalhes e listas do solicitante (DM-2014, DM-2015, DM-2016; DM-2001 vista pela Hidráulica) | Médio (texto confuso) | `resumoParaSolicitante` em `src/domain/permissoes.js` troca "Pendente de aceite" por "Não aceita pelo setor", que é o texto da **RN12**. Proposta: "Aguardando aceite do setor" (mudar a RN12, não a RN09) | Não corrigido; a proposta vai para ata |
| **A16** | O select de status corta o texto: "Pendente de aceit" | Tela Atualizar, modo aceite | Baixo (visual) | `.update-status-control select` com `max-width: 170px` em `src/pages/DetalhesDemanda.css`, com a fonte de 14 px | Não corrigido por falta de tempo |
| **A17** | Vindo do card "Recebidas abertas" e trocando para a aba Solicitadas, o aviso "Filtro da Visão Geral: Recebidas abertas" continua e filtra a outra aba | Demandas, setor | Baixo; dá para clicar em "Limpar filtro" | `trocarAba` em `src/pages/Demandas.jsx` muda a aba e a página, mas não limpa `filtroPainel` | Não corrigido por falta de tempo |
| **O1** | O campo Origem (somente leitura) recebe o foco com o texto selecionado | Nova Demanda, Tab | Muito baixo | `<input id="origem" … readOnly>` em `src/pages/NovaDemanda.jsx`: campo só leitura continua focável; o texto selecionado ao focar é comportamento do navegador (não investigado a fundo) | Não corrigido |
| — | Sem detecção de offline; o formulário se perde ao recarregar (RF10 não atendido) | Nova Demanda | Médio para a persona Dona Célia | Não existe `navigator.onLine` nem os eventos `online`/`offline` no código | Adiado (seção 18) |
| — | Zoom de 500% pode ter rolagem lateral | Todas as telas | Baixo | `min-width: 320px` no `html` e no `body` em `src/index.css` | Não executado (seção 20.6) |
| — | Sem biblioteca de teste de interface | Testes | Os testes cobrem regras, não cliques | Só `vitest` em `package.json` | Limitação |
| — | Tema claro/escuro | — | — | Trabalho futuro (seção 20.7) | Futuro |
