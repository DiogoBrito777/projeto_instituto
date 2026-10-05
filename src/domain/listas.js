// Filtros, abas, ordenação e indicadores das listas (RF-R04, RF-R06; requisitos, seções 5 e 6).
// Funções puras: recebem a lista completa e o usuário, devolvem só o que ele pode ver.

import { compararDemandas, ordemPrioridade } from './prioridades.js'
import { STATUS, estaFinal } from './status.js'
import { ehExecutor, ehGerencia, ehSolicitante, podeVer, podeVerDetalhes, setorResponsavel } from './permissoes.js'
import { aExpirar, aguardandoMuito, vencida } from './prazos.js'
import { LIMITE_ACEITE_HORAS, compararPorAtencao, marcoDeAtencao } from './atencao.js'
import { nomeDoSetor } from './setores.js'

// Selo do card "Pendentes de aceite", lido da constante (proposta de 48 h; a RN09 hoje diz 72 h).
const SELO_ACEITE = `${LIMITE_ACEITE_HORAS} h para aceitar`

export const ABAS = {
  RECEBIDAS: 'recebidas',
  SOLICITADAS: 'solicitadas',
}

// Setor: Recebidas / Solicitadas. Gerência: Todas / Solicitadas por mim (seção 6).
export function abasDoPerfil(usuario) {
  if (ehGerencia(usuario)) {
    return [
      { id: ABAS.RECEBIDAS, rotulo: 'Todas' },
      { id: ABAS.SOLICITADAS, rotulo: 'Solicitadas por mim' },
    ]
  }
  return [
    { id: ABAS.RECEBIDAS, rotulo: 'Recebidas' },
    { id: ABAS.SOLICITADAS, rotulo: 'Solicitadas' },
  ]
}

// O filtro por setor só vale para a gerência; para um setor ele fica travado no próprio setor, e as
// regras de visibilidade já garantem isso (RN02). O filtro usa o setor RESPONSÁVEL: demanda em
// triagem é da gerência e não aparece sob o setor de destino (decisão de 04/10).
export function demandasDaAba(demandas, usuario, aba, setor = null) {
  return demandas
    .filter((demanda) => podeVer(usuario, demanda))
    .filter((demanda) =>
      aba === ABAS.SOLICITADAS
        ? ehSolicitante(usuario, demanda)
        : ehGerencia(usuario) || ehExecutor(usuario, demanda),
    )
    .filter((demanda) => !ehGerencia(usuario) || !setor || setorResponsavel(demanda) === setor)
}

// "Pendentes de aceite" ficam numa seção própria, no topo (seção 5).
export function separarPendentes(demandas) {
  return {
    pendentes: demandas.filter((demanda) => demanda.status === STATUS.PENDENTE_ACEITE),
    demais: demandas.filter((demanda) => demanda.status !== STATUS.PENDENTE_ACEITE),
  }
}

// Busca única de Demandas e da Visão Geral (ajustes do teste manual, item 3): antes a Visão Geral
// não achava pelo solicitante e Demandas não achava pela descrição. Agora as duas procuram em ID,
// título, descrição, tipo, solicitante e setor de origem. Todos esses campos estão no resumo de quem
// abriu (RN03), então a busca não revela nada escondido. Ignora maiúsculas e acentos.
function semAcento(texto) {
  return (texto ?? '').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function combinaComBusca(demanda, termo) {
  const procurado = semAcento(termo).trim()
  if (!procurado) return true
  return [demanda.id, demanda.titulo, demanda.descricao, demanda.tipo, demanda.solicitante, nomeDoSetor(demanda.origem)]
    .some((campo) => semAcento(campo).includes(procurado))
}

// Paginação da lista de Demandas (ajustes do teste manual, item 2). Antes o grupo "Pendentes de
// aceite" ficava FORA da paginação e se repetia em todas as páginas (página 1: 2 + 6; página 2:
// 2 + 5, somando 15 de 13). Agora a lista inteira é paginada, com o grupo primeiro: cada demanda
// aparece em uma página só, e a página só mostra o pedaço do grupo que cai nela.
export function paginarComPendentes({ pendentes, demais }, pagina, porPagina) {
  const todas = [...pendentes, ...demais]
  const totalPaginas = Math.max(1, Math.ceil(todas.length / porPagina))
  const atual = Math.min(Math.max(1, pagina), totalPaginas)
  const inicio = (atual - 1) * porPagina
  const daPagina = todas.slice(inicio, inicio + porPagina)
  const pendentesNaPagina = Math.max(0, Math.min(pendentes.length - inicio, daPagina.length))
  return {
    pendentes: daPagina.slice(0, pendentesNaPagina),
    demais: daPagina.slice(pendentesNaPagina),
    total: todas.length,
    totalPendentes: pendentes.length,
    totalPaginas,
    pagina: atual,
  }
}

const COMPARADORES = {
  padrao: compararDemandas,
  recentes: (a, b) => new Date(b.criadaEm) - new Date(a.criadaEm),
  antigas: (a, b) => new Date(a.criadaEm) - new Date(b.criadaEm),
  'maior-prioridade': (a, b) => ordemPrioridade(a.prioridade) - ordemPrioridade(b.prioridade),
  'menor-prioridade': (a, b) => ordemPrioridade(b.prioridade) - ordemPrioridade(a.prioridade),
}

export function ordenarDemandas(demandas, criterio = 'padrao') {
  return [...demandas].sort(COMPARADORES[criterio] ?? compararDemandas)
}

// Ordem padrão das listas (Bloco 4B, "prioridade zero"): Em triagem e Pendente de aceite primeiro,
// a mais antiga antes; o resto segue o critério de antes (Demandas: prioridade e data; Visão Geral:
// recentes). Para quem só abriu, a mais antiga é pela data de criação, que ele já vê (RN03).
// Quando o usuário escolhe outro "Ordenar por", a tela usa ordenarDemandas e esta ordem não vale.
export function ordenarPorAtencao(demandas, usuario, criterioDoResto = 'padrao') {
  const resto = COMPARADORES[criterioDoResto] ?? compararDemandas
  return [...demandas].sort((a, b) => {
    const marcoVisivel = (demanda) =>
      podeVerDetalhes(usuario, demanda) ? marcoDeAtencao(demanda) : new Date(demanda.criadaEm)
    return compararPorAtencao(a, b, marcoVisivel) || resto(a, b)
  })
}

// Filtro "Status" da tela Demandas. Vazio = todos. Recebe a lista JÁ filtrada pela permissão
// (demandasDaAba), então nunca mostra nada além do que o perfil pode ver.
export function filtrarPorStatus(demandas, status) {
  if (!status) return demandas
  return demandas.filter((demanda) => demanda.status === status)
}

// Status na URL sem acento nem espaço: "#demandas?status=em-triagem" (cards e aviso da Visão Geral).
const SLUG_DO_STATUS = {
  [STATUS.PENDENTE_ACEITE]: 'pendente-de-aceite',
  [STATUS.EM_ANDAMENTO]: 'em-andamento',
  [STATUS.AGUARDANDO]: 'aguardando',
  [STATUS.EM_TRIAGEM]: 'em-triagem',
  [STATUS.CONCLUIDA]: 'concluida',
  [STATUS.NAO_APLICAVEL]: 'nao-aplicavel',
  [STATUS.CANCELADA]: 'cancelada',
}

// Endereço inválido ou desconhecido vira "todos os status", sem erro.
export function statusDoSlug(slug) {
  return Object.keys(SLUG_DO_STATUS).find((status) => SLUG_DO_STATUS[status] === slug) ?? ''
}

// Link para a lista de Demandas já filtrada. O setor só tem efeito para a gerência: para um
// setor, a tela Demandas trava o filtro no próprio departamento (RF-R04).
export function linkDaLista(status, setor = null) {
  const caminho = setor ? `#demandas/${encodeURIComponent(setor)}` : '#demandas'
  return `${caminho}?status=${SLUG_DO_STATUS[status]}`
}

// Abas da Visão Geral. "Alta prioridade" é PRIORIDADE (Alta ou Urgente), não status (defeito G05).
// Para quem só abriu a demanda a prioridade é sigilosa (RN03), então ela nunca entra nesse filtro.
export function filtrarVisaoGeral(demandas, usuario, filtro) {
  return demandas.filter((demanda) => {
    if (filtro === 'pendentes') return demanda.status === STATUS.PENDENTE_ACEITE
    if (filtro === 'concluidas') return demanda.status === STATUS.CONCLUIDA
    // Bloco 4B. O setor executor nunca tem demanda em triagem na base (permissoes.js), então vê 0;
    // quem abriu vê as suas, só com o resumo.
    if (filtro === 'triagem') return demanda.status === STATUS.EM_TRIAGEM
    if (filtro === 'alta-prioridade') {
      return podeVerDetalhes(usuario, demanda) && ['Urgente', 'Alta'].includes(demanda.prioridade)
    }
    return true
  })
}

function contar(demandas, teste) {
  return demandas.filter(teste).length
}

const prazoCorrendo = (demanda) =>
  demanda.status === STATUS.EM_ANDAMENTO || demanda.status === STATUS.AGUARDANDO

// Filtros dos cards da Visão Geral que não são um único status (ajustes do teste manual, item 1).
// O MESMO teste conta o número do card e filtra a lista de Demandas, para os dois baterem.
// "aba": em qual aba de Demandas o card faz sentido (Solicitadas, para "Solicitadas por mim").
export const FILTROS_DO_PAINEL = {
  abertas: { rotulo: 'Abertas', teste: (d) => !estaFinal(d.status) },
  'recebidas-abertas': { rotulo: 'Recebidas abertas', teste: prazoCorrendo },
  'a-expirar': { rotulo: 'A expirar', teste: (d, agora) => aExpirar(d, agora) },
  vencidas: { rotulo: 'Vencidas', teste: (d, agora) => vencida(d, agora) },
  aguardando: { rotulo: 'Aguardando > 7 dias', teste: (d, agora) => aguardandoMuito(d, agora) },
  'solicitadas-abertas': {
    rotulo: 'Solicitadas por mim em aberto',
    teste: (d) => !estaFinal(d.status),
    aba: ABAS.SOLICITADAS,
  },
}

// Valor do endereço que não é um filtro conhecido vira "sem filtro", sem erro.
export function filtroDoPainel(chave) {
  return Object.hasOwn(FILTROS_DO_PAINEL, chave ?? '') ? chave : ''
}

// Recebe a lista JÁ recortada pela permissão e pela aba (demandasDaAba): nunca mostra além disso.
export function filtrarPorPainel(demandas, chave, agora) {
  const filtro = FILTROS_DO_PAINEL[chave]
  return filtro ? demandas.filter((demanda) => filtro.teste(demanda, agora)) : demandas
}

// Link de qualquer card: status ("?status=") ou filtro do painel ("?filtro=", mais "&aba=" se preciso).
export function linkDoIndicador(indicador, setor = null) {
  if (indicador.status) return linkDaLista(indicador.status, setor)
  const filtro = FILTROS_DO_PAINEL[indicador.filtro]
  if (!filtro) return null
  const caminho = setor ? `#demandas/${encodeURIComponent(setor)}` : '#demandas'
  const aba = filtro.aba ? `&aba=${filtro.aba}` : ''
  return `${caminho}?filtro=${indicador.filtro}${aba}`
}

const indicadorDoPainel = (chave, base, agora, extra = {}) => ({
  chave,
  rotulo: FILTROS_DO_PAINEL[chave].rotulo,
  valor: contar(base, (d) => FILTROS_DO_PAINEL[chave].teste(d, agora)),
  filtro: chave,
  ...extra,
})

// Números da Visão Geral, sempre calculados (seção 6). "agora" entra por parâmetro.
// "status" (Bloco 4B) ou "filtro" (ajustes do teste manual): todo card vira link para a lista filtrada.
export function indicadoresVisaoGeral(demandas, usuario, agora, setor = null) {
  if (ehGerencia(usuario)) {
    const base = setor ? demandas.filter((demanda) => setorResponsavel(demanda) === setor) : demandas
    return [
      indicadorDoPainel('abertas', base, agora),
      { chave: 'pendentes', rotulo: 'Pendentes de aceite', valor: contar(base, (d) => d.status === STATUS.PENDENTE_ACEITE), badge: SELO_ACEITE, tom: 'ambar', status: STATUS.PENDENTE_ACEITE },
      { chave: 'triagem', rotulo: 'Em triagem', valor: contar(base, (d) => d.status === STATUS.EM_TRIAGEM), status: STATUS.EM_TRIAGEM },
      indicadorDoPainel('a-expirar', base, agora, { badge: '25% do prazo', tom: 'ambar' }),
      indicadorDoPainel('vencidas', base, agora, { badge: 'Prazo passou', tom: 'vermelho' }),
      indicadorDoPainel('aguardando', base, agora),
      { chave: 'concluidas', rotulo: 'Concluídas', valor: contar(base, (d) => d.status === STATUS.CONCLUIDA), tom: 'verde', status: STATUS.CONCLUIDA },
    ]
  }

  const recebidas = demandas.filter((demanda) => ehExecutor(usuario, demanda))
  const solicitadas = demandas.filter((demanda) => ehSolicitante(usuario, demanda))
  return [
    indicadorDoPainel('recebidas-abertas', recebidas, agora),
    { chave: 'pendentes', rotulo: 'Pendentes de aceite', valor: contar(recebidas, (d) => d.status === STATUS.PENDENTE_ACEITE), badge: SELO_ACEITE, tom: 'ambar', status: STATUS.PENDENTE_ACEITE },
    indicadorDoPainel('a-expirar', recebidas, agora, { badge: '25% do prazo', tom: 'ambar' }),
    { chave: 'resolvidas', rotulo: 'Resolvidas', valor: contar(recebidas, (d) => d.status === STATUS.CONCLUIDA), tom: 'verde', status: STATUS.CONCLUIDA },
    indicadorDoPainel('solicitadas-abertas', solicitadas, agora),
  ]
}

// Aviso do topo da Visão Geral (Bloco 4B): o que espera alguém agir, só do que o perfil responde.
// Gerência: triagem e pendentes de todos (ou do setor filtrado). Setor: só as pendentes de aceite
// que ELE recebeu; triagem é sempre 0, porque não é com ele (decisão de 04/10).
export function avisoDeAtencao(demandas, usuario, setor = null) {
  const visiveis = demandas.filter((demanda) => podeVer(usuario, demanda))
  if (ehGerencia(usuario)) {
    const base = setor ? visiveis.filter((demanda) => setorResponsavel(demanda) === setor) : visiveis
    const triagem = contar(base, (d) => d.status === STATUS.EM_TRIAGEM)
    const pendentes = contar(base, (d) => d.status === STATUS.PENDENTE_ACEITE)
    return { triagem, pendentes, total: triagem + pendentes }
  }
  const pendentes = contar(visiveis, (d) => ehExecutor(usuario, d) && d.status === STATUS.PENDENTE_ACEITE)
  return { triagem: 0, pendentes, total: pendentes }
}

// Demandas ainda abertas que um setor executa (cards de Departamentos). Em triagem não conta:
// está com a gerência.
export function abertasDoSetor(demandas, setor) {
  return contar(demandas, (demanda) => setorResponsavel(demanda) === setor && !estaFinal(demanda.status))
}
