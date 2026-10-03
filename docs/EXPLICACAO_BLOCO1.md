# Explicação do Bloco 1 — Fundação (para estudar antes da apresentação)

> Leia, rode o app (`npm run dev`) e os testes (`npm test`) e tente explicar cada parte sem consultar.

## 1. A ideia em uma frase
O Bloco 1 cria o **"motor"** do sistema: onde os dados ficam guardados, quais são as regras (quem pode o quê, prazos, status) e quem está logado. As telas antigas ainda não usam esse motor; isso é o Bloco 2.

## 2. Como os dados fluem
```
Tela (React)  →  hook (useDemandas / useSessao)  →  serviço (storage.js / auth.js)  →  localStorage / sessionStorage
                                     ↑
                       regras puras (src/domain/) — a tela pergunta "posso?"
```
- **Tela** só mostra e reage a cliques.
- **Hook** guarda os dados como estado do React (quando muda, a tela redesenha).
- **Serviço** é o único que fala com o armazenamento do navegador.
- **Regras** (`domain/`) não sabem nada de React nem de armazenamento: recebem dados e respondem sim/não. Por isso dá para testar sem abrir o navegador.

## 3. Arquivo por arquivo

### Regras (`src/domain/`)
| Arquivo | O que faz | Por que existe |
|---|---|---|
| `status.js` | Lista os 7 status e diz, para cada um, para onde cada papel pode levar a demanda. `estaFinal` diz se é Concluída/Não aplicável/Cancelada. | Antes cada tela tinha seu próprio dropdown de status (Pendente/Em andamento/Concluído). Agora existe **um** lugar com a máquina de estados (`FLUXOS.md`). |
| `prioridades.js` | Os 4 níveis, o prazo de cada um em horas e a ordenação "prioridade → mais recente → título". | A Ata 15/09 definiu a ordem; o Git só tinha 3 níveis. |
| `prazos.js` | Calcula prazo de aceite (72 h), prazo de resolução e os selos "a expirar", "vencida", "aceite atrasado", "aguardando há mais de 7 dias". | Todas recebem o **agora** como parâmetro: o teste usa uma data fixa e sempre dá o mesmo resultado. |
| `permissoes.js` | `podeVer`, `podeVerDetalhes`, `resumoParaSolicitante`, `podeAceitar`, `podeDefinirPrioridade`, `podeRecusar`, `podeRedirecionar`, `podeCancelar`, `podeRegistrarPrazo`, `podeCobrar`. | É a matriz de permissões (seção 3 dos requisitos) em código. A tela nunca decide sozinha. |

**Trecho-chave — papel do usuário na demanda:**
```js
export function papelNaDemanda(usuario, demanda) {
  if (ehGerencia(usuario)) return 'gerenciamento'
  if (ehExecutor(usuario, demanda)) return 'executor'      // destino = meu setor
  if (ehSolicitante(usuario, demanda)) return 'solicitante' // origem = meu setor
  return null                                               // não tenho nada a ver → não vejo
}
```
Tudo parte daqui: quem é `null` não vê; quem é `solicitante` vê só o resumo; quem é `executor` ou `gerenciamento` vê tudo e age conforme `status.js`.

**Trecho-chave — resumo para quem abriu (lista branca):**
`resumoParaSolicitante` monta um objeto novo **escolhendo campo por campo** (id, título, descrição, tipo, status, setor atual…). Se amanhã a demanda ganhar um campo interno novo, ele **não vaza**, porque não está na lista.

### Dados e serviços (`src/data/`, `src/services/`)
| Arquivo | O que faz |
|---|---|
| `usuarios.json` | Os 5 logins de teste (`admin`, `user01`–`user04`; senha = usuário). |
| `departamentos.json` | Ganhou `tiposAtendimento`: cada setor tem seus tipos (o Bloco 2 usa no formulário). |
| `seed-demandas.json` | 12 demandas de exemplo. As datas são **"há X horas"**, não datas fixas. |
| `seed.js` | Converte "há X horas" em data real no momento em que a semente é carregada. Assim, na terça, ainda existem demandas a expirar e vencidas. |
| `storage.js` | Único ponto que lê/grava no `localStorage`. |
| `auth.js` | Login, sair e "quem está logado", no `sessionStorage`. |

**Como o `storage.js` funciona:**
1. **Primeira carga** = `getItem(chave) === null` → grava a semente. Se a lista existir e estiver vazia, **não** recria a semente (senão demanda apagada "ressuscitaria").
2. **Chave versionada** (`demanda-de-aco:v1:demandas`): se o formato mudar, vira `v2` e os dados velhos não quebram o app.
3. **Resultado explícito:** toda função devolve `{ ok: true, dados }` ou `{ ok: false, erro }`. A tela sabe exatamente se deu certo.
4. **Corrompido:** se o JSON salvo estiver quebrado, devolve erro e **não apaga**; o usuário decide clicando "Resetar dados" (na tela de login).
5. **Gravações** esperam 250 ms (para dar tempo de mostrar "carregando") e, com `?falha=1` no endereço, falham de propósito (para demonstrar o estado de erro). Ex.: `http://localhost:5173/?falha=1#login`.
6. **IDs** vêm de um contador salvo: sempre maior que o maior ID existente (DM-2013, DM-2014…). Nunca `Date.now()`.
7. **Backend injetável:** `criarStorage({ backend })` recebe o armazenamento por parâmetro. No app é o `localStorage`; nos testes é um objeto falso. Por isso os testes rodam sem navegador.

### Hooks (`src/hooks/`)
- `useSessao`: guarda o usuário logado. Lê a sessão **no estado inicial** (`useState(() => ...)`), sem `useEffect`, então a tela já nasce sabendo se há login.
- `useDemandas`: carrega a lista do storage do mesmo jeito; tem `recarregar` e `resetar`.

### Telas
- `Login.jsx` (nova): rótulo em cada campo, erro escrito **junto ao campo** (`aria-describedby`), `aria-invalid`, **foco vai para o primeiro campo com erro**. Para usuário ou senha errados aparece a **mesma mensagem**, sem dizer qual dos dois errou. Tem o botão "Resetar dados".
- `App.jsx`: **guarda de rotas.** Sem usuário → mostra o Login. Com usuário em `#login` → vai para a Visão Geral.
- `Sidebar.jsx`: mostra nome e setor do usuário logado; o botão Sair agora funciona.

**Trecho-chave — por que o Voltar não reabre a tela depois de Sair:**
```js
if (!usuario && activePage !== 'login') window.location.replace('#login')
```
`location.replace` **troca** o endereço atual em vez de criar um novo no histórico. E, mesmo que o Voltar leve a `#demandas`, sem usuário o App só desenha o Login.

## 4. Testes (`npm test`)
61 testes em 5 arquivos. Incluem **casos negativos**, que são os que provam a regra:
- `user01` (TI) **não** vê demanda entre Hidráulica e Elétrica.
- Gerência **não** aceita nem define prioridade.
- Depois do aceite, **nem o executor** muda a prioridade.
- Demanda final: **nenhuma** ação para **ninguém**.
- Quem abriu **não** recebe histórico, prazo nem prioridade no resumo.
- Storage: JSON corrompido não é apagado; cota cheia não finge que salvou; falha simulada não grava.

## 5. O que este bloco NÃO faz (de propósito)
- As telas Demandas, Detalhes, Atualizar, Departamentos e Visão Geral **ainda usam os JSONs antigos** → Bloco 2.
- Os botões de aceitar, recusar, redirecionar etc. ainda não existem na tela → Bloco 4 (as regras já estão prontas e testadas).
- Login é **simulação**: senha no JSON e sessão editável no DevTools. Não é segurança (limitação documentada).

## 6. Perguntas que o professor pode fazer
1. **Por que o JSON não é atualizado quando crio uma demanda?** O navegador não consegue escrever em arquivo do projeto. O JSON é só a semente; depois tudo é lido e gravado no `localStorage`.
2. **Como vocês sabem que é a primeira vez?** Quando `getItem` devolve `null` (a chave não existe). Lista vazia não conta como primeira vez.
3. **Por que as regras ficam fora do React?** Para serem testadas sem tela e para nenhuma tela decidir sozinha. Esconder um botão não é regra; a função é.
4. **O que acontece se os dados salvos estragarem?** O storage devolve erro "corrompido", não apaga nada sozinho e a tela de login oferece "Resetar dados".
5. **Por que as funções de prazo recebem o "agora"?** Para o teste usar uma data fixa; senão o resultado mudaria a cada dia.
6. **Por que a mensagem de login não diz se o errado foi o usuário ou a senha?** Para não ajudar alguém a descobrir quais usuários existem.
7. **Como o botão Voltar não reabre a tela depois de Sair?** O App só desenha telas com usuário logado, e o `location.replace` não deixa a tela anterior no histórico.
8. **Isso é seguro?** Não. É simulação para a demonstração: dá para editar a sessão no DevTools. Com back-end, a autenticação e a permissão iriam para o servidor.
