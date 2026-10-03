import { describe, expect, it } from 'vitest'
import { STATUS, estaFinal, podeTransicionar, proximosStatus } from './status.js'

describe('status', () => {
  it('Concluída, Não aplicável e Cancelada são finais (RN20)', () => {
    expect(estaFinal(STATUS.CONCLUIDA)).toBe(true)
    expect(estaFinal(STATUS.NAO_APLICAVEL)).toBe(true)
    expect(estaFinal(STATUS.CANCELADA)).toBe(true)
    expect(estaFinal(STATUS.EM_ANDAMENTO)).toBe(false)
  })

  it('estado final não vai para nenhum outro status, para nenhum papel', () => {
    for (const status of [STATUS.CONCLUIDA, STATUS.NAO_APLICAVEL, STATUS.CANCELADA]) {
      expect(proximosStatus(status, 'executor')).toEqual([])
      expect(proximosStatus(status, 'gerenciamento')).toEqual([])
    }
  })

  it('executor aceita (Em andamento) ou recusa (Em triagem) uma pendente', () => {
    expect(proximosStatus(STATUS.PENDENTE_ACEITE, 'executor')).toEqual([
      STATUS.EM_ANDAMENTO,
      STATUS.EM_TRIAGEM,
    ])
  })

  it('em triagem só a gerência age (RN18, RN19)', () => {
    expect(proximosStatus(STATUS.EM_TRIAGEM, 'executor')).toEqual([])
    expect(podeTransicionar(STATUS.EM_TRIAGEM, STATUS.PENDENTE_ACEITE, 'gerenciamento')).toBe(true)
    expect(podeTransicionar(STATUS.EM_TRIAGEM, STATUS.NAO_APLICAVEL, 'gerenciamento')).toBe(true)
  })

  it('setor não cancela; gerência não conclui', () => {
    expect(podeTransicionar(STATUS.EM_ANDAMENTO, STATUS.CANCELADA, 'executor')).toBe(false)
    expect(podeTransicionar(STATUS.EM_ANDAMENTO, STATUS.CONCLUIDA, 'gerenciamento')).toBe(false)
  })

  it('quem só abriu a demanda não tem transição nenhuma (RN03)', () => {
    expect(proximosStatus(STATUS.EM_ANDAMENTO, 'solicitante')).toEqual([])
    expect(proximosStatus(STATUS.EM_ANDAMENTO, null)).toEqual([])
  })
})
