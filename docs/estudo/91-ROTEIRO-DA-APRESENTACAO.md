# 91 — Roteiro da apresentação (8 a 10 minutos)

## Antes de começar (5 minutos antes, no computador da apresentação)
1. No CMD, na pasta do projeto: `npm run dev`. Abrir `http://localhost:5173` no **computador** (não no celular, por causa da falha F1).
2. Na tela de login: **"Resetar dados"** → no pop-up, **"Resetar dados"** de novo → aparece "Dados de demonstração restaurados.".
3. Conferir que o endereço **não** tem `?falha=1`.
4. Deixar aberta uma segunda aba com `docs/estudo/` ou com o GitHub, se for mostrar os PRs.
5. Opcional: no CMD, rodar `npm test` e deixar o resultado na tela (245 passaram).

## Roteiro
| Tempo | Tela / ação | Quem explica | Arquivo de estudo |
|---|---|---|---|
| 0:00–1:00 | Problema e solução; "sem back-end, dados no navegador" | ____________ | 00 |
| 1:00–2:00 | Login: erro com `admin`/`x`; entrar com `admin` | ____________ | 01 |
| 2:00–3:30 | Visão Geral: aviso "Precisa de atenção", selos, clicar em "Vencidas" → Demandas filtrada → "Limpar filtro" | ____________ | 05 |
| 3:30–4:30 | Demandas: abas, Status "Em triagem" + busca, ordenação, paginação | ____________ | 04 |
| 4:30–5:30 | Sair → `user01` → Nova Demanda: enviar vazio (erros), preencher, pop-up "Demanda enviada" | ____________ | 03, 07 |
| 5:30–7:00 | `user04` → DM-2002 → aceitar com prioridade (pop-up); `admin` → DM-2013 → Triar → redirecionar com justificativa | ____________ | 06 |
| 7:00–8:00 | Acessibilidade: Tab, "Ir para o conteúdo", foco no título, Esc no pop-up; 360 px no F12 | ____________ | 08 |
| 8:00–9:00 | Testes: `npm test` (245) e `TESTES_PENDENTES.md` (o que foi e o que não foi testado) | ____________ | 09 |
| 9:00–10:00 | Falhas conhecidas e o que ficou de fora, com honestidade; processo (PRs #4 a #9) | ____________ | 92, 10 |

## Dicas
- Se um número não bater com o esperado, lembre que os prazos dependem do relógio; o reset feito antes resolve.
- Não demonstre o envio pelo celular: é a falha F1. Se perguntarem, explique (arquivo 92).
- Se o professor pedir algo que não está pronto, diga que não está pronto e mostre onde está registrado (DOCUMENTACAO, seções 18 e 23).
