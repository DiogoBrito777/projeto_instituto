# Testes pendentes — Demanda de Aço

> **Regra do projeto:** teste que não foi feito é registrado aqui com honestidade e executado no fim. Nada é escondido e **nada aqui está marcado como "passou"**: quem executar marca, com data e observação.
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

## 1. Pendências por bloco

### Bloco 1 — login, sessão, dados (6 itens)
| # | Item pendente | Quem | Como fazer | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| 1.1 | Dados corrompidos → "Resetar dados" (ERROR_HANDLING §5) | Bruno | 1. Logado, F12 → Application → Local Storage. 2. Na chave `demanda-de-aco:v1:demandas`, troque o valor por `{quebrado`. 3. Recarregue: deve aparecer a mensagem de dados com problema e o botão "Resetar dados". 4. Clique: os dados de demonstração voltam. | ☐ passou · ☐ não passou | | |
| 1.2 | Reteste do **Sair** no celular, 360 px, no Edge | Bruno | F12 → modo celular, 360 px → entre → Tab até "Sair" → Enter: volta ao login. | ☐ passou · ☐ não passou | | |
| 1.3 | Login errado com erro acessível (CT-R02, parte "errado") | Bruno | Usuário `admin`, senha `x` → Entrar: aparece mensagem de erro e o foco vai para ela ou para o campo. | ☐ passou · ☐ não passou | | |
| 1.4 | Abrir uma tela sem login pela URL (CT-R01) | Bruno | Numa janela privada, abra `http://localhost:5173/#demandas`: deve ir ao login. | ☐ passou · ☐ não passou | | |
| 1.5 | Sair + botão Voltar não reabre tela protegida (CT-R11, CA-R10) | Bruno | Entre, abra Demandas, clique em Sair e depois em Voltar do navegador: continua no login. | ☐ passou · ☐ não passou | | |
| 1.6 | Teclado em todas as telas (estava "parcial" no Bloco 1) | grupo | Roteiro da seção 2, passos de teclado. | ☐ passou · ☐ não passou | | |

### Blocos 2A e 2B — telas ligadas aos dados e Nova Demanda (8 itens)
| # | Item pendente | Quem | Como fazer | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| 2.1 | Teclado na 2A (CT-R13): Demandas, Detalhes, Atualizar, Departamentos | grupo | Só com Tab, Shift+Tab, Enter e Esc: abrir uma demanda, ir em "Atualizar", mudar status e salvar. | ☐ passou · ☐ não passou | | |
| 2.2 | Leitor de tela na 2A (CT-R14) | só pessoa | Seção 3.1, nas telas Demandas e Detalhes. | ☐ passou · ☐ não passou | | |
| 2.3 | Demanda final sem ações (CT-R08, CA-R07) | Bruno | Com `admin` e com `user03`, abra a DM-2008 (Concluída): nenhum botão de ação. Abra `#demanda/DM-2008/editar`: aparece "finalizada". | ☐ passou · ☐ não passou | | |
| 2.4 | Estados: carregando, vazio e erro (TC14) | Bruno | Busca sem resultado → "Nenhuma demanda encontrada". Abra `http://localhost:5173/?falha=1#nova-demanda`, envie uma demanda válida: "Enviando…" e depois o erro, com o formulário mantido. | ☐ passou · ☐ não passou | | |
| 2.5 | Teste manual da Nova Demanda pela equipe (2B) | grupo | Com `user01`: enviar vazio (4 erros, foco no Destino); o destino não tem TI; o tipo muda com o destino; enviar → pop-up com o número; Esc fecha. | ☐ passou · ☐ não passou | | |
| 2.6 | **Colar** texto acima do limite (não pôde ser testado no navegador embutido) | Bruno | Copie um texto com mais de 60 caracteres e cole no Título: o campo corta em 60 e aparece "Limite de 60 caracteres atingido. O texto foi cortado." Repita na Descrição (500). | ☐ passou · ☐ não passou | | |
| 2.7 | Leitor de tela anuncia aviso de limite e erros da Nova Demanda | só pessoa | Seção 3.1: enviar vazio e colar texto longo, ouvindo o que é lido. | ☐ passou · ☐ não passou | | |
| 2.8 | Tipo "Outros" na Nova Demanda e no Atualizar | Bruno | Nova demanda com tipo "Outros" → envia. Em Atualizar (executor), trocar o tipo para "Outros" → aparece no histórico. | ☐ passou · ☐ não passou | | |

> Fora deste quadro: a **2C (offline, fila "Pendentes de envio")** não foi implementada; o TC04 (offline) **não se aplica** e vai para a seção 18 como "adiado".

### Bloco 3 — acessibilidade (7 itens)
| # | Item pendente | Quem | Como fazer | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| 3.1 | Edge só com teclado, olhando **cor e espessura** do contorno (o navegador embutido não permite conferir) | só pessoa | Tab em todas as telas: o contorno é verde, com 2 px, em botões, links, campos e selects; na barra lateral é verde-claro. | ☐ passou · ☐ não passou | | |
| 3.2 | Leitor de tela no fluxo principal (TC10, CT-R14) | só pessoa | Seção 3.1. | ☐ passou · ☐ não passou | | |
| 3.3 | Lighthouse (Acessibilidade) | Bruno | Seção 3.3. | ☐ passou · ☐ não passou | | |
| 3.4 | Nova rodada do axe **pela equipe** (o "depois" atual foi feito pelo assistente) | Bruno | Seção 3.4. | ☐ passou · ☐ não passou | | |
| 3.5 | Zoom de 400% (WCAG 1.4.10), nunca testado | Bruno | Edge em 1280 px, Ctrl + até 400%: sem rolagem lateral e nada cortado em Visão Geral, Demandas e Detalhes. | ☐ passou · ☐ não passou | | |
| 3.6 | Contraste dos itens do menu lateral em 360 px (o axe deixou "incompleto") | só pessoa | Modo celular, 360 px: "Demandas" e "Departamentos" legíveis. Se possível, meça com o seletor de cor do F12 (deve dar 4,5:1 ou mais). | ☐ passou · ☐ não passou | | |
| 3.7 | Celular real | só pessoa | Seção 3.2. | ☐ passou · ☐ não passou | | |

### Bloco 4A — aceite e recusa (3 itens)
| # | Item pendente | Quem | Como fazer | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| 4A.1 | Aceite e recusa no Edge, só com teclado (CT-R05, CT-R13) | grupo | `user01` → DM-2001 → "Aceitar ou recusar". Aceitar sem prioridade dá erro e foco no select; com prioridade, pop-up → Esc devolve o foco → confirmar. Recusar sem motivo dá erro; com motivo, volta à lista. | ☐ passou · ☐ não passou | | |
| 4A.2 | Leitor de tela nos pop-ups de aceite e recusa | só pessoa | Seção 3.1: ouvir título e texto do pop-up e as mensagens de erro. | ☐ passou · ☐ não passou | | |
| 4A.3 | Setor que recusou perde o acesso; quem abriu vê "Setor atual: Gerenciamento" | Bruno | Depois do 4A.1 (recusa), `user01` abre `#demanda/DM-2001`: "não encontrada ou sem permissão". `user02` (quem abriu) vê o resumo com "Gerenciamento". | ☐ passou · ☐ não passou | | |

### Bloco 4B — fila de triagem e atenção (4 itens)
| # | Item pendente | Quem | Como fazer | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| 4B.1 | Aba "Em triagem", aviso, selos e cards clicáveis no Edge | grupo | Roteiro da seção 2, passos 2 e 3. | ☐ passou · ☐ não passou | | |
| 4B.2 | Filtro "Status" **combinado com a busca** (não conferido no navegador) | Bruno | `admin` → Demandas → Status "Em triagem" → busque "infiltração": só a DM-2013. Apague a busca: DM-2013 e DM-2007. | ☐ passou · ☐ não passou | | |
| 4B.3 | Leitor de tela: contagem da aba anunciada e selos lidos | só pessoa | Seção 3.1: clicar na aba "Em triagem" e ouvir "2 demandas exibidas". | ☐ passou · ☐ não passou | | |
| 4B.4 | Ordem padrão × ordem escolhida no Edge | Bruno | Demandas com "Atenção primeiro": triagem e pendentes no topo. Trocar para "Mais recentes": essa ordem passa a valer. | ☐ passou · ☐ não passou | | |

### Bloco 4C — ações da gerência (6 itens)
| # | Item pendente | Quem | Como fazer | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| 4C.1 | Triagem completa no Edge (redirecionar, Não aplicável, Cancelar), só com teclado | grupo | Roteiro da seção 2, passos 4 a 7. | ☐ passou · ☐ não passou | | |
| 4C.2 | Prazo depois do redirecionamento no Edge: 24 h; nunca redirecionada: 48 h | Bruno | Redirecionar a DM-2013 e ver "Aceitar até" = agora + 24 h. Ver a DM-2001: criação + 48 h. | ☐ passou · ☐ não passou | | |
| 4C.3 | O novo setor **aceita** depois do redirecionamento | Bruno | Depois do 4C.2, `user02` → DM-2013 → aceitar com prioridade → Em andamento. | ☐ passou · ☐ não passou | | |
| 4C.4 | Leitor de tela nos pop-ups da triagem | só pessoa | Seção 3.1. | ☐ passou · ☐ não passou | | |
| 4C.5 | Celular real na tela de triagem | só pessoa | Seção 3.2. | ☐ passou · ☐ não passou | | |
| 4C.6 | axe nas telas novas (triagem, aviso, filtro) | Bruno | Seção 3.4, incluindo `#demanda/DM-2013/editar` como `admin`. | ☐ passou · ☐ não passou | | |

---

## 2. Roteiro manual no Edge (15 a 20 minutos)
Preparação (1 min): `npm run dev`, Edge, `http://localhost:5173`, **Resetar dados**.

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
   - escolha Hidráulica e "Vazamento" (setas do teclado) → pop-up com o prazo de 24 h;
   - Tab fica preso no pop-up e Esc fecha devolvendo o foco;
   - reabra e confirme: volta à lista com o foco no h1.
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

### 3.1 Leitor de tela (Narrador do Windows)
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
4. Salve o relatório (menu ⋮ → "Save as HTML") em `docs/evidencias/depois/` com nome `lighthouse_<tela>_<desktop|mobile>.html`. Anote a nota de cada tela.

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
