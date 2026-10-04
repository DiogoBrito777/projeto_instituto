import { describe, expect, it } from 'vitest'
import {
  ERROS_NOVA,
  LIMITE_DESCRICAO,
  LIMITE_TITULO,
  montarNovaDemanda,
  origemDoUsuario,
  primeiroCampoComErro,
  validarNovaDemanda,
} from './novaDemanda.js'
import { STATUS } from './status.js'
import { tiposDoSetor } from './setores.js'

const admin = { usuario: 'admin', nome: 'Gerenciamento', perfil: 'gerenciamento', departamento: null }
const ti = { usuario: 'user01', nome: 'Equipe de TI', perfil: 'departamento', departamento: 'tecnologia' }

const VALIDA = {
  destino: 'eletrica',
  tipo: 'Iluminação',
  titulo: 'Lâmpada queimada',
  descricao: 'A lâmpada do corredor do bloco A queimou.',
}

const contexto = { agora: new Date('2026-10-05T12:00:00Z'), novoId: () => 'ev-1' }

describe('origem automática (RN07)', () => {
  it('setor: origem é o próprio departamento; gerência: "gerenciamento"', () => {
    expect(origemDoUsuario(ti)).toBe('tecnologia')
    expect(origemDoUsuario(admin)).toBe('gerenciamento')
  })
})

describe('validarNovaDemanda', () => {
  it('formulário completo e correto não tem erros', () => {
    expect(validarNovaDemanda(VALIDA, ti)).toEqual({})
  })

  it('formulário vazio: erro em todos os campos, foco no destino (o primeiro)', () => {
    const erros = validarNovaDemanda({ destino: '', tipo: '', titulo: '', descricao: '' }, ti)
    expect(erros).toEqual({
      destino: ERROS_NOVA.DESTINO_VAZIO,
      tipo: ERROS_NOVA.TIPO_SEM_DESTINO,
      titulo: ERROS_NOVA.TITULO_VAZIO,
      descricao: ERROS_NOVA.DESCRICAO_VAZIA,
    })
    expect(primeiroCampoComErro(erros)).toBe('destino')
  })

  it('setor NÃO envia para o próprio setor (CA-R11)', () => {
    const erros = validarNovaDemanda({ ...VALIDA, destino: 'tecnologia', tipo: 'Rede e internet' }, ti)
    expect(erros.destino).toBe(ERROS_NOVA.DESTINO_PROPRIO)
  })

  it('gerência pode enviar para qualquer um dos 4 setores', () => {
    for (const destino of ['tecnologia', 'hidraulica', 'administrativo', 'eletrica']) {
      expect(validarNovaDemanda({ ...VALIDA, destino, tipo: '' }, admin).destino).toBeUndefined()
    }
  })

  it('tipo de OUTRO setor é recusado', () => {
    expect(validarNovaDemanda({ ...VALIDA, tipo: 'Vazamento' }, ti).tipo).toBe(ERROS_NOVA.TIPO_INVALIDO)
  })

  it('"Outros" é aceito como tipo em cada um dos 4 setores, e é o último da lista', () => {
    for (const destino of ['tecnologia', 'hidraulica', 'administrativo', 'eletrica']) {
      expect(validarNovaDemanda({ ...VALIDA, destino, tipo: 'Outros' }, admin).tipo).toBeUndefined()
      expect(tiposDoSetor(destino).at(-1)).toBe('Outros')
    }
  })

  it('tipo vazio com destino escolhido', () => {
    expect(validarNovaDemanda({ ...VALIDA, tipo: '' }, ti).tipo).toBe(ERROS_NOVA.TIPO_VAZIO)
  })

  it('título: 60 caracteres passa, 61 é recusado, só espaços é vazio', () => {
    expect(validarNovaDemanda({ ...VALIDA, titulo: 'a'.repeat(LIMITE_TITULO) }, ti).titulo).toBeUndefined()
    expect(validarNovaDemanda({ ...VALIDA, titulo: 'a'.repeat(LIMITE_TITULO + 1) }, ti).titulo).toBe(ERROS_NOVA.TITULO_LONGO)
    expect(validarNovaDemanda({ ...VALIDA, titulo: '   ' }, ti).titulo).toBe(ERROS_NOVA.TITULO_VAZIO)
  })

  it('descrição: 500 caracteres passa, 501 é recusado', () => {
    expect(validarNovaDemanda({ ...VALIDA, descricao: 'a'.repeat(LIMITE_DESCRICAO) }, ti).descricao).toBeUndefined()
    expect(validarNovaDemanda({ ...VALIDA, descricao: 'a'.repeat(LIMITE_DESCRICAO + 1) }, ti).descricao).toBe(
      ERROS_NOVA.DESCRICAO_LONGA,
    )
  })

  it('o foco vai para o primeiro erro na ordem da tela', () => {
    expect(primeiroCampoComErro({ descricao: 'x', titulo: 'y' })).toBe('titulo')
    expect(primeiroCampoComErro({})).toBeNull()
  })
})

describe('montarNovaDemanda', () => {
  it('nasce Pendente de aceite, sem prioridade, com origem automática e item de criação', () => {
    const nova = montarNovaDemanda(VALIDA, ti, contexto)
    expect(nova).toMatchObject({
      origem: 'tecnologia',
      destino: 'eletrica',
      solicitante: 'Equipe de TI',
      status: STATUS.PENDENTE_ACEITE,
      prioridade: 'Não definida',
      criadaEm: '2026-10-05T12:00:00.000Z',
      aceitaEm: null,
      prazo: null,
    })
    expect(nova.historico).toEqual([
      { id: 'ev-1', data: '2026-10-05T12:00:00.000Z', autor: 'Equipe de TI', perfil: 'departamento', tipo: 'criacao', texto: 'Demanda criada.' },
    ])
  })

  it('quem abre NÃO escolhe prioridade nem origem: valores enviados são ignorados (RN07, RN08)', () => {
    const nova = montarNovaDemanda({ ...VALIDA, prioridade: 'Urgente', origem: 'hidraulica' }, ti, contexto)
    expect(nova.prioridade).toBe('Não definida')
    expect(nova.origem).toBe('tecnologia')
  })

  it('não define id: o número vem do storage', () => {
    expect(montarNovaDemanda(VALIDA, ti, contexto)).not.toHaveProperty('id')
  })

  it('gerência abre com origem "gerenciamento"', () => {
    expect(montarNovaDemanda(VALIDA, admin, contexto).origem).toBe('gerenciamento')
  })

  it('título e descrição são gravados sem espaços nas pontas', () => {
    const nova = montarNovaDemanda({ ...VALIDA, titulo: '  Lâmpada  ' }, ti, contexto)
    expect(nova.titulo).toBe('Lâmpada')
  })
})
