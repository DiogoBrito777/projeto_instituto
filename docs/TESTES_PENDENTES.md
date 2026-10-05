# Testes pendentes — Demanda de Aço

> **Regra do projeto:** teste que não foi feito é registrado aqui com honestidade e executado no fim. Nada é escondido. **Só se marca "passou" com fonte:** um arquivo de evidência ou o relato do autor, escrito na observação. Quem executar marca, com data e observação. *(Atualizado em 04/10/2026 com o relato do autor, Bruno Diogo: Blocos 1, 2A e 2B, e a rodada final de retestes da seção 0.)*
> Levantamento feito em 04/10/2026 a partir de `docs/CHANGELOG.md`, `docs/EXPLICACAO_BLOCO*.md`, `docs/evidencias/` (incluindo `TESTE_MANUAL_BLOCO1.md`, `TESTE_MANUAL_BLOCO2A.md` e os relatórios do axe), `docs/DOCUMENTACAO.md` (seções 9, 10 e 19) e `docs/REQUISITOS_REGRAS_DE_NEGOCIO.md` (seção 9).

**Como usar**
- Antes de cada teste: `npm run dev`, abrir no **Microsoft Edge** e clicar em **"Resetar dados"** na tela de login (senha = usuário: `admin`, `user01` a `user04`).
- Em "Resultado", troque `☐` por `☒` na opção certa. Preencha data e observação. Se falhar, descreva como reproduzir.
- "Quem": **Bruno** (dá para fazer sozinho), **grupo** (melhor em dupla ou com quem vai apresentar), **só pessoa** (precisa de um humano: leitor de tela, celular, olhar cor e contorno).

Demandas do seed usadas abaixo:
- **DM-2001**: Hidráulica → TI, pendente há 5 h;
- **DM-2002**: Administrativo → Elétrica, pendente e atrasada;
- **DM-2007**: TI → Hidráulica, em triagem;
- **DM-2013**: Administrativo → Elétrica, em triagem e atrasada (exemplo).

---

## 0. Rodada final do autor (04/10/2026), manual
> Registrado como "passou" **só o que o autor (Bruno Diogo) informou ter executado**. Decisão do autor: **nenhuma correção de código antes da apresentação** (terça, 06/10, à noite). Os prints estão com o autor; os que já estão em `docs/evidencias/` aparecem com o nome do arquivo. Onde não há print, está escrito "sem print".

**Executados, todos passaram (exceto o envio no celular):**
- **Bateria manual de 1 a 32**, já registrada antes (achados que viraram o PR #9).
- **Retestes 1 a 12, depois das correções do PR #9:**
  1. Resetar dados com confirmação;
  2. cards da Visão Geral levam à lista filtrada, com as contagens batendo;
  3. paginação;
  4. busca na Visão Geral;
  5. filtros combinados;
  6. layout em 360 px;
  7. Nova Demanda completa, mais a visão do setor de destino;
  8. fluxo de aceite;
  9. pop-ups: o Esc e o "Voltar"/"Cancelar" ficam cobertos pelo reteste 1;
  10. login e sessão (**passo 1 sem print**);
  11. card "Solicitadas por mim em aberto" (2 de 2);
  12. demanda encerrada sem ações, em andamento com ações, e ordenação.
- **Bloco A:** encerrada sem ações, em andamento com ações, ordenação. Passou.
- **Bloco B:** Nova Demanda só com teclado, tipo "Outros", DM-2015 → Elétrica e DM-2016 → Administrativo; pop-up "Demanda enviada" com o foco em "Ver demanda"; Esc fecha e devolve o foco. Passou, **por relato do autor**; sem print de cada passo (a captura exige mouse); há prints do resultado.
- **Bloco C, parte 1 (`?falha=1`):** aparece "Não foi possível enviar. Seus dados continuam salvos. Tente novamente.", o formulário é mantido e nenhuma demanda é criada. Passou, com print.
- **Bloco C, parte 2 (Resetar dados):** pop-up com "Voltar" e "Resetar dados"; "Voltar" não apaga nada; confirmar volta aos dados de exemplo (`admin`: Abertas 10, Pendentes de aceite 2, aviso "2 aguardando triagem · 2 pendentes de aceite"). Passou, com prints. Em dois prints o `?falha=1` ainda estava no endereço; o reset funcionou mesmo assim.
- **Bloco D, parte 1 (celular Android real, Chrome, `npm run dev -- --host`, `user03`):**
  - login, Visão Geral, Demandas, Departamentos e Nova Demanda abrem;
  - sem rolagem lateral; o teclado não esconde o campo digitado; alvos de toque OK;
  - **FALHOU o envio da Nova Demanda:** o botão fica em "Enviando…", reproduzido 2 vezes (19:47 e 19:48). É a **falha F1** (`docs/DOCUMENTACAO.md`, seção 23).
  - Prints: `docs/evidencias/depois/celular/`. **A pasta ainda não existe; o autor vai criá-la.**

**Não executados (motivo: falta de tempo antes da apresentação; nada disso está marcado como "passou"):**
- Bloco D, parte 2: NVDA nesta rodada de reteste (Visão Geral, Demandas, Nova Demanda);
- axe com o código atual (a última rodada foi em código anterior);
- Lighthouse nas demais telas (só Visão Geral e Nova Demanda, `admin`, desktop: 100/100);
- zoom de 400% e de 500%;
- dados corrompidos no `localStorage` pelo F12;
- reabrir o aviso de limite de 500 caracteres;
- Voz de Acesso.

**Falhas e achados conhecidos** (F1, A13 a A17, O1): tabela completa, com origem no código, em `docs/DOCUMENTACAO.md`, seção 23.

---

## 1. Pendências por bloco

### Bloco 1 — login, sessão, dados (6 itens · 1 passou · 5 pendentes)
| # | Item pendente | Quem | Como fazer | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| 1.1 | Dados corrompidos → "Resetar dados" (ERROR_HANDLING §5) | Bruno | 1. Logado, F12 → Application → Local Storage. 2. Na chave `demanda-de-aco:v1:demandas`, troque o valor por `{quebrado`. 3. Recarregue: deve aparecer a mensagem de dados com problema e o botão "Resetar dados". 4. Clique: os dados de demonstração voltam. | ☐ passou · ☐ não passou | | **Não executado** (falta de tempo, 04/10). |
| 1.2 | Reteste do **Sair** no celular, 360 px, no Edge | Bruno | F12 → modo celular, 360 px → entre → Tab até "Sair" → Enter: volta ao login. | ☒ passou · ☐ não passou | não registrada | Relato do autor (Bruno Diogo): reteste no Edge, com o DevTools em modo dispositivo. Sem print do estado anterior (defeito corrigido; não reproduzível sem voltar o código). |
| 1.3 | Login errado com erro acessível (CT-R02, parte "errado") | Bruno | Usuário `admin`, senha `x` → Entrar: aparece mensagem de erro e o foco vai para ela ou para o campo. | ☐ passou · ☐ não passou | | O reteste 10 (login/sessão) passou em 04/10, mas o registro não detalha se este passo foi incluído. |
| 1.4 | Abrir uma tela sem login pela URL (CT-R01) | Bruno | Numa janela privada, abra `http://localhost:5173/#demandas`: deve ir ao login. | ☐ passou · ☐ não passou | | Idem 1.3. |
| 1.5 | Sair + botão Voltar não reabre tela protegida (CT-R11, CA-R10) | Bruno | Entre, abra Demandas, clique em Sair e depois em Voltar do navegador: continua no login. | ☐ passou · ☐ não passou | | Idem 1.3. "Entrar e sair" passou no Bloco 1, mas o **Voltar depois do Sair** não está descrito em nenhum registro; por isso o CT-R11 nos requisitos também está desmarcado. |
| 1.6 | Teclado em todas as telas (estava "parcial" no Bloco 1) | grupo | Roteiro da seção 2, passos de teclado. | ☐ passou · ☐ não passou | | |

### Blocos 2A e 2B — telas ligadas aos dados e Nova Demanda (8 itens · 3 passaram · 5 pendentes)
| # | Item pendente | Quem | Como fazer | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| 2.1 | Teclado na 2A (CT-R13): Demandas, Detalhes, Atualizar, Departamentos | grupo | Só com Tab, Shift+Tab, Enter e Esc: abrir uma demanda, ir em "Atualizar", mudar status e salvar. | ☐ passou · ☐ não passou | | |
| 2.2 | Leitor de tela na 2A (CT-R14) | só pessoa | Seção 3.1, nas telas Demandas e Detalhes. | ☐ passou · ☐ não passou | | |
| 2.3 | Demanda final sem ações (CT-R08, CA-R07) | Bruno | Com `admin` e com `user03`, abra a DM-2008 (Concluída): nenhum botão de ação. Abra `#demanda/DM-2008/editar`: aparece "finalizada". | ☒ passou · ☐ não passou | 04/10/2026 | Reteste 12 e Bloco A do autor: encerrada sem ações, em andamento com ações. |
| 2.4 | Estados: carregando, vazio e erro (TC14) | Bruno | Busca sem resultado → "Nenhuma demanda encontrada". Abra `http://localhost:5173/?falha=1#nova-demanda`, envie uma demanda válida: "Enviando…" e depois o erro, com o formulário mantido. | ☐ passou · ☐ não passou | 04/10/2026 | Parcial: a parte do `?falha=1` **passou** (Bloco C, parte 1, com print do autor). A "busca sem resultado" não está registrada. |
| 2.5 | Teste manual da Nova Demanda pela equipe (2B) | grupo | Com `user01`: enviar vazio (4 erros, foco no Destino); o destino não tem TI; o tipo muda com o destino; enviar → pop-up com o número; Esc fecha. | ☒ passou · ☐ não passou | 04/10/2026 | Reteste 7 (Nova Demanda completa, mais a visão do destino) e Bloco B (só teclado; pop-up com o foco em "Ver demanda"; Esc devolve o foco), por relato do autor. No computador. **No celular o envio falha (F1).** |
| 2.6 | **Colar** texto acima do limite (não pôde ser testado no navegador embutido) | Bruno | Copie um texto com mais de 60 caracteres e cole no Título: o campo corta em 60 e aparece "Limite de 60 caracteres atingido. O texto foi cortado." Repita na Descrição (500). | ☒ passou · ☐ não passou | não registrada | Relato do autor (Bruno Diogo): a falha "2400/60" e "3072/500" foi corrigida com a trava e o aviso, e o reteste passou. Sem arquivo de evidência escrita; prints do defeito em `evidencias/antes/teste-manual_bloco2b_limite-titulo-2400-60.png` e `evidencias/antes/teste-manual_bloco2b_limite-descricao-3072-500.png`. |
| 2.7 | Leitor de tela anuncia aviso de limite e erros da Nova Demanda | só pessoa | Seção 3.1: enviar vazio e colar texto longo, ouvindo o que é lido. | ☐ passou · ☐ não passou | | |
| 2.8 | Tipo "Outros" na Nova Demanda e no Atualizar | Bruno | Nova demanda com tipo "Outros" → envia. Em Atualizar (executor), trocar o tipo para "Outros" → aparece no histórico. | ☐ passou · ☐ não passou | | Parcial: "Outros" na Nova Demanda **passou** (Bloco B: DM-2015 e DM-2016). Na tela Atualizar: não registrado. |

> Fora deste quadro: a **2C (offline, fila "Pendentes de envio")** não foi implementada; o TC04 (offline) **não se aplica** e vai para a seção 18 como "adiado".

### Bloco 3 — acessibilidade (8 itens · 1 não passou (3.7, envio no celular) · 7 pendentes)
| # | Item pendente | Quem | Como fazer | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| 3.1 | Edge só com teclado, olhando **cor e espessura** do contorno (o navegador embutido não permite conferir) | só pessoa | Tab em todas as telas: o contorno é verde, com 2 px, em botões, links, campos e selects; na barra lateral é verde-claro. | ☐ passou · ☐ não passou | | Parcial: o autor conferiu no Edge o skip link, as buscas e o contorno verde dos botões, com Tab, Enter e Shift+Tab (`evidencias/depois/RELATORIO_AXE_DEPOIS.md`). Falta percorrer todas as telas, inclusive as dos Blocos 4A a 4C. |
| 3.2 | Leitor de tela no fluxo principal (TC10, CT-R14) | só pessoa | Seção 3.1. | ☐ passou · ☐ não passou | não registrada | **Executado pelo autor**: NVDA 2026.2 + Edge InPrivate, 2 ou 3 vezes (relato do autor). O resultado por tela ainda não foi registrado, por isso não está marcado. Prints: `evidencias/depois/nvda_edge-inprivate_visao-geral.png` e `evidencias/depois/nvda_edge-inprivate_nova-demanda.png`. **NVDA na rodada de reteste (Bloco D, parte 2): não executado** (falta de tempo). |
| 3.3 | Lighthouse (Acessibilidade) | Bruno | Seção 3.3. | ☐ passou · ☐ não passou | não registrada | Parcial: **100/100 em Visão Geral e Nova Demanda, `admin`, desktop** (relato do autor; prints `evidencias/depois/lighthouse_visao-geral_admin_desktop.png` e `lighthouse_nova-demanda_admin_desktop.png`). Faltam Login, Demandas, Detalhes, Atualizar e mobile: **não executado** (falta de tempo). |
| 3.4 | Nova rodada do axe **pela equipe** (o "depois" atual foi feito pelo assistente) | Bruno | Seção 3.4. | ☐ passou · ☐ não passou | | **Não executada no código atual.** A rodada antiga (Bloco 3) deu 0 violações em 26 combinações. |
| 3.5 | Zoom de 400% (WCAG 1.4.10), nunca testado | Bruno | Edge em 1280 px, Ctrl + até 400%: sem rolagem lateral e nada cortado em Visão Geral, Demandas e Detalhes. | ☐ passou · ☐ não passou | | Zoom de **200% no Chrome (1920 × 1080, escala 100%): OK** (relato do autor; print `evidencias/depois/zoom-200_chrome_1920x1080_visao-geral.png`). **400% e 500%: não executados** (falta de tempo). O assistente só emulou 320 px, o que não substitui o zoom real. |
| 3.6 | Contraste dos itens do menu lateral em 360 px (o axe deixou "incompleto") | só pessoa | Modo celular, 360 px: "Demandas" e "Departamentos" legíveis. Se possível, meça com o seletor de cor do F12 (deve dar 4,5:1 ou mais). | ☐ passou · ☐ não passou | | |
| 3.7 | Celular real | só pessoa | Seção 3.2. | ☐ passou · ☒ não passou | 04/10/2026 | **Bloco D, parte 1** (Android, Chrome, `user03`): login, Visão Geral, Demandas, Departamentos e Nova Demanda abrem; sem rolagem lateral; o teclado não esconde o campo; alvos de toque OK. **O envio da Nova Demanda falhou** (fica em "Enviando…", 19:47 e 19:48): **falha F1**, não corrigida (`DOCUMENTACAO.md`, seção 23). Prints desta rodada: `evidencias/depois/celular/` (pasta a ser criada pelo autor). Rodada anterior: Visão Geral, Demandas, Departamentos e Nova Demanda abriram; os achados foram corrigidos no PR #9. Também 360 px no DevTools (Samsung Galaxy A55). Prints: `evidencias/depois/celular-android_visao-geral.jpeg`, `celular-android_demandas.jpeg`, `celular-android_departamentos.jpeg`, `celular-android_nova-demanda.jpeg`, `devtools-360px_galaxy-a55_visao-geral.png` e `devtools-360px_galaxy-a55_demandas.png`. A tela de triagem no celular está em **4C.5** (ligado a este item). |
| 3.8 | Comando de voz (ex.: Voz de Acesso do Windows) | só pessoa | Windows: Configurações → Acessibilidade → Fala → Voz de Acesso. Diga "clicar Nova demanda", "clicar Destino", "digitar…" e confira se cada controle é encontrado pelo nome visível. | ☐ passou · ☐ não passou | | **Não executado** (falta de tempo). |

### Bloco 4A — aceite e recusa (3 itens · 3 pendentes)
| # | Item pendente | Quem | Como fazer | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| 4A.1 | Aceite e recusa no Edge, só com teclado (CT-R05, CT-R13) | grupo | `user01` → DM-2001 → "Aceitar ou recusar". Aceitar sem prioridade dá erro e foco no select; com prioridade, pop-up → Esc devolve o foco → confirmar. Recusar sem motivo dá erro; com motivo, volta à lista. | ☐ passou · ☐ não passou | | Parcial: o **fluxo de aceite passou** no reteste 8 (04/10). Não está registrado se foi só com teclado nem se incluiu a recusa. |
| 4A.2 | Leitor de tela nos pop-ups de aceite e recusa | só pessoa | Seção 3.1: ouvir título e texto do pop-up e as mensagens de erro. | ☐ passou · ☐ não passou | | |
| 4A.3 | Setor que recusou perde o acesso; quem abriu vê "Setor atual: Gerenciamento" | Bruno | Depois do 4A.1 (recusa), `user01` abre `#demanda/DM-2001`: "não encontrada ou sem permissão". `user02` (quem abriu) vê o resumo com "Gerenciamento". | ☐ passou · ☐ não passou | | |

### Bloco 4B — fila de triagem e atenção (4 itens · 2 passaram · 2 pendentes)
| # | Item pendente | Quem | Como fazer | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| 4B.1 | Aba "Em triagem", aviso, selos e cards clicáveis no Edge | grupo | Roteiro da seção 2, passos 2 e 3. | ☐ passou · ☐ não passou | | Parcial: os **cards passaram** (retestes 2 e 11) e o aviso aparece nos prints do Bloco C, parte 2 ("2 aguardando triagem · 2 pendentes de aceite"). A aba "Em triagem" e os selos não estão registrados. |
| 4B.2 | Filtro "Status" **combinado com a busca** | Bruno | `admin` → Demandas → Status "Em triagem" → busque "infiltração": só a DM-2013. Apague a busca: DM-2013 e DM-2007. | ☒ passou · ☐ não passou | 04/10/2026 | Reteste 5 do autor ("filtros combinados"). |
| 4B.3 | Leitor de tela: contagem da aba anunciada e selos lidos | só pessoa | Seção 3.1: clicar na aba "Em triagem" e ouvir "2 demandas exibidas". | ☐ passou · ☐ não passou | | |
| 4B.4 | Ordem padrão × ordem escolhida no Edge | Bruno | Demandas com "Atenção primeiro": triagem e pendentes no topo. Trocar para "Mais recentes": essa ordem passa a valer. | ☒ passou · ☐ não passou | 04/10/2026 | Reteste 12 e Bloco A do autor (ordenação). |

### Bloco 4C — ações da gerência (6 itens · 6 pendentes)
| # | Item pendente | Quem | Como fazer | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| 4C.1 | Triagem completa no Edge (redirecionar **com justificativa obrigatória**, Não aplicável, Cancelar), só com teclado | grupo | Roteiro da seção 2, passos 4 a 7. | ☐ passou · ☐ não passou | | |
| 4C.2 | Prazo depois do redirecionamento no Edge: 24 h; nunca redirecionada: 48 h | Bruno | Redirecionar a DM-2013 e ver "Aceitar até" = agora + 24 h. Ver a DM-2001: criação + 48 h. | ☐ passou · ☐ não passou | | |
| 4C.3 | O novo setor **aceita** depois do redirecionamento | Bruno | Depois do 4C.2, `user02` → DM-2013 → aceitar com prioridade → Em andamento. | ☐ passou · ☐ não passou | | |
| 4C.4 | Leitor de tela nos pop-ups da triagem | só pessoa | Seção 3.1. | ☐ passou · ☐ não passou | | |
| 4C.5 | Celular real na tela de triagem | só pessoa | Seção 3.2. | ☐ passou · ☐ não passou | | Não executado. Ligado ao **3.7**: no celular, o envio da Nova Demanda falhou (F1). Pela hipótese da F1, as ações da triagem também poderiam falhar no celular; **não verificado**. |
| 4C.6 | axe nas telas novas (triagem, aviso, filtro) | Bruno | Seção 3.4, incluindo `#demanda/DM-2013/editar` como `admin`. | ☐ passou · ☐ não passou | | **Não executado** (falta de tempo). |

> **Fix visual "card gordo" (cards da Visão Geral limitados a 3 linhas):** conferido só pelo assistente no navegador embutido (1280 e 360 px). Não está entre os retestes do autor. **Pendente:** Edge (ver os cards com título de 60 e descrição de 500 caracteres), leitor de tela (confirmar que lê o texto inteiro, não só as 3 linhas) e celular real.

### Ajustes do teste manual — reteste (9 itens · 5 passaram · 4 pendentes)
Corrigidos na branch `fix/ajustes-teste-manual` (PR #9) a partir da bateria manual do autor. Conferidos pelo assistente no navegador embutido e **retestados pelo autor em 04/10/2026** (seção 0) onde está marcado.
| # | Item corrigido | Quem | Como retestar | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| R.1 | Todos os cards da Visão Geral levam a Demandas filtrada | Bruno | `admin`: clique em Abertas, A expirar, Vencidas e Aguardando; o "Exibindo N de N" bate com o card; o aviso "Filtro da Visão Geral" aparece; "Limpar filtro" volta a lista toda. Repita com `user01` em "Solicitadas por mim em aberto" (abre na aba Solicitadas). | ☒ passou · ☐ não passou | 04/10/2026 | Retestes 2 (cards → lista filtrada, contagens batem) e 11 ("Solicitadas por mim em aberto", 2 de 2). **Achado A17:** trocando de aba, o filtro do card continua (seção 23 da DOCUMENTACAO). |
| R.2 | "Pendentes de aceite" não se repete entre as páginas | Bruno | `admin` → Demandas: página 1 com 2 pendentes + 4; páginas 2 e 3 sem o grupo; 13 demandas no total. | ☒ passou · ☐ não passou | 04/10/2026 | Reteste 3 (paginação). |
| R.3 | Busca da Visão Geral acha pelo solicitante | Bruno | Visão Geral → "Lucas" → DM-2002. Em Demandas, uma palavra da descrição também acha. | ☒ passou · ☐ não passou | 04/10/2026 | Reteste 4 (busca na Visão Geral). **Achado A14:** largura da barra de busca. |
| R.4 | Bordas visíveis, select sem cortar, fonte da busca, rótulos alinhados, plural | Bruno | Ver a busca e os selects sem foco (borda visível); "Tecnologia da Informação (TI)" inteiro; em 360 px, rótulos em coluna; "1 demanda aberta" em Departamentos. | ☐ passou · ☐ não passou | | Parcial: o layout em 360 px passou (reteste 6). Bordas, select e plural não estão registrados à parte. **Achado A16:** o select de status da tela Atualizar corta "Pendente de aceit". |
| R.5 | Aviso de limite não volta ao reabrir o pop-up | Bruno | Triagem → Cancelar: cole um texto acima de 500, apague, feche, reabra e digite 1 caractere: nenhum aviso. | ☐ passou · ☐ não passou | | **Não executado** pelo autor (falta de tempo). Coberto só por teste automático (`limites.test.js`, "item 5"). |
| R.6 | Menu em 360 px e com zoom de 400%/500% | só pessoa | Edge com Ctrl + até 400% e 500%: os itens do menu quebram linha, sem cortar e sem rolagem lateral. | ☐ passou · ☐ não passou | | Parcial: **360 px passou** (reteste 6). **400% e 500%: não executados.** No 500% pode haver rolagem (`min-width: 320px` no `html`/`body`). |
| R.7 | Nova Demanda com "(obrigatório)" | Bruno + só pessoa | Ver os rótulos; enviar vazio (erros iguais, foco no Destino); com o leitor de tela, ouvir "obrigatório" nos campos. | ☐ passou · ☐ não passou | | Parcial: a Nova Demanda completa passou (reteste 7 e Bloco B). Com o leitor de tela: **não executado**. **Achado A13** (erro velho no Tipo) e **O1** (foco na Origem). |
| R.8 | Sem o botão "Criar" no topo da Nova Demanda | Bruno | Abrir Nova Demanda: não há botão no topo; Tab: Origem → Destino → Título → Descrição → "Criar Nova Demanda". | ☒ passou · ☐ não passou | 04/10/2026 | Bloco B (Nova Demanda só com teclado), por relato do autor; sem print de cada passo. |
| R.9 | "Resetar dados" pede confirmação | Bruno | Login → "Resetar dados" → pop-up; Esc ou "Voltar" não apaga (crie uma demanda antes e confira que ela continua); "Resetar dados" no pop-up mostra "Dados de demonstração restaurados.". | ☒ passou · ☐ não passou | 04/10/2026 | Reteste 1 e Bloco C, parte 2, com prints (com o autor). O reteste 1 também cobre o Esc e o "Voltar" dos pop-ups (reteste 9). |

---

## 2. Roteiro manual no Edge (15 a 20 minutos)
Preparação (1 min): `npm run dev`, Edge, `http://localhost:5173`, **Resetar dados** (desde os ajustes do teste manual, confirme no pop-up).

1. **Login e teclado (2 min).**
   - Recarregue. O 1º Tab mostra "Ir para o conteúdo"; Enter leva o foco ao título (h1), com contorno.
   - Login errado (`admin` / `x`): mensagem de erro.
   - Entre como `admin`. Clique em Sair e depois em Voltar do navegador: continua no login.
   - Entre de novo como `admin`.
2. **Visão Geral (3 min):**
   - aviso "Precisa de atenção" com triagem e pendentes;
   - selos "Atrasada para triagem" (DM-2013) e "Atrasada para aceite" (DM-2002), sempre em texto, não só cor;
   - com Tab, chegue ao card "Em triagem" (contorno visível) → Enter: abre Demandas já filtrada, foco no h1;
   - volte e clique na aba "Em triagem": contador 2.
3. **Filtro + busca (1 min):** em Demandas, Status "Em triagem" + busca "infiltração" → só DM-2013. Troque "Ordenar por" e veja a ordem mudar.
4. **Redirecionar (3 min):**
   - DM-2013 → "Triar demanda": aparecem o motivo e quem recusou;
   - Redirecionar sem setor e sem tipo: erros junto dos campos;
   - escolha Hidráulica e "Vazamento" (setas do teclado) → pop-up com o prazo de 24 h e o campo "Justificativa (obrigatória)";
   - confirme vazio: aparece "Informe a justificativa." junto do campo;
   - Tab fica preso no pop-up e Esc fecha devolvendo o foco;
   - reabra, escreva a justificativa e confirme: volta à lista com o foco no h1. Como `user02`, a justificativa aparece no histórico; como `user03` (quem abriu), não.
5. **Não aplicável (1 min):** DM-2007 → Triar → "Marcar como não aplicável" → confirmar vazio dá "Informe a justificativa." → escreva → confirme.
6. **Setores (4 min):**
   - `user02`: DM-2013 em "Pendentes de aceite", "Aceitar até" = +24 h → aceitar sem prioridade (erro) → com prioridade (pop-up) → confirmar.
   - `user01`: Nova Demanda vazia (erros) → preencha para Elétrica → enviar → pop-up com o número.
   - Ainda `user01`: DM-2001 → recusar com motivo.
7. **Cancelar e estado final (2 min):**
   - `admin`: DM-2001 → Triar → "Cancelar demanda" → justificativa → confirmar (o pop-up fecha com "Voltar", não com "Cancelar").
   - Abra `#demanda/DM-2001/editar` e `#demanda/DM-2007/editar`: "finalizada", sem ações.
8. **Permissões (2 min):**
   - `user04`: aba Em triagem = 0; abra `#demanda/DM-2001` → "não encontrada ou sem permissão".
   - `user03`: abra a DM-2002 → só o resumo ("Não aceita pelo setor"), sem selo e sem botão.
9. **360 px (2 min):** F12 → modo celular, 360 px. Confira Visão Geral, Demandas e uma tela de triagem com pop-up aberto: sem rolagem lateral, texto legível, Sair visível.

Anote quem fez, a data e o que falhou. Depois marque os itens 1.x, 2.x, 4A.x, 4B.x e 4C.x correspondentes.

---

## 3. Testes que precisam de uma pessoa ou ferramenta

### 3.1 Leitor de tela (Narrador do Windows ou NVDA)
> O autor já usou o **NVDA 2026.2 com o Edge InPrivate** (2 ou 3 vezes). Os passos abaixo valem para os dois leitores; anote o resultado de cada passo.
1. Ligue e desligue com **Ctrl + Windows + Enter**. Com o Narrador ligado, use Tab e Enter normalmente; **Caps Lock + seta** lê o texto.
2. No login: o nome de cada campo é lido; o erro de senha é lido.
3. Na Visão Geral: o título é lido a cada troca de tela; ao clicar na aba "Em triagem", é lido "N demandas exibidas".
4. Na Nova Demanda: ao enviar vazio, o erro do campo é lido junto com o rótulo; ao colar texto longo, o aviso de limite é lido.
5. Nos pop-ups (aceite, recusa, triagem): o título e o texto são lidos ao abrir; o Esc fecha.
6. Anote o que **não** foi lido ou foi lido sem sentido.

### 3.2 Celular real
1. Celular e computador na **mesma rede Wi-Fi**.
2. No computador: `npm run dev -- --host`. O terminal mostra uma linha "Network: http://192.168.x.x:5173".
3. No celular, abra esse endereço. Se não abrir, o firewall do Windows pode estar bloqueando: peça ajuda a quem conhece a máquina; não mude configurações de segurança sem saber o que está fazendo.
4. Faça os passos 1, 2, 4 e 6 do roteiro: toque nos botões (alvo confortável), role a tela (sem rolagem lateral) e abra os pop-ups (cabem na tela).

### 3.3 Lighthouse (Edge)
1. Entre no app e abra a tela a medir (o Lighthouse recarrega a página, e a sessão continua na mesma aba).
2. F12 → aba **Lighthouse** (se não aparecer, procure em ">>") → marque só **Accessibility** → "Analyze page load". Faça uma vez em Desktop e outra em Mobile.
3. Telas: Login, Visão Geral, Demandas, Detalhes, Atualizar (modo triagem) e Nova Demanda.
4. Salve um print (ou o relatório, pelo menu ⋮ → "Save as HTML") em `docs/evidencias/depois/`, no mesmo padrão dos arquivos que já existem: `lighthouse_<tela>_<perfil>_<desktop|mobile>.png` (ex.: `lighthouse_visao-geral_admin_desktop.png`). Anote a nota de cada tela.

### 3.4 Nova rodada do axe
- O relatório `docs/evidencias/depois/RELATORIO_AXE_DEPOIS.md` existe, mas foi feito **pelo assistente**, sobre o Bloco 3, **antes** dos Blocos 4A a 4C.
- Opção A (equipe):
  1. Instale a extensão gratuita **axe DevTools** no Edge, se o grupo concordar.
  2. Em cada tela da 3.3, F12 → aba "axe DevTools" → "Scan all of my page".
  3. Exporte ou tire print e salve em `docs/evidencias/depois/` com data e nome de quem fez.
- Opção B: pedir ao assistente para repetir o procedimento do relatório (Playwright + axe-core). Nesse caso, ele deve vir registrado como "executado pelo assistente".

---

## 4. Na entrega
O que não for executado até a entrega será registrado como **"não executado"** na **seção 18 de `docs/DOCUMENTACAO.md`**, com o motivo (ex.: falta de tempo, sem celular disponível), e nunca marcado como "passou".
