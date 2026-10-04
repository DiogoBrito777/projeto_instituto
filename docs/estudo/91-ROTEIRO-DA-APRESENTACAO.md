# 91 — Roteiro de demonstração

> A apresentação é conduzida pelo professor, que pode pedir a **qualquer integrante**, em qualquer ordem, para explicar ou demonstrar uma parte. Por isso este roteiro serve a todos:
> - a **seção 2** é a demonstração completa, na ordem das telas;
> - a **seção 3** mostra como demonstrar um ponto isolado, quando pedido.
>
> Para revisar o conteúdo, use o guia de autoavaliação (`17-material-de-apresentacao.md`).

## 1. Preparação (antes de começar, no computador da apresentação)
1. No CMD, na pasta do projeto, rode `npm run dev`. Abra `http://localhost:5173` no **computador**. Não use o celular: há a falha F1, ver o arquivo 92.
2. Na tela de login, clique em **"Resetar dados"** e confirme no pop-up. Deve aparecer "Dados de demonstração restaurados.".
3. Confira que o endereço **não** tem `?falha=1`.
4. Opcional: rode `npm test` no CMD e deixe o resultado aberto. Na última execução, em 04/10, passaram os 245 testes.

## 2. Demonstração completa (ordem das telas)
| # | Tela | O que fazer | O que mostrar / dizer | Arquivo |
|---|---|---|---|---|
| 1 | Login | Entrar com `admin` e senha `x` | Aparece "Usuário ou senha incorretos. Confira e tente de novo." e o foco volta para o campo Usuário. A mensagem é única: não diz qual dos dois está errado. | 01 |
| 2 | Login | Entrar com `admin` / `admin` | A sessão fica no `sessionStorage`, sem a senha. | 01 |
| 3 | Visão Geral | Olhar a faixa "Precisa de atenção" e os cards | Os chips "48 h para aceitar", "25% do prazo" e "Prazo passou". Os números dependem da hora do reset. | 05, 15 |
| 4 | Visão Geral → Demandas | Clicar no card **"Vencidas"** (ou "Em triagem") | O endereço muda para `#demandas?filtro=...`; aparecem "Filtro da Visão Geral: …" e **"Limpar filtro"**. **Não troque de aba** antes de limpar o filtro (A17). | 15 |
| 5 | Demandas | Limpar filtro; Status "Em triagem"; buscar uma palavra; trocar "Ordenar por" | Mostrar o resultado "Exibindo X de Y demandas" e a paginação de 6 por página. | 04, 14 |
| 6 | Nova Demanda | Sair → entrar como `user01` → Nova Demanda → "Criar Nova Demanda" vazio | Os erros aparecem junto dos campos e o foco vai para o primeiro. | 03 |
| 7 | Nova Demanda | Preencher (Destino, Tipo, título, descrição) e enviar | Pop-up "Demanda enviada" com o número. Depois de um reset, o primeiro número é a **DM-2014**. | 03, 07, 12 |
| 8 | Detalhes | Clicar em "Ver demanda" | Quem abriu vê só o resumo, com o status "Não aceita pelo setor" (achado A15, ver abaixo). | 06, 92 |
| 9 | Aceite | Sair → `user04` → **DM-2002** → "Aceitar ou recusar" → prioridade → confirmar | A confirmação mostra o prazo; o status vira "Em andamento". | 06 |
| 10 | Triagem | Sair → `admin` → **DM-2013** → "Triar demanda" → Redirecionar (setor, tipo e justificativa) | A demanda volta a "Pendente de aceite" no novo setor, com 24 h para o aceite. A justificativa fica no histórico. | 06, 16 |
| 11 | Acessibilidade | Tab desde o início; "Ir para o conteúdo"; Esc num pop-up; F12 com largura de 360 px | O foco é visível; o foco vai para o título a cada tela; o pop-up prende o foco. | 07, 08 |
| 12 | Testes | Mostrar `npm test` e `docs/TESTES_PENDENTES.md` | O que foi testado e o que **não** foi. | 09, 92 |

**Se aparecer "Não aceita pelo setor" (A15):**
- Esse texto aparece para quem abriu uma demanda que ainda espera o aceite.
- É o texto da RN12, gerado por `resumoParaSolicitante` (`src/domain/permissoes.js`).
- A demanda **não foi recusada**. A proposta é trocar o texto por "Aguardando aceite do setor".

**Se algo der errado:** Sair → "Resetar dados" → recomeçar do passo onde parou.

## 3. Demonstrações avulsas (quando pedirem um ponto específico)
| Pedido | Como mostrar | Arquivo |
|---|---|---|
| Permissões (um setor não vê o de outro) | `user02` → Demandas: só aparece o que recebeu e o que abriu. Abrir **DM-2001** (aberta pela Hidráulica): só o resumo, sem prioridade e sem histórico. | 04, 06 |
| Recusa | `user01` → **DM-2001** → "Aceitar ou recusar" → recusar com motivo. A demanda vai para "Em triagem". | 06 |
| Erro de gravação | Abrir `http://localhost:5173/?falha=1#nova-demanda` (o `?falha=1` vem antes do `#`) e enviar: aparece a mensagem de erro e o formulário continua preenchido. | 03 |
| Rota protegida | Sair e digitar `#demandas` no endereço: o app volta para `#login`. | 01, 16 |
| Endereço inválido | Logado, digitar `#xyz`: abre a tela Demandas. | 16 |
| Demanda finalizada | Abrir **DM-2008** (Concluída): não há botões de ação. | 06, 16 |
| Departamentos | `admin` vê os 4 setores; `user03` vê só o próprio. "Acessar setor" abre a lista do setor. | 16 |
| Onde está uma regra no código | `src/domain/` (ex.: `status.js` para as transições, `prazos.js` para os prazos) e o `.test.js` ao lado. | 11, 16 |
| Dados no navegador | F12 → Application → Local Storage → chave `demanda-de-aco:v1:demandas`. | 02, 12 |

## 4. Boas práticas durante a demonstração
- Os prazos dependem do relógio. Se um número parecer estranho, explique isso; o reset feito antes ajuda.
- Não demonstre o envio pelo celular (F1). Se perguntarem, explique a falha com honestidade (arquivo 92).
- Se pedirem algo que não está pronto, diga que não está pronto e mostre onde está registrado (DOCUMENTACAO, seções 18 e 23).
- Não afirme que algo funciona sem ter testado. Diga o que foi testado e quando.
