import { describe, expect, it } from 'vitest'
import {
  ABAS,
  abasDoPerfil,
  abertasDoSetor,
  demandasDaAba,
  filtrarVisaoGeral,
  indicadoresVisaoGeral,
  ordenarDemandas,
  separarPendentes,
} from './listas.js'
import { STATUS } from './status.js'

const AGORA = new Date('2026-10-05T12:00:00Z')
const horasAntes = (horas) => new Date(AGORA.getTime() - horas * 3600000).toISOString()

const admin = { usuario: 'admin', perfil: 'gerenciamento', departamento: null }
const ti = { usuario: 'user01', perfil: 'departamento', departamento: 'tecnologia' }
const eletrica = { usuario: 'user04', perfil: 'departamento', departamento: 'eletrica' }

function demanda(id, origem, destino, status, extra = {}) {
  return { id, titulo: id, origem, destino, status, prioridade: 'Média', criadaEm: horasAntes(10), ...extra }
}

const LISTA = [
  demanda('A', 'hidraulica', 'tecnologia', STATUS.PENDENTE_ACEITE, { prioridade: 'Não definida' }),
  demanda('B', 'eletrica', 'tecnologia', STATUS.EM_ANDAMENTO, { prioridade: 'Alta', aceitaEm: horasAntes(40) }),
  demanda('C', 'tecnologia', 'administrativo', STATUS.EM_ANDAMENTO, { prioridade: 'Urgente', aceitaEm: horasAntes(30) }),
  demanda('D', 'hidraulica', 'eletrica', STATUS.CONCLUIDA),
  demanda('E', 'gerenciamento', 'eletrica', STATUS.EM_TRIAGEM),
  demanda('F', 'administrativo', 'hidraulica', STATUS.AGUARDANDO, { aceitaEm: horasAntes(5), aguardandoDesde: horasAntes(200) }),
]
const ids = (lista) => lista.map((d) => d.id)

describe('abas por perfil', () => {
  it('setor vê Recebidas/Solicitadas; gerência vê Todas/Solicitadas por mim', () => {
    expect(abasDoPerfil(ti).map((aba) => aba.rotulo)).toEqual(['Recebidas', 'Solicitadas'])
    expect(abasDoPerfil(admin).map((aba) => aba.rotulo)).toEqual(['Todas', 'Solicitadas por mim'])
  })
})

describe('demandasDaAba (RN02)', () => {
  it('Recebidas de TI = destino TI', () => {
    expect(ids(demandasDaAba(LISTA, ti, ABAS.RECEBIDAS))).toEqual(['A', 'B'])
  })

  it('Solicitadas de TI = origem TI', () => {
    expect(ids(demandasDaAba(LISTA, ti, ABAS.SOLICITADAS))).toEqual(['C'])
  })

  it('TI NÃO recebe demanda entre Hidráulica e Elétrica em nenhuma aba', () => {
    const todas = [...demandasDaAba(LISTA, ti, ABAS.RECEBIDAS), ...demandasDaAba(LISTA, ti, ABAS.SOLICITADAS)]
    expect(ids(todas)).not.toContain('D')
  })

  it('setor NÃO consegue ver outro setor usando o filtro de departamento', () => {
    expect(ids(demandasDaAba(LISTA, ti, ABAS.RECEBIDAS, 'eletrica'))).toEqual(['A', 'B'])
  })

  it('gerência vê todas e pode filtrar por setor de destino', () => {
    expect(demandasDaAba(LISTA, admin, ABAS.RECEBIDAS)).toHaveLength(LISTA.length)
    expect(ids(demandasDaAba(LISTA, admin, ABAS.RECEBIDAS, 'eletrica'))).toEqual(['D', 'E'])
  })

  it('"Solicitadas por mim" da gerência = origem gerenciamento', () => {
    expect(ids(demandasDaAba(LISTA, admin, ABAS.SOLICITADAS))).toEqual(['E'])
  })
})

describe('pendentes e ordenação', () => {
  it('separa as pendentes de aceite das demais', () => {
    const { pendentes, demais } = separarPendentes(LISTA)
    expect(ids(pendentes)).toEqual(['A'])
    expect(demais).toHaveLength(LISTA.length - 1)
  })

  it('padrão: prioridade primeiro (Urgente antes de Alta)', () => {
    expect(ids(ordenarDemandas(LISTA)).slice(0, 2)).toEqual(['C', 'B'])
  })

  it('critério desconhecido cai no padrão', () => {
    expect(ids(ordenarDemandas(LISTA, 'xyz'))).toEqual(ids(ordenarDemandas(LISTA)))
  })
})

describe('filtros da Visão Geral', () => {
  it('"alta prioridade" filtra por PRIORIDADE (Alta e Urgente), não por status', () => {
    expect(ids(filtrarVisaoGeral(LISTA, admin, 'alta-prioridade'))).toEqual(['B', 'C'])
  })

  it('quem só abriu NÃO descobre a prioridade pelo filtro (RN03)', () => {
    expect(ids(filtrarVisaoGeral([LISTA[2]], ti, 'alta-prioridade'))).toEqual([])
  })

  it('pendentes e concluídas filtram pelo status', () => {
    expect(ids(filtrarVisaoGeral(LISTA, admin, 'pendentes'))).toEqual(['A'])
    expect(ids(filtrarVisaoGeral(LISTA, admin, 'concluidas'))).toEqual(['D'])
  })
})

describe('indicadores (seção 6)', () => {
  const valor = (indicadores, chave) => indicadores.find((item) => item.chave === chave).valor

  it('gerência: números de todos os setores', () => {
    const ind = indicadoresVisaoGeral(LISTA, admin, AGORA)
    expect(valor(ind, 'abertas')).toBe(5)
    expect(valor(ind, 'pendentes')).toBe(1)
    expect(valor(ind, 'triagem')).toBe(1)
    expect(valor(ind, 'a-expirar')).toBe(1)
    expect(valor(ind, 'vencidas')).toBe(1)
    expect(valor(ind, 'aguardando')).toBe(1)
    expect(valor(ind, 'concluidas')).toBe(1)
  })

  it('gerência filtrando por setor conta só aquele destino', () => {
    expect(valor(indicadoresVisaoGeral(LISTA, admin, AGORA, 'eletrica'), 'abertas')).toBe(1)
  })

  it('setor: conta só as suas recebidas e solicitadas, NUNCA as dos outros', () => {
    const ind = indicadoresVisaoGeral(LISTA, ti, AGORA)
    expect(valor(ind, 'recebidas-abertas')).toBe(1)
    expect(valor(ind, 'pendentes')).toBe(1)
    expect(valor(ind, 'a-expirar')).toBe(1)
    expect(valor(ind, 'resolvidas')).toBe(0)
    expect(valor(ind, 'solicitadas-abertas')).toBe(1)
  })

  it('setor não tem indicadores exclusivos da gerência', () => {
    const chaves = indicadoresVisaoGeral(LISTA, eletrica, AGORA).map((item) => item.chave)
    expect(chaves).not.toContain('vencidas')
    expect(chaves).not.toContain('triagem')
  })

  it('abertas do setor ignora as finalizadas', () => {
    expect(abertasDoSetor(LISTA, 'eletrica')).toBe(1)
    expect(abertasDoSetor(LISTA, 'tecnologia')).toBe(2)
  })
})
