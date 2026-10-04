# Explicação do Bloco 4C — Ações da gerência sobre a demanda em triagem (para estudar)

> Rode `npm run dev`, clique em **"Resetar dados"** na tela de login e entre com `admin`. Abra a DM-2013 (em triagem) e clique em **"Triar demanda"**.

## 1. A ideia em uma frase
Quando um setor recusa uma demanda, ela vai para a **triagem** e passa a ser da **gerência**, que tem três saídas: **redirecionar** para outro setor, marcar como **não aplicável** ou **cancelar**.

## 2. O caminho
```
Detalhes → "Triar demanda" (só admin, só Em triagem)
  → tela Atualizar em "modo triagem" (src/pages/TriagemDemanda.jsx)
      mostra: motivo da recusa + quem recusou + histórico
      Redirecionar: escolhe novo departamento + tipo dele → pop-up com o novo prazo
                    e justificativa obrigatória → Confirmar
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
  - **justificativa obrigatória**, até 500 caracteres (vazia, só espaços ou com 501 caracteres é recusada). Motivo, decisão do dono do projeto combinada desde a 2A: cada redirecionamento reinicia o relógio de 24 h; sem justificativa, a gerência poderia redirecionar várias vezes sem ninguém saber por quê;
  - o histórico ganha um item `redirecionamento` com o setor, o tipo e a justificativa: "Redirecionada para Hidráulica (Vazamento): motivo." (RN22). O novo setor lê nos Detalhes; quem abriu vê só o resumo, sem o histórico (RN03);
  - pode escolher de novo o setor que recusou: não há regra proibindo.
- **`marcarNaoAplicavel`** (RN19): só a partir de Em triagem (é o que a seção 4 permite). Justificativa obrigatória, até 500 caracteres.
- **`cancelarDemanda`** (RN19): a seção 4 permite cancelar Pendente, Em andamento, Aguardando e Em triagem, e o domínio segue isso. **A tela só oferece em triagem** (decisão de 04/10). Justificativa obrigatória, até 500 caracteres.
- **Por que 500?** É o mesmo limite do motivo da recusa e da descrição (`LIMITE_JUSTIFICATIVA = LIMITE_MOTIVO`).

## 4. O novo prazo de aceite (em `src/domain/atencao.js`, proposta 15)
| Situação | Prazo para aceitar |
|---|---|
| Nunca redirecionada | abertura + **48 h** (como no Bloco 4B) |
| Redirecionada | último redirecionamento + **24 h**, sempre |

Exemplos (viraram teste): aberta às 08h e redirecionada às 11h → 24 h; redirecionada 24 h, 36 h ou 50 h depois da abertura → também 24 h, contadas do redirecionamento. Assim o novo setor nunca "nasce atrasado".

Exatamente no prazo **não** é atraso; 1 minuto depois, é.

```js
export function prazoAposRedirecionar(redirecionadaEm) {
  return redirecionamento + 24 h
}
```
(trecho simplificado; o código usa datas em milissegundos.)

- *Histórico da decisão:* a primeira versão do 4C tinha um teto de 48 h desde a abertura. O dono do projeto retirou o teto (04/10), porque com ele o novo setor podia ficar com poucos minutos.
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
1. **Quem pode redirecionar?** Só a gerência e só em triagem (RN18), sempre com justificativa. O setor nunca envia direto a outro setor.
   - **Por que exigir justificativa no redirecionamento?** Cada redirecionamento dá mais 24 h ao novo setor. Sem motivo registrado, daria para "esticar" o prazo redirecionando de novo, sem deixar rastro.
2. **Por que a gerência escolhe o tipo junto com o setor?** Cada setor tem os seus tipos; sem isso, a demanda chegaria com um tipo que não existe no novo setor.
3. **Como fica o prazo de aceite depois do redirecionamento?** Sempre 24 h, contadas do redirecionamento. A demanda que nunca foi redirecionada continua com 48 h.
4. **Por que 24 h e não 48 h depois do redirecionamento?** A demanda já perdeu tempo na recusa e na triagem; 24 h é o mínimo justo para o novo setor e evita que ela fique parada mais tempo.
5. **Qual a diferença entre Não aplicável e Cancelada?** Não aplicável: nenhum setor tem competência. Cancelada: o pedido não deve ser atendido (duplicado, desistência…). Os dois exigem justificativa e são finais (RN19, RN20).
6. **Dá para cancelar uma demanda em andamento?** Pela regra (seção 4), sim, e o domínio permite. Pela tela, por enquanto só em triagem (decisão de 04/10).
7. **O que impede alguém de triar pelo DevTools?** A regra roda de novo no storage, com a demanda lida na hora de gravar; para quem não é gerência a resposta é "sem permissão". Há teste para isso.
8. **Depois de cancelada, dá para desfazer?** Não. Estado final não muda (RN20), nem pela gerência. Há teste para isso.
