import { describe, expect, it } from 'vitest'
import { quantidade } from './formatos.js'

describe('quantidade (plural)', () => {
  it('1 fica no singular (antes: "1 demandas ativas")', () => {
    expect(quantidade(1, 'demanda ativa', 'demandas ativas')).toBe('1 demanda ativa')
    expect(quantidade(1, 'demanda aberta', 'demandas abertas')).toBe('1 demanda aberta')
  })

  it('0 e mais de 1 ficam no plural', () => {
    expect(quantidade(0, 'demanda ativa', 'demandas ativas')).toBe('0 demandas ativas')
    expect(quantidade(3, 'demanda aberta', 'demandas abertas')).toBe('3 demandas abertas')
  })
})
