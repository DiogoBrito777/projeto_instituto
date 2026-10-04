# 04 — Tela Demandas (lista)

## (a) O que faz
Mostra as demandas que o perfil pode ver, separadas em abas, com busca, filtros, ordenação e paginação. Cada card abre os Detalhes da demanda.

## (b) Onde está no código
| Arquivo | Função / parte |
|---|---|
| `src/pages/Demandas.jsx` | a tela (`Demandas`, `DemandCard`), `ITEMS_PER_PAGE = 6` |
| `src/domain/listas.js` | `abasDoPerfil`, `demandasDaAba`, `filtrarPorStatus`, `filtrarPorPainel`, `combinaComBusca`, `ordenarDemandas`, `ordenarPorAtencao`, `separarPendentes`, `paginarComPendentes` |
| `src/domain/permissoes.js` | `podeVer`, `podeVerDetalhes`, `resumoParaSolicitante` |
| `src/domain/atencao.js` | `seloDeAtencao` (os selos "Aguardando aceite há X" etc.) |

## (c) Como funciona
1. **Abas:** setor vê "Recebidas" e "Solicitadas"; gerência vê "Todas" e "Solicitadas por mim" (`abasDoPerfil`).
2. **Permissão primeiro:** `demandasDaAba` só deixa passar o que `podeVer` permite. Todos os outros filtros trabalham **em cima** disso, então nunca mostram demanda de outro setor.
3. **Filtros:** Departamento (só a gerência escolhe; para um setor fica travado), Status (`filtrarPorStatus`) e, se veio de um card da Visão Geral, o filtro do painel (`filtrarPorPainel`, ver o arquivo 05).
4. **Busca:** `combinaComBusca` procura em ID, título, descrição, tipo, solicitante e setor de origem, sem diferença de acento ou maiúscula. É a mesma busca da Visão Geral.
5. **Ordenação:** o padrão é "Atenção primeiro" (`ordenarPorAtencao`): em triagem e pendentes de aceite vêm primeiro, a mais antiga antes; depois, prioridade e data. Se a pessoa escolher outro "Ordenar por", vale a escolha dela (`ordenarDemandas`).
6. **Paginação:** 6 por página. `paginarComPendentes` pagina a lista inteira com o grupo "Pendentes de aceite" primeiro; nada se repete entre as páginas.
7. **Quem só abriu** a demanda vê o resumo: sem prioridade, com "Setor atual" (`resumoParaSolicitante`, RN03).

## (d) Demonstração em 1 minuto
1. `admin` → Demandas: "Pendentes de aceite (2)" no topo; o selo "Atrasada para aceite" na DM-2002.
2. Status "Em triagem" + busca "infiltração" → só a DM-2013.
3. "Ordenar por: Mais recentes" → a ordem muda.
4. Vá até a página 2 → o grupo de pendentes não se repete.

## (e) Perguntas prováveis
- **Como garantem que um setor não vê o que é de outro?** Toda lista passa primeiro por `podeVer` (`demandasDaAba`), e há testes para isso (`listas.test.js`, `permissoes.test.js`).
- **Por que triagem e pendentes vêm primeiro?** Estão paradas, esperando alguém agir (proposta 13 da ata de 03/10).
- **A busca mostra campos escondidos?** Não: só campos que quem abriu também vê. Há teste: "não procura em campos internos".
- **O grupo "Pendentes de aceite" se repetia?** Sim, antes do PR #9; agora a lista inteira é paginada.

## (f) O que não está pronto / limitações
- **A17:** vindo do card "Recebidas abertas" e trocando para a aba Solicitadas, o filtro do card continua ativo (`trocarAba` não limpa `filtroPainel`). Dá para clicar em "Limpar filtro".
- **A14:** a barra de busca tem no máximo 430 px (`.search-field` em `src/App.css`).
- Depois de "Limpar filtro", o `?filtro=` continua no endereço.
