import { describe, expect, it } from 'vitest'
import { ERROS_ACAO, LIMITE_OBSERVACAO, podeEditar, salvarAtualizacao, statusParaEdicao } from './acoes.js'
import { STATUS } from './status.js'

const AGORA = new Date('2026-10-05T12:00:00Z')

const admin = { usuario: 'admin', nome: 'Gerenciamento', perfil: 'gerenciamento', departamento: null }
const eletrica = { usuario: 'user04', nome: 'Equipe de Elétrica', perfil: 'departamento', departamento: 'eletrica' }
const hidraulica = { usuario: 'user02', nome: 'Equipe de Hidráulica', perfil: 'departamento', departamento: 'hidraulica' }

const TIPOS_ELETRICA = ['Iluminação', 'Tomadas e instalações', 'Quadro de distribuição']

function demanda(status, extra = {}) {
  return {
    id: 'DM-9999',
    origem: 'hidraulica',
    destino: 'eletrica',
    tipo: 'Iluminação',
    status,
    aguardandoDesde: null,
    historico: [{ id: 'h1', texto: 'Demanda criada.' }],
    ...extra,
  }
}

function contexto() {
  let contador = 0
  return { agora: AGORA, novoId: () => `ev-${++contador}`, tiposValidos: TIPOS_ELETRICA }
}

describe('quem pode editar', () => {
  it('executor edita em andamento e aguardando', () => {
    expect(podeEditar(eletrica, demanda(STATUS.EM_ANDAMENTO))).toBe(true)
    expect(podeEditar(eletrica, demanda(STATUS.AGUARDANDO))).toBe(true)
  })

  it('gerência e quem abriu NÃO editam', () => {
    expect(podeEditar(admin, demanda(STATUS.EM_ANDAMENTO))).toBe(false)
    expect(podeEditar(hidraulica, demanda(STATUS.EM_ANDAMENTO))).toBe(false)
  })

  it('pendente (precisa de aceite com prioridade) e triagem NÃO são editáveis aqui', () => {
    expect(podeEditar(eletrica, demanda(STATUS.PENDENTE_ACEITE))).toBe(false)
    expect(podeEditar(eletrica, demanda(STATUS.EM_TRIAGEM))).toBe(false)
  })

  it('opções de status: atual + transições simples', () => {
    expect(statusParaEdicao(eletrica, demanda(STATUS.EM_ANDAMENTO))).toEqual([
      STATUS.EM_ANDAMENTO,
      STATUS.AGUARDANDO,
      STATUS.CONCLUIDA,
    ])
    expect(statusParaEdicao(admin, demanda(STATUS.EM_ANDAMENTO))).toEqual([])
  })
})

describe('salvarAtualizacao', () => {
  it('muda o status, registra no histórico com autor e data, e mantém o histórico antigo', () => {
    const resultado = salvarAtualizacao(demanda(STATUS.EM_ANDAMENTO), { status: STATUS.CONCLUIDA }, eletrica, contexto())
    expect(resultado.ok).toBe(true)
    expect(resultado.dados.status).toBe(STATUS.CONCLUIDA)
    expect(resultado.dados.historico).toHaveLength(2)
    expect(resultado.dados.historico[0]).toEqual({ id: 'h1', texto: 'Demanda criada.' })
    expect(resultado.dados.historico[1]).toMatchObject({
      id: 'ev-1',
      data: AGORA.toISOString(),
      autor: 'Equipe de Elétrica',
      perfil: 'departamento',
      tipo: 'status',
    })
  })

  it('entrar em Aguardando marca aguardandoDesde; sair limpa', () => {
    const entrou = salvarAtualizacao(demanda(STATUS.EM_ANDAMENTO), { status: STATUS.AGUARDANDO }, eletrica, contexto())
    expect(entrou.dados.aguardandoDesde).toBe(AGORA.toISOString())
    const saiu = salvarAtualizacao(entrou.dados, { status: STATUS.EM_ANDAMENTO }, eletrica, contexto())
    expect(saiu.dados.aguardandoDesde).toBeNull()
  })

  it('troca o tipo, desde que seja do setor de destino', () => {
    const resultado = salvarAtualizacao(demanda(STATUS.EM_ANDAMENTO), { tipo: 'Tomadas e instalações' }, eletrica, contexto())
    expect(resultado.ok).toBe(true)
    expect(resultado.dados.tipo).toBe('Tomadas e instalações')
  })

  it('NÃO aceita tipo de outro setor', () => {
    const resultado = salvarAtualizacao(demanda(STATUS.EM_ANDAMENTO), { tipo: 'Vazamento' }, eletrica, contexto())
    expect(resultado).toEqual({ ok: false, erro: ERROS_ACAO.TIPO_INVALIDO })
  })

  it('NÃO faz transição que exige dado extra (triagem precisa de motivo; Bloco 4)', () => {
    const resultado = salvarAtualizacao(demanda(STATUS.EM_ANDAMENTO), { status: STATUS.EM_TRIAGEM }, eletrica, contexto())
    expect(resultado).toEqual({ ok: false, erro: ERROS_ACAO.TRANSICAO_INVALIDA })
  })

  it('NÃO deixa o executor cancelar', () => {
    const resultado = salvarAtualizacao(demanda(STATUS.EM_ANDAMENTO), { status: STATUS.CANCELADA }, eletrica, contexto())
    expect(resultado.erro).toBe(ERROS_ACAO.TRANSICAO_INVALIDA)
  })

  it('gerência e quem abriu NÃO salvam', () => {
    expect(salvarAtualizacao(demanda(STATUS.EM_ANDAMENTO), { status: STATUS.CONCLUIDA }, admin, contexto()).erro).toBe(
      ERROS_ACAO.SEM_PERMISSAO,
    )
    expect(
      salvarAtualizacao(demanda(STATUS.EM_ANDAMENTO), { status: STATUS.CONCLUIDA }, hidraulica, contexto()).erro,
    ).toBe(ERROS_ACAO.SEM_PERMISSAO)
  })

  it('demanda final NÃO muda, nem pelo executor (RN20)', () => {
    for (const status of [STATUS.CONCLUIDA, STATUS.NAO_APLICAVEL, STATUS.CANCELADA]) {
      const resultado = salvarAtualizacao(demanda(status), { status: STATUS.EM_ANDAMENTO }, eletrica, contexto())
      expect(resultado).toEqual({ ok: false, erro: ERROS_ACAO.FINALIZADA })
    }
  })

  it('observação vai no mesmo item da mudança, com autor, perfil e data', () => {
    const resultado = salvarAtualizacao(
      demanda(STATUS.EM_ANDAMENTO),
      { status: STATUS.AGUARDANDO, observacao: '  Aguardando peça do fornecedor.  ' },
      eletrica,
      contexto(),
    )
    expect(resultado.ok).toBe(true)
    expect(resultado.dados.historico).toHaveLength(2)
    expect(resultado.dados.historico[1]).toMatchObject({
      autor: 'Equipe de Elétrica',
      perfil: 'departamento',
      data: AGORA.toISOString(),
      tipo: 'status',
      texto: 'Status alterado de "Em andamento" para "Aguardando (processamento interno)". Observação: Aguardando peça do fornecedor.',
    })
  })

  it('só a observação, sem mudar status nem tipo, também é salva', () => {
    const resultado = salvarAtualizacao(
      demanda(STATUS.EM_ANDAMENTO),
      { status: STATUS.EM_ANDAMENTO, tipo: 'Iluminação', observacao: 'Visita técnica marcada para amanhã.' },
      eletrica,
      contexto(),
    )
    expect(resultado.ok).toBe(true)
    expect(resultado.dados.status).toBe(STATUS.EM_ANDAMENTO)
    expect(resultado.dados.historico[1]).toMatchObject({
      autor: 'Equipe de Elétrica',
      perfil: 'departamento',
      data: AGORA.toISOString(),
      tipo: 'observacao',
      texto: 'Observação: Visita técnica marcada para amanhã.',
    })
  })

  it('observação acima de 500 caracteres NÃO é salva', () => {
    const resultado = salvarAtualizacao(
      demanda(STATUS.EM_ANDAMENTO),
      { observacao: 'a'.repeat(LIMITE_OBSERVACAO + 1) },
      eletrica,
      contexto(),
    )
    expect(resultado).toEqual({ ok: false, erro: ERROS_ACAO.OBSERVACAO_LONGA })
  })

  it('observação com exatamente 500 caracteres é aceita', () => {
    const resultado = salvarAtualizacao(
      demanda(STATUS.EM_ANDAMENTO),
      { observacao: 'a'.repeat(LIMITE_OBSERVACAO) },
      eletrica,
      contexto(),
    )
    expect(resultado.ok).toBe(true)
  })

  it('observação só com espaços conta como vazia', () => {
    const resultado = salvarAtualizacao(demanda(STATUS.EM_ANDAMENTO), { observacao: '   ' }, eletrica, contexto())
    expect(resultado).toEqual({ ok: false, erro: ERROS_ACAO.SEM_ALTERACAO })
  })

  it('quem não pode editar NÃO grava observação', () => {
    const resultado = salvarAtualizacao(demanda(STATUS.EM_ANDAMENTO), { observacao: 'Oi' }, admin, contexto())
    expect(resultado.erro).toBe(ERROS_ACAO.SEM_PERMISSAO)
  })

  it('sem nenhuma mudança devolve erro, sem gravar histórico vazio', () => {
    const resultado = salvarAtualizacao(demanda(STATUS.EM_ANDAMENTO), { status: STATUS.EM_ANDAMENTO, tipo: 'Iluminação' }, eletrica, contexto())
    expect(resultado).toEqual({ ok: false, erro: ERROS_ACAO.SEM_ALTERACAO })
  })
})
