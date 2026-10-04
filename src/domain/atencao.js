// Fila de atenção: demandas paradas esperando alguém agir (Bloco 4B).
// - Pendente de aceite: espera o SETOR EXECUTOR aceitar ou recusar (RN09).
// - Em triagem: espera a GERÊNCIA redirecionar, marcar Não aplicável ou cancelar (RN17, RN18, RN19).
// Funções puras: o "agora" entra por parâmetro, como em prazos.js, para os testes usarem data fixa.

import { ehGerencia, podeVerDetalhes } from './permissoes.js'
import { STATUS } from './status.js'

const UMA_HORA = 60 * 60 * 1000

// PROPOSTAS de 04/10, a confirmar em ata (propostas 13 e 14 do rascunho de 03/10).
// Hoje a RN09 diz 72 h para aceitar e a RN17 diz 72 h em triagem; prazos.js continua com o texto atual.
export const LIMITE_ACEITE_HORAS = 48
export const LIMITE_TRIAGEM_HORAS = 24

// Quais itens do histórico "zeram o relógio" em cada status.
// Pendente: a criação ou o último redirecionamento (RN18: o prazo de aceite reinicia).
// Triagem: a recusa (RN11) ou, quando existir, a devolução de uma demanda já aceita.
const MARCOS = {
  [STATUS.PENDENTE_ACEITE]: ['criacao', 'redirecionamento'],
  [STATUS.EM_TRIAGEM]: ['recusa', 'devolucao'],
}

const LIMITES = {
  [STATUS.PENDENTE_ACEITE]: LIMITE_ACEITE_HORAS,
  [STATUS.EM_TRIAGEM]: LIMITE_TRIAGEM_HORAS,
}

export function precisaDeAtencao(demanda) {
  return demanda.status in MARCOS
}

// Desde quando a demanda está parada no status atual, lido do histórico.
// Sem o item no histórico (dado antigo), usa os campos gravados na demanda.
export function marcoDeAtencao(demanda) {
  const tipos = MARCOS[demanda.status]
  if (!tipos) return null

  const datas = (demanda.historico ?? [])
    .filter((evento) => tipos.includes(evento.tipo))
    .map((evento) => new Date(evento.data).getTime())
  if (datas.length > 0) return new Date(Math.max(...datas))

  return new Date(demanda.redirecionadaEm ?? demanda.criadaEm)
}

// Tempo parado em milissegundos (null se a demanda não está na fila de atenção).
export function tempoParado(demanda, agora) {
  const marco = marcoDeAtencao(demanda)
  return marco ? Math.max(0, agora - marco) : null
}

// "há menos de 1 hora", "há 1 hora", "há 5 horas", "há 1 dia", "há 3 dias" (sempre arredonda para baixo).
export function formatarTempoParado(ms) {
  const horas = Math.floor(ms / UMA_HORA)
  if (horas < 1) return 'há menos de 1 hora'
  if (horas < 24) return `há ${horas} ${horas === 1 ? 'hora' : 'horas'}`
  const dias = Math.floor(horas / 24)
  return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`
}

// Atrasada = passou do limite. Exatamente no limite (24 h ou 48 h) ainda NÃO está atrasada.
export function estaAtrasada(demanda, agora) {
  const limite = LIMITES[demanda.status]
  if (limite === undefined) return false
  return tempoParado(demanda, agora) > limite * UMA_HORA
}

// Texto do selo, conforme quem está olhando (decisão de 04/10):
// - aceite (tempo e atraso): só o setor executor e a gerência (RN02, RN06);
// - triagem (tempo e atraso): só a gerência; o setor executor nem vê a demanda (permissoes.js);
// - quem só abriu: nenhum selo, porque tempo parado é operação interna (RN03).
// O texto diz tudo sozinho; a cor é só reforço (WCAG 1.4.1).
export function seloDeAtencao(demanda, usuario, agora) {
  if (demanda.status === STATUS.PENDENTE_ACEITE && podeVerDetalhes(usuario, demanda)) {
    return estaAtrasada(demanda, agora)
      ? { texto: 'Atrasada para aceite', atrasada: true }
      : { texto: `Aguardando aceite ${formatarTempoParado(tempoParado(demanda, agora))}`, atrasada: false }
  }
  if (demanda.status === STATUS.EM_TRIAGEM && ehGerencia(usuario)) {
    return estaAtrasada(demanda, agora)
      ? { texto: 'Atrasada para triagem', atrasada: true }
      : { texto: `Em triagem · parada ${formatarTempoParado(tempoParado(demanda, agora))}`, atrasada: false }
  }
  return null
}

// Comparador da "prioridade zero": Em triagem e Pendente de aceite antes de tudo, a mais antiga
// primeiro. Devolve 0 entre duas demandas fora da fila, para o critério seguinte decidir.
// marcoVisivel: quem só abriu não conhece a data da recusa, então para ele vale a data de criação.
export function compararPorAtencao(a, b, marcoVisivel = marcoDeAtencao) {
  const atencaoA = precisaDeAtencao(a)
  const atencaoB = precisaDeAtencao(b)
  if (atencaoA && atencaoB) return marcoVisivel(a) - marcoVisivel(b)
  if (atencaoA) return -1
  if (atencaoB) return 1
  return 0
}
