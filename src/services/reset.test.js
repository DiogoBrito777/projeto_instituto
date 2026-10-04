import { describe, expect, it, vi } from 'vitest'
import { resetarComConfirmacao } from './reset.js'
import { CHAVES, criarStorage } from './storage.js'

// Armazenamento falso, no lugar do localStorage (mesmo padrão de storage.test.js).
function criarBackendFalso(inicial = {}) {
  const dados = { ...inicial }
  return {
    dados,
    getItem: (chave) => (chave in dados ? dados[chave] : null),
    setItem: (chave, valor) => {
      dados[chave] = String(valor)
    },
    removeItem: (chave) => {
      delete dados[chave]
    },
  }
}

const SEMENTE = [{ id: 'DM-2001', titulo: 'Semente' }]
const ALTERADOS = JSON.stringify([...SEMENTE, { id: 'DM-2014', titulo: 'Criada no teste' }])

function novoStorage(backend) {
  return criarStorage({ backend, gerarSemente: () => SEMENTE, atrasoMs: 0 })
}

describe('ajustes do teste manual — "Resetar dados" com confirmação (item 9)', () => {
  it('cancelar (Voltar ou Esc) NÃO apaga nada', () => {
    const backend = criarBackendFalso({ [CHAVES.demandas]: ALTERADOS, [CHAVES.contador]: '2014' })
    const storage = novoStorage(backend)
    const resetar = vi.fn(storage.resetarDados)

    expect(resetarComConfirmacao(false, resetar)).toEqual({ executado: false, ok: true })
    expect(resetar).not.toHaveBeenCalled()
    expect(backend.dados[CHAVES.demandas]).toBe(ALTERADOS)
    expect(backend.dados[CHAVES.contador]).toBe('2014')
  })

  it('confirmar apaga e a próxima carga volta à semente', () => {
    const backend = criarBackendFalso({ [CHAVES.demandas]: ALTERADOS, [CHAVES.contador]: '2014' })
    const storage = novoStorage(backend)

    expect(resetarComConfirmacao(true, storage.resetarDados)).toEqual({ executado: true, ok: true })
    expect(backend.dados).not.toHaveProperty(CHAVES.contador)
    expect(storage.carregarDemandas()).toEqual({ ok: true, dados: SEMENTE })
  })

  it('confirmar com o armazenamento indisponível: informa a falha (ok: false)', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const storage = criarStorage({ backend: null, gerarSemente: () => SEMENTE })
    expect(resetarComConfirmacao(true, storage.resetarDados)).toEqual({ executado: true, ok: false })
    vi.restoreAllMocks()
  })
})
