# Explicação do Bloco 2B — Nova Demanda (para estudar)

> Pré-requisitos: `EXPLICACAO_BLOCO1.md` e `EXPLICACAO_BLOCO2A.md`. Rode `npm run dev`, entre com `user01` e abra "Nova demanda".

## 1. A ideia em uma frase
O formulário que antes só mostrava "Cadastro simulado" agora **cria a demanda de verdade**. O próprio sistema preenche a origem e a data, o tipo de atendimento depende do destino, quem abre não escolhe prioridade, e cada erro aparece junto do campo.

## 2. O caminho do envio
```
Clique em "Criar Nova Demanda"
  → validarNovaDemanda(campos, usuario)        (domain/novaDemanda.js)
      tem erro? → mostra os erros e põe o foco no primeiro campo errado. FIM
  → botão vira "Enviando…" (desativado)
  → montarNovaDemanda(...)                      monta a demanda: origem, status, prioridade, histórico
  → storage.criarDemanda(...)                   espera 250 ms, dá o número (DM-2013…) e grava
      deu erro? → mensagem de erro; o formulário continua preenchido. FIM
  → formulário limpo + pop-up "Demanda DM-XXXX enviada com sucesso."
```

## 3. Arquivos
| Arquivo | O que faz |
|---|---|
| `domain/novaDemanda.js` | `origemDoUsuario`, `validarNovaDemanda`, `primeiroCampoComErro` e `montarNovaDemanda`. Só regras, sem React. |
| `components/Dialogo.jsx` | Pop-up acessível, com o visual do diálogo que os colegas fizeram. O Bloco 4 reaproveita. |
| `pages/NovaDemanda.jsx` | A tela: mantém a mesma grade e as mesmas classes, só liga os campos às regras. |
| `mensagens.js` | Instruções e textos de erro do catálogo `MENSAGENS_VALIDACAO.md`. |

## 4. Campo por campo
- **Origem.** É travada e mostra o setor do usuário, ou "Gerenciamento" para o admin. A regra `montarNovaDemanda` **ignora** qualquer origem enviada, então nem alterando a tela pelo DevTools dá para trocar.
- **Destino.** É uma lista que não inclui o próprio setor. Mesmo assim, a regra recusa destino igual à origem (CA-R11), porque esconder a opção na tela não basta.
- **Tipo de atendimento.** Fica desativado até escolher o destino. As opções vêm do `tiposAtendimento` do setor de destino. Trocar o destino limpa o tipo, porque os tipos de um setor não valem para outro.
- **Título e descrição.**
  - Os limites são 60 e 500 caracteres, com contador.
  - O campo é **travado** com `maxLength`: não dá para digitar além do limite. Na primeira versão não havia trava, e o teste manual mostrou "2400/60".
  - O navegador corta um texto colado sem avisar ninguém. Por isso, ao colar, guardamos quantos caracteres a pessoa **tentou** pôr (`useAvisoLimite`). Se passou do limite, aparece "Limite de N caracteres atingido. O texto foi cortado.". Se só chegou ao limite digitando, aparece "Limite de N caracteres atingido.".
  - O aviso fica numa área `role="status"`, que o leitor de tela anuncia sozinho.
  - A regra `validarNovaDemanda` continua conferindo os limites, como segurança.
- **Prioridade.** Não existe no formulário (RN08). A demanda nasce "Não definida" e "Pendente de aceite". Quem define a prioridade é o setor de destino, ao aceitar (Bloco 4).

## 5. Acessibilidade aplicada
- Cada campo tem `<label>` e uma instrução **sempre visível**.
- Quando há erro, o campo ganha `aria-invalid="true"` e a mensagem fica ligada a ele por `aria-describedby`. O leitor de tela lê o rótulo, a instrução, o contador e o erro juntos.
- Ao enviar com erro, o foco vai para o **primeiro** campo errado, na ordem da tela.
- **O pop-up:**
  - abre com o foco em "Ver demanda";
  - Tab e Shift+Tab não saem dele;
  - Esc, o × e o clique fora fecham;
  - ao fechar, o foco volta para o botão de envio.
- "Enviando…" e "Demanda DM-XXXX enviada com sucesso." ficam numa área `role="status"`, que o leitor de tela anuncia. O erro de envio usa `role="alert"`.

## 6. Trechos-chave
**Trocar o destino limpa o tipo**
```js
...(name === 'destino' ? { tipo: '' } : {}),
```
Se o destino mudou, o tipo escolhido antes deixa de valer. Por isso ele volta a vazio.

**Prioridade e origem nunca vêm do formulário**
```js
origem: origemDoUsuario(usuario),
prioridade: NAO_DEFINIDA,
```
`montarNovaDemanda` copia **só** os campos permitidos. Um teste prova que, mesmo recebendo `prioridade: 'Urgente'`, a demanda nasce "Não definida".

**Foco preso no pop-up**
```js
if (event.shiftKey && document.activeElement === primeiro) { ultimo.focus() }
else if (!event.shiftKey && document.activeElement === ultimo) { primeiro.focus() }
```
No último elemento, Tab volta ao primeiro. No primeiro, Shift+Tab vai para o último.

## 7. O que não está aqui (2C, opcional)
Aviso online/offline, fila "Pendentes de envio" e rascunho que sobrevive a recarregar a página. Se der erro, o formulário continua preenchido, mas recarregar a página apaga o que foi digitado.

## 8. Perguntas que o professor pode fazer
1. **Por que o usuário não escolhe a origem?** A origem é o setor de quem está logado (RN07). Deixar escolher permitiria abrir uma demanda "em nome" de outro setor.
2. **Por que não tem campo de prioridade?** Quem abre não decide a urgência; quem executa decide, ao aceitar (RN08 e RN10, Ata 08/09). Se houver urgência, a pessoa escreve na descrição.
3. **Como o tipo depende do destino?** Cada setor tem a sua lista `tiposAtendimento` em `departamentos.json`. A tela mostra a lista do destino escolhido, e a regra recusa um tipo de outro setor.
4. **E se alguém mudar o HTML pelo DevTools e mandar para o próprio setor?** A regra `validarNovaDemanda` recusa (CA-R11), e `montarNovaDemanda` ignora origem e prioridade enviadas. É simulação no navegador, mas a regra não depende só da tela.
5. **Como aparece o estado de erro?** Com `?falha=1` no endereço (`http://localhost:5173/?falha=1#nova-demanda`), o envio falha de propósito: aparece a mensagem e o formulário fica preenchido.
6. **Como se evita enviar duas vezes?** Enquanto envia, o botão fica desativado e mostra "Enviando…", e a função sai logo se já estiver enviando.
7. **Como o leitor de tela sabe do erro?** O erro é ligado ao campo por `aria-describedby`, o campo fica `aria-invalid` e o foco vai para ele.
8. **De onde vem o número DM-XXXX?** Do contador salvo no storage (Bloco 1). Ele é sempre maior que o maior número existente, sem `Date.now()`.
