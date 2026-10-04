import { describe, expect, it } from 'vitest'
import {
  ERROS_ACAO,
  LIMITE_JUSTIFICATIVA,
  LIMITE_MOTIVO,
  LIMITE_OBSERVACAO,
  aceitarDemanda,
  cancelarDemanda,
  marcarNaoAplicavel,
  motivoDaTriagem,
  podeEditar,
  recusarDemanda,
  redirecionarDemanda,
  salvarAtualizacao,
  statusParaEdicao,
} from './acoes.js'
import { podeAceitar, podeDefinirPrioridade, podeVer, podeVerDetalhes, resumoParaSolicitante } from './permissoes.js'
import { STATUS } from './status.js'

const AGORA = new Date('2026-10-05T12:00:00Z')

const admin = { usuario: 'admin', nome: 'Gerenciamento', perfil: 'gerenciamento', departamento: null }
const eletrica = { usuario: 'user04', nome: 'Equipe de Elétrica', perfil: 'departamento', departamento: 'eletrica' }
const hidraulica = { usuario: 'user02', nome: 'Equipe de Hidráulica', perfil: 'departamento', departamento: 'hidraulica' }

const TIPOS_ELETRICA = ['Iluminação', 'Tomadas e instalações', 'Quadro de distribuição', 'Outros']

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

  it('aceita trocar para "Outros" na tela Atualizar', () => {
    const resultado = salvarAtualizacao(demanda(STATUS.EM_ANDAMENTO), { tipo: 'Outros' }, eletrica, contexto())
    expect(resultado.ok).toBe(true)
    expect(resultado.dados.tipo).toBe('Outros')
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

describe('aceitarDemanda (RN09, RN10, RN13, CA-R03)', () => {
  const pendente = () => demanda(STATUS.PENDENTE_ACEITE, { prioridade: 'Não definida', aceitaEm: null, prazo: null })

  it('executor aceita: Em andamento, prioridade gravada, aceite agora, prazo calculado e histórico', () => {
    const resultado = aceitarDemanda(pendente(), 'Alta', eletrica, contexto())
    expect(resultado.ok).toBe(true)
    expect(resultado.dados).toMatchObject({
      status: STATUS.EM_ANDAMENTO,
      prioridade: 'Alta',
      aceitaEm: AGORA.toISOString(),
      prazo: '2026-10-07T12:00:00.000Z',
    })
    expect(resultado.dados.historico.at(-1)).toMatchObject({
      autor: 'Equipe de Elétrica',
      perfil: 'departamento',
      data: AGORA.toISOString(),
      tipo: 'aceite',
      texto: 'Demanda aceita com prioridade Alta.',
    })
    expect(resultado.dados.historico).toHaveLength(2)
  })

  it('prazo de cada prioridade a partir do aceite (RN13)', () => {
    const prazo = (p) => aceitarDemanda(pendente(), p, eletrica, contexto()).dados.prazo
    expect(prazo('Urgente')).toBe('2026-10-06T12:00:00.000Z')
    expect(prazo('Média')).toBe('2026-10-08T12:00:00.000Z')
    expect(prazo('Baixa')).toBe('2026-10-12T12:00:00.000Z')
  })

  it('depois do aceite a prioridade fica travada (CA-R03)', () => {
    const aceita = aceitarDemanda(pendente(), 'Média', eletrica, contexto()).dados
    expect(podeDefinirPrioridade(eletrica, aceita)).toBe(false)
  })

  it('NÃO aceita sem prioridade, com "Não definida" ou com valor inventado', () => {
    for (const p of [undefined, '', 'Não definida', 'Altíssima']) {
      expect(aceitarDemanda(pendente(), p, eletrica, contexto())).toEqual({ ok: false, erro: ERROS_ACAO.PRIORIDADE_AUSENTE })
    }
  })

  it('NÃO aceita por perfil errado: gerência e quem só abriu', () => {
    expect(aceitarDemanda(pendente(), 'Alta', admin, contexto()).erro).toBe(ERROS_ACAO.SEM_PERMISSAO)
    expect(aceitarDemanda(pendente(), 'Alta', hidraulica, contexto()).erro).toBe(ERROS_ACAO.SEM_PERMISSAO)
  })

  it('NÃO aceita fora de Pendente de aceite (Em andamento, Aguardando)', () => {
    for (const status of [STATUS.EM_ANDAMENTO, STATUS.AGUARDANDO]) {
      expect(aceitarDemanda(demanda(status), 'Alta', eletrica, contexto()).erro).toBe(ERROS_ACAO.TRANSICAO_INVALIDA)
    }
  })

  it('em triagem o setor de destino nem é mais executor: sem permissão (demanda da gerência)', () => {
    expect(aceitarDemanda(demanda(STATUS.EM_TRIAGEM), 'Alta', eletrica, contexto()).erro).toBe(ERROS_ACAO.SEM_PERMISSAO)
  })

  it('NÃO aceita demanda final (RN20)', () => {
    for (const status of [STATUS.CONCLUIDA, STATUS.NAO_APLICAVEL, STATUS.CANCELADA]) {
      expect(aceitarDemanda(demanda(status), 'Alta', eletrica, contexto()).erro).toBe(ERROS_ACAO.FINALIZADA)
    }
  })
})

describe('recusarDemanda (RN11, CA-R04)', () => {
  const pendente = () => demanda(STATUS.PENDENTE_ACEITE, { prioridade: 'Não definida' })

  it('executor recusa com motivo: Em triagem, destino mantido e histórico com o motivo', () => {
    const resultado = recusarDemanda(pendente(), '  Fiação não é com a Elétrica predial.  ', eletrica, contexto())
    expect(resultado.ok).toBe(true)
    expect(resultado.dados.status).toBe(STATUS.EM_TRIAGEM)
    expect(resultado.dados.destino).toBe('eletrica')
    expect(resultado.dados.historico.at(-1)).toMatchObject({
      autor: 'Equipe de Elétrica',
      perfil: 'departamento',
      data: AGORA.toISOString(),
      tipo: 'recusa',
      texto: 'Recusada: Fiação não é com a Elétrica predial.',
    })
  })

  it('quem abriu passa a ver o setor atual "gerenciamento", sem o motivo (RN03)', () => {
    const recusada = recusarDemanda(pendente(), 'Não é do setor.', eletrica, contexto()).dados
    const resumo = resumoParaSolicitante(recusada)
    expect(resumo.setorAtual).toBe('gerenciamento')
    expect(resumo).not.toHaveProperty('historico')
  })

  it('NÃO recusa com motivo vazio ou só com espaços (CA-R04)', () => {
    for (const motivo of [undefined, '', '    ']) {
      expect(recusarDemanda(pendente(), motivo, eletrica, contexto())).toEqual({ ok: false, erro: ERROS_ACAO.MOTIVO_AUSENTE })
    }
  })

  it('motivo: 500 caracteres passa, 501 é recusado', () => {
    expect(recusarDemanda(pendente(), 'a'.repeat(LIMITE_MOTIVO), eletrica, contexto()).ok).toBe(true)
    expect(recusarDemanda(pendente(), 'a'.repeat(LIMITE_MOTIVO + 1), eletrica, contexto()).erro).toBe(ERROS_ACAO.MOTIVO_LONGO)
  })

  it('NÃO recusa por perfil errado: gerência e quem só abriu', () => {
    expect(recusarDemanda(pendente(), 'Motivo', admin, contexto()).erro).toBe(ERROS_ACAO.SEM_PERMISSAO)
    expect(recusarDemanda(pendente(), 'Motivo', hidraulica, contexto()).erro).toBe(ERROS_ACAO.SEM_PERMISSAO)
  })

  it('NÃO recusa fora de Pendente de aceite (devolver de Em andamento é da parte B)', () => {
    expect(recusarDemanda(demanda(STATUS.EM_ANDAMENTO), 'Motivo', eletrica, contexto()).erro).toBe(
      ERROS_ACAO.TRANSICAO_INVALIDA,
    )
  })

  it('NÃO recusa demanda final (RN20)', () => {
    expect(recusarDemanda(demanda(STATUS.CONCLUIDA), 'Motivo', eletrica, contexto()).erro).toBe(ERROS_ACAO.FINALIZADA)
  })
})

describe('Bloco 4C — ações da gerência em triagem (RN18, RN19, RN20)', () => {
  // Hidráulica abriu para a Elétrica; a Elétrica recusou; está com a gerência.
  const administrativo = { usuario: 'user03', nome: 'Equipe Administrativa', perfil: 'departamento', departamento: 'administrativo' }
  const emTriagem = () =>
    demanda(STATUS.EM_TRIAGEM, {
      prioridade: 'Não definida',
      criadaEm: '2026-10-04T12:00:00Z',
      historico: [
        { id: 'h1', tipo: 'criacao', texto: 'Demanda criada.', autor: 'Equipe de Hidráulica', data: '2026-10-04T12:00:00Z' },
        { id: 'h2', tipo: 'recusa', texto: 'Recusada: não é da Elétrica.', autor: 'Equipe de Elétrica', data: '2026-10-04T20:00:00Z' },
      ],
    })
  const destinoAdm = { setor: 'administrativo', tipo: 'Compras e materiais' }

  describe('redirecionar', () => {
    it('gerência redireciona: Pendente de aceite, novo destino e tipo, histórico com setor e tipo', () => {
      const resultado = redirecionarDemanda(emTriagem(), destinoAdm, admin, contexto())
      expect(resultado.ok).toBe(true)
      const nova = resultado.dados
      expect(nova.status).toBe(STATUS.PENDENTE_ACEITE)
      expect(nova.destino).toBe('administrativo')
      expect(nova.tipo).toBe('Compras e materiais')
      expect(nova.redirecionadaEm).toBe(AGORA.toISOString())
      expect(nova.prioridade).toBe('Não definida')
      const ultimo = nova.historico[nova.historico.length - 1]
      expect(ultimo).toMatchObject({
        tipo: 'redirecionamento',
        setor: 'administrativo',
        tipoAtendimento: 'Compras e materiais',
        autor: 'Gerenciamento',
        perfil: 'gerenciamento',
        data: AGORA.toISOString(),
      })
      expect(ultimo.texto).toBe('Redirecionada para Administrativo, tipo "Compras e materiais".')
      // Histórico só cresce: os itens antigos continuam iguais.
      expect(nova.historico.slice(0, 2)).toEqual(emTriagem().historico)
    })

    it('pode escolher de novo o setor que recusou (sem regra nova)', () => {
      expect(redirecionarDemanda(emTriagem(), { setor: 'eletrica', tipo: 'Outros' }, admin, contexto()).ok).toBe(true)
    })

    it('demanda devolvida já aceita: prioridade e prazos antigos não passam ao novo setor', () => {
      const devolvida = { ...emTriagem(), prioridade: 'Alta', aceitaEm: '2026-10-04T13:00:00Z', prazo: '2026-10-06T13:00:00Z', aguardandoDesde: '2026-10-04T14:00:00Z' }
      const nova = redirecionarDemanda(devolvida, destinoAdm, admin, contexto()).dados
      expect([nova.prioridade, nova.aceitaEm, nova.prazo, nova.aguardandoDesde]).toEqual(['Não definida', null, null, null])
    })

    it('visibilidade depois: o novo setor recebe; quem recusou não vê; quem abriu vê só o resumo com o novo setor', () => {
      const nova = redirecionarDemanda(emTriagem(), destinoAdm, admin, contexto()).dados
      expect(podeAceitar(administrativo, nova)).toBe(true)
      expect(podeVer(eletrica, nova)).toBe(false)
      expect(podeVerDetalhes(hidraulica, nova)).toBe(false)
      expect(resumoParaSolicitante(nova).setorAtual).toBe('administrativo')
      expect(resumoParaSolicitante(nova).status).toBe('Não aceita pelo setor')
    })

    it('NÃO redireciona: setor comum (o que recusou, quem abriu, outro)', () => {
      for (const usuario of [eletrica, hidraulica, administrativo]) {
        expect(redirecionarDemanda(emTriagem(), destinoAdm, usuario, contexto()).erro).toBe(ERROS_ACAO.SEM_PERMISSAO)
      }
    })

    it('NÃO redireciona fora de Em triagem (pendente, em andamento, aguardando)', () => {
      for (const status of [STATUS.PENDENTE_ACEITE, STATUS.EM_ANDAMENTO, STATUS.AGUARDANDO]) {
        expect(redirecionarDemanda(demanda(status), destinoAdm, admin, contexto()).erro).toBe(ERROS_ACAO.TRANSICAO_INVALIDA)
      }
    })

    it('NÃO redireciona demanda final (RN20)', () => {
      for (const status of [STATUS.CONCLUIDA, STATUS.NAO_APLICAVEL, STATUS.CANCELADA]) {
        expect(redirecionarDemanda(demanda(status), destinoAdm, admin, contexto()).erro).toBe(ERROS_ACAO.FINALIZADA)
      }
    })

    it('NÃO redireciona para setor inválido: vazio, inventado ou "gerenciamento"', () => {
      for (const setor of ['', undefined, 'financeiro', 'gerenciamento']) {
        expect(redirecionarDemanda(emTriagem(), { setor, tipo: 'Outros' }, admin, contexto()).erro).toBe(ERROS_ACAO.SETOR_INVALIDO)
      }
    })

    it('NÃO redireciona com tipo que não existe no novo setor (nem vazio)', () => {
      expect(redirecionarDemanda(emTriagem(), { setor: 'administrativo', tipo: 'Iluminação' }, admin, contexto()).erro).toBe(ERROS_ACAO.TIPO_INVALIDO)
      expect(redirecionarDemanda(emTriagem(), { setor: 'administrativo', tipo: '' }, admin, contexto()).erro).toBe(ERROS_ACAO.TIPO_INVALIDO)
    })
  })

  describe('não aplicável e cancelar', () => {
    it('gerência marca Não aplicável com justificativa; histórico registra', () => {
      const resultado = marcarNaoAplicavel(emTriagem(), '  Nenhum setor atende isso.  ', admin, contexto())
      expect(resultado.dados.status).toBe(STATUS.NAO_APLICAVEL)
      expect(resultado.dados.historico.at(-1)).toMatchObject({ tipo: 'encerramento', texto: 'Não aplicável: Nenhum setor atende isso.', autor: 'Gerenciamento' })
    })

    it('gerência cancela com justificativa; histórico registra', () => {
      const resultado = cancelarDemanda(emTriagem(), 'Pedido duplicado.', admin, contexto())
      expect(resultado.dados.status).toBe(STATUS.CANCELADA)
      expect(resultado.dados.historico.at(-1)).toMatchObject({ tipo: 'encerramento', texto: 'Cancelada: Pedido duplicado.' })
    })

    it('justificativa vazia, só espaços ou acima de 500 caracteres: bloqueia', () => {
      for (const acao of [marcarNaoAplicavel, cancelarDemanda]) {
        expect(acao(emTriagem(), '', admin, contexto()).erro).toBe(ERROS_ACAO.JUSTIFICATIVA_AUSENTE)
        expect(acao(emTriagem(), '   ', admin, contexto()).erro).toBe(ERROS_ACAO.JUSTIFICATIVA_AUSENTE)
        expect(acao(emTriagem(), 'x'.repeat(LIMITE_JUSTIFICATIVA + 1), admin, contexto()).erro).toBe(ERROS_ACAO.JUSTIFICATIVA_LONGA)
        expect(acao(emTriagem(), 'x'.repeat(LIMITE_JUSTIFICATIVA), admin, contexto()).ok).toBe(true)
      }
      expect(LIMITE_JUSTIFICATIVA).toBe(500)
    })

    it('setor comum NÃO marca nem cancela', () => {
      for (const usuario of [eletrica, hidraulica, administrativo]) {
        expect(marcarNaoAplicavel(emTriagem(), 'J', usuario, contexto()).erro).toBe(ERROS_ACAO.SEM_PERMISSAO)
        expect(cancelarDemanda(emTriagem(), 'J', usuario, contexto()).erro).toBe(ERROS_ACAO.SEM_PERMISSAO)
      }
    })

    it('Não aplicável só a partir de Em triagem (seção 4)', () => {
      for (const status of [STATUS.PENDENTE_ACEITE, STATUS.EM_ANDAMENTO, STATUS.AGUARDANDO]) {
        expect(marcarNaoAplicavel(demanda(status), 'J', admin, contexto()).erro).toBe(ERROS_ACAO.TRANSICAO_INVALIDA)
      }
    })

    it('Cancelar: o domínio permite o que a seção 4 permite (Pendente, Andamento, Aguardando, Triagem)', () => {
      for (const status of [STATUS.PENDENTE_ACEITE, STATUS.EM_ANDAMENTO, STATUS.AGUARDANDO, STATUS.EM_TRIAGEM]) {
        expect(cancelarDemanda(demanda(status), 'J', admin, contexto()).ok).toBe(true)
      }
    })

    it('estado final não muda (RN20): nenhuma ação passa, nem da gerência', () => {
      const encerrada = marcarNaoAplicavel(emTriagem(), 'J', admin, contexto()).dados
      expect(cancelarDemanda(encerrada, 'J', admin, contexto()).erro).toBe(ERROS_ACAO.FINALIZADA)
      expect(marcarNaoAplicavel(encerrada, 'J', admin, contexto()).erro).toBe(ERROS_ACAO.FINALIZADA)
      expect(redirecionarDemanda(encerrada, destinoAdm, admin, contexto()).erro).toBe(ERROS_ACAO.FINALIZADA)
      const cancelada = cancelarDemanda(emTriagem(), 'J', admin, contexto()).dados
      expect(redirecionarDemanda(cancelada, destinoAdm, admin, contexto()).erro).toBe(ERROS_ACAO.FINALIZADA)
    })
  })

  it('motivoDaTriagem: último motivo de recusa e quem recusou', () => {
    expect(motivoDaTriagem(emTriagem())).toEqual({ texto: 'não é da Elétrica.', autor: 'Equipe de Elétrica', data: '2026-10-04T20:00:00Z' })
    expect(motivoDaTriagem(demanda(STATUS.EM_TRIAGEM))).toBeNull()
  })
})
