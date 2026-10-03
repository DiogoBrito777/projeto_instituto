// Quem pode ver e fazer o quê em cada demanda (RN02–RN06, RN10, RN18, RN19, RN21; matriz da seção 3).
// Funções puras: recebem o usuário logado e a demanda, devolvem sim/não.
// A tela só pergunta "posso?"; esconder botão sem passar por aqui não vale como regra.

import { STATUS, estaFinal, proximosStatus } from './status.js'

export const ORIGEM_GERENCIAMENTO = 'gerenciamento'

export function ehGerencia(usuario) {
  return usuario?.perfil === 'gerenciamento'
}

// Executor = setor de destino da demanda.
export function ehExecutor(usuario, demanda) {
  return usuario?.perfil === 'departamento' && demanda.destino === usuario.departamento
}

// Quem abriu: o setor do usuário, ou "gerenciamento" quando foi o admin (RN07).
export function ehSolicitante(usuario, demanda) {
  if (!usuario) return false
  const origemDoUsuario = ehGerencia(usuario) ? ORIGEM_GERENCIAMENTO : usuario.departamento
  return demanda.origem === origemDoUsuario
}

// Papel que o usuário tem nesta demanda; é o que o módulo de status usa para as transições.
export function papelNaDemanda(usuario, demanda) {
  if (ehGerencia(usuario)) return 'gerenciamento'
  if (ehExecutor(usuario, demanda)) return 'executor'
  if (ehSolicitante(usuario, demanda)) return 'solicitante'
  return null
}

// RN04: sem permissão, a demanda é tratada como inexistente.
export function podeVer(usuario, demanda) {
  return papelNaDemanda(usuario, demanda) !== null
}

// RN02: a operação interna (histórico, prazo, prioridade, justificativas) é só do executor e da gerência.
export function podeVerDetalhes(usuario, demanda) {
  const papel = papelNaDemanda(usuario, demanda)
  return papel === 'gerenciamento' || papel === 'executor'
}

// RN03 + RN12: o que quem abriu pode ver. Os campos são escolhidos um a um (lista branca),
// para que histórico, prazo e prioridade nunca vazem, mesmo se a demanda ganhar campos novos.
export function resumoParaSolicitante(demanda) {
  const emTriagem = demanda.status === STATUS.EM_TRIAGEM
  const naoAceita = demanda.status === STATUS.PENDENTE_ACEITE

  return {
    id: demanda.id,
    titulo: demanda.titulo,
    descricao: demanda.descricao,
    tipo: demanda.tipo,
    origem: demanda.origem,
    solicitante: demanda.solicitante,
    criadaEm: demanda.criadaEm,
    status: naoAceita ? 'Não aceita pelo setor' : demanda.status,
    setorAtual: emTriagem ? ORIGEM_GERENCIAMENTO : demanda.destino,
  }
}

function podeIrPara(usuario, demanda, para) {
  return proximosStatus(demanda.status, papelNaDemanda(usuario, demanda)).includes(para)
}

// RN09/RN10: só o executor aceita, e só enquanto a demanda está pendente.
export function podeAceitar(usuario, demanda) {
  return ehExecutor(usuario, demanda) && demanda.status === STATUS.PENDENTE_ACEITE
}

// RN05 + RN10: a prioridade só é definida pelo executor, no aceite; depois fica travada.
// A gerência nunca define prioridade (Ata 08/09).
export function podeDefinirPrioridade(usuario, demanda) {
  return podeAceitar(usuario, demanda)
}

// RN11: recusar/devolver leva a Em triagem, com motivo.
export function podeRecusar(usuario, demanda) {
  return ehExecutor(usuario, demanda) && podeIrPara(usuario, demanda, STATUS.EM_TRIAGEM)
}

// RN18: só a gerência redireciona, e só em triagem. Setor nunca envia direto a outro setor.
export function podeRedirecionar(usuario, demanda) {
  return ehGerencia(usuario) && demanda.status === STATUS.EM_TRIAGEM
}

// RN19: só a gerência cancela, com justificativa; estados finais não mudam (RN20).
export function podeCancelar(usuario, demanda) {
  return ehGerencia(usuario) && podeIrPara(usuario, demanda, STATUS.CANCELADA)
}

// RN14: novo prazo só pelo executor, enquanto o prazo está correndo.
export function podeRegistrarPrazo(usuario, demanda) {
  const prazoCorrendo =
    demanda.status === STATUS.EM_ANDAMENTO || demanda.status === STATUS.AGUARDANDO
  return ehExecutor(usuario, demanda) && prazoCorrendo
}

// RN21: só a gerência cobra posição, e não faz sentido cobrar demanda encerrada.
export function podeCobrar(usuario, demanda) {
  return ehGerencia(usuario) && !estaFinal(demanda.status)
}
