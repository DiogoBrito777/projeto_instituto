# CHANGELOG

Uma entrada por bloco/PR (formato em `docs/CONVENCOES.md`).

### 2026-10-03 · Bloco 1 · feat/fundacao
- **Arquivos novos:** `src/domain/status.js`, `prioridades.js`, `prazos.js`, `permissoes.js` (+ `*.test.js`); `src/services/storage.js` (+ `storage.test.js`), `seed.js`, `auth.js`; `src/hooks/useSessao.js`, `useDemandas.js`; `src/pages/Login.jsx`, `Login.css`; `src/data/usuarios.json`, `seed-demandas.json`; `docs/CHANGELOG.md`, `docs/EXPLICACAO_BLOCO1.md`.
- **Arquivos alterados:** `src/App.jsx` (guarda de rotas e login), `src/components/Sidebar.jsx` (usuário logado e Sair), `src/components/Sidebar.css` (Sair visível no celular), `src/data/departamentos.json` (acrescenta `tiposAtendimento`), `package.json` (`vitest` e script `test`), `docs/MENSAGENS_VALIDACAO.md` (mensagens novas marcadas como proposta).
- **O quê:** regras de status, prioridade, prazo e permissão em funções puras com testes; camada única de dados com semente versionada, resultado explícito, dados corrompidos sem apagamento automático, "Resetar dados", atraso e falha simulados (`?falha=1`) nas gravações e IDs por contador; login com sessão no `sessionStorage`, Sair funcional e guarda de rotas.
- **Por quê:** não havia camada de dados (G03), nem login/perfis (G07); a máquina de estados do app não batia com a proposta (G09); datas simuladas eram fixas (G18).
- **Mudança visual:** só a tela nova de login. Sidebar mantém layout e classes; troca o usuário fixo "Márcio Almeida / Gestor" pelo usuário logado.
- **Atende:** RN01–RN06, RN09–RN11, RN13–RN16, RN18–RN21 (como funções testadas; a interface dessas ações é dos Blocos 2 e 4); RF-R01; CA-R01, CA-R02, CA-R07, CA-R10, CA-R11 (no nível das regras).
- **Verificação:** `npm test` 5 arquivos / 61 testes passaram · `npm run lint` 0 avisos e 0 erros · `npm run build` OK.
- **Teste manual (03/10, Edge, navegação privada), feito pelo autor, Bruno Diogo:** evidência em `docs/evidencias/depois/TESTE_MANUAL_BLOCO1.md`; sem print do estado anterior (defeito corrigido; não reproduzível sem voltar o código).
  - Passou: os 5 logins, entrar e sair, F5 (sessão e dados mantidos) e fechar o navegador (pede login de novo).
  - Teclado: parcial, com Tab inconsistente nas telas antigas (ficou para o Bloco 3).
  - Dados corrompidos: não executado.
  - Login errado (CT-R02, parte "errado") e abrir tela sem login (CT-R01): sem registro.
- **Observação (decisão de projeto, não bug):** voltar para a URL na mesma aba mantém a sessão ativa, porque ela fica no `sessionStorage`; só o **Sair** encerra a sessão. Fechar o navegador também encerra.
- **Correção — Sair no celular (falha do teste manual):** em 360 px a Sidebar escondia o perfil inteiro (`.sidebar-profile { display: none }` no `@media (max-width: 760px)`), e com ele o botão Sair. Agora o perfil aparece abaixo do menu e o Sair tem alvo de 34 × 34 px (WCAG 2.5.8). Mudança visual só no celular, por acessibilidade; o layout no computador não muda. Arquivo: `src/components/Sidebar.css`. Verificado pelo assistente no navegador embutido em 360 × 740: o Sair fica visível, é alcançado por Tab e o Enter encerra a sessão. **Reteste no Edge: passou** (conforme relato do autor, com o DevTools em modo dispositivo; data não registrada).
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
- **Verificação:** `npm test` 7 arquivos / 94 testes passaram · `npm run lint` 0 avisos e 0 erros (um aviso novo, `new Date()` durante a renderização na Visão Geral, foi corrigido) · `npm run build` OK. Conferência rápida do assistente no navegador embutido com `user01`: Visão Geral com números calculados; Demandas com 4 recebidas e 1 pendente no topo; DM-2005 (Hidráulica → Elétrica) dá "sem permissão"; DM-2004 (aberta por TI) mostra só o resumo; Departamentos mostra só o card de TI; Atualizar DM-2012 para Aguardando grava e aparece no histórico. (O teste manual do autor está registrado mais abaixo, em "Teste manual da 2A".)
- **Fica para depois:** dois `<h1>` na Visão Geral, "Ctrl K", "Ordenar: Recentes" fixo, foco/Tab, contraste e texto longo sem espaços (ex.: "xxxx…") que estoura a largura em Detalhes (Bloco 3); título "Painel de Gerenciamento" também para setores (texto dos colegas, mantido); aceitar, recusar, redirecionar, cancelar, novo prazo e cobrança (Bloco 4).
- **Correção — Atualizar sem campo de texto (falha do teste manual da 2A):** a textarea da Descrição tinha ficado só leitura e não havia onde escrever. Agora, no mesmo cartão (layout mantido), a descrição original aparece como texto e a textarea vira **"Observação (opcional)"**, com rótulo associado, limite de 500 caracteres (`maxLength` na tela e validação em `acoes.js`) e contador ligado ao campo (`aria-describedby`). A observação vai para o histórico **no mesmo item** da mudança de status/tipo, com autor, perfil e data; se só houver observação, ela é salva como item próprio (tipo `observacao`) em vez de "Nenhuma alteração para salvar". Arquivos: `src/domain/acoes.js` (+ 6 testes em `acoes.test.js`), `src/pages/AtualizarDemanda.jsx`, `src/mensagens.js`, `src/App.css` (rótulo e contador), `docs/MENSAGENS_VALIDACAO.md` (mensagem do limite, proposta). Verificação: `npm test` 7 arquivos / 100 testes passaram · lint 0 avisos e 0 erros · build OK. Reteste: passou (ver a linha abaixo).
- **Teste manual da 2A (03/10, Edge), feito pelo autor, Bruno Diogo:** evidência em `docs/evidencias/depois/TESTE_MANUAL_BLOCO2A.md`; print do defeito em `docs/evidencias/antes/teste-manual_bloco2a_atualizar-sem-campo.png`.
  - Passou: Demandas, Detalhes, Departamentos e Visão Geral (a contagem acompanhou a conclusão da DM-2012).
  - Atualizar falhou por não haver onde escrever. Foi corrigido com o campo "Observação (opcional)" e **o reteste do autor passou**.
  - Mudar o tipo de atendimento foi mantido, com registro no histórico.
  - Fonte pequena ficou para o Bloco 3.
  - Teclado e leitor de tela: não executado.

### 2026-10-03 · Bloco 2B · feat/telas-nova-demanda
- **Arquivos novos:** `src/domain/novaDemanda.js` (+ `novaDemanda.test.js`), `src/components/Dialogo.jsx`, `docs/EXPLICACAO_BLOCO2B.md`.
- **Arquivos alterados:** `src/pages/NovaDemanda.jsx`, `src/App.jsx` (passa o usuário; botão "Criar" do topo foca o Destino), `src/mensagens.js`, `src/App.css` (só classes novas: instrução, erro e campo inválido), `docs/MENSAGENS_VALIDACAO.md`.
- **O quê:** Nova Demanda grava de verdade. Origem automática pelo perfil (campo visível e travado; gerência = "Gerenciamento"); destino em lista sem o próprio setor; tipo de atendimento depende do destino e é limpo quando o destino muda; título (60) e descrição (500) com contador; **sem campo de prioridade** (nasce "Não definida"). Instrução do catálogo sempre visível; erro junto ao campo (`aria-describedby`, `aria-invalid`) e foco no primeiro erro. Envio pelo `storage.criarDemanda`: status "Pendente de aceite", item "Demanda criada." no histórico, número pelo contador. Botão "Enviando…" desativado (sem envio duplo); erro (`?falha=1`) mantém o formulário; sucesso abre pop-up acessível com o número (foco entra e fica preso, Esc fecha, foco volta ao botão de envio).
- **Por quê:** o envio só mostrava "Cadastro simulado" (G01); origem e destino em texto livre e tipo fixo (G02); botão "Criar" focava um campo que agora é travado (G19).
- **Mudança visual:** só elementos novos (instruções, contadores, mensagens de erro, pop-up com as classes do diálogo dos colegas). Rótulo "Tipo de Demanda" virou "Tipo de atendimento", o termo dos requisitos. Grade, campos e botão mantidos.
- **Atende:** RF-R03; RN07, RN08, RN09, RN22; CA-R11; CT-R03 (a executar).
- **Verificação:** `npm test` 8 arquivos / 115 testes passaram · `npm run lint` 0 avisos e 0 erros (um aviso novo, refs lidos durante a renderização, foi corrigido) · `npm run build` OK. Conferência do assistente no navegador embutido com `user01`: envio vazio mostra os 4 erros do catálogo e o foco vai ao Destino; a lista de destino não tem TI; envio válido criou a DM-2013 (Pendente de aceite, "Não definida", origem TI, item de criação) e abriu o pop-up com foco em "Ver demanda"; Tab ficou preso no pop-up; Esc fechou e o foco voltou ao botão; com `?falha=1` apareceu "Enviando…", depois o erro, o formulário continuou preenchido e nada foi gravado. **Teste manual:** feito pelo autor, Bruno Diogo: achou a falha do limite de caracteres, que foi corrigida, e o reteste passou (item seguinte). Não há arquivo de evidência escrita; a data não foi registrada.
- **Fica como 2C (opcional, se houver tempo):** aviso online/offline, fila "Pendentes de envio" com "Enviar agora" e rascunho preservado ao recarregar (Bloco 2 do `PROMPT_BLOCOS.md`; Atas 15/09 e 02/10). Hoje o formulário é mantido em caso de erro, mas se perde se a página for recarregada.
- **Correção — campos sem trava de limite (falha do teste manual da 2B):** dava para digitar e colar muito além do limite (vistos "2400/60" e "3072/500"), e o aviso só vinha no envio. Agora Título (60), Descrição (500) e a Observação da tela Atualizar (500) são travados com `maxLength`, e um aviso numa área `role="status"`, anunciada pelo leitor de tela, mostra "Limite de N caracteres atingido." ao chegar ao limite ou "Limite de N caracteres atingido. O texto foi cortado." quando um texto colado é maior que o espaço. Para saber que houve corte, o tamanho tentado é calculado no momento de colar (`domain/limites.js`, puro e testado; `hooks/useAvisoLimite.js`). A validação na regra (`validarNovaDemanda`, `salvarAtualizacao`) continua como segurança. Arquivos novos (4): `src/domain/limites.js`, `src/domain/limites.test.js`, `src/hooks/useAvisoLimite.js`, `src/components/ContadorLimite.jsx`. Alterados (7): `src/pages/NovaDemanda.jsx`, `src/pages/AtualizarDemanda.jsx`, `src/mensagens.js`, `src/App.css`, `docs/MENSAGENS_VALIDACAO.md`, `docs/EXPLICACAO_BLOCO2B.md` (o texto dizia "não usamos maxLength"), `docs/CHANGELOG.md`. Verificação: `npm test` 9 arquivos / 122 testes passaram · lint 0 avisos e 0 erros · build OK. Conferência do assistente no navegador embutido: digitando 69 caracteres no Título, o campo parou em 60 e mostrou "Limite de 60 caracteres atingido."; a Observação tem `maxLength` 500 e a área de aviso. A colagem real **não pôde ser testada** ali (o navegador embutido bloqueou a área de transferência); a lógica de "texto cortado" foi conferida com uma colagem simulada (3072 → 500, aviso certo). **Reteste do autor: passou** (conforme relato do autor; data não registrada; prints do defeito em `docs/evidencias/antes/teste-manual_bloco2b_limite-titulo-2400-60.png` e `docs/evidencias/antes/teste-manual_bloco2b_limite-descricao-3072-500.png`; sem arquivo de evidência escrita). Não consta, nesse reteste, se a colagem foi feita no Edge. **O leitor de tela anunciando o aviso não foi executado.**
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
- **Contraste conferido por cálculo, não por auditoria:** um script `node`, rodado no terminal sem arquivo nem dependência nova, recalculou todas as cores de texto declaradas. Sobraram só 2 casos dispensados: botão de página desativado (a WCAG dispensa) e ícone branco sobre fundo colorido (o script não resolve o fundo). *(Na hora desta fase, a auditoria axe "depois" ainda não existia. Ela foi gerada depois, pelo assistente na nuvem; ver o item "Correções da auditoria axe 'depois'" abaixo.)*
- **Verificação:**
  - `npm test` 9 arquivos / 124 testes passaram · lint 0 avisos e 0 erros · build OK.
  - No CSS final do build, a fonte mínima vem por último.
  - Conferência do assistente no navegador embutido:
    - com página recarregada, o 1º Tab mostrou o skip link no topo, sem cobrir a marca, em 1280 e 360 px;
    - o Enter levou o foco ao `<h1>`;
    - título e descrição de 400 caracteres sem espaço quebraram dentro dos cards;
    - em 6 telas e 4 larguras (360, 800, 1024, 1280 px), sem rolagem lateral e sem texto visível abaixo de 14 px.
  - **Limitação:** o navegador embutido força o próprio estilo de foco (3 px na cor do texto, até num `<div>` de teste sem regra nossa); por isso a **cor e a espessura do contorno não puderam ser conferidas ali**.
  - **Teste no Edge:**
    - **conferido a mão pelo autor:** skip link, buscas e botões com contorno verde, Tab, Enter e Shift+Tab até "Demanda de aço". Fonte: `docs/evidencias/depois/RELATORIO_AXE_DEPOIS.md`, seção "O que o axe NÃO prova". Os bugs de teclado da Fase 1 também vieram de um teste no Edge (`docs/EXPLICACAO_BLOCO3.md`, seção 3);
    - **pendente:** leitor de tela, celular real, Lighthouse, zoom de 400% e o contraste do menu lateral em 360 px, que o axe deixou "incompleto".
- **Correções da auditoria axe "depois" (rodada pelo assistente, em ambiente de nuvem, na branch publicada, 04/10; não pela equipe):**
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
    - Segunda rodada do axe (assistente, commit `c664734`): **0 violações nas 26 combinações** (`docs/evidencias/depois/RELATORIO_AXE_DEPOIS.md`).
    - **Nova rodada do axe pela equipe e Lighthouse: não executados.**

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

### 2026-10-04 · Bloco 4B — Fila de triagem e prioridade de atenção · feat/bloco4b-fila-triagem
- **Domínio (funções puras, com testes):**
  - `src/domain/atencao.js` (novo): `LIMITE_ACEITE_HORAS = 48` e `LIMITE_TRIAGEM_HORAS = 24` (**propostas**, a confirmar em ata; hoje RN09 e RN17 dizem 72 h). `marcoDeAtencao` (pendente: último `criacao`/`redirecionamento` do histórico; triagem: última `recusa`/`devolucao`), `tempoParado`, `formatarTempoParado`, `estaAtrasada` (limite exato não conta como atraso), `seloDeAtencao` e `compararPorAtencao`. "Agora" sempre por parâmetro.
  - `src/domain/listas.js` (só acréscimos): `ordenarPorAtencao`, `filtrarPorStatus`, aba `triagem` em `filtrarVisaoGeral`, `avisoDeAtencao`, `linkDaLista`/`statusDoSlug` (status na URL) e o campo `status` nos indicadores de um único status. O selo do card passou de "72 h para aceitar" (texto fixo) para a constante (`48 h para aceitar`).
  - `ordenarDemandas` **não mudou** ("Prioridade e data" continua igual); a ordem de atenção é um critério novo, usado como padrão nas telas.
- **Interface:**
  - Visão Geral: aviso "Precisa de atenção" (só com soma > 0) com links para a lista filtrada; aba rápida **Em triagem** com contador (`aria-pressed`, contagem anunciada pelo `role="status"` existente); cards Pendentes de aceite, Em triagem e Concluídas/Resolvidas viraram `<a>` com "Ver na lista"; lista em "atenção primeiro, depois recentes"; selos nos cards.
  - Demandas: filtro **Status** (rótulo visível, todos os status) ao lado de "Ordenar por"; "Ordenar por" começa em **Atenção primeiro**; selos nos cards.
  - `src/App.jsx`: lê `?status=` no hash (`#demandas?status=em-triagem`, `#demandas/eletrica?status=…`); o regex do setor passou a ignorar o `?`. O foco no h1 a cada troca de rota já existia.
  - CSS: `.attention-tag` e `.status-filter` em `src/App.css`; aviso, card-link e selo em `src/pages/VisaoGeral.css`. Fonte nova já nasce com 14 px (por isso nada foi acrescentado a `src/fonte-minima.css`).
- **Visibilidade (decisão de 04/10):** selo de aceite só para o setor executor e a gerência; selo de triagem só para a gerência; quem abriu vê só o resumo, sem tempo parado (RN03), e na ordem de atenção a demanda dele usa a data de criação. Aviso: gerência conta triagem + pendentes (respeitando o filtro de setor); setor conta só as pendentes que recebeu. Nenhum perfil ganhou acesso novo.
- **Seed:** acrescentada a **DM-2013** ("Exemplo: infiltração no teto do almoxarifado"), Administrativo → Elétrica, em triagem, recusada há 30 h, marcada com o campo `exemplo`. As demais não mudaram. Quem já tem dados salvos precisa de "Resetar dados" para vê-la.
- **Docs:** RN09 e RN17 com nota de proposta (texto atual mantido); propostas 13 e 14 no rascunho de ata de 03/10; `docs/EXPLICACAO_BLOCO4B.md`.
- **Passar do prazo:** RN09 e RN17 só preveem selo; nada além do selo foi implementado.
- **Atende:** RN02, RN03, RN09 (proposta), RN11, RN17 (proposta), RN20; RF-R06, RF-R08 (parte).
- **Verificação:**
  - `npm test` 10 arquivos / **192** testes passaram (42 novos: 18 em `atencao.test.js`, 23 em `listas.test.js`, 1 em `storage.test.js`) · lint 0 avisos e 0 erros · build OK.
  - Navegador embutido, depois de "Resetar dados" (o reset recriou a semente com a DM-2013):
    - `admin`: aviso "2 aguardando triagem · 2 pendentes de aceite"; ordem DM-2002, DM-2013, DM-2007, DM-2001 e depois por recentes; selos "Atrasada para aceite", "Atrasada para triagem", "Em triagem · parada há 20 horas", "Aguardando aceite há 5 horas"; com o teclado, Tab até o card "Em triagem" (contorno visível) e Enter abriu `#demandas?status=em-triagem` com o filtro preenchido e o foco no h1; aba "Em triagem" com `aria-pressed=true` e "2 demandas exibidas"; "Prioridade e data" tirou a fila da frente; Status "Pendente de aceite" + Elétrica = só DM-2002; "Em triagem" + Elétrica = 0.
    - `user04` (Elétrica): aviso só "1 pendente de aceite" (o link, pelo teclado, abriu a lista filtrada com o foco no h1); aba Em triagem 0; DM-2013 fora das listas e da URL ("Demanda não encontrada ou sem permissão."); filtro "Em triagem" = 0 em Recebidas e Solicitadas.
    - `user03` (Administrativo, quem abriu): sem aviso; aba Em triagem 1 (DM-2013, só resumo, "Setor atual: Gerenciamento"); nenhum selo.
    - 360 px: sem rolagem lateral em Demandas e Visão Geral; nenhum texto novo abaixo de 14 px.
  - Ajuste feito na conferência: o texto "Atenção primeiro (padrão)" cortava no select de 170 px; virou "Atenção primeiro", e o select de Status ganhou 260 px.
  - **Teste da equipe no Edge e com leitor de tela: não executado.**

### 2026-10-04 · Bloco 4C — Ações da gerência sobre a demanda em triagem · feat/bloco4c-acoes-gerencia
- **Domínio (funções puras, com testes):**
  - `src/domain/acoes.js` (acréscimos):
    - `redirecionarDemanda` (RN18): só a gerência e só Em triagem. Exige setor entre os 4 departamentos e tipo existente nesse setor. Leva a Pendente de aceite, grava `destino`, `tipo` e `redirecionadaEm`, e zera prioridade e prazos antigos. Histórico `redirecionamento` com `setor` e `tipoAtendimento`.
    - `marcarNaoAplicavel` (só Em triagem) e `cancelarDemanda` (o que a seção 4 permite: Pendente, Andamento, Aguardando, Triagem). Justificativa obrigatória, até 500 caracteres (`LIMITE_JUSTIFICATIVA = LIMITE_MOTIVO`), com histórico `encerramento`.
    - `motivoDaTriagem` devolve o último motivo de recusa e quem recusou.
    - Erros novos: `setor-invalido`, `justificativa-ausente`, `justificativa-longa`.
  - `src/domain/atencao.js`:
    - `LIMITE_ACEITE_REDIRECIONADA_HORAS = 24`;
    - `prazoAposRedirecionar` e `prazoDeAceite`: 24 h após o redirecionamento (*a versão com teto de 48 h desde a abertura foi retirada no ajuste abaixo*);
    - `estaAtrasada` (pendente) passou a usar `prazoDeAceite`. Demanda nunca redirecionada continua em 48 h; os testes do 4B não mudaram.
- **Interface:**
  - `src/pages/DetalhesDemanda.jsx`: botão **"Triar demanda"** (só gerência, só Em triagem). Campo novo **"Aceitar até"** para pendentes (executor e gerência). O comentário antigo sobre o redirecionamento foi atualizado.
  - `src/pages/TriagemDemanda.jsx` (novo), aberto pela tela Atualizar em "modo triagem":
    - mostra o motivo da recusa e quem recusou;
    - selects "Novo departamento" e "Tipo de atendimento" (o tipo depende do setor);
    - botões Redirecionar, Marcar como não aplicável, Cancelar demanda e Voltar;
    - pop-ups com o `Dialogo`, todos com "Voltar" para fechar; a justificativa tem contador e aviso de limite;
    - depois de agir, vai para `#demandas` (o foco vai para o h1).
  - `src/pages/AtualizarDemanda.jsx`: só o desvio para o modo triagem (`podeRedirecionar`).
  - `src/mensagens.js`: textos do catálogo e propostas novas. Nenhum CSS novo: reaproveita as classes da tela Atualizar.
- **Docs:**
  - `docs/MENSAGENS_VALIDACAO.md` com a seção "Triagem pela gerência" (proposta);
  - nota de proposta na RN18;
  - proposta 15 no rascunho de 03/10 e atualização da 14;
  - `docs/EXPLICACAO_BLOCO4C.md`.
- **Seed:** não mudou.
- **Atende:** RN18, RN19, RN20, RN22; RN02/RN03 (visibilidade depois do redirecionamento); RF-R09; CA-R05, CA-R07, CA-R11; CT-R06 (redirecionar), CT-R08.
- **Verificação:**
  - `npm test` 10 arquivos / **222** testes passaram (30 novos: 13 em `atencao.test.js`, 17 em `acoes.test.js`) · lint 0 avisos e 0 erros · build OK.
  - Navegador embutido, depois de "Resetar dados":
    - **`admin` na DM-2013 (aberta há 40 h):**
      - "Triar demanda" por Tab/Enter; a tela mostrou o motivo e "Recusada por Equipe de Elétrica (Elétrica)";
      - Redirecionar sem setor e sem tipo deu as mensagens junto dos campos, com o foco no campo;
      - tipo escolhido pelas setas;
      - o pop-up mostrou "até 04/10 11:12" (pela regra com teto, retirada no ajuste abaixo);
      - Tab ficou preso no pop-up e Esc devolveu o foco a "Redirecionar";
      - a confirmação levou à lista com o foco no h1;
      - nos Detalhes: Pendente de aceite, Hidráulica, tipo Vazamento, "Aceitar até 04/10 11:12" e o histórico de redirecionamento.
    - **`user02` (novo setor):** a DM-2013 apareceu em "Pendentes de aceite" com "Aguardando aceite há menos de 1 hora" e o botão "Aceitar ou recusar". Recusou de novo e depois recebeu "não encontrada ou sem permissão" no `/editar`.
    - **`admin` na DM-2007:**
      - Não aplicável: justificativa vazia deu "Informe a justificativa." e o foco foi para o campo;
      - com justificativa, a demanda ficou Não aplicável, sem botões, e o `/editar` mostrou "finalizada".
    - **`admin` na DM-2013, em 360 px:** cancelou com justificativa (botões "Voltar" / "Confirmar cancelamento"). Ficou Cancelada, sem botões, com o histórico.
    - **`user03` (quem abriu):** em triagem, só o resumo ("Setor atual: Gerenciamento"), sem botão; no `/editar`, "não há alterações disponíveis…".
    - **`user04`:** a DM-2013 deu "não encontrada ou sem permissão" no detalhe e no `/editar`.
    - **360 px:** sem rolagem lateral, nenhum texto da tela abaixo de 14 px, botões e selects com 38 px de altura.
  - **Não executado:**
    - teste no Edge;
    - leitor de tela (NVDA/Narrador);
    - celular real;
    - nova rodada do axe;
    - aceite pelo novo setor depois do redirecionamento (a regra do aceite é a do Bloco 4A, já testada);
    - cancelamento pela tela fora de triagem (a tela não oferece).

### 2026-10-04 · Bloco 4C — ajuste: prazo de aceite após redirecionar sem teto · feat/bloco4c-acoes-gerencia
- **Decisão do dono do projeto:** depois do redirecionamento, o novo setor tem **sempre 24 h**, contadas do redirecionamento. O teto de 48 h desde a abertura e a regra das "24 h cheias quando o teto venceu" deixaram de existir. Com isso some o caso-limite de sobrar só alguns minutos. A demanda nunca redirecionada continua com 48 h.
- **Código:**
  - `src/domain/atencao.js`: `prazoAposRedirecionar(redirecionadaEm)` agora é só redirecionamento + 24 h (recebe um parâmetro a menos), e `prazoDeAceite` a usa. Sem código morto.
  - `src/pages/TriagemDemanda.jsx`: o pop-up chama a função nova.
  - Comentários atualizados em `src/domain/acoes.js` e `src/pages/DetalhesDemanda.jsx`.
- **Testes** (`src/domain/atencao.test.js`):
  - o bloco do 4C foi reescrito: os redirecionamentos às 24 h, 36 h e 50 h dão sempre 24 h;
  - limite exato (24 h após o redirecionamento) não é atraso;
  - redirecionada depois das 48 h não nasce atrasada;
  - vários redirecionamentos: vale o último;
  - a demanda nunca redirecionada continua com 48 h;
  - saíram os testes do teto (12 h, "24 h cheias" e o caso de 1 minuto). Eram 13 testes no bloco, agora são 10.
- **Docs:** nota da RN18, proposta 15 ("Depois do redirecionamento pela gerência, o novo setor tem 24h para aceitar; antes eram 48h") e `docs/EXPLICACAO_BLOCO4C.md`.
- **Verificação:**
  - `npm test` 10 arquivos / **219** testes passaram · lint 0 avisos e 0 erros · build OK.
  - Navegador embutido, depois de "Resetar dados":
    - `admin`: a DM-2001, nunca redirecionada, mostrou "Aceitar até" = criação + 48 h;
    - a DM-2013 (aberta há 40 h) foi redirecionada às 05:09; o pop-up e os Detalhes mostraram "até 05/10 05:09" (24 h; pela regra antiga seriam 8 h);
    - `user02`: a DM-2013 em Pendentes de aceite, "Aguardando aceite há menos de 1 hora", "Aceitar até 05/10 05:09".
  - **Não executado:** Edge, leitor de tela, celular real, axe.

### 2026-10-04 · Bloco 4C — ajuste: justificativa obrigatória ao redirecionar · feat/bloco4c-acoes-gerencia
- **Decisão do dono do projeto, combinada desde a 2A:** o redirecionamento exige justificativa. Cada redirecionamento reinicia o relógio de 24 h; sem motivo registrado, a gerência poderia redirecionar várias vezes sem ninguém saber por quê. *(Isso resolve a divergência apontada no 4C entre a entrada da 2A e a primeira versão do 4C.)*
- **Domínio** — `src/domain/acoes.js`:
  - `redirecionarDemanda(demanda, { setor, tipo, justificativa }, usuario, contexto)` exige justificativa com a mesma validação de Não aplicável e Cancelar (`LIMITE_JUSTIFICATIVA = LIMITE_MOTIVO = 500`; vazia ou só espaços → `justificativa-ausente`; acima de 500 → `justificativa-longa`). A ordem das conferências não mudou: estado final, perfil, transição, setor, tipo e por último a justificativa.
  - O histórico `redirecionamento` grava `setor`, `tipoAtendimento` e `justificativa`, com o texto "Redirecionada para <setor> (<tipo>): <justificativa>." (sem ponto duplicado se a justificativa já termina com pontuação).
- **Interface** — `src/pages/TriagemDemanda.jsx`:
  - o pop-up "Confirmar redirecionamento" ganhou o campo "Justificativa (obrigatória)", no mesmo padrão dos outros dois: foco no campo ao abrir, contador e aviso de limite, erro junto do campo com `aria-invalid`, Esc e "Voltar";
  - o campo virou um trecho único, reaproveitado nos três pop-ups.
- **Textos:** `src/mensagens.js` (o pop-up termina em "Explique o motivo: ele fica no histórico.") e `docs/MENSAGENS_VALIDACAO.md` (proposta). O comentário de `src/pages/DetalhesDemanda.jsx` foi atualizado.
- **Testes** — `src/domain/acoes.test.js`:
  - 4 novos: justificativa ausente, vazia, só espaços e com 501 caracteres recusadas (500 aceita); espaços nas pontas limpos e sem ponto duplicado; o novo setor vê a justificativa e quem abriu não (o resumo não tem histórico); sem permissão continua dando "sem permissão";
  - chamadas existentes ajustadas com o argumento novo; o texto esperado do histórico mudou (com comentário).
- **Docs:** RN18, proposta 15 e `docs/EXPLICACAO_BLOCO4C.md` (regra, motivo e uma pergunta nova).
- **Verificação:**
  - `npm test` 10 arquivos / **223** testes passaram · lint 0 avisos e 0 erros · build OK.
  - Navegador embutido, depois de "Resetar dados":
    - `admin` na DM-2013, por teclado: o pop-up abriu com o foco na justificativa; "Confirmar redirecionamento" vazio deu "Informe a justificativa." junto do campo (`aria-invalid`, foco no campo) e nada foi gravado; Esc fechou e devolveu o foco a "Redirecionar";
    - em 360 px, sem rolagem lateral: com justificativa, a confirmação levou à lista com o foco no h1;
    - `user02`: no histórico dos Detalhes, "Redirecionada para Hidráulica (Vazamento): <justificativa>.";
    - `user03` (quem abriu): só o resumo ("Não aceita pelo setor", "Setor atual: Hidráulica"), sem histórico nem o texto da justificativa.
  - **Não executado:** Edge, leitor de tela, celular real, axe (ver `docs/TESTES_PENDENTES.md`).

### 2026-10-04 · Fix visual — "card gordo" · fix/visual-cards
- **Mudança:** `src/pages/VisaoGeral.css`: nos cards da Visão Geral, título e descrição ficam com no máximo 3 linhas cada, com reticências (`line-clamp`), além do `overflow-wrap: anywhere` que já existia. Só CSS: o texto inteiro continua no HTML, o leitor de tela lê tudo e os Detalhes mostram o texto completo. Demandas já limitava o título a 2 linhas (código dos colegas) e Departamentos só tem texto fixo dos setores; nos dois, nada mudou.
- **Verificação:**
  - lint 0 avisos e 0 erros · build OK · `npm test` 223 passaram;
  - navegador embutido: com duas demandas criadas pela Nova Demanda (título de 60 caracteres + descrição de 500; título e descrição com uma palavra gigante sem espaço), os cards da Visão Geral ficaram com a mesma altura dos normais (274 px em 1280 e em 360 px), a descrição em 3 linhas com "…", a palavra gigante quebrando dentro do card, sem rolagem lateral nas duas larguras, texto completo no DOM e fonte de 14/16 px;
  - depois, "Resetar dados";
  - **não executado:** Edge, leitor de tela, celular real.

### 2026-10-04 · Ajustes do teste manual (9 itens) · fix/ajustes-teste-manual
Origem: bateria de testes manuais do autor (Bruno Diogo). Cada item foi feito separado; depois de cada um rodaram `npm test`, lint e build.

1. **Todos os cards da Visão Geral são clicáveis.**
   - `listas.js`: `FILTROS_DO_PAINEL` (Abertas, Recebidas abertas, A expirar, Vencidas, Aguardando > 7 dias, Solicitadas por mim em aberto), `filtrarPorPainel`, `filtroDoPainel` e `linkDoIndicador` (`#demandas?filtro=…`, mais `&aba=solicitadas` quando é o caso). O mesmo teste conta o card e filtra a lista.
   - `App.jsx` lê `filtro` e `aba` do hash.
   - `Demandas.jsx` mostra "Filtro da Visão Geral: X" com o botão "Limpar filtro".
   - 6 testes. No navegador, os 7 cards do `admin` bateram com o "Exibindo N de N".
2. **"Pendentes de aceite" repetido em todas as páginas.**
   - **Não era intencional:** o grupo ficava fora da paginação (página 1 com 2 + 6, página 2 com 2 + 5: 15 de 13).
   - **Decisão:** `paginarComPendentes` pagina a lista inteira, com o grupo primeiro; o título mostra o total do grupo.
   - 4 testes. No navegador: 13 demandas em 3 páginas, sem repetição.
3. **Busca única:** `combinaComBusca` procura em ID, título, descrição, tipo, solicitante e setor de origem, sem diferença de acento nem de maiúsculas. Todos esses campos estão no resumo de quem abriu (RN03). Demandas e Visão Geral usam a mesma regra. 4 testes; "lucas" acha a DM-2002 na Visão Geral.
4. **Bordas e contraste (WCAG 1.4.11):**
   - Busca de Demandas: sem foco tinha borda transparente; agora `#6d968c`, 3,29:1 sobre o branco. A fonte passou de 11 px (14 px pela fonte-minima) para 16 px.
   - Selects de filtro: estavam sem borda; agora `#6d968c`, 3,29:1. Também perderam o `max-width: 170px` que cortava "Tecnologia da Informação (TI)".
   - Visão Geral: `--color-border` foi de `#e7e7e4` (1,24:1) para `#868a85` (3,51:1) em busca, abas e cards.
   - Departamentos: busca e cards foram de `#e7e9ed`/`#eceef1` (1,10 e 1,06:1 sobre `#f3f4f6`) para `#868a85` (3,19:1).
   - Cards de Demandas: já tinham `#6d968c` (3,29:1); não mudaram.
   - O anel duplo de foco foi mantido.
   - Em tela estreita, os rótulos dos filtros ficam em coluna, alinhados, com o select na largura toda.
   - Plural certo ("1 demanda ativa", "1 demanda aberta") com `quantidade()` em `formatos.js`; 2 testes.
5. **Aviso "Limite de 500 caracteres atingido" que voltava.**
   - Causa: o aviso não era reiniciado ao reabrir o pop-up, e uma colagem bloqueada no limite deixava guardado um tamanho "tentado" velho.
   - Correção: `avisoDeLimite` ignora esse valor velho; o hook ganhou `reiniciar(valor)`, chamado ao abrir os pop-ups da triagem e da recusa; a colagem que não cabe avisa na hora.
   - 3 testes, um deles reproduzindo o bug.
6. **Menu em 360 px e com zoom alto:** os itens quebram linha em vez de virar uma faixa com rolagem. Sem itens cortados e sem rolagem lateral em 320, 360, 640 e 1280 px.
7. **Nova Demanda:**
   - rótulos "(obrigatório)"/"(obrigatória)", como nos pop-ups;
   - `required` e `aria-required="true"`; o `noValidate` evita os balões do navegador;
   - as mensagens e o foco no 1º erro continuam iguais.
8. **Botão "Criar" do topo removido**, junto com `PlusIcon`, `.topbar-action`, `.button-icon` e a regra da fonte-minima. Nenhum teste dependia dele. Ordem do Tab: Origem → Destino → Título → Descrição → "Criar Nova Demanda"; o Tipo fica desativado até escolher o destino.
9. **"Resetar dados" com confirmação:**
   - pop-up acessível com o `Dialogo` (foco começa em "Voltar"; Esc e "Voltar" cancelam; o foco volta ao botão);
   - confirmar restaura o seed e mostra "Dados de demonstração restaurados.";
   - a regra fica em `src/services/reset.js`, com 3 testes que usam o storage de verdade.

- **Verificação:**
  - `npm test` 12 arquivos / **245** testes passaram (22 novos) · lint 0 avisos e 0 erros · build OK;
  - navegador embutido, como `admin`: itens 1 a 9 conferidos. O item 4 inclui as bordas medidas em 1280 px e os rótulos dos filtros em 320 px.
- **Limitações:**
  - não há biblioteca de teste de interface (jsdom/Testing Library); por isso os testes cobrem as regras puras, não os cliques. Instalar exige baixar pacotes: decisão do grupo;
  - o navegador embutido não emula menos de 320 px, então o zoom de 500% (256 px) não foi conferido. `index.css` tem `min-width: 320px` no `html`/`body` (código anterior), o que pode gerar rolagem da página inteira abaixo disso;
  - a colagem real (item 5) não pôde ser feita, porque a área de transferência é bloqueada no navegador embutido;
  - "Limpar filtro" limpa a lista, mas o `?filtro=` continua no endereço até a próxima navegação.
- **Não executado:** Edge, leitor de tela, celular real, Lighthouse, axe.

### 2026-10-04 · Documentação: limitações, personas e evidências · fix/ajustes-teste-manual
- **Só documentação**; nenhum arquivo de `src/` mudou.
- `docs/DOCUMENTACAO.md`:
  - **matriz (seção 6)** com a coluna "Em 04/10" ao lado do diagnóstico de 03/10;
  - **retrospectiva (14)** em rascunho, a partir dos registros;
  - **entregue × adiado (18)** com a justificativa de cada item;
  - **evidências (19)** com os resultados relatados pelo autor e os nomes de arquivo esperados para os prints;
  - seções novas: **20** (simulação sem back-end: dados, chaves de armazenamento, "Resetar dados", `?falha=1`, segurança, o que um back-end substituiria, limites, tema escuro como trabalho futuro), **21** (personas × atendimento) e **22** (o aviso "Precisa de atenção" para a apresentação);
  - remissão na seção 11.
- `docs/TESTES_PENDENTES.md`:
  - 3.2 (NVDA), 3.3 (Lighthouse 100/100 em 2 telas), 3.5 (zoom de 200% OK) e 3.7 (celular real) com o relato do autor, **sem marcar "passou"** onde falta resultado ou reteste;
  - novo item 3.8: comando de voz, não executado;
  - nota sobre o NVDA na seção 3.1.
- **Evidências relatadas pelo autor:** Lighthouse, NVDA, 360 px no DevTools (Galaxy A55), zoom de 200% e celular Android. Os prints foram salvos depois em `docs/evidencias/depois/` (ver a entrada seguinte e a seção 19 da DOCUMENTACAO).
- **Não executado:** nova rodada do axe no código atual, comando de voz, Lighthouse nas outras telas, zoom de 500%.

### 2026-10-04 · Documentação: referências aos prints de evidência · fix/ajustes-teste-manual
- **Só documentação.** As referências foram ajustadas aos arquivos que existem em `docs/evidencias/antes/` e `docs/evidencias/depois/`:
  - celular Android em `.jpeg`, e não `.png`;
  - os curingas (`*_*.png`) foram trocados pelos nomes completos;
  - os prints dos defeitos da 2A e da 2B estão em `antes/`;
  - o Bloco 1 está registrado como "sem print do estado anterior (defeito corrigido; não reproduzível sem voltar o código)".
- Arquivos: `docs/DOCUMENTACAO.md` (seção 19), `docs/TESTES_PENDENTES.md`, `docs/evidencias/depois/TESTE_MANUAL_BLOCO1.md`, `docs/evidencias/depois/TESTE_MANUAL_BLOCO2A.md` e este CHANGELOG.
- Os prints ficam só em `docs/evidencias/antes/` e `docs/evidencias/depois/`.

### 2026-10-04 · Registro final de testes, falhas conhecidas e material de estudo · fix/ajustes-teste-manual
- **Só documentação**; nenhum arquivo de `src/` mudou. Decisão do autor: nenhuma correção de código antes da apresentação (06/10).
- **Rodada final do autor (04/10/2026), manual:**
  - passaram: retestes 1 a 12 do PR #9 (o passo 1 do reteste 10 está sem print), Bloco A, Bloco B (por relato, sem print de cada passo), Bloco C partes 1 e 2 (com prints);
  - Bloco D, parte 1 (celular Android real): as telas abrem, mas **o envio da Nova Demanda falhou** (F1);
  - **não executados** por falta de tempo: NVDA no reteste, axe no código atual, Lighthouse nas demais telas, zoom de 400% e 500%, dados corrompidos pelo F12, reabrir o aviso de limite, Voz de Acesso.
  - Registro completo em `docs/TESTES_PENDENTES.md`, seção 0.
- **Falhas conhecidas** (`docs/DOCUMENTACAO.md`, seção 23, nova): F1 (envio trava no celular pelo IP da rede; causa não investigada, com uma hipótese não confirmada), A13 a A17 e O1, com a origem no código encontrada por leitura, sem alterar nada.
- **Inconsistências corrigidas:**
  - CT-R11 desmarcado nos requisitos, coerente com o item 1.5;
  - DOCUMENTACAO §20.6: zoom de 400%/500% registrado como não executado;
  - DOCUMENTACAO §6, "Registrar rápido": agora 🟡, por causa da F1;
  - o CHANGELOG do PR #9 agora inclui o item 4 nas conferências;
  - TESTES §3.3 usa o padrão real de nome do Lighthouse;
  - CT-R03 marcado como evidência fraca;
  - 4C.5 ligado ao 3.7.
- `docs/evidencias/depois/NAO_EXECUTADO_AINDA.md` atualizado com a lista final.
- **Material de estudo** para o grupo em `docs/estudo/` (14 arquivos): índice, funcionalidades, perguntas rápidas, roteiro da apresentação e falhas para falar.

### 2026-10-05 · PR #14 — ?lento=1 para a demonstração · feat/lento-demo
- Arquivos: `src/services/storage.js` (só `obterStorage`).
- O quê: `?lento=1` na URL deixa leitura e gravação em 2 s (padrões: 150 ms e 250 ms). Vai na parte de busca do endereço, antes do `#`, e só vale depois de recarregar a página. Sem ele, nada muda. O `?falha=1` continua igual.
- Por quê: mostrar "Carregando demandas…" e "Enviando…" com calma na demonstração.
- Atende: RNF06 (estados de carregamento visíveis).
- Verificação:
  - `npm test` 12 arquivos / 245 testes passaram · `npm run lint` 0 avisos e 0 erros · `npm run build` OK (rodados em 05/10, durante a tarefa de documentação deste PR, com o código de 2 s);
  - teste automatizado específico para o `?lento=1`: **não executado** (não existe);
  - navegador embutido: conferido pelo assistente na versão de 1,5 s (05/10); versão final de 2 s: conferida visualmente pelo autor, sem medir o tempo, no Edge (prévia da Vercel) e no celular (produção), em 05/10.
- Documentação: `README.md` (seção nova "Parâmetros de demonstração", com `?falha=1` e `?lento=1`), `docs/ERROR_HANDLING.md` e `docs/DOCUMENTACAO.md` (seções 20.2 e 20.5) registram o `?lento=1`; `ERROR_HANDLING.md` (seção 6) e `FLUXOS.md` (seção 5) marcam a fila "Pendentes de envio" como **não implementado (melhoria futura)**, porque ela não existe no código; `docs/CONTEXTO_E_PREFERENCIAS.md` ganhou a seção "Divisão de papéis".
