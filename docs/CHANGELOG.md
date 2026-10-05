# CHANGELOG

Uma entrada por bloco/PR (formato em `docs/CONVENCOES.md`).

### 2026-10-03 · Bloco 1 · feat/fundacao
- **Arquivos novos:** `src/domain/status.js`, `prioridades.js`, `prazos.js`, `permissoes.js` (+ `*.test.js`); `src/services/storage.js` (+ `storage.test.js`), `seed.js`, `auth.js`; `src/hooks/useSessao.js`, `useDemandas.js`; `src/pages/Login.jsx`, `Login.css`; `src/data/usuarios.json`, `seed-demandas.json`; `docs/CHANGELOG.md`, `docs/EXPLICACAO_BLOCO1.md`.
- **Arquivos alterados:** `src/App.jsx` (guarda de rotas e login), `src/components/Sidebar.jsx` (usuário logado e Sair), `src/components/Sidebar.css` (Sair visível no celular), `src/data/departamentos.json` (acrescenta `tiposAtendimento`), `package.json` (`vitest` e script `test`), `docs/MENSAGENS_VALIDACAO.md` (mensagens novas marcadas como proposta).
- **O quê:** regras de status, prioridade, prazo e permissão em funções puras com testes; camada única de dados com semente versionada, resultado explícito, dados corrompidos sem apagamento automático, "Resetar dados", atraso e falha simulados (`?falha=1`) nas gravações e IDs por contador; login com sessão no `sessionStorage`, Sair funcional e guarda de rotas.
- **Por quê:** não havia camada de dados (G03), nem login/perfis (G07); a máquina de estados do app não batia com a proposta (G09); datas simuladas eram fixas (G18).
- **Mudança visual:** só a tela nova de login. Sidebar mantém layout e classes; troca o usuário fixo "Márcio Almeida / Gestor" pelo usuário logado.
- **Atende:** RN01–RN06, RN09–RN11, RN13–RN16, RN18–RN21 (como funções testadas; a interface dessas ações é dos Blocos 2 e 4); RF-R01; CA-R01, CA-R02, CA-R07, CA-R10, CA-R11 (no nível das regras).
- **Verificação:** `npm test` 5 arquivos / 61 testes passaram · `npm run lint` 0 avisos e 0 erros · `npm run build` OK. Teste manual no navegador (CT-R01, CT-R02, CT-R11): **não executado**.
- **Teste manual (03/10, Edge, navegação privada):** passou nos 5 logins, em entrar e sair, no F5 (sessão e dados mantidos) e em fechar o navegador (pede login de novo). Teclado: parcial, com TAB inconsistente nas telas antigas (fica para o Bloco 3). Dados corrompidos: não executado. Evidência em `docs/evidencias/depois/TESTE_MANUAL_BLOCO1.md`.
- **Observação (decisão de projeto, não bug):** voltar para a URL na mesma aba mantém a sessão ativa, porque ela fica no `sessionStorage`; só o **Sair** encerra a sessão. Fechar o navegador também encerra.
- **Correção — Sair no celular (falha do teste manual):** em 360 px a Sidebar escondia o perfil inteiro (`.sidebar-profile { display: none }` no `@media (max-width: 760px)`), e com ele o botão Sair. Agora o perfil aparece abaixo do menu e o Sair tem alvo de 34 × 34 px (WCAG 2.5.8). Mudança visual só no celular, por acessibilidade; o layout no computador não muda. Arquivo: `src/components/Sidebar.css`. Verificado pelo assistente no navegador embutido em 360 × 740: o Sair fica visível, é alcançado por Tab e o Enter encerra a sessão. Reteste da equipe no Edge: não executado.
- **Preexistente (não alterado):** `DetalhesDemanda.jsx` e `AtualizarDemanda.jsx` usam `localStorage` direto e a DM-2048 fixa; as telas ainda leem `demandas.json` e `VisaoGeral.json`. Fica para o Bloco 2.

### 2026-10-03 · Bloco 2A · feat/telas-nova-demanda
- **Arquivos novos:** `src/domain/listas.js`, `acoes.js` (+ `listas.test.js`, `acoes.test.js`), `src/domain/setores.js`; `src/components/EstadoDados.jsx`; `src/mensagens.js`; `src/formatos.js`; `docs/EXPLICACAO_BLOCO2A.md`.
- **Arquivos alterados:** `src/pages/Demandas.jsx`, `DetalhesDemanda.jsx`, `Departamentos.jsx`, `AtualizarDemanda.jsx`, `VisaoGeral.jsx`; `src/components/VisaoGeralStatsCards.jsx`, `VisaoGeralFilterTabs.jsx`, `VisaoGeralHeader.jsx`, `Sidebar.jsx` (iniciais vão para `formatos.js`); `src/App.jsx` (lê `:id` e setor da URL); `src/hooks/useDemandas.js` (estados carregando/erro); `src/services/storage.js` (+ testes); `src/App.css`, `src/pages/VisaoGeral.css` (só classes novas); `src/data/departamentos.json` (sai o `demandasAbertas` fixo); `docs/MENSAGENS_VALIDACAO.md`.
- **O quê:** as 5 telas existentes passam a ler a base nova, com o layout e as classes dos colegas mantidos. **Demandas:** abas Recebidas/Solicitadas (gerência: Todas/Solicitadas por mim), filtro por departamento (travado para setor), seção "Pendentes de aceite", ordenação prioridade → recente → título, todos os cards abrem o detalhe, nível Urgente, estados carregando/vazio/erro. **Detalhes:** lê o `:id`, mostra "Demanda não encontrada ou sem permissão" (RN04), resumo sem histórico/prazo/prioridade para quem só abriu (RN03), histórico real. **Departamentos:** contagem calculada, "Acessar setor" abre `#demandas/<setor>`, setor vê só o próprio card. **Atualizar:** só o executor, só em Em andamento/Aguardando; muda status (transições simples) e tipo; setor/origem/responsável viram listas travadas; prioridade e prazo travados; histórico gravado; "Salvando…" e erro com o formulário mantido. **Visão Geral:** números calculados por perfil (seção 6), filtro por setor para a gerência, "Alta prioridade" filtra prioridade (não status), data de hoje e avatar do usuário logado.
- **Por quê:** telas presas à DM-2048 e a dados fixos (G03, G04, G05, G06, G16, G17, G18); `localStorage` direto nas telas (ERROR_HANDLING, seção 5).
- **Removido:** botão e diálogo "Atribuir responsável" em Detalhes. Gravavam direto no `localStorage` e trocavam o setor sem regra. **O redirecionamento volta no Bloco 4**, como "Redirecionar para outro departamento", só da gerência, em triagem e **com justificativa obrigatória** (RN18).
- **Desvio do kit (decisão 1 aprovada):** a leitura das demandas também espera 150 ms (`lerDemandas`), só para o estado "Carregando demandas…" aparecer na demonstração. O kit previa atraso só nas gravações.
- **Sem uso, mantidos (decisão 2 aprovada):** `src/data/demandas.json` e `src/data/VisaoGeral.json` não são mais lidos por nenhuma tela. **Apagar após aprovação do grupo.**
- **Mudança visual:** só elementos novos (abas, filtro de departamento, seção de pendentes, estilo Urgente, filtro de setor na Visão Geral, mensagem de erro). Os demais elementos mantêm classes e layout.
- **Atende:** RF-R02, RF-R04, RF-R05, RF-R06; RN02–RN06, RN12, RN20, RN22; CA-R01, CA-R06, CA-R07, CA-R11 (na tela); CT-R03, CT-R04, CT-R07, CT-R08 (a executar).
- **Verificação:** `npm test` 7 arquivos / 94 testes passaram · `npm run lint` 0 avisos e 0 erros (um aviso novo, `new Date()` durante a renderização na Visão Geral, foi corrigido) · `npm run build` OK. Conferência rápida do assistente no navegador embutido com `user01`: Visão Geral com números calculados; Demandas com 4 recebidas e 1 pendente no topo; DM-2005 (Hidráulica → Elétrica) dá "sem permissão"; DM-2004 (aberta por TI) mostra só o resumo; Departamentos mostra só o card de TI; Atualizar DM-2012 para Aguardando grava e aparece no histórico. **Teste manual da equipe: não executado.**
- **Fica para depois:** dois `<h1>` na Visão Geral, "Ctrl K", "Ordenar: Recentes" fixo, foco/Tab, contraste e texto longo sem espaços (ex.: "xxxx…") que estoura a largura em Detalhes (Bloco 3); título "Painel de Gerenciamento" também para setores (texto dos colegas, mantido); aceitar, recusar, redirecionar, cancelar, novo prazo e cobrança (Bloco 4).
- **Correção — Atualizar sem campo de texto (falha do teste manual da 2A):** a textarea da Descrição tinha ficado só leitura e não havia onde escrever. Agora, no mesmo cartão (layout mantido), a descrição original aparece como texto e a textarea vira **"Observação (opcional)"**, com rótulo associado, limite de 500 caracteres (`maxLength` na tela e validação em `acoes.js`) e contador ligado ao campo (`aria-describedby`). A observação vai para o histórico **no mesmo item** da mudança de status/tipo, com autor, perfil e data; se só houver observação, ela é salva como item próprio (tipo `observacao`) em vez de "Nenhuma alteração para salvar". Arquivos: `src/domain/acoes.js` (+ 6 testes em `acoes.test.js`), `src/pages/AtualizarDemanda.jsx`, `src/mensagens.js`, `src/App.css` (rótulo e contador), `docs/MENSAGENS_VALIDACAO.md` (mensagem do limite, proposta). Verificação: `npm test` 7 arquivos / 100 testes passaram · lint 0 avisos e 0 erros · build OK. Reteste manual da equipe: não executado.
- **Teste manual da 2A (03/10, Edge):** passou em Demandas, Detalhes, Departamentos e Visão Geral (a contagem acompanhou a conclusão da DM-2012). Atualizar falhou por não haver onde escrever; foi corrigido com o campo Observação e o reteste passou. Mudar o tipo de atendimento foi mantido, com registro no histórico. Fonte pequena fica para o Bloco 3. Teclado e leitor de tela: não executado. Evidência em `docs/evidencias/depois/TESTE_MANUAL_BLOCO2A.md`.

### 2026-10-03 · Bloco 2B · feat/telas-nova-demanda
- **Arquivos novos:** `src/domain/novaDemanda.js` (+ `novaDemanda.test.js`), `src/components/Dialogo.jsx`, `docs/EXPLICACAO_BLOCO2B.md`.
- **Arquivos alterados:** `src/pages/NovaDemanda.jsx`, `src/App.jsx` (passa o usuário; botão "Criar" do topo foca o Destino), `src/mensagens.js`, `src/App.css` (só classes novas: instrução, erro e campo inválido), `docs/MENSAGENS_VALIDACAO.md`.
- **O quê:** Nova Demanda grava de verdade. Origem automática pelo perfil (campo visível e travado; gerência = "Gerenciamento"); destino em lista sem o próprio setor; tipo de atendimento depende do destino e é limpo quando o destino muda; título (60) e descrição (500) com contador; **sem campo de prioridade** (nasce "Não definida"). Instrução do catálogo sempre visível; erro junto ao campo (`aria-describedby`, `aria-invalid`) e foco no primeiro erro. Envio pelo `storage.criarDemanda`: status "Pendente de aceite", item "Demanda criada." no histórico, número pelo contador. Botão "Enviando…" desativado (sem envio duplo); erro (`?falha=1`) mantém o formulário; sucesso abre pop-up acessível com o número (foco entra e fica preso, Esc fecha, foco volta ao botão de envio).
- **Por quê:** o envio só mostrava "Cadastro simulado" (G01); origem e destino em texto livre e tipo fixo (G02); botão "Criar" focava um campo que agora é travado (G19).
- **Mudança visual:** só elementos novos (instruções, contadores, mensagens de erro, pop-up com as classes do diálogo dos colegas). Rótulo "Tipo de Demanda" virou "Tipo de atendimento", o termo dos requisitos. Grade, campos e botão mantidos.
- **Atende:** RF-R03; RN07, RN08, RN09, RN22; CA-R11; CT-R03 (a executar).
- **Verificação:** `npm test` 8 arquivos / 115 testes passaram · `npm run lint` 0 avisos e 0 erros (um aviso novo, refs lidos durante a renderização, foi corrigido) · `npm run build` OK. Conferência do assistente no navegador embutido com `user01`: envio vazio mostra os 4 erros do catálogo e o foco vai ao Destino; a lista de destino não tem TI; envio válido criou a DM-2013 (Pendente de aceite, "Não definida", origem TI, item de criação) e abriu o pop-up com foco em "Ver demanda"; Tab ficou preso no pop-up; Esc fechou e o foco voltou ao botão; com `?falha=1` apareceu "Enviando…", depois o erro, o formulário continuou preenchido e nada foi gravado. **Teste manual da equipe: não executado.**
- **Fica como 2C (opcional, se houver tempo):** aviso online/offline, fila "Pendentes de envio" com "Enviar agora" e rascunho preservado ao recarregar (Bloco 2 do `PROMPT_BLOCOS.md`; Atas 15/09 e 02/10). Hoje o formulário é mantido em caso de erro, mas se perde se a página for recarregada.
- **Correção — campos sem trava de limite (falha do teste manual da 2B):** dava para digitar e colar muito além do limite (vistos "2400/60" e "3072/500"), e o aviso só vinha no envio. Agora Título (60), Descrição (500) e a Observação da tela Atualizar (500) são travados com `maxLength`, e um aviso numa área `role="status"`, anunciada pelo leitor de tela, mostra "Limite de N caracteres atingido." ao chegar ao limite ou "Limite de N caracteres atingido. O texto foi cortado." quando um texto colado é maior que o espaço. Para saber que houve corte, o tamanho tentado é calculado no momento de colar (`domain/limites.js`, puro e testado; `hooks/useAvisoLimite.js`). A validação na regra (`validarNovaDemanda`, `salvarAtualizacao`) continua como segurança. Arquivos novos (4): `src/domain/limites.js`, `src/domain/limites.test.js`, `src/hooks/useAvisoLimite.js`, `src/components/ContadorLimite.jsx`. Alterados (7): `src/pages/NovaDemanda.jsx`, `src/pages/AtualizarDemanda.jsx`, `src/mensagens.js`, `src/App.css`, `docs/MENSAGENS_VALIDACAO.md`, `docs/EXPLICACAO_BLOCO2B.md` (o texto dizia "não usamos maxLength"), `docs/CHANGELOG.md`. Verificação: `npm test` 9 arquivos / 122 testes passaram · lint 0 avisos e 0 erros · build OK. Conferência do assistente no navegador embutido: digitando 69 caracteres no Título, o campo parou em 60 e mostrou "Limite de 60 caracteres atingido."; a Observação tem `maxLength` 500 e a área de aviso. A colagem real **não pôde ser testada** ali (o navegador embutido bloqueou a área de transferência); a lógica de "texto cortado" foi conferida com uma colagem simulada (3072 → 500, aviso certo). Reteste manual da equipe, inclusive colar no Edge e ouvir o aviso no leitor de tela: não executado.
- **Decisão (a confirmar em ata): tipo "Outros".** Incluído no fim da lista `tiposAtendimento` de cada um dos 4 setores em `src/data/departamentos.json`. A Nova Demanda, a validação (`validarNovaDemanda`) e a tela Atualizar (`salvarAtualizacao`) leem a lista do setor, então aceitam "Outros" sem mudança de código. Testes acrescentados: "Outros" aceito e último da lista nos 4 setores (`novaDemanda.test.js`) e troca para "Outros" na Atualizar (`acoes.test.js`). Junto, proposta de **limitar a 4 setores** (área fora deles segue devolução → redirecionar ou "Não aplicável"; novos setores são cadastro futuro), registrada em `docs/ATAS_RASCUNHO_27-09_e_02-10.md` (itens 10 e 11) e em `docs/DOCUMENTACAO.md` (seção 11). Verificação: `npm test` 9 arquivos / 124 testes passaram · lint 0 avisos e 0 erros · build OK. Teste manual: não executado.

### 2026-10-03 · Bloco 3 — Fase 1 (semântica) · fix/acessibilidade
- **Escopo:** só estrutura e anúncios para tecnologia assistiva. Visual dos colegas sem mudança, exceto a remoção do "Ctrl K" (pedido do bloco) e o skip link, que só aparece com o foco do teclado.
- **Skip link "Ir para o conteúdo" (WCAG 2.4.1)** — `src/App.jsx`, `src/index.css` (classe nova `.skip-link`). É o primeiro item do Tab e leva o foco ao `<main id="conteudo">`. É botão e não link `#conteudo`, porque com roteamento por hash um link trocaria de tela.
- **Foco no título a cada troca de rota (WCAG 2.4.3)** — `src/App.jsx`. O `<h1>` da barra do topo tem `tabIndex=-1` e recebe o foco quando o endereço muda (não no primeiro carregamento). Em `src/index.css`, `[tabindex='-1']:focus { outline: none }`: título e `<main>` só recebem foco por código, não são clicáveis.
- **Um único `<h1>` por tela (WCAG 1.3.1)** — `src/components/VisaoGeralHeader.jsx`: "Painel de Gerenciamento" passou de `<h1>` a `<h2>`, com a mesma classe; o CSS fixa margem, tamanho e peso, então o visual não muda. O `<h1>` é o título da barra do topo em todas as telas (o Login tem o seu).
- **Rótulo na busca da Visão Geral (WCAG 1.3.1, 3.3.2)** — `src/components/VisaoGeralSearchBar.jsx`: `<label>` "Pesquisar demanda" para leitor de tela (antes só placeholder); ícone com `aria-hidden`. As buscas de Demandas e Departamentos já tinham rótulo.
- **"Ctrl K" removido** — `src/components/VisaoGeralSearchBar.jsx`. Era decorativo; o atalho não existia (defeito G11). A regra `.kbd` em `VisaoGeral.css` ficou sem uso (não mexi no CSS dos colegas nesta fase).
- **`aria-pressed` nas abas de filtro (WCAG 4.1.2)** — `src/components/VisaoGeralFilterTabs.jsx`, mais `type="button"`. As abas de Demandas já tinham desde a 2A.
- **Contagem de resultados anunciada (WCAG 4.1.3)** — `src/components/VisaoGeralDemandList.jsx` ("N demandas exibidas") e `src/pages/Departamentos.jsx` ("N setores encontrados"), em `role="status"` invisível (`sr-only`). Demandas já tinha `aria-live` na contagem. Erros já eram anunciados: `role="alert"` em erro de dados, sem permissão, erro de envio e erro ao salvar; erros de campo são lidos pelo foco + `aria-describedby`.
- **`aria-current="page"` no menu** — já existia em `Sidebar.jsx` (código dos colegas); conferido. Em Detalhes/Atualizar o item marcado é "Demandas", a seção de onde a tela vem.
- **Verificação:** `npm test` 9 arquivos / 124 testes passaram · lint 0 avisos e 0 erros · build OK. Conferência do assistente no navegador embutido com `admin`: depois do login o foco foi ao `<h1>` "Visão geral"; numa página recarregada, o 1º Tab foi ao "Ir para o conteúdo", visível no topo, o Enter levou o foco ao `<main>` e o Tab seguinte já caiu no conteúdo; em 7 rotas (Demandas, Departamentos, Nova Demanda, Detalhes, Atualizar, Demandas por setor e Visão Geral) havia **1 `<h1>`** e o foco ia ao título; abas com `aria-pressed`; busca com rótulo; sem "Ctrl K". **Leitor de tela e teste da equipe: não executado.**

### 2026-10-03 · Bloco 3 — Fase 2 (CSS) · fix/acessibilidade
**Correções do teste de teclado no Edge (bugs da Fase 1)**
- **Causa analisada no código** (não há `onKeyDown`, `onBlur` nem `onFocus` em `App.jsx` ou `Sidebar.jsx`; só o `hashchange` e o `keydown` do `Dialogo`, que só existe com o pop-up aberto):
  1. o `.skip-link` ficava em `top: 8px; left: 8px`, exatamente sobre o link "Demanda de aço" da barra lateral;
  2. o Enter levava o foco ao `<main>`, mas a regra `[tabindex='-1']:focus { outline: none }`, que eu criei na Fase 1, escondia o contorno; o skip link sumia e o link "Demanda de aço" aparecia no mesmo lugar, parecendo focado, e o Enter seguinte também "não fazia nada";
  3. com Shift+Tab o foco caía de fato no link, cujo `href="#inicio"` é uma rota inexistente que o `getPageFromHash` manda para Demandas.
  - A conferência da Fase 1 no navegador embutido não percebeu (1) e (2).
- **Skip link reposicionado** — `src/index.css`: agora é `position: fixed` no topo, centralizado sobre a faixa do cabeçalho; no celular (≤ 760 px) fica à direita. Não cobre mais a marca.
- **Skip link leva o foco ao `<h1>`** — `src/App.jsx`. O `<main>` não precisa mais de `id` nem `tabIndex`. Em `src/index.css`, a regra que escondia o contorno foi trocada por `.page-title:focus { outline: 2px solid #1b7766 }`, que mostra onde o foco caiu (também a cada troca de rota).
- **Marca "Demanda de aço"** — `src/components/Sidebar.jsx`: `#inicio` → `#visao-geral`.
- **Lupa do topo de Demandas removida** — `src/App.jsx`: saem o botão, o ícone `SearchIcon`, o ref `searchInput` e a prop. Ela só levava o foco à busca e o rótulo "Buscar demandas" prometia uma busca que não fazia. A lupa foi para **dentro** da barra de busca (`src/pages/Demandas.jsx`), como em Departamentos e na Visão Geral. Em `src/App.css` saem `.topbar-search` e `.search-icon`, sem uso; `.search-field` vira flex e ganha estilo para o ícone.

**CSS dos colegas: o que mudou, arquivo por arquivo (só o que a acessibilidade exige)**
- **`src/index.css`:**
  - foco visível global: `:focus-visible { outline: 2px solid #1b7766; outline-offset: 2px }`. Antes valia só para botão e link, em `#58a495` (2,9:1); agora vale para todo elemento focável, com 5,4:1 (WCAG 2.4.7, 1.4.11). Na barra lateral escura o contorno é `#9fdccf`;
  - `prefers-reduced-motion` zera transições e animações (WCAG 2.3.3);
  - skip link e foco no título, como descrito acima.
- **`src/App.css`:**
  - 4 linhas `outline: none/0` removidas (campos do formulário, busca de Demandas, ordenação, busca de Departamentos);
  - 16 cores de texto escurecidas, cada uma para o tom mais próximo na mesma cor com 4,5:1 ou mais (ex.: `#87938f` 3,18 → `#6b7773` 4,65; `#ea580c` 3,29 → `#c1480a` 4,62 no selo laranja; `#159447` 3,72 → `#12823e` 4,64 no selo verde);
  - borda dos cards de Demandas: transparente (no celular, `#edf1ef`) → `#6d968c`, 3:1 (WCAG 1.4.11);
  - borda das abas Recebidas/Solicitadas: → `#6d968c`;
  - `overflow-wrap: anywhere` no título dos cards.
- **`src/components/Sidebar.css`:**
  - avatar `#17816e` → `#167d6a` (4,47 → 4,71 com o texto `#effaf7`);
  - setor do usuário com opacidade 55% → 75% (abaixo de 4,5 → acima);
  - Sair 22 × 24 → 24 × 24 px (WCAG 2.5.8).
- **`src/pages/DetalhesDemanda.css`:**
  - 6 `outline: 0` removidos;
  - 8 cores escurecidas (ex.: `#91a09c` 2,72 → `#687874`; status azul `#2876d5` 4,12 → `#256ec6`; prioridade `#d95c54` 3,38 → `#ca362d`);
  - caminho no topo da página → `#5e736f`, calculado sobre o fundo real `#f3f7f6` (4,7:1);
  - contorno do card-link `#58a495` → `#1b7766`;
  - `overflow-wrap: anywhere` em título, campos, descrição, histórico e caminho;
  - select de prioridade com `min-height: 24px` (axe "antes").
- **`src/pages/VisaoGeral.css`:**
  - 1 `outline: none` removido;
  - variáveis de cor: verde `#1f8a4c` → `#1c7b44`, âmbar `#b6790a` → `#946308`, vermelho `#d4392b` → `#bf3327`, texto claro `#9a9da2` → `#72757b`, texto médio `#6b7075` → `#676c71`;
  - placeholder `#9a9a97` → `#757572`;
  - regra `.kbd` apagada (sem uso desde a Fase 1);
  - card com `min-width: 0` e `overflow-wrap: anywhere` no título e na descrição (texto sem espaço criava rolagem lateral);
  - borda do filtro de setor (meu, da 2A) → `#6d968c`.
- **Fonte mínima de 14 px, isolada (WCAG 1.4.4)** — arquivo novo `src/fonte-minima.css`, importado por último em `src/main.jsx`. **Nenhum CSS dos colegas foi editado para isso.** É gerado por script: para cada seletor que tinha texto abaixo de 14 px, repete os seus `font-size` na mesma ordem e `@media`, como `max(14px, original)`. Cobre 87 declarações de 7 a 13,5 px (as 88 do levantamento, menos a do `.kbd` apagado). No fim do arquivo há um ajuste manual: na Visão Geral, com a fonte maior, o selo de status e o número do card não cabiam em ~800 px e criavam rolagem; a linha agora pode quebrar. **Para desfazer:** apagar o arquivo e a linha de import no `main.jsx`.
- **Contraste conferido por cálculo, não por auditoria:** um script `node`, rodado no terminal sem arquivo nem dependência nova, recalculou todas as cores de texto declaradas. Sobraram só 2 casos dispensados: botão de página desativado (a WCAG dispensa) e ícone branco sobre fundo colorido (o script não resolve o fundo). **A auditoria axe "depois" não foi gerada:** fica para a equipe, em `docs/evidencias/depois/`.
- **Verificação:**
  - `npm test` 9 arquivos / 124 testes passaram · lint 0 avisos e 0 erros · build OK.
  - No CSS final do build, a fonte mínima vem por último.
  - Conferência do assistente no navegador embutido:
    - com página recarregada, o 1º Tab mostrou o skip link no topo, sem cobrir a marca, em 1280 e 360 px;
    - o Enter levou o foco ao `<h1>`;
    - título e descrição de 400 caracteres sem espaço quebraram dentro dos cards;
    - em 6 telas e 4 larguras (360, 800, 1024, 1280 px), sem rolagem lateral e sem texto visível abaixo de 14 px.
  - **Limitação:** o navegador embutido força o próprio estilo de foco (3 px na cor do texto, até num `<div>` de teste sem regra nossa); por isso a **cor e a espessura do contorno não puderam ser conferidas ali**.
  - **Teste no Edge (teclado, contorno e leitor de tela): não executado.**
- **Correções da auditoria axe "depois" (rodada pela equipe na branch publicada, 04/10):**
  - **Contraste em fundos cinza** — `src/App.css`. As cores da Fase 2 tinham sido calculadas contra branco, e três regras ficam direto sobre o fundo da página:
    - `.departments-intro p`: `#6c7581` → `#666f7a` (4,24 → 4,63:1 sobre `#f3f4f6`);
    - `.department-empty-state`: `#6c7682` → `#656e7a` (4,19 → 4,69:1);
    - `.empty-state p` (mensagens "Você pode consultar…", "Demanda não encontrada…", carregando e erro): `#6b7874` → `#65716d` (4,26 → 4,70:1 sobre `#f3f7f6`, 4,61 sobre `#f3f4f6`, 5,08 no branco).
    - As demais regras com essas cores ficam em cards brancos ou na tela Demandas (branca) e já passavam.
  - **Rolagem lateral em 360 px em Detalhes (DM-2006)** — `src/fonte-minima.css`. A causa **não era o menu**: os itens do menu estão dentro do `.sidebar-nav`, que tem rolagem própria (`overflow-x: auto`), e por isso aparecem na lista de elementos "fora da tela" sem alargar a página. O culpado era o selo `.detail-status` "Aguardando (processamento interno)": com `white-space: nowrap` e 14 px ele ficou com 274 px, numa linha flex sem quebra (`.detail-summary-top`), levando a página a 382 px. Só a DM-2006 tem esse status, e a conferência anterior tinha usado a DM-2003. O skip link medido em 374 px era efeito colateral: no modo celular, a área visível se alarga junto com o conteúdo. Correção no arquivo isolado da fonte (some se a fonte for desfeita): a linha pode quebrar e o selo também; em telas largas a linha cabe e nada muda.
  - **Verificação:**
    - `npm test` 124 passaram · lint 0 avisos e 0 erros · build OK.
    - Navegador embutido, como `admin` e como `user01`: Visão Geral, Demandas, Departamentos, Nova Demanda e as 12 demandas em Detalhes e Atualizar (28 telas), em 360, 800, 1024 e 1280 px. **Nenhuma rolagem lateral** nas 224 combinações.
    - Cores renderizadas: 4,63:1 (Departamentos) e 4,70:1 (mensagem em Detalhes).
    - Em 1280 px o selo da DM-2006 continua na mesma linha do código.
    - **Nova rodada do axe pela equipe: não executado.**

### 2026-10-04 · Bloco 4 — Parte A (aceite e recusa) · feat/bloco4-aceite
- **Regras (funções puras, com testes)** — `src/domain/acoes.js`:
  - `aceitarDemanda(demanda, prioridade, usuario, contexto)`: só o setor executor, só com a demanda Pendente de aceite, com prioridade válida (RN10). Leva a Em andamento, grava `prioridade`, `aceitaEm` e `prazo` calculado do aceite (RN13) e acrescenta "Demanda aceita com prioridade X." ao histórico (RN22). Depois disso a prioridade fica travada, porque `podeDefinirPrioridade` só vale com a demanda pendente (CA-R03). Aceitar depois de 72 h é permitido; a RN09 prevê só o selo.
  - `recusarDemanda(demanda, motivo, usuario, contexto)`: mesmas conferências; motivo obrigatório, de no máximo 500 caracteres (`LIMITE_MOTIVO`). Leva a Em triagem, mantém o destino e acrescenta "Recusada: <motivo>" ao histórico (RN11, CA-R04).
  - `src/domain/prioridades.js`: `descreverPrazo` ("24 horas", "48 horas", "72 horas", "7 dias") para o pop-up.
  - Testes: 14 novos em `acoes.test.js` e 1 em `prioridades.test.js`. Casos negativos: sem prioridade, "Não definida" ou valor inventado; gerência e quem só abriu; status errado (Em andamento, Aguardando, Em triagem); estados finais; motivo vazio, só com espaços ou com 501 caracteres; prioridade travada depois do aceite; quem abriu vê "setor atual: gerenciamento" sem o motivo.
- **Interface:**
  - `src/pages/DetalhesDemanda.jsx`: para o setor executor com a demanda pendente, o botão de ação se chama **"Aceitar ou recusar"** e leva à tela Atualizar. Gerência, quem só abriu e outros setores não veem.
  - `src/pages/AtualizarDemanda.jsx`, "modo aceite":
    - o select de prioridade é liberado com "Selecione"; status e tipo ficam travados e a observação não aparece;
    - os botões são **"Aceitar demanda"**, **"Recusar demanda"** e **"Voltar"**;
    - sem prioridade, o pop-up não abre: a mensagem do catálogo fica ligada ao campo (`aria-describedby`, `aria-invalid`) e o foco vai para ele;
    - com prioridade, abre o **pop-up de confirmação** com o texto do catálogo e só a duração do prazo (decisão 4);
    - "Recusar" abre um pop-up com o campo **"Motivo da recusa (obrigatório)"**, travado em 500 caracteres, com contador e aviso de limite;
    - a regra é conferida de novo no storage, com a demanda lida na hora de gravar.
  - `src/components/Dialogo.jsx`: nova prop `descricao` (o texto lido pelo leitor de tela, `aria-describedby`); o `children` saiu de dentro do `<p>` para aceitar um campo de formulário. `src/pages/NovaDemanda.jsx` passou a usar `descricao`, sem mudança visual.
  - `src/mensagens.js`: textos do catálogo e as propostas novas. `src/App.css`: classe nova `.dialog-textarea` (borda com 3:1, fonte de 14 px).
- **Decisões de 04/10:**
  - "Devolver à triagem" (de Em andamento/Aguardando) fica para a **parte B**.
  - **Em triagem, a demanda pertence à gerência** (esclarece a RN11; FLUXOS.md: "Em triagem (com o Gerenciamento)"). O campo `destino` não muda (auditoria e futuro redirecionamento), mas o setor que recusou **perde o acesso** enquanto ela estiver em triagem: some de Recebidas, dos contadores, do card de Departamentos e do detalhe/URL. A gerência a vê em "Todas" e no contador "Em triagem". Quem abriu continua vendo o resumo, com "Setor atual: Gerenciamento". **Decisão a confirmar em ata** (proposta 12 do rascunho de 03/10). *Substitui a primeira versão desta parte, em que o setor que recusou continuava vendo a demanda.*
  - Limite do motivo: 500 caracteres. Pop-up do aceite só com a duração, sem data. A ação fica na tela Atualizar.
- **Atende:** RN09, RN10, RN11, RN12 (já existia), RN13, RN20, RN22; RF-R07, RF-R09 (parte); CA-R03, CA-R04; CT-R05, CT-R06 (parte da recusa).
- **Verificação:**
  - `npm test` 9 arquivos / 139 testes passaram · lint 0 avisos e 0 erros · build OK.
  - Navegador embutido, só com teclado, com `user01` na DM-2001:
    - "Aceitar ou recusar" → Enter abriu o modo aceite;
    - Enter em "Aceitar demanda" sem prioridade mostrou "Escolha a prioridade para aceitar a demanda." e o foco foi ao select;
    - setas → Alta; Enter abriu o pop-up com o texto do catálogo e "48 horas", com o foco em "Confirmar aceite";
    - Esc fechou e devolveu o foco a "Aceitar demanda", sem gravar;
    - Tab e Shift+Tab ficaram presos no pop-up;
    - a confirmação gravou Em andamento, Alta, aceite e prazo (+48 h) e o histórico com autor e perfil; o foco foi ao título e o select de prioridade ficou travado.
  - Com os dados de volta ao seed, na recusa:
    - o foco entrou no campo do motivo;
    - confirmar vazio mostrou "Explique por que esta demanda não é do seu setor." ligado ao campo, sem gravar;
    - Esc devolveu o foco a "Recusar demanda";
    - com motivo: Em triagem, destino mantido, "Recusada: …" no histórico.
  - Com `admin`: nenhum botão na DM-2002 (pendente) nem na DM-2001 (em triagem); pela URL de edição, a mensagem de que não há alterações para o perfil.
  - **Teste da equipe no Edge e leitor de tela: não executado.**
- **Correção antes dos commits — "Em triagem pertence à gerência":**
  - **Regra central** — `src/domain/permissoes.js`: nova função `setorResponsavel(demanda)`, que devolve "gerenciamento" em triagem e o `destino` nos demais status. `ehExecutor` passou a usá-la, e com isso visibilidade, detalhe, URL, Recebidas e ações do setor de destino deixam de valer em triagem, sem mudar mais nada. `resumoParaSolicitante` usa a mesma função para o "setor atual".
  - **Listas e contadores** — `src/domain/listas.js`: o filtro por setor da gerência, os indicadores com filtro de setor e `abertasDoSetor` (cards de Departamentos) usam o setor responsável. `src/pages/VisaoGeral.jsx`: o filtro de setor também. Efeito: com o filtro "Elétrica", a gerência não vê sob a Elétrica uma demanda que está em triagem; ela aparece em "Todas" e em "Em triagem".
  - **Detalhes** — `src/pages/DetalhesDemanda.jsx`: para a gerência, em triagem, "Responsável (setor)" mostra Gerenciamento; "Departamento" continua mostrando o destino.
  - **Tela Atualizar** — `src/pages/AtualizarDemanda.jsx`: depois da recusa, o setor vai para a **lista de Demandas**, e não para o detalhe, que agora mostraria "não encontrada". Problema achado na conferência no navegador.
  - `src/domain/acoes.js`: só o comentário da recusa.
  - **Testes:** 4 testes antigos registravam o comportamento anterior e foram ajustados, com comentário: em triagem o setor de destino recebe "sem permissão", e não "transição inválida"; com o filtro de setor, a demanda em triagem não aparece sob o destino; `abertasDoSetor` não a conta. Testes novos:
    - 6 em `permissoes.test.js`: o destino não vê nem o detalhe; o destino continua gravado e o responsável é a gerência; a gerência vê; quem abriu vê só o resumo; nos demais status nada muda; outro setor continua sem ver;
    - 4 em `listas.test.js`: antes da recusa a demanda está em Recebidas e nos contadores; depois, sai de Recebidas, dos contadores e do card; a gerência vê em Todas e em "Em triagem"; quem abriu continua com ela em Solicitadas;
    - 1 em `acoes.test.js`: aceitar em triagem dá "sem permissão".
  - **Verificação:**
    - `npm test` 9 arquivos / **150** testes passaram · lint 0 avisos e 0 erros · build OK.
    - Navegador embutido, com `user04` (Elétrica) na DM-2002:
      - antes da recusa: Pendentes de aceite 1, DM-2002 em Recebidas, card "3 demandas abertas", detalhe acessível;
      - recusa feita com o teclado; depois: Pendentes de aceite 0, fora de Recebidas, card "2 demandas abertas", URL de detalhe com "Demanda não encontrada ou sem permissão.", destino gravado ainda Elétrica;
      - repetida após voltar os dados ao seed: a recusa leva à lista de Demandas, com o foco no título.
    - Com `admin`: "Em triagem" 2 (DM-2007 do seed + DM-2002), a DM-2002 em "Todas" (achada pela busca, porque a lista tem 6 por página), detalhe com "Responsável: Gerenciamento", e 0 em "Em triagem" com o filtro "Elétrica".
    - Com `user03` (quem abriu): "Em triagem", "Setor atual: Gerenciamento", sem histórico nem prioridade.
    - **Teste da equipe no Edge: não executado.**
