# Explicação do Bloco 4C — Ações da gerência sobre a demanda em triagem (para estudar)

> Rode `npm run dev`, clique em **"Resetar dados"** na tela de login e entre com `admin`. Abra a DM-2013 (em triagem) e clique em **"Triar demanda"**.

## 1. A ideia em uma frase
Quando um setor recusa uma demanda, ela vai para a **triagem** e passa a ser da **gerência**, que tem três saídas: **redirecionar** para outro setor, marcar como **não aplicável** ou **cancelar**.

## 2. O caminho
```
Detalhes → "Triar demanda" (só admin, só Em triagem)
  → tela Atualizar em "modo triagem" (src/pages/TriagemDemanda.jsx)
      mostra: motivo da recusa + quem recusou + histórico
      Redirecionar: escolhe novo departamento + tipo dele → pop-up com o novo prazo → Confirmar
                    → redirecionarDemanda() → Pendente de aceite no novo setor
      Marcar como não aplicável / Cancelar demanda: pop-up com justificativa obrigatória → Confirmar
                    → marcarNaoAplicavel() / cancelarDemanda() → estado final (nada muda depois)
  → volta à lista de Demandas, com o foco no título
```

## 3. As regras (em `src/domain/acoes.js`)
Todas começam pelas mesmas três perguntas (`conferirGerencia`): **está finalizada?** (RN20) **É a gerência?** (matriz, seção 3) **A transição existe?** (seção 4). Se alguma resposta for ruim, nada é gravado.

- **`redirecionarDemanda`** (RN18):
  - só a partir de Em triagem;
  - o setor tem de ser um dos 4 departamentos ("gerenciamento" não vale);
  - o **tipo de atendimento tem de existir no novo setor** (cada setor tem os seus tipos; decisão de 04/10);
  - grava: Pendente de aceite, novo `destino`, novo `tipo`, `redirecionadaEm`; a prioridade volta a "Não definida", porque quem define é o novo setor no aceite (RN10);
  - o histórico ganha um item `redirecionamento` com o setor e o tipo novos (RN22);
  - pode escolher de novo o setor que recusou: não há regra proibindo.
- **`marcarNaoAplicavel`** (RN19): só a partir de Em triagem (é o que a seção 4 permite). Justificativa obrigatória, até 500 caracteres.
- **`cancelarDemanda`** (RN19): a seção 4 permite cancelar Pendente, Em andamento, Aguardando e Em triagem, e o domínio segue isso. **A tela só oferece em triagem** (decisão de 04/10). Justificativa obrigatória, até 500 caracteres.
- **Por que 500?** É o mesmo limite do motivo da recusa e da descrição (`LIMITE_JUSTIFICATIVA = LIMITE_MOTIVO`).

## 4. O novo prazo de aceite (em `src/domain/atencao.js`, proposta 15)
| Situação | Prazo para aceitar |
|---|---|
| Nunca redirecionada | abertura + **48 h** (como no Bloco 4B) |
| Redirecionada | redirecionamento + **24 h**, mas **nunca depois de abertura + 48 h** (o "teto") |
| Redirecionada com o teto já vencido | redirecionamento + **24 h cheias** (não nasce atrasada) |

Exemplos (todos viraram teste):
- aberta às 08h e redirecionada às 11h → 24 h;
- redirecionada 24 h depois da abertura → 24 h (bate exatamente no teto);
- redirecionada 36 h depois → **12 h** (o teto corta);
- redirecionada 50 h depois → 24 h cheias.

Exatamente no prazo **não** é atraso; 1 minuto depois, é.

```js
export function prazoAposRedirecionar(criadaEm, redirecionadaEm) {
  const teto = criação + 48 h
  const cheio = redirecionamento + 24 h
  if (teto <= redirecionamento) return cheio // teto já venceu: 24 h cheias
  return o menor entre cheio e teto
}
```
(trecho simplificado; o código usa datas em milissegundos.)

- **Caso-limite:** redirecionada com 47 h 59 min desde a abertura, o novo setor fica com **1 minuto**. É o que a regra diz; está registrado no relatório e na proposta 15 para o grupo decidir.
- O selo "Aguardando aceite há X" / "Atrasada para aceite" e o campo **"Aceitar até"** dos Detalhes usam esse prazo.
- O pop-up do redirecionamento já mostra até quando o novo setor terá para aceitar.

## 5. Quem vê o quê depois de cada ação (nenhum perfil ganhou acesso novo)
- **Redirecionada:**
  - o **novo setor** vê a demanda em Recebidas, como Pendente de aceite, e pode aceitar ou recusar;
  - o setor que recusou **não vê** (não é mais o destino);
  - quem abriu vê só o resumo, com o novo "Setor atual".
- **Não aplicável / Cancelada:** estado final. Nenhum botão para ninguém. A URL `/editar` mostra "Esta demanda foi finalizada e não pode mais ser alterada."
- **Setor comum na URL `/editar` de uma demanda em triagem:**
  - o setor de destino recebe "Demanda não encontrada ou sem permissão.";
  - quem abriu recebe "Você pode consultar esta demanda, mas não há alterações…".

## 6. Acessibilidade
- Os pop-ups usam o `Dialogo` do Bloco 4A: o foco entra no pop-up, Tab fica preso, Esc fecha e o foco volta ao botão que abriu.
- O botão que fecha sem gravar se chama **"Voltar"**, para não confundir com "Cancelar demanda".
- Erro de setor, tipo ou justificativa: a mensagem fica junto do campo (`aria-describedby`), o campo fica `aria-invalid` e recebe o foco.
- Reaproveita as classes da tela Atualizar, já com 14 px (fonte-minima) e contraste conferido nos blocos anteriores. Nenhum CSS novo.

## 7. Perguntas que o professor pode fazer
1. **Quem pode redirecionar?** Só a gerência e só em triagem (RN18). O setor nunca envia direto a outro setor.
2. **Por que a gerência escolhe o tipo junto com o setor?** Cada setor tem os seus tipos; sem isso, a demanda chegaria com um tipo que não existe no novo setor.
3. **Como fica o prazo de aceite depois do redirecionamento?** 24 h, sem passar de 48 h desde a abertura; se essas 48 h já passaram, 24 h cheias.
4. **Por que o teto de 48 h?** Para a demanda não ficar parada indefinidamente sendo passada de setor em setor.
5. **Qual a diferença entre Não aplicável e Cancelada?** Não aplicável: nenhum setor tem competência. Cancelada: o pedido não deve ser atendido (duplicado, desistência…). Os dois exigem justificativa e são finais (RN19, RN20).
6. **Dá para cancelar uma demanda em andamento?** Pela regra (seção 4), sim, e o domínio permite. Pela tela, por enquanto só em triagem (decisão de 04/10).
7. **O que impede alguém de triar pelo DevTools?** A regra roda de novo no storage, com a demanda lida na hora de gravar; para quem não é gerência a resposta é "sem permissão". Há teste para isso.
8. **Depois de cancelada, dá para desfazer?** Não. Estado final não muda (RN20), nem pela gerência. Há teste para isso.
