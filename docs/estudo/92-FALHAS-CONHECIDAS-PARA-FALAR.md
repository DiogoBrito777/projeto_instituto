# 92 — Falhas conhecidas e o que não foi feito: como falar com honestidade

> Orientação recebida para o trabalho: **não é preciso entregar tudo**, mas é preciso **justificar e saber explicar**. Regra da equipe: o que não foi testado é dito como "não testado", nunca como "funciona".
> Tabela completa, com a origem no código: `docs/DOCUMENTACAO.md`, seção 23.

## Fala curta geral (30 segundos)
"Fizemos uma bateria de testes manuais e retestes no dia 04/10. Quase tudo passou. Achamos uma falha importante no celular e alguns problemas visuais pequenos. Decidimos não mexer mais no código antes da apresentação, para não arriscar quebrar o que funciona, e registramos tudo, com a causa provável quando sabíamos."

## Falhas encontradas
**F1 — Envio trava no celular ("Enviando…")**
- **O que é:** no celular real, acessando o app pelo IP da rede (`npm run dev -- --host`), o botão de envio da Nova Demanda fica em "Enviando…" para sempre. No computador funciona. Reproduzimos 2 vezes.
- **Como responder com honestidade:** "A causa não foi investigada. Temos uma **hipótese, não confirmada**: o código gera um identificador com `crypto.randomUUID()`, e o navegador só oferece essa função em endereço seguro (HTTPS ou `localhost`). Pelo IP com `http`, ela não existiria, o envio quebraria no meio e o botão ficaria preso. Se a hipótese estiver certa, com HTTPS o problema não deveria ocorrer, mas isso não foi verificado."
- **Impacto:** alto no celular. As outras telas funcionaram no celular.

**A13 — Erro antigo no campo Tipo**
- **O que é:** depois de enviar vazio, a mensagem "Escolha primeiro o destino." pode continuar no Tipo mesmo depois de escolher o Destino.
- **Como responder com honestidade:** "Não confirmamos se ainda ocorre. Pelo código, quando o Destino muda, só o erro do Destino é limpo."
- **Impacto:** baixo.

**A14 — Barra de busca com meia largura em tela larga**
- **Como responder com honestidade:** "Escolha visual: em Demandas, a busca tem no máximo 430 px. Na Visão Geral e em Departamentos não investigamos."
- **Impacto:** só visual.

**A15 — "Não aceita pelo setor" confunde**
- **O que é:** quem abriu a demanda vê "Não aceita pelo setor" enquanto ela ainda está esperando o aceite, o que parece recusa.
- **Como responder com honestidade:** "É o texto da regra RN12. Propomos trocar por 'Aguardando aceite do setor'; precisa ir para a ata."

**A16 — Select de status cortado na tela Atualizar**
- **Como responder com honestidade:** "Mostra 'Pendente de aceit' porque a largura máxima do campo é 170 px com a fonte de 14 px."
- **Impacto:** só visual.

**A17 — Filtro do card continua ao trocar de aba**
- **O que é:** vindo do card "Recebidas abertas" e indo para a aba Solicitadas, o filtro do card continua ativo.
- **Como responder com honestidade:** "O botão 'Limpar filtro' resolve. A troca de aba não limpa o filtro, e isso seria uma correção pequena."

**O1 — Foco no campo Origem**
- **Como responder com honestidade:** "A Origem é só leitura, mas continua recebendo o foco, para o leitor de tela poder lê-la; o navegador seleciona o texto. Efeito pequeno."

## Não executados (falta de tempo antes da apresentação)
| Item | Como responder com honestidade |
|---|---|
| NVDA na rodada de reteste | "Usamos o NVDA antes, 2 ou 3 vezes; depois das correções não deu tempo de repetir." |
| Nova rodada do axe | "A última (0 violações) foi em código anterior; não rodamos de novo no código atual." |
| Lighthouse nas outras telas | "Fizemos na Visão Geral e na Nova Demanda (100/100). Nas outras, não." |
| Zoom de 400% e 500% | "Testamos 200% e a tela de 360 px. 400% e 500% não; no 500% pode haver rolagem por causa de uma largura mínima de 320 px." |
| Dados corrompidos pelo F12 | "Há teste automático da regra; o teste manual não foi feito." |
| Aviso de limite ao reabrir o pop-up | "Corrigimos e há teste automático; o reteste manual não foi feito." |
| Voz de Acesso | "Não testado." |

## O que ficou de fora por escolha (escopo)
- **Sem back-end real:** proibido pelo enunciado.
- **Novo prazo e cobrança:** a regra existe, falta a tela.
- **Modo offline:** sem back-end, nada depende de rede depois de carregar. Num sistema real, seria necessário aviso de conexão e fila de envio.
- **Chat, reabrir, "visualizada" e responsável individual:** marcados como futuro desde o começo.
- **Tema escuro:** custo alto (280 cores fixas) e o contraste teria de ser refeito.

Detalhes: `docs/DOCUMENTACAO.md`, seções 18, 20 e 23, e `docs/TESTES_PENDENTES.md`, seção 0.
