// Filtros, abas, ordenação e indicadores das listas (RF-R04, RF-R06; requisitos, seções 5 e 6).
// Funções puras: recebem a lista completa e o usuário, devolvem só o que ele pode ver.

import { compararDemandas, ordemPrioridade } from './prioridades.js'
import { STATUS, estaFinal } from './status.js'
import { ehExecutor, ehGerencia, ehSolicitante, podeVer, podeVerDetalhes } from './permissoes.js'
import { aExpirar, aguardandoMuito, vencida } from './prazos.js'

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

// O filtro por setor (destino) só vale para a gerência; para um setor ele fica travado no próprio
// setor, e as regras de visibilidade já garantem isso (RN02).
export function demandasDaAba(demandas, usuario, aba, setor = null) {
  return demandas
    .filter((demanda) => podeVer(usuario, demanda))
    .filter((demanda) =>
      aba === ABAS.SOLICITADAS
        ? ehSolicitante(usuario, demanda)
        : ehGerencia(usuario) || ehExecutor(usuario, demanda),
    )
    .filter((demanda) => !ehGerencia(usuario) || !setor || demanda.destino === setor)
}

// "Pendentes de aceite" ficam numa seção própria, no topo (seção 5).
export function separarPendentes(demandas) {
  return {
    pendentes: demandas.filter((demanda) => demanda.status === STATUS.PENDENTE_ACEITE),
    demais: demandas.filter((demanda) => demanda.status !== STATUS.PENDENTE_ACEITE),
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

// Abas da Visão Geral. "Alta prioridade" é PRIORIDADE (Alta ou Urgente), não status (defeito G05).
// Para quem só abriu a demanda a prioridade é sigilosa (RN03), então ela nunca entra nesse filtro.
export function filtrarVisaoGeral(demandas, usuario, filtro) {
  return demandas.filter((demanda) => {
    if (filtro === 'pendentes') return demanda.status === STATUS.PENDENTE_ACEITE
    if (filtro === 'concluidas') return demanda.status === STATUS.CONCLUIDA
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

// Números da Visão Geral, sempre calculados (seção 6). "agora" entra por parâmetro.
export function indicadoresVisaoGeral(demandas, usuario, agora, setor = null) {
  if (ehGerencia(usuario)) {
    const base = setor ? demandas.filter((demanda) => demanda.destino === setor) : demandas
    return [
      { chave: 'abertas', rotulo: 'Abertas', valor: contar(base, (d) => !estaFinal(d.status)) },
      { chave: 'pendentes', rotulo: 'Pendentes de aceite', valor: contar(base, (d) => d.status === STATUS.PENDENTE_ACEITE), badge: '72 h para aceitar', tom: 'ambar' },
      { chave: 'triagem', rotulo: 'Em triagem', valor: contar(base, (d) => d.status === STATUS.EM_TRIAGEM) },
      { chave: 'a-expirar', rotulo: 'A expirar', valor: contar(base, (d) => aExpirar(d, agora)), badge: '25% do prazo', tom: 'ambar' },
      { chave: 'vencidas', rotulo: 'Vencidas', valor: contar(base, (d) => vencida(d, agora)), badge: 'Prazo passou', tom: 'vermelho' },
      { chave: 'aguardando', rotulo: 'Aguardando > 7 dias', valor: contar(base, (d) => aguardandoMuito(d, agora)) },
      { chave: 'concluidas', rotulo: 'Concluídas', valor: contar(base, (d) => d.status === STATUS.CONCLUIDA), tom: 'verde' },
    ]
  }

  const recebidas = demandas.filter((demanda) => ehExecutor(usuario, demanda))
  const solicitadas = demandas.filter((demanda) => ehSolicitante(usuario, demanda))
  return [
    { chave: 'recebidas-abertas', rotulo: 'Recebidas abertas', valor: contar(recebidas, prazoCorrendo) },
    { chave: 'pendentes', rotulo: 'Pendentes de aceite', valor: contar(recebidas, (d) => d.status === STATUS.PENDENTE_ACEITE), badge: '72 h para aceitar', tom: 'ambar' },
    { chave: 'a-expirar', rotulo: 'A expirar', valor: contar(recebidas, (d) => aExpirar(d, agora)), badge: '25% do prazo', tom: 'ambar' },
    { chave: 'resolvidas', rotulo: 'Resolvidas', valor: contar(recebidas, (d) => d.status === STATUS.CONCLUIDA), tom: 'verde' },
    { chave: 'solicitadas-abertas', rotulo: 'Solicitadas por mim em aberto', valor: contar(solicitadas, (d) => !estaFinal(d.status)) },
  ]
}

// Demandas ainda abertas que um setor executa (cards de Departamentos).
export function abertasDoSetor(demandas, setor) {
  return contar(demandas, (demanda) => demanda.destino === setor && !estaFinal(demanda.status))
}
