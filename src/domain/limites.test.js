import { describe, expect, it } from 'vitest'
import { AVISOS_LIMITE, avisoDeLimite, tamanhoAposColar } from './limites.js'

describe('avisoDeLimite', () => {
  it('abaixo do limite: nenhum aviso', () => {
    expect(avisoDeLimite(59, 60)).toBe(AVISOS_LIMITE.NENHUM)
    expect(avisoDeLimite(0, 500)).toBe(AVISOS_LIMITE.NENHUM)
  })

  it('exatamente no limite, digitando: "limite atingido"', () => {
    expect(avisoDeLimite(60, 60)).toBe(AVISOS_LIMITE.ATINGIDO)
    expect(avisoDeLimite(500, 500)).toBe(AVISOS_LIMITE.ATINGIDO)
  })

  it('colou mais do que cabia: "texto cortado", mesmo com o campo travado no limite', () => {
    expect(avisoDeLimite(500, 500, 3072)).toBe(AVISOS_LIMITE.CORTADO)
    expect(avisoDeLimite(60, 60, 2400)).toBe(AVISOS_LIMITE.CORTADO)
  })

  it('colou e coube exatamente: só "limite atingido", nada foi cortado', () => {
    expect(avisoDeLimite(60, 60, 60)).toBe(AVISOS_LIMITE.ATINGIDO)
  })

  it('colou um texto curto: nenhum aviso', () => {
    expect(avisoDeLimite(20, 60, 20)).toBe(AVISOS_LIMITE.NENHUM)
  })
})

describe('ajustes do teste manual — aviso que voltava ao reabrir o pop-up (item 5)', () => {
  // Reproduz o bug: com 500 caracteres, a pessoa cola mais 10. O navegador bloqueia (o valor não
  // muda, não há onChange) e o "tentado" 510 fica guardado. Ela apaga tudo, fecha, reabre e digita
  // 1 caractere: antes o aviso "cortado" voltava; só sumia no 2º caractere.
  it('"tentado" velho acima do limite com o campo abaixo dele NÃO gera aviso', () => {
    expect(avisoDeLimite(1, 500, 510)).toBe(AVISOS_LIMITE.NENHUM)
    expect(avisoDeLimite(0, 500, 510)).toBe(AVISOS_LIMITE.NENHUM)
  })

  it('o corte de verdade continua avisado (campo no limite)', () => {
    expect(avisoDeLimite(500, 500, 510)).toBe(AVISOS_LIMITE.CORTADO)
  })

  it('reiniciar pelo tamanho atual: vazio sem aviso; texto no limite com "atingido"', () => {
    expect(avisoDeLimite(''.length, 500)).toBe(AVISOS_LIMITE.NENHUM)
    expect(avisoDeLimite('x'.repeat(500).length, 500)).toBe(AVISOS_LIMITE.ATINGIDO)
  })
})

describe('tamanhoAposColar', () => {
  it('cursor no fim: soma o texto colado', () => {
    expect(tamanhoAposColar(10, 10, 10, 55)).toBe(65)
  })

  it('com trecho selecionado, o trecho é substituído pelo colado', () => {
    expect(tamanhoAposColar(60, 0, 60, 30)).toBe(30)
    expect(tamanhoAposColar(58, 50, 58, 10)).toBe(60)
  })
})
