# Explicação do Bloco 2A — Telas ligadas aos dados (para estudar)

> Pré-requisito: `docs/EXPLICACAO_BLOCO1.md`. Rode `npm run dev`, entre com `user01` e depois com `admin`, e compare as telas.

## 1. A ideia em uma frase
As 5 telas que os colegas fizeram (Demandas, Detalhes, Atualizar, Departamentos e Visão Geral) **mantêm o visual**, mas agora leem as demandas da base criada no Bloco 1 e mostram a cada usuário só o que ele pode ver.

## 2. O caminho de um clique
```
Usuário abre #demanda/DM-2004
  → App.jsx lê o endereço: página = detalhes, id = "DM-2004"
  → DetalhesDemanda recebe { id, usuario }
  → useDemandas() lê a base (mostra "Carregando demandas…" por um instante)
  → permissoes.js responde: podeVer? podeVerDetalhes?
  → a tela desenha: completa, resumo ou "Demanda não encontrada ou sem permissão."
```

## 3. Arquivos novos
| Arquivo | O que faz | Por que existe |
|---|---|---|
| `domain/listas.js` | Abas (Recebidas/Solicitadas), filtro por setor, "Pendentes de aceite", ordenação, filtros e números da Visão Geral. | Os filtros são **regras** ("TI não vê demanda dos outros"). Por isso ficam fora da tela e têm testes. |
| `domain/acoes.js` | `podeEditar`, `statusParaEdicao` e `salvarAtualizacao`: valida a mudança e devolve a demanda nova com o item de histórico. | A tela Atualizar não decide nada sozinha. A mesma função roda de novo **na hora de gravar**. |
| `domain/setores.js` | Nome, sigla e tipos de atendimento de cada setor. | Antes os nomes eram texto solto ("Infraestrutura e Serviços"). |
| `components/EstadoDados.jsx` | Telinhas de "carregando", "erro com Resetar dados" e "sem permissão". | O enunciado exige esses estados, e as 5 telas usam os mesmos. |
| `mensagens.js` | Textos das telas, copiados do catálogo `MENSAGENS_VALIDACAO.md`. | Para ninguém inventar mensagem diferente em cada tela. |
| `formatos.js` | Formata data e calcula as iniciais do avatar. | Usado em várias telas. |

## 4. Tela por tela
- **Demandas.**
  - Cada card vira link para o detalhe. Antes só a DM-2048 abria.
  - As abas são botões com `aria-pressed`, que diz ao leitor de tela qual está ativa.
  - O filtro de departamento fica **desativado** para quem é setor: ele só pode ver o próprio.
  - As "Pendentes de aceite" aparecem numa seção separada no topo.
  - Na aba Solicitadas, o card **não mostra a prioridade** e troca "Pendente de aceite" por "Não aceita pelo setor" (RN03 e RN12).
- **Detalhes.**
  - Lê o id da URL. Se a demanda não existe **ou** a pessoa não pode vê-la, a mensagem é a mesma (RN04). Assim ninguém descobre que a demanda existe.
  - Quem só abriu a demanda vê o **resumo**: sem histórico, prazo ou prioridade.
  - O histórico vem da própria demanda, com o item mais novo em cima.
- **Atualizar.**
  - Só o setor executor entra, com a demanda Em andamento ou Aguardando.
  - Dá para mudar o status (Em andamento ↔ Aguardando, ou Concluída) e o tipo de atendimento.
  - Setor, origem e responsável aparecem como **listas travadas**: só a gerência redireciona (RN18). Prioridade e prazo também ficam travados.
  - Ao salvar, o botão vira "Salvando…". Se der erro (por exemplo com `?falha=1`), a mensagem aparece e o que foi preenchido continua no formulário.
- **Departamentos.**
  - O número "demandas abertas" é **calculado**; antes era digitado no JSON.
  - "Acessar setor" abre `#demandas/<setor>`.
  - Um setor vê só o próprio card, porque os setores são independentes.
- **Visão Geral.**
  - Os números são calculados por perfil: 5 cards para setor e 7 para a gerência.
  - A aba "Alta prioridade" filtra pela **prioridade** (Alta ou Urgente). Antes "alta-prioridade" era tratado como um status, o que estava errado.
  - O `VisaoGeral.json` não é mais lido.

## 5. Trechos-chave
**O endereço inteiro no estado (`App.jsx`)**
```js
const [hash, setHash] = useState(() => window.location.hash)
```
Antes o estado guardava só o "nome da página". Indo de DM-2001 para DM-2002, a página continuava "detalhes" e nada mudava na tela. Guardando o endereço inteiro, mudar o id também redesenha.

**Validar duas vezes ao salvar (`AtualizarDemanda.jsx`)**
```js
obterStorage().atualizarDemanda(demand.id, (atual) => salvarAtualizacao(atual, form, usuario, contexto))
```
O storage lê a demanda **atual**, passa para a regra e só grava se a regra aprovar. Se outra aba já tiver concluído a demanda, a regra recusa e nada é gravado.

**"Carregando" sem `setState` direto no `useEffect` (`useDemandas.js`)**
```js
obterStorage().lerDemandas().then((resultado) => { if (ativo) setCarga(resultado) })
```
O estado só muda quando a leitura termina. A variável `ativo` impede atualizar uma tela que já foi fechada.

## 6. Decisões registradas
- A leitura também espera 150 ms, só para o "Carregando demandas…" aparecer na demonstração. É um desvio do kit, aprovado e anotado no CHANGELOG.
- "Atribuir responsável" saiu por enquanto: gravava sem regra. Volta no Bloco 4 como "Redirecionar", só da gerência e com justificativa.
- `demandas.json` e `VisaoGeral.json` ficaram sem uso. O grupo decide se apaga.

## 7. Perguntas que o professor pode fazer
1. **Como a tela sabe qual demanda mostrar?** O `App.jsx` tira o id do endereço (`#demanda/DM-2004`) e passa para a tela como propriedade.
2. **Por que a demanda inexistente e a demanda sem permissão dão a mesma mensagem?** Para não revelar que a demanda existe. É a regra RN04.
3. **O que quem abriu a demanda vê?** Só o resumo: número, título, o que enviou, data, status e setor atual. Histórico, prazo e prioridade são internos do setor executor e da gerência (RN02 e RN03).
4. **Onde está a regra de quem pode alterar o status?** Em `acoes.js` e `status.js`, que são funções puras com teste. A tela só mostra as opções que a regra devolve.
5. **Por que o setor não escolhe outro departamento no filtro?** Os departamentos são independentes. A regra `demandasDaAba` ignora o filtro para setor, e um teste prova isso.
6. **Os números da Visão Geral vêm de onde?** São contados na hora, com `indicadoresVisaoGeral`, a partir das demandas que o usuário pode ver. Nada é digitado.
7. **Como vocês mostram o estado de erro?** Com `?falha=1` no endereço, a gravação falha de propósito e a mensagem aparece com o formulário preservado. Se os dados estiverem corrompidos, aparece o botão "Resetar dados".
8. **Por que o "Atribuir responsável" sumiu?** Ele trocava o setor sem nenhuma regra e gravava direto no navegador. Pela regra RN18, só a gerência redireciona, em triagem e com justificativa. Isso volta no Bloco 4.
