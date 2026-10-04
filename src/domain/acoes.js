// Ações que alteram uma demanda (RN20, RN22). Funções puras: recebem a demanda, o usuário e o
// contexto (agora e gerador de IDs) e devolvem { ok: true, dados: novaDemanda } ou { ok: false, erro }.
// Nada aqui grava; quem grava é o storage, depois que a ação foi aprovada.
//
// Neste bloco só existem as mudanças "simples" de status, que não pedem dado extra.
// Aceitar (prioridade), recusar (motivo), redirecionar, cancelar e não aplicável (justificativa) são do Bloco 4.

import { ehExecutor } from './permissoes.js'
import { STATUS, estaFinal, podeTransicionar } from './status.js'

export const ERROS_ACAO = {
  SEM_PERMISSAO: 'sem-permissao',
  FINALIZADA: 'finalizada',
  TRANSICAO_INVALIDA: 'transicao-invalida',
  TIPO_INVALIDO: 'tipo-invalido',
  OBSERVACAO_LONGA: 'observacao-longa',
  SEM_ALTERACAO: 'sem-alteracao',
}

// Mesmo limite da descrição da demanda (500 caracteres).
export const LIMITE_OBSERVACAO = 500

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
