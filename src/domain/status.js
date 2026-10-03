// Status da demanda e transições permitidas (REQUISITOS_REGRAS_DE_NEGOCIO.md, seção 4; ADR-08).
// Nenhuma tela decide transição sozinha: todas perguntam a este módulo.

export const STATUS = {
  PENDENTE_ACEITE: 'Pendente de aceite',
  EM_ANDAMENTO: 'Em andamento',
  AGUARDANDO: 'Aguardando (processamento interno)',
  EM_TRIAGEM: 'Em triagem',
  CONCLUIDA: 'Concluída',
  NAO_APLICAVEL: 'Não aplicável',
  CANCELADA: 'Cancelada',
}

// RN20: estados finais não aceitam nenhuma alteração, de ninguém.
const FINAIS = [STATUS.CONCLUIDA, STATUS.NAO_APLICAVEL, STATUS.CANCELADA]

// Para cada status, quem pode levá-lo a qual status.
// "executor" = setor de destino; "gerenciamento" = admin. Quem só abriu a demanda não aparece: não age (RN03).
const TRANSICOES = {
  [STATUS.PENDENTE_ACEITE]: {
    executor: [STATUS.EM_ANDAMENTO, STATUS.EM_TRIAGEM],
    gerenciamento: [STATUS.CANCELADA],
  },
  [STATUS.EM_ANDAMENTO]: {
    executor: [STATUS.AGUARDANDO, STATUS.CONCLUIDA, STATUS.EM_TRIAGEM],
    gerenciamento: [STATUS.CANCELADA],
  },
  [STATUS.AGUARDANDO]: {
    executor: [STATUS.EM_ANDAMENTO, STATUS.CONCLUIDA, STATUS.EM_TRIAGEM],
    gerenciamento: [STATUS.CANCELADA],
  },
  // RN18/RN19: em triagem só a gerência age (redirecionar = volta a Pendente de aceite).
  [STATUS.EM_TRIAGEM]: {
    executor: [],
    gerenciamento: [STATUS.PENDENTE_ACEITE, STATUS.NAO_APLICAVEL, STATUS.CANCELADA],
  },
}

export function estaFinal(status) {
  return FINAIS.includes(status)
}

export function proximosStatus(status, papel) {
  return TRANSICOES[status]?.[papel] ?? []
}

export function podeTransicionar(de, para, papel) {
  return proximosStatus(de, papel).includes(para)
}
