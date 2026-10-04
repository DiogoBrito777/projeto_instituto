// Ações que alteram uma demanda (RN20, RN22). Funções puras: recebem a demanda, o usuário e o
// contexto (agora e gerador de IDs) e devolvem { ok: true, dados: novaDemanda } ou { ok: false, erro }.
// Nada aqui grava; quem grava é o storage, depois que a ação foi aprovada.
//
// Mudanças "simples" de status (sem dado extra), aceite com prioridade e recusa com motivo (Bloco 4-A).
// Redirecionar, Não aplicável e Cancelar (gerência, com justificativa) vieram no Bloco 4C, no fim do
// arquivo. "Devolver à triagem" (de Em andamento/Aguardando) ainda não foi implementado.

import { ehExecutor, ehGerencia } from './permissoes.js'
import { calcularPrazoResolucao } from './prazos.js'
import { NAO_DEFINIDA, ehPrioridadeValida } from './prioridades.js'
import { nomeDoSetor, tiposDoSetor } from './setores.js'
import { STATUS, estaFinal, podeTransicionar } from './status.js'

export const ERROS_ACAO = {
  SEM_PERMISSAO: 'sem-permissao',
  FINALIZADA: 'finalizada',
  TRANSICAO_INVALIDA: 'transicao-invalida',
  TIPO_INVALIDO: 'tipo-invalido',
  OBSERVACAO_LONGA: 'observacao-longa',
  SEM_ALTERACAO: 'sem-alteracao',
  PRIORIDADE_AUSENTE: 'prioridade-ausente',
  MOTIVO_AUSENTE: 'motivo-ausente',
  MOTIVO_LONGO: 'motivo-longo',
  // Bloco 4C (ações da gerência).
  SETOR_INVALIDO: 'setor-invalido',
  JUSTIFICATIVA_AUSENTE: 'justificativa-ausente',
  JUSTIFICATIVA_LONGA: 'justificativa-longa',
}

// Mesmo limite da descrição da demanda (500 caracteres).
export const LIMITE_OBSERVACAO = 500
export const LIMITE_MOTIVO = 500

const STATUS_COM_PRAZO_CORRENDO = [STATUS.EM_ANDAMENTO, STATUS.AGUARDANDO]

// Em andamento ↔ Aguardando e → Concluída: o executor faz sem informar mais nada.
function ehTransicaoSimples(de, para) {
  return STATUS_COM_PRAZO_CORRENDO.includes(de) && [...STATUS_COM_PRAZO_CORRENDO, STATUS.CONCLUIDA].includes(para)
}

// A tela Atualizar só se abre para quem tem algo a alterar aqui.
export function podeEditar(usuario, demanda) {
  return ehExecutor(usuario, demanda) && STATUS_COM_PRAZO_CORRENDO.includes(demanda.status)
}

// Opções do select de status: o status atual + as transições simples permitidas.
export function statusParaEdicao(usuario, demanda) {
  if (!podeEditar(usuario, demanda)) return []
  const destinos = [STATUS.EM_ANDAMENTO, STATUS.AGUARDANDO, STATUS.CONCLUIDA].filter(
    (para) => para !== demanda.status && podeTransicionar(demanda.status, para, 'executor'),
  )
  return [demanda.status, ...destinos]
}

function evento(usuario, contexto, texto, tipo) {
  return {
    id: contexto.novoId(),
    data: contexto.agora.toISOString(),
    autor: usuario.nome,
    perfil: usuario.perfil,
    tipo,
    texto,
  }
}

// Salva o que a tela Atualizar permite mudar: status (transição simples), tipo de atendimento e
// uma observação opcional. Cada mudança vira um item no histórico (RN22). tiposValidos = tipos do setor de destino.
export function salvarAtualizacao(demanda, alteracoes, usuario, contexto) {
  if (estaFinal(demanda.status)) return { ok: false, erro: ERROS_ACAO.FINALIZADA }
  if (!podeEditar(usuario, demanda)) return { ok: false, erro: ERROS_ACAO.SEM_PERMISSAO }

  const observacao = (alteracoes.observacao ?? '').trim()
  if (observacao.length > LIMITE_OBSERVACAO) return { ok: false, erro: ERROS_ACAO.OBSERVACAO_LONGA }

  const eventos = []
  const nova = { ...demanda }

  if (alteracoes.tipo !== undefined && alteracoes.tipo !== demanda.tipo) {
    if (!contexto.tiposValidos.includes(alteracoes.tipo)) return { ok: false, erro: ERROS_ACAO.TIPO_INVALIDO }
    nova.tipo = alteracoes.tipo
    eventos.push(evento(usuario, contexto, `Tipo alterado de "${demanda.tipo}" para "${alteracoes.tipo}".`, 'tipo'))
  }

  if (alteracoes.status !== undefined && alteracoes.status !== demanda.status) {
    const permitida =
      ehTransicaoSimples(demanda.status, alteracoes.status) &&
      podeTransicionar(demanda.status, alteracoes.status, 'executor')
    if (!permitida) return { ok: false, erro: ERROS_ACAO.TRANSICAO_INVALIDA }

    nova.status = alteracoes.status
    // RN16: o selo "Aguardando há mais de 7 dias" conta a partir da entrada em Aguardando.
    nova.aguardandoDesde = alteracoes.status === STATUS.AGUARDANDO ? contexto.agora.toISOString() : null
    eventos.push(evento(usuario, contexto, `Status alterado de "${demanda.status}" para "${alteracoes.status}".`, 'status'))
  }

  // A observação vai junto da última mudança, no mesmo item do histórico; sozinha, vira um item próprio.
  if (observacao) {
    if (eventos.length > 0) {
      const ultimo = eventos[eventos.length - 1]
      ultimo.texto = `${ultimo.texto} Observação: ${observacao}`
    } else {
      eventos.push(evento(usuario, contexto, `Observação: ${observacao}`, 'observacao'))
    }
  }

  if (eventos.length === 0) return { ok: false, erro: ERROS_ACAO.SEM_ALTERACAO }

  // Histórico só cresce: itens antigos nunca são alterados (ERROR_HANDLING.md, seção 5).
  nova.historico = [...demanda.historico, ...eventos]
  return { ok: true, dados: nova }
}

// Conferências comuns ao aceite e à recusa: estado final (RN20), só o setor executor (matriz,
// seção 3) e só enquanto a demanda está Pendente de aceite (seção 4).
function conferirPendenteDoExecutor(demanda, usuario) {
  if (estaFinal(demanda.status)) return { ok: false, erro: ERROS_ACAO.FINALIZADA }
  if (!ehExecutor(usuario, demanda)) return { ok: false, erro: ERROS_ACAO.SEM_PERMISSAO }
  if (demanda.status !== STATUS.PENDENTE_ACEITE) return { ok: false, erro: ERROS_ACAO.TRANSICAO_INVALIDA }
  return { ok: true }
}

// RN10 + RN13: aceitar exige prioridade; o prazo conta a partir do aceite e fica gravado.
// Depois daqui a prioridade fica travada: podeDefinirPrioridade só vale com a demanda pendente.
// Aceitar depois de 72 h é permitido: a RN09 prevê só o selo "Aceite atrasado".
export function aceitarDemanda(demanda, prioridade, usuario, contexto) {
  const conferencia = conferirPendenteDoExecutor(demanda, usuario)
  if (!conferencia.ok) return conferencia
  if (!ehPrioridadeValida(prioridade)) return { ok: false, erro: ERROS_ACAO.PRIORIDADE_AUSENTE }

  const aceitaEm = contexto.agora.toISOString()
  return {
    ok: true,
    dados: {
      ...demanda,
      status: STATUS.EM_ANDAMENTO,
      prioridade,
      aceitaEm,
      prazo: calcularPrazoResolucao(aceitaEm, prioridade).toISOString(),
      historico: [
        ...demanda.historico,
        evento(usuario, contexto, `Demanda aceita com prioridade ${prioridade}.`, 'aceite'),
      ],
    },
  }
}

// RN11: recusar exige motivo; a demanda vai para Em triagem e passa a PERTENCER À GERÊNCIA.
// O destino não muda (auditoria; só a gerência redireciona, RN18), mas o setor que recusou perde o
// acesso enquanto ela estiver em triagem (permissoes.js → setorResponsavel; decisão de 04/10, a
// confirmar em ata). Quem abriu passa a ver o setor atual "Gerenciamento" (RN03).
export function recusarDemanda(demanda, motivo, usuario, contexto) {
  const conferencia = conferirPendenteDoExecutor(demanda, usuario)
  if (!conferencia.ok) return conferencia

  const texto = (motivo ?? '').trim()
  if (!texto) return { ok: false, erro: ERROS_ACAO.MOTIVO_AUSENTE }
  if (texto.length > LIMITE_MOTIVO) return { ok: false, erro: ERROS_ACAO.MOTIVO_LONGO }

  return {
    ok: true,
    dados: {
      ...demanda,
      status: STATUS.EM_TRIAGEM,
      historico: [...demanda.historico, evento(usuario, contexto, `Recusada: ${texto}`, 'recusa')],
    },
  }
}

// ---------------------------------------------------------------------------------------------
// Bloco 4C — ações da gerência (RN18, RN19, RN20; matriz da seção 3 e transições da seção 4).

// Mesmo limite do motivo da recusa (500 caracteres).
export const LIMITE_JUSTIFICATIVA = LIMITE_MOTIVO

// Por que a demanda está em triagem: o último item de recusa (ou devolução) do histórico.
// Só a gerência chega à tela que mostra isso; quem abriu nunca recebe o histórico (RN03).
export function motivoDaTriagem(demanda) {
  const eventos = (demanda.historico ?? []).filter((item) => ['recusa', 'devolucao'].includes(item.tipo))
  const ultimo = eventos[eventos.length - 1]
  if (!ultimo) return null
  return { texto: ultimo.texto.replace(/^Recusada:\s*/, ''), autor: ultimo.autor, data: ultimo.data }
}

// Conferências comuns: estado final (RN20), só a gerência (matriz) e só se a transição existe (seção 4).
function conferirGerencia(demanda, usuario, para) {
  if (estaFinal(demanda.status)) return { ok: false, erro: ERROS_ACAO.FINALIZADA }
  if (!ehGerencia(usuario)) return { ok: false, erro: ERROS_ACAO.SEM_PERMISSAO }
  if (!podeTransicionar(demanda.status, para, 'gerenciamento')) return { ok: false, erro: ERROS_ACAO.TRANSICAO_INVALIDA }
  return { ok: true }
}

function conferirJustificativa(justificativa) {
  const texto = (justificativa ?? '').trim()
  if (!texto) return { ok: false, erro: ERROS_ACAO.JUSTIFICATIVA_AUSENTE }
  if (texto.length > LIMITE_JUSTIFICATIVA) return { ok: false, erro: ERROS_ACAO.JUSTIFICATIVA_LONGA }
  return { ok: true, texto }
}

// RN18: só a gerência redireciona, e só em triagem (a transição Em triagem → Pendente de aceite só
// existe para ela). O tipo de atendimento depende do setor, então vem junto e precisa existir no novo
// setor (decisão de 04/10). O setor que recusou pode ser escolhido de novo (sem regra nova).
// O prazo de aceite reinicia (atencao.js → prazoDeAceite: 24 h contadas do redirecionamento).
export function redirecionarDemanda(demanda, { setor, tipo }, usuario, contexto) {
  const conferencia = conferirGerencia(demanda, usuario, STATUS.PENDENTE_ACEITE)
  if (!conferencia.ok) return conferencia

  // "gerenciamento" não é departamento: tiposDoSetor devolve lista vazia e o setor é recusado.
  const tiposDoNovoSetor = tiposDoSetor(setor)
  if (tiposDoNovoSetor.length === 0) return { ok: false, erro: ERROS_ACAO.SETOR_INVALIDO }
  if (!tiposDoNovoSetor.includes(tipo)) return { ok: false, erro: ERROS_ACAO.TIPO_INVALIDO }

  const redirecionadaEm = contexto.agora.toISOString()
  const registro = {
    ...evento(usuario, contexto, `Redirecionada para ${nomeDoSetor(setor)}, tipo "${tipo}".`, 'redirecionamento'),
    setor,
    tipoAtendimento: tipo,
  }
  return {
    ok: true,
    dados: {
      ...demanda,
      status: STATUS.PENDENTE_ACEITE,
      destino: setor,
      tipo,
      redirecionadaEm,
      // O novo setor define a prioridade no aceite (RN10). Se a demanda já tinha sido aceita antes
      // (devolução), prioridade e prazos antigos não valem para o novo setor.
      prioridade: NAO_DEFINIDA,
      aceitaEm: null,
      prazo: null,
      aguardandoDesde: null,
      historico: [...demanda.historico, registro],
    },
  }
}

// RN19: Não aplicável só pela gerência, com justificativa; pela seção 4, só a partir de Em triagem.
export function marcarNaoAplicavel(demanda, justificativa, usuario, contexto) {
  const conferencia = conferirGerencia(demanda, usuario, STATUS.NAO_APLICAVEL)
  if (!conferencia.ok) return conferencia
  const texto = conferirJustificativa(justificativa)
  if (!texto.ok) return texto

  return {
    ok: true,
    dados: {
      ...demanda,
      status: STATUS.NAO_APLICAVEL,
      historico: [...demanda.historico, evento(usuario, contexto, `Não aplicável: ${texto.texto}`, 'encerramento')],
    },
  }
}

// RN19: Cancelar só pela gerência, com justificativa. A seção 4 permite a partir de Pendente,
// Em andamento, Aguardando e Em triagem; a tela oferece só em triagem (decisão de 04/10).
export function cancelarDemanda(demanda, justificativa, usuario, contexto) {
  const conferencia = conferirGerencia(demanda, usuario, STATUS.CANCELADA)
  if (!conferencia.ok) return conferencia
  const texto = conferirJustificativa(justificativa)
  if (!texto.ok) return texto

  return {
    ok: true,
    dados: {
      ...demanda,
      status: STATUS.CANCELADA,
      historico: [...demanda.historico, evento(usuario, contexto, `Cancelada: ${texto.texto}`, 'encerramento')],
    },
  }
}
