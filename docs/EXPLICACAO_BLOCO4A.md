# Explicação do Bloco 4 — Parte A: aceite e recusa (para estudar)

> Rode `npm run dev`, entre com `user01` e abra a DM-2001 (Hidráulica → TI, Pendente de aceite). Para voltar ao início, use "Resetar dados" na tela de login.

## 1. A ideia em uma frase
Quando uma demanda chega ao setor, ela fica **Pendente de aceite**. O setor executor **aceita** escolhendo a prioridade, que fica travada e define o prazo, ou **recusa** explicando o motivo, e a demanda vai para a triagem da gerência.

## 2. O caminho
```
Detalhes → "Aceitar ou recusar" (só o executor, só com a demanda pendente)
  → tela Atualizar em "modo aceite"
      Aceitar: escolhe a prioridade → pop-up "Você vai aceitar com prioridade X. O prazo será de Y…"
               → Confirmar → aceitarDemanda() → Em andamento, prioridade travada, prazo calculado
      Recusar: pop-up com "Motivo da recusa" → Confirmar → recusarDemanda() → Em triagem
  → aceite: volta para Detalhes · recusa: volta para a lista de Demandas (o setor perdeu o acesso)
    (nos dois casos, o foco vai para o título)
```

## 3. As regras (em `src/domain/acoes.js`)
- **Quem pode:** só o **setor executor** (o destino) e só com a demanda **Pendente de aceite** (matriz, seção 3; transições, seção 4). Demanda final não muda (RN20).
- **`aceitarDemanda`:**
  - Exige uma das 4 prioridades (RN10).
  - Grava: status **Em andamento**, a prioridade, `aceitaEm` (agora) e `prazo` = aceite + 24 h, 48 h, 72 h ou 7 dias (RN13).
  - Acrescenta ao histórico "Demanda aceita com prioridade X." (RN22).
- **`recusarDemanda`:**
  - Exige um motivo de até 500 caracteres (RN11).
  - Grava: status **Em triagem**. O destino **não muda**: fica para auditoria e para a gerência redirecionar depois (RN18).
  - Acrescenta ao histórico "Recusada: <motivo>".
- **Em triagem, a demanda pertence à gerência** (`permissoes.js` → `setorResponsavel`):
  - o setor que recusou **perde o acesso**: a demanda some de Recebidas, dos contadores, do card de Departamentos e do detalhe (pela URL também);
  - a gerência a vê em "Todas" e no contador "Em triagem";
  - basta uma função para isso: `ehExecutor` pergunta "este setor é o responsável agora?", e em triagem o responsável é a gerência.
- **Prioridade travada:** depois do aceite a demanda não está mais pendente, então `podeDefinirPrioridade` responde "não" (CA-R03). Um teste prova isso.
- **Quem abriu a demanda** passa a ver "Setor atual: Gerenciamento" e **não** vê o motivo, porque o resumo não inclui o histórico (RN03).

## 4. Trechos-chave
```js
function conferirPendenteDoExecutor(demanda, usuario) {
  if (estaFinal(demanda.status)) return { ok: false, erro: ERROS_ACAO.FINALIZADA }
  if (!ehExecutor(usuario, demanda)) return { ok: false, erro: ERROS_ACAO.SEM_PERMISSAO }
  if (demanda.status !== STATUS.PENDENTE_ACEITE) return { ok: false, erro: ERROS_ACAO.TRANSICAO_INVALIDA }
  return { ok: true }
}
```
As duas ações começam pelas mesmas três perguntas: está finalizada? É o executor? Está pendente? Se alguma resposta for ruim, nada acontece.

```js
const resultado = await obterStorage().atualizarDemanda(demand.id, (atual) =>
  aceitarDemanda(atual, prioridade, usuario, contextoDaAcao()))
```
A regra roda de novo **na hora de gravar**, com a demanda lida naquele momento. Se outra aba já tiver aceitado, a regra recusa.

## 5. Acessibilidade dos pop-ups (componente `Dialogo`)
- Ao abrir, o foco entra no pop-up: em "Confirmar aceite", ou no campo do motivo na recusa.
- Tab e Shift+Tab ficam presos dentro do pop-up. Esc fecha, e o foco volta ao botão que abriu.
- `role="dialog"`, `aria-modal`, título (`aria-labelledby`) e explicação (`aria-describedby`).
- **Erros:** "Escolha a prioridade…" e "Explique por que…" ficam ligados ao campo (`aria-describedby`), o campo fica `aria-invalid` e recebe o foco.
- O `Dialogo` ganhou a prop `descricao`. Antes todo o conteúdo ia dentro de um `<p>`, e um `<p>` não pode conter um campo de formulário.

## 6. Decisões (a registrar em ata)
- **Em triagem, a demanda pertence à gerência**: o setor que recusou perde o acesso até a gerência redirecionar; o `destino` fica gravado para auditoria (proposta 12 do rascunho de ata de 03/10).
- "Devolver à triagem" de uma demanda já Em andamento ou Aguardando fica para a parte B.
- Motivo de até 500 caracteres. O pop-up do aceite mostra a duração do prazo, sem a data.

## 7. Perguntas que o professor pode fazer
1. **Por que a prioridade é escolhida só no aceite?** Quem executa conhece a urgência real; quem abre não escolhe (RN08), e a gerência também não (RN05). Depois do aceite ela fica travada, para ninguém mudar o prazo à vontade (RN10).
2. **Como o prazo é calculado?** A partir da hora do aceite: Urgente 24 h, Alta 48 h, Média 72 h, Baixa 7 dias (RN13). O valor fica gravado na demanda.
3. **O que acontece se o setor clicar em "Aceitar" sem prioridade?** O pop-up não abre; aparece "Escolha a prioridade para aceitar a demanda." junto ao campo, e o foco vai para ele (CA-R03).
4. **E se recusar sem motivo?** O botão de confirmar não grava: a mensagem aparece junto ao campo e o foco volta para ele (CA-R04). A regra também recusa, então nem pelo DevTools passa.
5. **Para onde vai a demanda recusada?** Para Em triagem, e passa a ser da gerência, que vai redirecionar ou marcar "Não aplicável" (parte B). O setor que recusou deixa de vê-la; quem abriu vê "Setor atual: Gerenciamento". O destino continua gravado, para auditoria.
6. **A gerência pode aceitar no lugar do setor?** Não. A função `aceitarDemanda` responde "sem permissão" para a gerência, e um teste prova isso.
7. **Por que o pop-up devolve o foco ao botão?** Quem usa teclado ou leitor de tela precisa continuar de onde estava; sem isso, o foco iria para o início da página (WCAG 2.4.3).
8. **Por que a regra roda duas vezes (tela e storage)?** A tela dá retorno rápido ao usuário; a regra no storage garante que nada inválido seja gravado, mesmo se a tela estiver desatualizada.
