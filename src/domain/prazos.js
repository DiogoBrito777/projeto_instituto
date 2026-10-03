// Cálculo de prazos e selos de atraso (RN09, RN13, RN15, RN16).
// Todas as funções recebem o "agora" por parâmetro: assim os testes usam uma data fixa
// e o resultado não depende do relógio do computador.

import { PRAZO_EM_HORAS, ehPrioridadeValida } from './prioridades.js'
import { STATUS } from './status.js'

const UMA_HORA = 60 * 60 * 1000

export const HORAS_PARA_ACEITE = 72
export const DIAS_LIMITE_AGUARDANDO = 7

// RN15: "a expirar" quando resta 25% do prazo ou menos.
const FRACAO_A_EXPIRAR = 0.25

function somarHoras(dataIso, horas) {
  return new Date(new Date(dataIso).getTime() + horas * UMA_HORA)
}

// O prazo corre em Em andamento e também em Aguardando (RN16: aguardar não pausa o prazo).
function prazoCorrendo(demanda) {
  return demanda.status === STATUS.EM_ANDAMENTO || demanda.status === STATUS.AGUARDANDO
}

// RN09/RN18: 72 h para aceitar, contadas da criação ou do último redirecionamento.
export function prazoAceite(demanda) {
  return somarHoras(demanda.redirecionadaEm ?? demanda.criadaEm, HORAS_PARA_ACEITE)
}

export function calcularPrazoResolucao(aceitaEm, prioridade) {
  if (!aceitaEm || !ehPrioridadeValida(prioridade)) return null
  return somarHoras(aceitaEm, PRAZO_EM_HORAS[prioridade])
}

// RN14: se o setor registrou um novo prazo, ele vale no lugar do calculado.
export function prazoResolucao(demanda) {
  if (demanda.prazo) return new Date(demanda.prazo)
  return calcularPrazoResolucao(demanda.aceitaEm, demanda.prioridade)
}

export function vencida(demanda, agora) {
  const prazo = prazoResolucao(demanda)
  return prazoCorrendo(demanda) && prazo !== null && agora > prazo
}

export function aExpirar(demanda, agora) {
  const prazo = prazoResolucao(demanda)
  if (!prazoCorrendo(demanda) || prazo === null || vencida(demanda, agora)) return false

  const total = prazo - new Date(demanda.aceitaEm)
  const restante = prazo - agora
  return restante <= total * FRACAO_A_EXPIRAR
}

export function aceiteAtrasado(demanda, agora) {
  return demanda.status === STATUS.PENDENTE_ACEITE && agora > prazoAceite(demanda)
}

export function aguardandoMuito(demanda, agora) {
  if (demanda.status !== STATUS.AGUARDANDO || !demanda.aguardandoDesde) return false
  const limite = somarHoras(demanda.aguardandoDesde, DIAS_LIMITE_AGUARDANDO * 24)
  return agora > limite
}
