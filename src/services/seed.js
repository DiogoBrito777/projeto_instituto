// Monta os dados iniciais (semente) a partir de seed-demandas.json.
// O JSON guarda "há quantas horas" cada coisa aconteceu, e não datas fixas: assim, no dia da
// apresentação, sempre existem demandas no prazo, a expirar e vencidas (seção 10 dos requisitos).

import demandasSemente from '../data/seed-demandas.json'
import { calcularPrazoResolucao } from '../domain/prazos.js'

const UMA_HORA = 60 * 60 * 1000

function horasAtras(agora, horas) {
  if (horas === undefined) return null
  return new Date(agora.getTime() - horas * UMA_HORA).toISOString()
}

function montarDemanda(modelo, agora) {
  const { criadaHaHoras, aceitaHaHoras, aguardandoHaHoras, redirecionadaHaHoras, historico, ...campos } = modelo
  const aceitaEm = horasAtras(agora, aceitaHaHoras)

  return {
    ...campos,
    criadaEm: horasAtras(agora, criadaHaHoras),
    aceitaEm,
    // Prazo fica gravado no aceite, como fará a tela de aceite (Bloco 4).
    prazo: calcularPrazoResolucao(aceitaEm, campos.prioridade)?.toISOString() ?? null,
    redirecionadaEm: horasAtras(agora, redirecionadaHaHoras),
    aguardandoDesde: horasAtras(agora, aguardandoHaHoras),
    historico: historico.map(({ haHoras, ...evento }, indice) => ({
      id: `${modelo.id}-h${indice + 1}`,
      data: horasAtras(agora, haHoras),
      ...evento,
    })),
  }
}

export function criarSemente(agora, modelos = demandasSemente) {
  return modelos.map((modelo) => montarDemanda(modelo, agora))
}
