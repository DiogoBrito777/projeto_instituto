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

// Pendente de aceite não está aqui desde o Bloco 4C: o prazo dela é calculado por prazoDeAceite.
const LIMITES = {
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

// Atrasada = passou do limite. Exatamente no limite ainda NÃO está atrasada.
// Pendente (Bloco 4C): o limite é o prazo de aceite DAQUELA demanda (prazoDeAceite), que muda depois
// de um redirecionamento; sem redirecionamento continua sendo criação + 48 h. Triagem: 24 h.
export function estaAtrasada(demanda, agora) {
  if (demanda.status === STATUS.PENDENTE_ACEITE) return agora > prazoDeAceite(demanda)
  const limite = LIMITES[demanda.status]
  if (limite === undefined) return false
  return tempoParado(demanda, agora) > limite * UMA_HORA
}

// PROPOSTA de 04/10 (Bloco 4C, proposta 15 do rascunho de 03/10; RN18): depois de um redirecionamento
// o novo setor tem 24 h, contadas do redirecionamento, mas nunca além do teto de 48 h desde a ABERTURA.
// Se o teto já venceu (ou vence no mesmo instante) quando a gerência redireciona, o novo setor recebe
// 24 h cheias, para não "nascer atrasado".
export const LIMITE_ACEITE_REDIRECIONADA_HORAS = 24

export function prazoAposRedirecionar(criadaEm, redirecionadaEm) {
  const teto = new Date(criadaEm).getTime() + LIMITE_ACEITE_HORAS * UMA_HORA
  const redirecionamento = new Date(redirecionadaEm).getTime()
  const cheio = redirecionamento + LIMITE_ACEITE_REDIRECIONADA_HORAS * UMA_HORA
  if (teto <= redirecionamento) return new Date(cheio)
  return new Date(Math.min(cheio, teto))
}

// Data do último redirecionamento: pelo histórico (RN22) ou, em dado antigo, pelo campo gravado.
function ultimoRedirecionamento(demanda) {
  const datas = (demanda.historico ?? [])
    .filter((evento) => evento.tipo === 'redirecionamento')
    .map((evento) => new Date(evento.data).getTime())
  if (datas.length > 0) return new Date(Math.max(...datas))
  return demanda.redirecionadaEm ? new Date(demanda.redirecionadaEm) : null
}

// Até quando o setor pode aceitar sem ficar "Atrasada para aceite".
export function prazoDeAceite(demanda) {
  const redirecionamento = ultimoRedirecionamento(demanda)
  if (!redirecionamento) {
    return new Date(new Date(demanda.criadaEm).getTime() + LIMITE_ACEITE_HORAS * UMA_HORA)
  }
  return prazoAposRedirecionar(demanda.criadaEm, redirecionamento)
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
