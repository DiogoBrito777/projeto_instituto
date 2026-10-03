# Convenções de commit, comentário e registro de mudanças

## Commits
`tipo(escopo): resumo no imperativo (RF/RN/CA)` — até ~70 caracteres. Corpo opcional: **por que** mudou e o que foi verificado.

```
feat(dados): cria camada de armazenamento com localStorage (RF03, RNF03)

JSON passa a ser só semente; leitura e escrita usam o storage versionado.
Verificado: npm test, npm run build. Teste manual: criar demanda e recarregar — não executado.
```

## Comentários no código
Bom — explica regra ou decisão:
```js
// Gerenciamento não define prioridade: quem executa a demanda é quem a prioriza (Ata 08/09, RN04).
```
Ruim — repete o código ou é ruído:
```js
// incrementa o contador
// FUNCIONA!!! não mexer
```
Regras:
- Cabeçalho curto em módulos de domínio/serviço: o que faz e quais requisitos atende.
- Comente o **porquê**, cite RF/RN/CA quando houver.
- Sem código comentado, sem "TODO" sem dono (use `TODO(nome): ...`).

## CHANGELOG (`docs/CHANGELOG.md`)
Uma entrada por etapa/PR:
```
### 2026-10-04 · Bloco 1 · feat/fundacao
- Arquivos: src/services/storage.js, src/domain/permissoes.js, ...
- O quê: camada de dados com seed versionado e falha simulável.
- Por quê: Detalhe e Lista dependiam de dados fixos (D05).
- Atende: RF03, RNF03, RN02.
- Verificação: lint/build/test OK; teste manual — não executado.
```

## Explicação para estudo (`docs/EXPLICACAO_BLOCO<N>.md`)
Ao fim de cada bloco, o agente escreve um guia para quem vai apresentar: o que cada arquivo faz, como os dados fluem (tela → hook → storage → localStorage), trechos-chave em linguagem simples e 8 perguntas prováveis do professor com resposta curta. Quem apresenta lê, executa o app e tenta explicar sem consultar.
