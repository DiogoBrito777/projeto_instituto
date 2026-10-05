import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CHAVES, ERROS, criarStorage } from './storage.js'
import { criarSemente } from './seed.js'
import { aExpirar, aceiteAtrasado, aguardandoMuito, vencida } from '../domain/prazos.js'
import { estaAtrasada } from '../domain/atencao.js'
import { STATUS } from '../domain/status.js'

// Armazenamento falso, no lugar do localStorage: os testes rodam sem navegador.
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

const SEMENTE = [
  { id: 'DM-2001', titulo: 'Primeira' },
  { id: 'DM-2002', titulo: 'Segunda' },
]

function novoStorage(backend, extra = {}) {
  return criarStorage({ backend, gerarSemente: () => SEMENTE, atrasoMs: 0, ...extra })
}

beforeEach(() => {
  // Os erros esperados são registrados no console; aqui só silenciamos a saída.
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('primeira carga e semente', () => {
  it('chave inexistente (null) grava a semente', () => {
    const backend = criarBackendFalso()
    const resultado = novoStorage(backend).carregarDemandas()
    expect(resultado).toEqual({ ok: true, dados: SEMENTE })
    expect(JSON.parse(backend.dados[CHAVES.demandas])).toEqual(SEMENTE)
  })

  it('lista vazia gravada NÃO recria a semente', () => {
    const backend = criarBackendFalso({ [CHAVES.demandas]: '[]' })
    expect(novoStorage(backend).carregarDemandas()).toEqual({ ok: true, dados: [] })
  })

  it('carregar duas vezes não duplica a semente', () => {
    const storage = novoStorage(criarBackendFalso())
    storage.carregarDemandas()
    expect(storage.carregarDemandas().dados).toHaveLength(SEMENTE.length)
  })
})

describe('dados com problema', () => {
  it('JSON corrompido devolve erro e NÃO apaga o que estava gravado', () => {
    const backend = criarBackendFalso({ [CHAVES.demandas]: '{quebrado' })
    expect(novoStorage(backend).carregarDemandas()).toEqual({ ok: false, erro: ERROS.CORROMPIDO })
    expect(backend.dados[CHAVES.demandas]).toBe('{quebrado')
  })

  it('formato inesperado (não é lista de demandas) também é corrompido', () => {
    const backend = criarBackendFalso({ [CHAVES.demandas]: '{"a":1}' })
    expect(novoStorage(backend).carregarDemandas().erro).toBe(ERROS.CORROMPIDO)
  })

  it('sem armazenamento disponível devolve erro, sem quebrar', () => {
    expect(novoStorage(null).carregarDemandas()).toEqual({ ok: false, erro: ERROS.INDISPONIVEL })
  })

  it('cota cheia: gravação falha de forma visível e nada é dado como salvo', async () => {
    const backend = criarBackendFalso({ [CHAVES.demandas]: JSON.stringify(SEMENTE) })
    backend.setItem = () => {
      throw new Error('QuotaExceededError')
    }
    const resultado = await novoStorage(backend).criarDemanda({ titulo: 'Nova' })
    expect(resultado).toEqual({ ok: false, erro: ERROS.GRAVACAO })
    expect(JSON.parse(backend.dados[CHAVES.demandas])).toHaveLength(SEMENTE.length)
  })

  it('falha simulada (?falha=1) não grava nada', async () => {
    const backend = criarBackendFalso({ [CHAVES.demandas]: JSON.stringify(SEMENTE) })
    const resultado = await novoStorage(backend, { falhaSimulada: true }).criarDemanda({ titulo: 'Nova' })
    expect(resultado).toEqual({ ok: false, erro: ERROS.FALHA_SIMULADA })
    expect(JSON.parse(backend.dados[CHAVES.demandas])).toHaveLength(SEMENTE.length)
  })
})

describe('gravações', () => {
  it('criar gera IDs sequenciais a partir do maior existente, sem repetir', async () => {
    const storage = novoStorage(criarBackendFalso())
    const primeira = await storage.criarDemanda({ titulo: 'Nova 1' })
    const segunda = await storage.criarDemanda({ titulo: 'Nova 2' })
    expect(primeira.dados.id).toBe('DM-2003')
    expect(segunda.dados.id).toBe('DM-2004')
    expect(storage.carregarDemandas().dados).toHaveLength(4)
  })

  it('atualizar altera só a demanda pedida', async () => {
    const storage = novoStorage(criarBackendFalso())
    const resultado = await storage.atualizarDemanda('DM-2002', (d) => ({ ok: true, dados: { ...d, titulo: 'Alterada' } }))
    expect(resultado.ok).toBe(true)
    const titulos = storage.carregarDemandas().dados.map((d) => d.titulo)
    expect(titulos).toEqual(['Primeira', 'Alterada'])
  })

  it('se a regra recusar a alteração, nada é gravado', async () => {
    const backend = criarBackendFalso({ [CHAVES.demandas]: JSON.stringify(SEMENTE) })
    const antes = backend.dados[CHAVES.demandas]
    const resultado = await novoStorage(backend).atualizarDemanda('DM-2002', () => ({ ok: false, erro: 'sem-permissao' }))
    expect(resultado).toEqual({ ok: false, erro: 'sem-permissao' })
    expect(backend.dados[CHAVES.demandas]).toBe(antes)
  })

  it('atualizar demanda inexistente devolve erro', async () => {
    const resultado = await novoStorage(criarBackendFalso()).atualizarDemanda('DM-0000', (d) => ({ ok: true, dados: d }))
    expect(resultado).toEqual({ ok: false, erro: ERROS.NAO_ENCONTRADA })
  })

  it('lerDemandas devolve o mesmo resultado da carga (com espera curta)', async () => {
    const storage = novoStorage(criarBackendFalso(), { atrasoLeituraMs: 0 })
    expect(await storage.lerDemandas()).toEqual({ ok: true, dados: SEMENTE })
  })
})

describe('resetar dados', () => {
  it('apaga dados e contador; a próxima carga volta à semente', async () => {
    const backend = criarBackendFalso({ [CHAVES.demandas]: '{quebrado', [CHAVES.contador]: '50' })
    const storage = novoStorage(backend)
    expect(storage.resetarDados()).toEqual({ ok: true })
    expect(backend.dados).not.toHaveProperty(CHAVES.contador)
    expect(storage.carregarDemandas()).toEqual({ ok: true, dados: SEMENTE })
  })
})

describe('semente real (seed-demandas.json)', () => {
  const agora = new Date('2026-10-06T19:00:00Z')
  const demandas = criarSemente(agora)

  it('tem no máximo 14 demandas, IDs únicos e datas relativas ao momento da carga', () => {
    expect(demandas.length).toBeLessThanOrEqual(14)
    expect(new Set(demandas.map((d) => d.id)).size).toBe(demandas.length)
    expect(demandas.every((d) => new Date(d.criadaEm) < agora)).toBe(true)
  })

  it('cobre os casos da seção 10 dos requisitos', () => {
    const algum = (teste) => demandas.some(teste)
    expect(algum((d) => d.status === STATUS.PENDENTE_ACEITE && !aceiteAtrasado(d, agora))).toBe(true)
    expect(algum((d) => aceiteAtrasado(d, agora))).toBe(true)
    expect(algum((d) => d.status === STATUS.EM_ANDAMENTO && !aExpirar(d, agora) && !vencida(d, agora))).toBe(true)
    expect(algum((d) => aExpirar(d, agora))).toBe(true)
    expect(algum((d) => vencida(d, agora))).toBe(true)
    expect(algum((d) => aguardandoMuito(d, agora))).toBe(true)
    for (const status of [STATUS.EM_TRIAGEM, STATUS.CONCLUIDA, STATUS.NAO_APLICAVEL, STATUS.CANCELADA]) {
      expect(algum((d) => d.status === status)).toBe(true)
    }
  })

  it('Bloco 4B: tem triagem no prazo e atrasada (24 h) e pendente no prazo e atrasada (48 h)', () => {
    const algum = (teste) => demandas.some(teste)
    const triagem = (d) => d.status === STATUS.EM_TRIAGEM
    const pendente = (d) => d.status === STATUS.PENDENTE_ACEITE
    expect(algum((d) => triagem(d) && !estaAtrasada(d, agora))).toBe(true)
    expect(algum((d) => triagem(d) && estaAtrasada(d, agora))).toBe(true)
    expect(algum((d) => pendente(d) && !estaAtrasada(d, agora))).toBe(true)
    expect(algum((d) => pendente(d) && estaAtrasada(d, agora))).toBe(true)
  })

  it('cada setor abriu ao menos uma demanda para outro setor', () => {
    for (const setor of ['tecnologia', 'hidraulica', 'administrativo', 'eletrica']) {
      expect(algumaDe(demandas, setor)).toBe(true)
    }
  })
})

function algumaDe(demandas, setor) {
  return demandas.some((d) => d.origem === setor && d.destino !== setor)
}
