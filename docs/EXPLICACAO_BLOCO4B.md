# Explicação do Bloco 4B — Fila de triagem e prioridade de atenção (para estudar)

> Rode `npm run dev`, clique em **"Resetar dados"** na tela de login (o seed ganhou a DM-2013) e entre com `admin`. Depois repita com `user04` (Elétrica) e `user03` (Administrativo).

## 1. A ideia em uma frase
Demanda **Em triagem** (esperando a gerência) e **Pendente de aceite** (esperando o setor) estão **paradas esperando alguém agir**. Por isso elas ganham destaque, um aviso no topo e vêm **primeiro** na lista.

## 2. Os prazos (propostas, a confirmar em ata)
| Situação | Quem precisa agir | Prazo | Conta a partir de |
|---|---|---|---|
| Pendente de aceite | setor executor | **48 h** (`LIMITE_ACEITE_HORAS`) | criação ou último redirecionamento (histórico) |
| Em triagem | gerência | **24 h** (`LIMITE_TRIAGEM_HORAS`) | a recusa (histórico) |

- Hoje a RN09 e a RN17 dizem **72 h**. Os textos antigos continuam nos requisitos, com uma nota de proposta (propostas 13 e 14 do rascunho de ata de 03/10).
- **Passar do prazo só muda o selo.** Ninguém é bloqueado: os documentos não preveem outra consequência (RN09: "selo Aceite atrasado"; RN17: "selo para a gerência").
- Exatamente 24 h ou 48 h **ainda não** está atrasada; passou disso, está.

## 3. Onde está cada parte
| Arquivo | O que faz |
|---|---|
| `src/domain/atencao.js` (novo) | Constantes dos prazos; `marcoDeAtencao` (desde quando está parada), `tempoParado`, `formatarTempoParado` ("há 5 horas", "há 3 dias"), `estaAtrasada`, `seloDeAtencao` (texto conforme quem olha) e o comparador da ordem. |
| `src/domain/listas.js` | `ordenarPorAtencao`, `filtrarPorStatus`, aba `triagem` da Visão Geral, `avisoDeAtencao`, status na URL (`linkDaLista`, `statusDoSlug`) e o campo `status` nos cards que viram link. |
| `src/App.jsx` | Lê `?status=` do endereço e entrega à tela Demandas. |
| `src/pages/Demandas.jsx` | Filtro **Status**, ordem padrão "Atenção primeiro" e selo nos cards. |
| `src/pages/VisaoGeral.jsx` + componentes | Aviso no topo, aba **Em triagem**, cards de status como link, selo nos cards e a mesma ordem. |
| `src/data/seed-demandas.json` | **Nova DM-2013**, marcada como exemplo: em triagem, recusada há 30 h (atrasada). |

Todas as regras são **funções puras com testes** (`atencao.test.js`, `listas.test.js`, `storage.test.js`). O "agora" entra por parâmetro, então o teste usa um relógio fixo.

## 4. Quem vê o quê (nenhum perfil ganhou acesso novo)
| | Gerência | Setor executor | Quem só abriu |
|---|---|---|---|
| Aba "Em triagem" | todas | 0 (em triagem a demanda é da gerência) | as suas, só com o resumo |
| Selo de aceite ("Aguardando aceite há X" / "Atrasada para aceite") | sim | sim, nas suas | **não** |
| Selo de triagem ("Em triagem · parada há X" / "Atrasada para triagem") | sim | não (nem vê a demanda) | **não** |
| Aviso do topo | triagem + pendentes | só as pendentes que recebeu | não aparece |

Por que quem abriu não vê o tempo parado? Porque a data da recusa está no histórico, que é operação interna (RN02, RN03). Pelo mesmo motivo, na ordem de atenção a demanda dele é ordenada pela **data de criação**, que ele já vê.

## 5. Trechos-chave
```js
// Desde quando está parada: o último item do histórico que "zera o relógio".
const MARCOS = {
  [STATUS.PENDENTE_ACEITE]: ['criacao', 'redirecionamento'],
  [STATUS.EM_TRIAGEM]: ['recusa', 'devolucao'],
}
```
Pendente conta da criação ou do último redirecionamento; triagem conta da recusa.

```js
export function estaAtrasada(demanda, agora) {
  const limite = LIMITES[demanda.status]
  if (limite === undefined) return false
  return tempoParado(demanda, agora) > limite * UMA_HORA
}
```
"Maior que", e não "maior ou igual": exatamente no limite ainda está no prazo.

```js
return compararPorAtencao(a, b, marcoVisivel) || resto(a, b)
```
Primeiro a fila de atenção (a mais antiga antes). Se as duas estão fora da fila, o comparador devolve 0 e quem decide é a ordem de antes (prioridade e data em Demandas; recentes na Visão Geral).

## 6. Como os cards levam para a lista filtrada
- O card "Em triagem" é um **link de verdade** (`<a href="#demandas?status=em-triagem">`), não uma `div` com clique: funciona com Tab e Enter e tem o contorno de foco do app.
- Com roteamento por hash, o filtro vai **depois do `?` dentro do próprio hash**. O `App.jsx` lê o `status` e a tela Demandas abre com o filtro preenchido.
- A cada troca de endereço, o foco vai para o título (h1), regra que já existia no `App.jsx`.
- Só viram link os cards de **um único status**: Pendentes de aceite, Em triagem, Concluídas/Resolvidas. "A expirar", "Vencidas" etc. misturam status e continuam só informativos.
- Gerência com filtro de setor: o link leva o setor junto (`#demandas/eletrica?status=…`).

## 7. Ordem padrão x ordem escolhida
- Demandas: "Ordenar por" começa em **Atenção primeiro**. Se o usuário escolher "Prioridade e data", "Mais recentes" etc., vale a escolha dele, sem a fila na frente.
- Visão Geral: não tem seletor, então sempre usa "atenção primeiro, depois recentes" (o texto ao lado das abas diz isso).

## 8. Acessibilidade
- Os selos são **texto** ("Atrasada para triagem"); a cor é só reforço (WCAG 1.4.1).
- Contraste: selos da lista 6,85:1 e 6,41:1; selos da Visão Geral 4,6:1; links do aviso 9,2:1.
- Fonte de 14 px ou mais em tudo o que é novo; alvos com pelo menos 24 px de altura.
- A aba "Em triagem" segue o padrão das outras: botão com `aria-pressed`, e a contagem é anunciada pela região `role="status"` que já existia.

## 9. Seed
- A DM-2013 ("Exemplo: infiltração no teto do almoxarifado") foi **acrescentada** ao seed para demonstrar "Atrasada para triagem". As outras demandas não mudaram.
- Quem já tinha dados salvos no navegador precisa clicar em **"Resetar dados"** para vê-la.

## 10. Perguntas que o professor pode fazer
1. **Por que essas duas situações vêm primeiro?** Nelas a demanda está parada esperando alguém; nas outras alguém já está trabalhando.
2. **Como o sistema sabe há quanto tempo está parada?** Pelo histórico: o último item de criação/redirecionamento (pendente) ou de recusa (triagem).
3. **O que acontece quando passa do prazo?** Só o selo muda para "Atrasada…". Os requisitos não preveem bloqueio, e não inventamos regra.
4. **Por que o setor não vê "Em triagem"?** Porque em triagem a demanda é da gerência (decisão de 04/10); o setor que recusou perde o acesso.
5. **Por que quem abriu não vê o tempo parado?** É operação interna (RN03): ele vê só status e setor atual.
6. **Como o card vira filtro?** É um link para `#demandas?status=…`; o `App.jsx` lê o status do endereço e entrega à tela.
7. **O filtro de status pode mostrar demanda de outro setor?** Não: ele filtra a lista que já passou pela permissão (`demandasDaAba`). Há teste para isso.
8. **Como testar prazo sem esperar 24 horas?** As funções recebem o "agora" por parâmetro; o teste usa uma data fixa e monta demandas "de 24 h atrás".
