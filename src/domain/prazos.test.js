import { describe, expect, it } from 'vitest'
import {
  aExpirar,
  aceiteAtrasado,
  aguardandoMuito,
  calcularPrazoResolucao,
  prazoAceite,
  prazoResolucao,
  vencida,
} from './prazos.js'
import { STATUS } from './status.js'

// "Agora" fixo: os testes dão o mesmo resultado em qualquer dia.
const AGORA = new Date('2026-10-05T12:00:00Z')

function horasAntes(horas) {
  return new Date(AGORA.getTime() - horas * 60 * 60 * 1000).toISOString()
}

function emAndamento(prioridade, aceitaHaHoras) {
  return { status: STATUS.EM_ANDAMENTO, prioridade, aceitaEm: horasAntes(aceitaHaHoras), prazo: null }
}

describe('prazo de resolução (RN13)', () => {
  it('Urgente 24 h, Alta 48 h, Média 72 h, Baixa 7 dias a partir do aceite', () => {
    const aceite = '2026-10-01T00:00:00.000Z'
    expect(calcularPrazoResolucao(aceite, 'Urgente').toISOString()).toBe('2026-10-02T00:00:00.000Z')
    expect(calcularPrazoResolucao(aceite, 'Alta').toISOString()).toBe('2026-10-03T00:00:00.000Z')
    expect(calcularPrazoResolucao(aceite, 'Média').toISOString()).toBe('2026-10-04T00:00:00.000Z')
    expect(calcularPrazoResolucao(aceite, 'Baixa').toISOString()).toBe('2026-10-08T00:00:00.000Z')
  })

  it('sem aceite ou sem prioridade não há prazo', () => {
    expect(calcularPrazoResolucao(null, 'Alta')).toBeNull()
    expect(calcularPrazoResolucao('2026-10-01T00:00:00Z', 'Não definida')).toBeNull()
  })

  it('novo prazo registrado vale no lugar do calculado (RN14)', () => {
    const demanda = { ...emAndamento('Alta', 10), prazo: '2026-12-01T00:00:00.000Z' }
    expect(prazoResolucao(demanda).toISOString()).toBe('2026-12-01T00:00:00.000Z')
  })
})

describe('a expirar e vencida (RN15)', () => {
  it('no começo do prazo não está a expirar nem vencida', () => {
    const demanda = emAndamento('Alta', 10)
    expect(aExpirar(demanda, AGORA)).toBe(false)
    expect(vencida(demanda, AGORA)).toBe(false)
  })

  it('restando 25% ou menos está a expirar', () => {
    expect(aExpirar(emAndamento('Alta', 40), AGORA)).toBe(true)
  })

  it('passou do prazo: vencida, e não mais "a expirar"', () => {
    const demanda = emAndamento('Urgente', 30)
    expect(vencida(demanda, AGORA)).toBe(true)
    expect(aExpirar(demanda, AGORA)).toBe(false)
  })

  it('Aguardando não pausa o prazo (RN16)', () => {
    const demanda = { ...emAndamento('Urgente', 30), status: STATUS.AGUARDANDO }
    expect(vencida(demanda, AGORA)).toBe(true)
  })

  it('demanda concluída não fica vencida', () => {
    const demanda = { ...emAndamento('Urgente', 30), status: STATUS.CONCLUIDA }
    expect(vencida(demanda, AGORA)).toBe(false)
  })
})

describe('aceite (RN09, RN18)', () => {
  it('pendente há mais de 72 h: aceite atrasado', () => {
    const demanda = { status: STATUS.PENDENTE_ACEITE, criadaEm: horasAntes(73) }
    expect(aceiteAtrasado(demanda, AGORA)).toBe(true)
  })

  it('pendente há menos de 72 h: não está atrasado', () => {
    const demanda = { status: STATUS.PENDENTE_ACEITE, criadaEm: horasAntes(71) }
    expect(aceiteAtrasado(demanda, AGORA)).toBe(false)
  })

  it('redirecionamento reinicia o prazo de aceite', () => {
    const demanda = {
      status: STATUS.PENDENTE_ACEITE,
      criadaEm: horasAntes(200),
      redirecionadaEm: horasAntes(1),
    }
    expect(prazoAceite(demanda).toISOString()).toBe(new Date(AGORA.getTime() + 71 * 3600000).toISOString())
    expect(aceiteAtrasado(demanda, AGORA)).toBe(false)
  })

  it('demanda já aceita nunca tem aceite atrasado', () => {
    const demanda = { status: STATUS.EM_ANDAMENTO, criadaEm: horasAntes(200) }
    expect(aceiteAtrasado(demanda, AGORA)).toBe(false)
  })
})

describe('aguardando há mais de 7 dias (RN16)', () => {
  it('mais de 7 dias aguardando: selo', () => {
    const demanda = { status: STATUS.AGUARDANDO, aguardandoDesde: horasAntes(7 * 24 + 1) }
    expect(aguardandoMuito(demanda, AGORA)).toBe(true)
  })

  it('menos de 7 dias, ou outro status: sem selo', () => {
    expect(aguardandoMuito({ status: STATUS.AGUARDANDO, aguardandoDesde: horasAntes(24) }, AGORA)).toBe(false)
    expect(aguardandoMuito({ status: STATUS.EM_ANDAMENTO, aguardandoDesde: horasAntes(500) }, AGORA)).toBe(false)
  })
})
