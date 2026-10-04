# 05 — Visão Geral e a técnica do filtro "card → Demandas"

## (a) O que faz
É o painel inicial: números calculados por perfil, o aviso "Precisa de atenção", abas rápidas e a lista de demandas. Clicar num card de número abre a tela Demandas **já filtrada**, e a quantidade da lista bate com o número do card.

## (b) Onde está no código
| Arquivo | Função / parte |
|---|---|
| `src/pages/VisaoGeral.jsx` | a tela; monta `indicadores`, `aviso` e a lista |
| `src/components/VisaoGeralStatsCards.jsx` | os cards; card com `href` vira link `<a>` com "Ver na lista" |
| `src/components/VisaoGeralFilterTabs.jsx` | abas Todas / Pendentes / Alta prioridade / Em triagem / Concluídas |
| `src/domain/listas.js` | `indicadoresVisaoGeral`, `FILTROS_DO_PAINEL`, `filtroDoPainel`, `filtrarPorPainel`, `linkDoIndicador`, `linkDaLista`, `statusDoSlug`, `avisoDeAtencao`, `filtrarVisaoGeral`, `combinaComBusca`, `paginarComPendentes` |
| `src/App.jsx` | `parametrosDaRota`, `statusDaRota`, `filtroDaRota`, `abaDaRota`, `setorDaRota` |
| `src/pages/Demandas.jsx` | recebe `statusInicial`, `filtroInicial`, `abaInicial`; mostra o aviso "Filtro da Visão Geral" com "Limpar filtro" |

## (c) Como funciona a técnica do filtro (passo a passo)
1. **O card sabe qual é o seu filtro.**
   - Em `indicadoresVisaoGeral`, cada card tem um `status` (Pendentes de aceite, Em triagem, Concluídas) ou um `filtro` (Abertas, A expirar, Vencidas, Aguardando > 7 dias, Recebidas abertas, Solicitadas por mim em aberto).
   - O número é calculado com o **mesmo teste** que depois filtra a lista. Esses testes ficam em `FILTROS_DO_PAINEL`.
2. **O card vira um link.** `linkDoIndicador` monta o endereço:
   - por status: `#demandas?status=em-triagem`;
   - por filtro: `#demandas?filtro=vencidas`;
   - "Solicitadas por mim": `#demandas?filtro=solicitadas-abertas&aba=solicitadas`;
   - gerência com setor escolhido: `#demandas/eletrica?filtro=…`.
3. **O endereço leva os parâmetros.** Como o app usa rotas por hash (`#`), os parâmetros vão **depois do `?`, dentro do próprio hash**.
4. **`App.jsx` lê o endereço.** `parametrosDaRota` separa o que vem depois do `?`; `statusDaRota`, `filtroDaRota` e `abaDaRota` validam o valor. Um filtro desconhecido vira "sem filtro" (`filtroDoPainel`). Os valores vão como propriedades para `Demandas`.
5. **`Demandas.jsx` aplica.** A lista passa por `demandasDaAba` (permissão), depois por `filtrarPorPainel` e `filtrarPorStatus`, depois pela busca e pela ordenação, e por fim é paginada (`paginarComPendentes`).
6. **Mostra e deixa limpar.** Aparece "Filtro da Visão Geral: Vencidas" com o botão **"Limpar filtro"**.
7. **Foco:** a cada troca de endereço, `App.jsx` leva o foco ao título da tela (bom para teclado e leitor de tela).

## (c2) O aviso "Precisa de atenção"
- Aparece no topo só se houver demanda parada esperando alguém: "N aguardando triagem" e "N pendentes de aceite", cada um com link.
- A gerência vê tudo; um setor vê só as pendentes que recebeu; quem só abriu não vê o aviso (`avisoDeAtencao`).
- Detalhes em `docs/DOCUMENTACAO.md`, seção 22.

## (d) Demonstração em 1 minuto
1. `admin` → Visão Geral → leia o aviso "Precisa de atenção".
2. Clique em "Vencidas" (logo depois do reset mostra 2; o número muda com as horas) → Demandas abre com "Filtro da Visão Geral: Vencidas" e "Exibindo N de N", com o mesmo número do card.
3. Clique em "Limpar filtro" → volta a lista toda.
4. Mostre o endereço no navegador: `#demandas?filtro=vencidas`.

## (e) Perguntas prováveis
- **Como o filtro vem de outra tela?** Pelo endereço: o card é um link `#demandas?filtro=…`; o `App.jsx` lê e passa para a tela Demandas.
- **Como garantem que o número do card bate com a lista?** O mesmo teste conta e filtra (`FILTROS_DO_PAINEL`); há testes automáticos para cada card.
- **Por que no hash e não em `?` normal?** O app é de uma página só e troca de tela pelo hash; tudo o que muda a tela fica no hash.
- **O filtro pode mostrar demanda de outro setor?** Não: ele roda depois do filtro de permissão. Há teste: "o filtro nunca ultrapassa a permissão".

## (f) O que não está pronto / limitações
- **A17:** o filtro do card continua quando se troca de aba em Demandas.
- Depois de "Limpar filtro", o `?filtro=` continua no endereço.
- Os números mudam com o relógio (prazos), por isso é preciso Resetar antes de demonstrar.
