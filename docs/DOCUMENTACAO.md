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
Status (código do Git de 03/10, **por leitura de código; não testado no navegador**): ✅ atende · 🟡 parcial · ❌ não atende.
| Necessidade (fonte) | Req. | História | Tela / componente | Teste | Status |
|---|---|---|---|---|---|
| Registrar rápido (enunciado) | RF02, RF03 | US01 | `NovaDemanda.jsx` | TC01 | 🟡 tipo é select fixo; origem/destino texto livre; não grava |
| Validação clara (enunciado) | RNF05 | US02 | `NovaDemanda.jsx` | TC02 | 🟡 só `required` nativo |
| Saber se o envio deu certo (enunciado) | RF10, RF11 | US03 | `NovaDemanda.jsx` | TC03 | ❌ só aviso "Cadastro simulado" |
| Não perder formulário (Ata 15/09) | RNF03 | US04 | storage (a criar) | TC04 | ❌ |
| Lista ordenada (Ata 15/09) | RF04, RF05 | US05 | `Demandas.jsx` | TC05, TC06 | 🟡 busca e ordenações existem; padrão é por data; sem filtro por departamento |
| Detalhe e histórico (Ata 08/09, 22/09) | RF06 | US06 | `DetalhesDemanda.jsx`, `AtualizarDemanda.jsx` | TC07 | 🟡 layout pronto; **fixo na DM-2048**, histórico fixo |
| Acessar setor (chat 02/10) | RF09 | US07 | `Departamentos.jsx` | TC08 | ❌ link vai a `#demandas` sem filtrar |
| Só teclado (Rafael) | RNF01 | US08 | global | TC09 | 🟡 a auditar |
| Leitor de tela (Bia) | RNF02 | US09 | global | TC10 | 🟡 a auditar |
| Celular (Dona Célia) | RNF04 | US10 | global | TC11 | 🟡 há `@media` em 4 CSS; a testar |
| Visão geral (Ata 15/09, 22/09) | RF08 | US11 | `VisaoGeral.jsx` + `VisaoGeral*.jsx` | TC12 | 🟡 tela pronta; números fixos em outro JSON |
| Login e Sair (Ata 15/09) | RF01 | US12 | Login (a criar) | TC13 | ❌ não existe; "Sair" sem ação |
| Perfis e visibilidade (03/10) | RF13 | US17 | permissões (a criar) | TC15 | ❌ |
| Aceite/triagem/encerramento (03/10) | RF14 | US14, US15 | Detalhe (a criar) | TC16 | ❌ |
| Prazos e cobrança (03/10) | RF15 | US16 | Detalhe/Visão Geral (a criar) | TC17 | ❌ |
| Estados (enunciado) | RNF06 | US03, US05 | todas | TC14 | 🟡 só lista vazia |

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
Sem back-end; dados e perfis só no navegador e editáveis (não é segurança); e-mail apenas simulado; login fictício; sem sincronização entre dispositivos; teste com leitor de tela restrito ao que a equipe executar; layout mudou durante o desenvolvimento (seção 12); setores fixos em 4 (TI, Hidráulica, Administrativo, Elétrica), em `departamentos.json`: **cadastro de novos setores é funcionalidade futura**, e até lá um pedido de área fora deles segue devolução à triagem → redirecionar ou "Não aplicável" (proposta em `ATAS_RASCUNHO_27-09_e_02-10.md`, item 11).

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

## 14. Retrospectiva (rascunho a completar em grupo)
- **Hipótese sobre usuários que precisou ser revista:** `☐`
- **Barreira de acessibilidade mais difícil de perceber** (candidata: foco removido com `outline: none`; diálogo sem foco gerenciado): `☐`
- **Requisito ambíguo e como ficou testável** (ex.: "tipo de atendimento", "status oficial", "demanda parada", "quem define prioridade"): `☐`
- **O que mudar no processo antes do back-end** (candidatos: registrar toda mudança de layout em ata/issue; um responsável por consolidar documentos; atas no mesmo dia; definir o *modelo de dados e perfis* antes das telas; validação intermediária com o professor): `☐`

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

## 18. Escopo entregue × adiado (preencher no fim, com honestidade)
| Item | Entregue? | Justificativa se adiado |
|---|---|---|
| Núcleo (Blocos 1–3) | ☐ | |
| Regras (Bloco 4) | ☐ | |
| Chat, reabrir, "visualizada", responsável individual | ☐ (adiado) | Prazo; especificados em `REQUISITOS_REGRAS_DE_NEGOCIO.md` |

## 19. Evidência real já existente
- **Axe "antes":** `docs/evidencias/antes/RELATORIO_AXE_ANTES.md` e `axe_antes.json`. Auditoria automática (axe-core 4.13.0) do `main` de 03/10, **antes** das correções. Achado dominante: contraste (24 combinações reprovadas) em todas as telas.
- **Axe "depois":** `docs/evidencias/depois/RELATORIO_AXE_DEPOIS.md` e `axe_depois.json`.
  - Feita no Bloco 3 (branch `fix/acessibilidade`), gerada **pelo assistente, em ambiente de nuvem, não pela equipe**.
  - **0 violações nas 26 combinações** (login + 6 rotas × 2 perfis, em 1280 e 360 px).
  - 12 itens "incompletos": contraste do menu lateral em 360 px, a conferir a mão.
- **Testes manuais do autor:** `docs/evidencias/depois/TESTE_MANUAL_BLOCO1.md` e `TESTE_MANUAL_BLOCO2A.md`. O teste da 2B tem registro só no CHANGELOG, sem arquivo próprio. Prints guardados pelo autor, a anexar.
- **Pendentes:** nova rodada do axe pela equipe (inclui os Blocos 4A a 4C), Lighthouse, leitor de tela e celular real. Roteiro em `docs/TESTES_PENDENTES.md`.
