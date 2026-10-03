// Níveis de prioridade, prazo de cada um e ordenação da lista (RN10, RN13; Ata 15/09).

export const NAO_DEFINIDA = 'Não definida'

// A ordem do array é a ordem de importância (usada para ordenar a lista).
export const PRIORIDADES = ['Urgente', 'Alta', 'Média', 'Baixa']

// RN13: prazo de resolução em horas corridas, contado a partir do aceite.
export const PRAZO_EM_HORAS = {
  Urgente: 24,
  Alta: 48,
  Média: 72,
  Baixa: 7 * 24,
}

export function ehPrioridadeValida(prioridade) {
  return PRIORIDADES.includes(prioridade)
}

// "Não definida" (ainda não aceita) fica depois de todas as outras.
export function ordemPrioridade(prioridade) {
  const posicao = PRIORIDADES.indexOf(prioridade)
  return posicao === -1 ? PRIORIDADES.length : posicao
}

// Ata 15/09: prioridade → mais recente → nome (título).
export function compararDemandas(a, b) {
  return (
    ordemPrioridade(a.prioridade) - ordemPrioridade(b.prioridade) ||
    new Date(b.criadaEm) - new Date(a.criadaEm) ||
    a.titulo.localeCompare(b.titulo, 'pt-BR')
  )
}
