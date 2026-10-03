import { describe, expect, it } from 'vitest'
import {
  podeAceitar,
  podeCancelar,
  podeCobrar,
  podeDefinirPrioridade,
  podeRecusar,
  podeRedirecionar,
  podeRegistrarPrazo,
  podeVer,
  podeVerDetalhes,
  resumoParaSolicitante,
} from './permissoes.js'
import { STATUS } from './status.js'

const admin = { usuario: 'admin', perfil: 'gerenciamento', departamento: null }
const ti = { usuario: 'user01', perfil: 'departamento', departamento: 'tecnologia' }
const hidraulica = { usuario: 'user02', perfil: 'departamento', departamento: 'hidraulica' }
const eletrica = { usuario: 'user04', perfil: 'departamento', departamento: 'eletrica' }

// Demanda aberta pela Hidráulica para a Elétrica (executora).
function demanda(status, extra = {}) {
  return {
    id: 'DM-9999',
    titulo: 'Disjuntor desarmando',
    descricao: 'Desarma quando a bomba liga.',
    tipo: 'Quadro de distribuição',
    origem: 'hidraulica',
    destino: 'eletrica',
    solicitante: 'Beatriz Lima',
    criadaEm: '2026-10-01T10:00:00Z',
    prioridade: 'Alta',
    prazo: '2026-10-03T10:00:00Z',
    historico: [{ id: 'h1', texto: 'Motivo interno' }],
    status,
    ...extra,
  }
}

describe('visibilidade (RN02–RN04)', () => {
  it('executor, solicitante e gerência veem a demanda', () => {
    const d = demanda(STATUS.EM_ANDAMENTO)
    expect(podeVer(eletrica, d)).toBe(true)
    expect(podeVer(hidraulica, d)).toBe(true)
    expect(podeVer(admin, d)).toBe(true)
  })

  it('user01 (TI) NÃO vê demanda entre Hidráulica e Elétrica (CA-R01)', () => {
    expect(podeVer(ti, demanda(STATUS.EM_ANDAMENTO))).toBe(false)
  })

  it('sem login ninguém vê nada', () => {
    expect(podeVer(null, demanda(STATUS.EM_ANDAMENTO))).toBe(false)
  })

  it('só executor e gerência veem a operação interna; quem abriu NÃO vê (RN02)', () => {
    const d = demanda(STATUS.EM_ANDAMENTO)
    expect(podeVerDetalhes(eletrica, d)).toBe(true)
    expect(podeVerDetalhes(admin, d)).toBe(true)
    expect(podeVerDetalhes(hidraulica, d)).toBe(false)
  })

  it('admin vê completa a demanda que ele mesmo abriu', () => {
    expect(podeVerDetalhes(admin, demanda(STATUS.EM_ANDAMENTO, { origem: 'gerenciamento' }))).toBe(true)
  })
})

describe('resumo para quem abriu (RN03, RN12, CA-R06)', () => {
  it('NÃO inclui histórico, prazo nem prioridade', () => {
    const resumo = resumoParaSolicitante(demanda(STATUS.EM_ANDAMENTO))
    expect(resumo).not.toHaveProperty('historico')
    expect(resumo).not.toHaveProperty('prazo')
    expect(resumo).not.toHaveProperty('prioridade')
    expect(resumo.setorAtual).toBe('eletrica')
  })

  it('em triagem, o setor atual é o Gerenciamento', () => {
    expect(resumoParaSolicitante(demanda(STATUS.EM_TRIAGEM)).setorAtual).toBe('gerenciamento')
  })

  it('pendente aparece como "Não aceita pelo setor"', () => {
    expect(resumoParaSolicitante(demanda(STATUS.PENDENTE_ACEITE)).status).toBe('Não aceita pelo setor')
  })
})

describe('aceite e prioridade (RN05, RN10)', () => {
  it('executor aceita e define prioridade de demanda pendente', () => {
    const d = demanda(STATUS.PENDENTE_ACEITE)
    expect(podeAceitar(eletrica, d)).toBe(true)
    expect(podeDefinirPrioridade(eletrica, d)).toBe(true)
  })

  it('gerência NÃO aceita e NÃO define prioridade (CA-R02)', () => {
    const d = demanda(STATUS.PENDENTE_ACEITE)
    expect(podeAceitar(admin, d)).toBe(false)
    expect(podeDefinirPrioridade(admin, d)).toBe(false)
  })

  it('quem só abriu NÃO define prioridade', () => {
    expect(podeDefinirPrioridade(hidraulica, demanda(STATUS.PENDENTE_ACEITE))).toBe(false)
  })

  it('depois do aceite a prioridade fica travada, até para o executor', () => {
    expect(podeDefinirPrioridade(eletrica, demanda(STATUS.EM_ANDAMENTO))).toBe(false)
  })
})

describe('recusar, redirecionar e cancelar (RN11, RN18, RN19)', () => {
  it('executor recusa pendente ou em andamento; NÃO recusa em triagem', () => {
    expect(podeRecusar(eletrica, demanda(STATUS.PENDENTE_ACEITE))).toBe(true)
    expect(podeRecusar(eletrica, demanda(STATUS.EM_ANDAMENTO))).toBe(true)
    expect(podeRecusar(eletrica, demanda(STATUS.EM_TRIAGEM))).toBe(false)
  })

  it('quem só abriu NÃO recusa', () => {
    expect(podeRecusar(hidraulica, demanda(STATUS.PENDENTE_ACEITE))).toBe(false)
  })

  it('só a gerência redireciona, e só em triagem (CA-R11)', () => {
    expect(podeRedirecionar(admin, demanda(STATUS.EM_TRIAGEM))).toBe(true)
    expect(podeRedirecionar(admin, demanda(STATUS.EM_ANDAMENTO))).toBe(false)
    expect(podeRedirecionar(eletrica, demanda(STATUS.EM_TRIAGEM))).toBe(false)
    expect(podeRedirecionar(hidraulica, demanda(STATUS.EM_TRIAGEM))).toBe(false)
  })

  it('gerência cancela demanda ativa; setor NÃO cancela', () => {
    expect(podeCancelar(admin, demanda(STATUS.EM_ANDAMENTO))).toBe(true)
    expect(podeCancelar(eletrica, demanda(STATUS.EM_ANDAMENTO))).toBe(false)
  })
})

describe('novo prazo e cobrança (RN14, RN21)', () => {
  it('executor registra novo prazo enquanto o prazo corre', () => {
    expect(podeRegistrarPrazo(eletrica, demanda(STATUS.EM_ANDAMENTO))).toBe(true)
    expect(podeRegistrarPrazo(eletrica, demanda(STATUS.AGUARDANDO))).toBe(true)
  })

  it('gerência e quem abriu NÃO registram prazo; pendente também não', () => {
    expect(podeRegistrarPrazo(admin, demanda(STATUS.EM_ANDAMENTO))).toBe(false)
    expect(podeRegistrarPrazo(hidraulica, demanda(STATUS.EM_ANDAMENTO))).toBe(false)
    expect(podeRegistrarPrazo(eletrica, demanda(STATUS.PENDENTE_ACEITE))).toBe(false)
  })

  it('só a gerência cobra posição', () => {
    expect(podeCobrar(admin, demanda(STATUS.EM_ANDAMENTO))).toBe(true)
  })

  it('setor executor e quem abriu NÃO cobram', () => {
    expect(podeCobrar(eletrica, demanda(STATUS.EM_ANDAMENTO))).toBe(false)
    expect(podeCobrar(hidraulica, demanda(STATUS.EM_ANDAMENTO))).toBe(false)
  })
})

describe('demanda final: nenhuma ação para ninguém (RN20, CA-R07)', () => {
  it.each([STATUS.CONCLUIDA, STATUS.NAO_APLICAVEL, STATUS.CANCELADA])('%s', (status) => {
    const d = demanda(status)
    for (const usuario of [admin, eletrica, hidraulica]) {
      expect(podeAceitar(usuario, d)).toBe(false)
      expect(podeDefinirPrioridade(usuario, d)).toBe(false)
      expect(podeRecusar(usuario, d)).toBe(false)
      expect(podeRedirecionar(usuario, d)).toBe(false)
      expect(podeCancelar(usuario, d)).toBe(false)
      expect(podeRegistrarPrazo(usuario, d)).toBe(false)
      expect(podeCobrar(usuario, d)).toBe(false)
    }
  })
})
