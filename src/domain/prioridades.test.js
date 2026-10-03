import { describe, expect, it } from 'vitest'
import { NAO_DEFINIDA, compararDemandas, ehPrioridadeValida, ordemPrioridade } from './prioridades.js'

describe('prioridades', () => {
  it('aceita só os 4 níveis; "Não definida" não serve para aceitar (RN10)', () => {
    expect(ehPrioridadeValida('Urgente')).toBe(true)
    expect(ehPrioridadeValida('Baixa')).toBe(true)
    expect(ehPrioridadeValida(NAO_DEFINIDA)).toBe(false)
    expect(ehPrioridadeValida('')).toBe(false)
  })

  it('"Não definida" fica depois de Baixa', () => {
    expect(ordemPrioridade(NAO_DEFINIDA)).toBeGreaterThan(ordemPrioridade('Baixa'))
  })

  it('ordena por prioridade → mais recente → título (Ata 15/09)', () => {
    const lista = [
      { titulo: 'B', prioridade: 'Baixa', criadaEm: '2026-10-03T10:00:00Z' },
      { titulo: 'Z', prioridade: 'Alta', criadaEm: '2026-10-01T10:00:00Z' },
      { titulo: 'A', prioridade: 'Alta', criadaEm: '2026-10-01T10:00:00Z' },
      { titulo: 'C', prioridade: 'Alta', criadaEm: '2026-10-02T10:00:00Z' },
      { titulo: 'U', prioridade: 'Urgente', criadaEm: '2026-09-01T10:00:00Z' },
    ]
    const titulos = [...lista].sort(compararDemandas).map((demanda) => demanda.titulo)
    expect(titulos).toEqual(['U', 'C', 'A', 'Z', 'B'])
  })
})
