import { describe, expect, it } from 'vitest'
import {
  LIMITE_ACEITE_HORAS,
  LIMITE_ACEITE_REDIRECIONADA_HORAS,
  LIMITE_TRIAGEM_HORAS,
  compararPorAtencao,
  estaAtrasada,
  formatarTempoParado,
  marcoDeAtencao,
  prazoAposRedirecionar,
  prazoDeAceite,
  seloDeAtencao,
  tempoParado,
} from './atencao.js'
import { STATUS } from './status.js'

// Relógio fixo (injetado): o resultado não depende do dia em que o teste roda.
const AGORA = new Date('2026-10-05T12:00:00Z')
const UMA_HORA = 3600000
const horasAntes = (horas) => new Date(AGORA.getTime() - horas * UMA_HORA).toISOString()

const admin = { usuario: 'admin', perfil: 'gerenciamento', departamento: null }
const eletrica = { usuario: 'user04', perfil: 'departamento', departamento: 'eletrica' }
const administrativo = { usuario: 'user03', perfil: 'departamento', departamento: 'administrativo' }

// Pendente: criada há X horas. Triagem: criada antes e recusada há X horas.
function pendente(haHoras, extra = {}) {
  return {
    id: 'P',
    origem: 'administrativo',
    destino: 'eletrica',
    status: STATUS.PENDENTE_ACEITE,
    criadaEm: horasAntes(haHoras),
    historico: [{ tipo: 'criacao', data: horasAntes(haHoras) }],
    ...extra,
  }
}

function emTriagem(recusadaHaHoras) {
  return {
    id: 'T',
    origem: 'administrativo',
    destino: 'eletrica',
    status: STATUS.EM_TRIAGEM,
    criadaEm: horasAntes(recusadaHaHoras + 10),
    historico: [
      { tipo: 'criacao', data: horasAntes(recusadaHaHoras + 10) },
      { tipo: 'recusa', data: horasAntes(recusadaHaHoras) },
    ],
  }
}

describe('limites (propostas de 04/10)', () => {
  it('48 h para aceitar e 24 h para triar', () => {
    expect(LIMITE_ACEITE_HORAS).toBe(48)
    expect(LIMITE_TRIAGEM_HORAS).toBe(24)
  })
})

describe('marco de tempo', () => {
  it('pendente: conta da criação', () => {
    expect(marcoDeAtencao(pendente(5)).toISOString()).toBe(horasAntes(5))
  })

  it('pendente redirecionada: conta do ÚLTIMO redirecionamento, não da criação (RN18)', () => {
    const demanda = pendente(100, {
      historico: [
        { tipo: 'criacao', data: horasAntes(100) },
        { tipo: 'recusa', data: horasAntes(80) },
        { tipo: 'redirecionamento', data: horasAntes(60) },
        { tipo: 'recusa', data: horasAntes(40) },
        { tipo: 'redirecionamento', data: horasAntes(3) },
      ],
    })
    expect(marcoDeAtencao(demanda).toISOString()).toBe(horasAntes(3))
  })

  it('triagem: conta da recusa, não da criação', () => {
    expect(marcoDeAtencao(emTriagem(20)).toISOString()).toBe(horasAntes(20))
  })

  it('sem histórico (dado antigo): usa redirecionadaEm ou criadaEm', () => {
    expect(marcoDeAtencao(pendente(7, { historico: [] })).toISOString()).toBe(horasAntes(7))
    expect(marcoDeAtencao(pendente(7, { historico: [], redirecionadaEm: horasAntes(2) })).toISOString()).toBe(horasAntes(2))
  })

  it('fora da fila (Em andamento, Concluída) não tem marco nem tempo parado', () => {
    const andamento = { ...pendente(5), status: STATUS.EM_ANDAMENTO }
    expect(marcoDeAtencao(andamento)).toBeNull()
    expect(tempoParado(andamento, AGORA)).toBeNull()
    expect(estaAtrasada({ ...pendente(500), status: STATUS.CONCLUIDA }, AGORA)).toBe(false)
  })
})

describe('formatação do tempo parado', () => {
  it('horas e dias, no singular e no plural, sempre para baixo', () => {
    expect(formatarTempoParado(10 * 60000)).toBe('há menos de 1 hora')
    expect(formatarTempoParado(UMA_HORA)).toBe('há 1 hora')
    expect(formatarTempoParado(5 * UMA_HORA + 50 * 60000)).toBe('há 5 horas')
    expect(formatarTempoParado(23 * UMA_HORA)).toBe('há 23 horas')
    expect(formatarTempoParado(24 * UMA_HORA)).toBe('há 1 dia')
    expect(formatarTempoParado(71 * UMA_HORA)).toBe('há 2 dias')
    expect(formatarTempoParado(72 * UMA_HORA)).toBe('há 3 dias')
  })

  it('tempoParado usa o "agora" recebido', () => {
    expect(tempoParado(pendente(5), AGORA)).toBe(5 * UMA_HORA)
  })
})

describe('atraso: limite exato', () => {
  it('aceite: 47 h e exatamente 48 h NÃO estão atrasadas; 48 h e 1 min está', () => {
    expect(estaAtrasada(pendente(47), AGORA)).toBe(false)
    expect(estaAtrasada(pendente(48), AGORA)).toBe(false)
    expect(estaAtrasada(pendente(48 + 1 / 60), AGORA)).toBe(true)
  })

  it('triagem: exatamente 24 h NÃO está atrasada; 24 h e 1 min está', () => {
    expect(estaAtrasada(emTriagem(23), AGORA)).toBe(false)
    expect(estaAtrasada(emTriagem(24), AGORA)).toBe(false)
    expect(estaAtrasada(emTriagem(24 + 1 / 60), AGORA)).toBe(true)
  })

  it('triagem conta da recusa: criada há 34 h, mas recusada há 10 h, NÃO está atrasada', () => {
    expect(estaAtrasada(emTriagem(10), AGORA)).toBe(false)
  })
})

describe('selo conforme quem olha', () => {
  it('setor executor vê o selo de aceite: no prazo e atrasada', () => {
    expect(seloDeAtencao(pendente(5), eletrica, AGORA)).toEqual({ texto: 'Aguardando aceite há 5 horas', atrasada: false })
    expect(seloDeAtencao(pendente(90), eletrica, AGORA)).toEqual({ texto: 'Atrasada para aceite', atrasada: true })
  })

  it('gerência vê os selos de aceite e de triagem', () => {
    expect(seloDeAtencao(pendente(72), admin, AGORA).texto).toBe('Atrasada para aceite')
    expect(seloDeAtencao(emTriagem(20), admin, AGORA)).toEqual({ texto: 'Em triagem · parada há 20 horas', atrasada: false })
    expect(seloDeAtencao(emTriagem(30), admin, AGORA)).toEqual({ texto: 'Atrasada para triagem', atrasada: true })
  })

  it('quem só abriu NÃO vê selo nem tempo parado (RN03)', () => {
    expect(seloDeAtencao(pendente(90), administrativo, AGORA)).toBeNull()
    expect(seloDeAtencao(emTriagem(30), administrativo, AGORA)).toBeNull()
  })

  it('setor de destino NÃO vê selo de triagem (a demanda é da gerência)', () => {
    expect(seloDeAtencao(emTriagem(30), eletrica, AGORA)).toBeNull()
  })

  it('setor sem relação com a demanda NÃO vê selo', () => {
    const ti = { usuario: 'user01', perfil: 'departamento', departamento: 'tecnologia' }
    expect(seloDeAtencao(pendente(90), ti, AGORA)).toBeNull()
  })

  it('demanda fora da fila não tem selo', () => {
    expect(seloDeAtencao({ ...pendente(90), status: STATUS.EM_ANDAMENTO }, admin, AGORA)).toBeNull()
  })
})

describe('Bloco 4C — prazo de aceite depois do redirecionamento (sempre 24 h)', () => {
  // Aberta às 08h de 01/10 (horário de Brasília = 11h UTC).
  const ABERTURA = new Date('2026-10-01T11:00:00Z')
  const depois = (horas) => new Date(ABERTURA.getTime() + horas * UMA_HORA)
  const horasEntre = (a, b) => (b - a) / UMA_HORA

  function redirecionada(redirecionadaHorasDepois) {
    return {
      status: STATUS.PENDENTE_ACEITE,
      criadaEm: ABERTURA.toISOString(),
      historico: [
        { tipo: 'criacao', data: ABERTURA.toISOString() },
        { tipo: 'recusa', data: depois(1).toISOString() },
        { tipo: 'redirecionamento', data: depois(redirecionadaHorasDepois).toISOString() },
      ],
    }
  }

  it('constante separada: 24 h', () => {
    expect(LIMITE_ACEITE_REDIRECIONADA_HORAS).toBe(24)
  })

  it('aberta 08h, redirecionada 11h do mesmo dia → vence em 24 h', () => {
    expect(horasEntre(depois(3), prazoDeAceite(redirecionada(3)))).toBe(24)
  })

  it('redirecionada 24 h, 36 h ou 50 h após a abertura → sempre 24 h a partir do redirecionamento', () => {
    for (const horas of [24, 36, 50]) {
      expect(horasEntre(depois(horas), prazoDeAceite(redirecionada(horas)))).toBe(24)
    }
  })

  it('redirecionada depois das 48 h da abertura NÃO nasce atrasada', () => {
    expect(estaAtrasada(redirecionada(50), depois(50))).toBe(false)
  })

  it('limite exato (24 h após o redirecionamento) NÃO é atraso; 1 minuto depois é', () => {
    const demanda = redirecionada(36) // prazo = 36 h + 24 h = 60 h após a abertura
    expect(estaAtrasada(demanda, depois(60))).toBe(false)
    expect(estaAtrasada(demanda, depois(60 + 1 / 60))).toBe(true)
  })

  it('selo usa o prazo daquela demanda: redirecionada às 36 h está no prazo às 59 h e atrasada às 61 h', () => {
    expect(seloDeAtencao(redirecionada(36), admin, depois(59)).texto).toBe('Aguardando aceite há 23 horas')
    expect(seloDeAtencao(redirecionada(36), admin, depois(61))).toEqual({ texto: 'Atrasada para aceite', atrasada: true })
  })

  it('vários redirecionamentos: vale o último', () => {
    const demanda = redirecionada(10)
    demanda.historico.push({ tipo: 'recusa', data: depois(20).toISOString() })
    demanda.historico.push({ tipo: 'redirecionamento', data: depois(30).toISOString() })
    expect(horasEntre(depois(30), prazoDeAceite(demanda))).toBe(24)
  })

  it('nunca redirecionada: continua criação + 48 h', () => {
    expect(prazoDeAceite(pendente(5)).toISOString()).toBe(new Date(AGORA.getTime() + 43 * UMA_HORA).toISOString())
  })

  it('dado antigo sem item no histórico: usa o campo redirecionadaEm', () => {
    const demanda = { status: STATUS.PENDENTE_ACEITE, criadaEm: ABERTURA.toISOString(), redirecionadaEm: depois(36).toISOString(), historico: [] }
    expect(horasEntre(depois(36), prazoDeAceite(demanda))).toBe(24)
  })

  it('prazoAposRedirecionar (usado no pop-up) dá o mesmo resultado', () => {
    expect(horasEntre(depois(36), prazoAposRedirecionar(depois(36)))).toBe(24)
  })
})

describe('comparador de atenção', () => {
  it('fila primeiro, a mais antiga antes; fora da fila empata (0) para o próximo critério decidir', () => {
    const andamento = { ...pendente(1), status: STATUS.EM_ANDAMENTO }
    expect(compararPorAtencao(pendente(5), andamento)).toBeLessThan(0)
    expect(compararPorAtencao(andamento, emTriagem(1))).toBeGreaterThan(0)
    expect(compararPorAtencao(pendente(5), emTriagem(30))).toBeGreaterThan(0)
    expect(compararPorAtencao(andamento, { ...andamento })).toBe(0)
  })
})
