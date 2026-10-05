import { describe, expect, it } from 'vitest'
import {
  ABAS,
  FILTROS_DO_PAINEL,
  abasDoPerfil,
  combinaComBusca,
  filtrarPorPainel,
  filtroDoPainel,
  linkDoIndicador,
  abertasDoSetor,
  avisoDeAtencao,
  demandasDaAba,
  filtrarPorStatus,
  filtrarVisaoGeral,
  indicadoresVisaoGeral,
  linkDaLista,
  ordenarDemandas,
  ordenarPorAtencao,
  paginarComPendentes,
  separarPendentes,
  statusDoSlug,
} from './listas.js'
import { podeVer } from './permissoes.js'
import { STATUS } from './status.js'

const AGORA = new Date('2026-10-05T12:00:00Z')
const horasAntes = (horas) => new Date(AGORA.getTime() - horas * 3600000).toISOString()

const admin = { usuario: 'admin', perfil: 'gerenciamento', departamento: null }
const ti = { usuario: 'user01', perfil: 'departamento', departamento: 'tecnologia' }
const eletrica = { usuario: 'user04', perfil: 'departamento', departamento: 'eletrica' }

function demanda(id, origem, destino, status, extra = {}) {
  return { id, titulo: id, origem, destino, status, prioridade: 'Média', criadaEm: horasAntes(10), ...extra }
}

const LISTA = [
  demanda('A', 'hidraulica', 'tecnologia', STATUS.PENDENTE_ACEITE, { prioridade: 'Não definida' }),
  demanda('B', 'eletrica', 'tecnologia', STATUS.EM_ANDAMENTO, { prioridade: 'Alta', aceitaEm: horasAntes(40) }),
  demanda('C', 'tecnologia', 'administrativo', STATUS.EM_ANDAMENTO, { prioridade: 'Urgente', aceitaEm: horasAntes(30) }),
  demanda('D', 'hidraulica', 'eletrica', STATUS.CONCLUIDA),
  demanda('E', 'gerenciamento', 'eletrica', STATUS.EM_TRIAGEM),
  demanda('F', 'administrativo', 'hidraulica', STATUS.AGUARDANDO, { aceitaEm: horasAntes(5), aguardandoDesde: horasAntes(200) }),
]
const ids = (lista) => lista.map((d) => d.id)

describe('abas por perfil', () => {
  it('setor vê Recebidas/Solicitadas; gerência vê Todas/Solicitadas por mim', () => {
    expect(abasDoPerfil(ti).map((aba) => aba.rotulo)).toEqual(['Recebidas', 'Solicitadas'])
    expect(abasDoPerfil(admin).map((aba) => aba.rotulo)).toEqual(['Todas', 'Solicitadas por mim'])
  })
})

describe('demandasDaAba (RN02)', () => {
  it('Recebidas de TI = destino TI', () => {
    expect(ids(demandasDaAba(LISTA, ti, ABAS.RECEBIDAS))).toEqual(['A', 'B'])
  })

  it('Solicitadas de TI = origem TI', () => {
    expect(ids(demandasDaAba(LISTA, ti, ABAS.SOLICITADAS))).toEqual(['C'])
  })

  it('TI NÃO recebe demanda entre Hidráulica e Elétrica em nenhuma aba', () => {
    const todas = [...demandasDaAba(LISTA, ti, ABAS.RECEBIDAS), ...demandasDaAba(LISTA, ti, ABAS.SOLICITADAS)]
    expect(ids(todas)).not.toContain('D')
  })

  it('setor NÃO consegue ver outro setor usando o filtro de departamento', () => {
    expect(ids(demandasDaAba(LISTA, ti, ABAS.RECEBIDAS, 'eletrica'))).toEqual(['A', 'B'])
  })

  it('gerência vê todas e pode filtrar por setor responsável', () => {
    expect(demandasDaAba(LISTA, admin, ABAS.RECEBIDAS)).toHaveLength(LISTA.length)
    // E tem destino Elétrica, mas está em triagem: é da gerência, não aparece sob a Elétrica.
    expect(ids(demandasDaAba(LISTA, admin, ABAS.RECEBIDAS, 'eletrica'))).toEqual(['D'])
  })

  it('"Solicitadas por mim" da gerência = origem gerenciamento', () => {
    expect(ids(demandasDaAba(LISTA, admin, ABAS.SOLICITADAS))).toEqual(['E'])
  })
})

describe('pendentes e ordenação', () => {
  it('separa as pendentes de aceite das demais', () => {
    const { pendentes, demais } = separarPendentes(LISTA)
    expect(ids(pendentes)).toEqual(['A'])
    expect(demais).toHaveLength(LISTA.length - 1)
  })

  it('padrão: prioridade primeiro (Urgente antes de Alta)', () => {
    expect(ids(ordenarDemandas(LISTA)).slice(0, 2)).toEqual(['C', 'B'])
  })

  it('critério desconhecido cai no padrão', () => {
    expect(ids(ordenarDemandas(LISTA, 'xyz'))).toEqual(ids(ordenarDemandas(LISTA)))
  })
})

describe('filtros da Visão Geral', () => {
  it('"alta prioridade" filtra por PRIORIDADE (Alta e Urgente), não por status', () => {
    expect(ids(filtrarVisaoGeral(LISTA, admin, 'alta-prioridade'))).toEqual(['B', 'C'])
  })

  it('quem só abriu NÃO descobre a prioridade pelo filtro (RN03)', () => {
    expect(ids(filtrarVisaoGeral([LISTA[2]], ti, 'alta-prioridade'))).toEqual([])
  })

  it('pendentes e concluídas filtram pelo status', () => {
    expect(ids(filtrarVisaoGeral(LISTA, admin, 'pendentes'))).toEqual(['A'])
    expect(ids(filtrarVisaoGeral(LISTA, admin, 'concluidas'))).toEqual(['D'])
  })
})

describe('indicadores (seção 6)', () => {
  const valor = (indicadores, chave) => indicadores.find((item) => item.chave === chave).valor

  it('gerência: números de todos os setores', () => {
    const ind = indicadoresVisaoGeral(LISTA, admin, AGORA)
    expect(valor(ind, 'abertas')).toBe(5)
    expect(valor(ind, 'pendentes')).toBe(1)
    expect(valor(ind, 'triagem')).toBe(1)
    expect(valor(ind, 'a-expirar')).toBe(1)
    expect(valor(ind, 'vencidas')).toBe(1)
    expect(valor(ind, 'aguardando')).toBe(1)
    expect(valor(ind, 'concluidas')).toBe(1)
  })

  it('gerência filtrando por setor conta só o que está com aquele setor (triagem fica fora)', () => {
    // Elétrica: D (concluída) não é aberta; E está em triagem, com a gerência.
    expect(valor(indicadoresVisaoGeral(LISTA, admin, AGORA, 'eletrica'), 'abertas')).toBe(0)
    expect(valor(indicadoresVisaoGeral(LISTA, admin, AGORA, 'tecnologia'), 'abertas')).toBe(2)
  })

  it('setor: conta só as suas recebidas e solicitadas, NUNCA as dos outros', () => {
    const ind = indicadoresVisaoGeral(LISTA, ti, AGORA)
    expect(valor(ind, 'recebidas-abertas')).toBe(1)
    expect(valor(ind, 'pendentes')).toBe(1)
    expect(valor(ind, 'a-expirar')).toBe(1)
    expect(valor(ind, 'resolvidas')).toBe(0)
    expect(valor(ind, 'solicitadas-abertas')).toBe(1)
  })

  it('setor não tem indicadores exclusivos da gerência', () => {
    const chaves = indicadoresVisaoGeral(LISTA, eletrica, AGORA).map((item) => item.chave)
    expect(chaves).not.toContain('vencidas')
    expect(chaves).not.toContain('triagem')
  })

  it('abertas do setor ignora as finalizadas e as que estão em triagem', () => {
    expect(abertasDoSetor(LISTA, 'eletrica')).toBe(0)
    expect(abertasDoSetor(LISTA, 'tecnologia')).toBe(2)
  })
})

describe('Em triagem pertence à gerência (decisão de 04/10)', () => {
  // Demanda pendente da Hidráulica para a Elétrica, antes e depois da recusa.
  const pendente = demanda('T', 'hidraulica', 'eletrica', STATUS.PENDENTE_ACEITE, { prioridade: 'Não definida' })
  const emTriagem = { ...pendente, status: STATUS.EM_TRIAGEM }
  const hidraulica = { usuario: 'user02', perfil: 'departamento', departamento: 'hidraulica' }

  it('antes da recusa, a Elétrica tem a demanda em Recebidas e nos contadores', () => {
    expect(ids(demandasDaAba([pendente], eletrica, ABAS.RECEBIDAS))).toEqual(['T'])
    expect(indicadoresVisaoGeral([pendente], eletrica, AGORA).find((i) => i.chave === 'pendentes').valor).toBe(1)
  })

  it('setor de destino NÃO lista a demanda em triagem: Recebidas, contadores e card de Departamentos', () => {
    expect(demandasDaAba([emTriagem], eletrica, ABAS.RECEBIDAS)).toEqual([])
    expect(demandasDaAba([emTriagem], eletrica, ABAS.SOLICITADAS)).toEqual([])
    expect(indicadoresVisaoGeral([emTriagem], eletrica, AGORA).every((i) => i.valor === 0)).toBe(true)
    expect(abertasDoSetor([emTriagem], 'eletrica')).toBe(0)
  })

  it('gerência vê a demanda em Todas e no contador "Em triagem"', () => {
    expect(ids(demandasDaAba([emTriagem], admin, ABAS.RECEBIDAS))).toEqual(['T'])
    expect(indicadoresVisaoGeral([emTriagem], admin, AGORA).find((i) => i.chave === 'triagem').valor).toBe(1)
  })

  it('quem abriu continua vendo a demanda em Solicitadas', () => {
    expect(ids(demandasDaAba([emTriagem], hidraulica, ABAS.SOLICITADAS))).toEqual(['T'])
  })
})

describe('ajustes do teste manual — busca única (item 3)', () => {
  const d = {
    id: 'DM-2002',
    titulo: 'Lâmpadas queimadas no arquivo',
    descricao: 'A sala fica escura à tarde.',
    tipo: 'Iluminação',
    solicitante: 'Lucas Ribeiro',
    origem: 'administrativo',
  }

  it('acha por solicitante (o que faltava na Visão Geral) e por descrição (o que faltava em Demandas)', () => {
    expect(combinaComBusca(d, 'lucas')).toBe(true)
    expect(combinaComBusca(d, 'escura')).toBe(true)
  })

  it('acha por ID, título, tipo e setor de origem, sem diferença de maiúsculas e acentos', () => {
    for (const termo of ['dm-2002', 'LAMPADAS', 'iluminacao', 'Administrativo']) {
      expect(combinaComBusca(d, termo)).toBe(true)
    }
  })

  it('busca vazia ou só espaços não filtra; termo inexistente não acha', () => {
    expect(combinaComBusca(d, '')).toBe(true)
    expect(combinaComBusca(d, '   ')).toBe(true)
    expect(combinaComBusca(d, 'hidráulica')).toBe(false)
  })

  it('não procura em campos internos (prioridade, histórico, destino)', () => {
    const interna = { ...d, prioridade: 'Urgente', destino: 'eletrica', historico: [{ texto: 'Recusada: segredo' }] }
    expect(combinaComBusca(interna, 'urgente')).toBe(false)
    expect(combinaComBusca(interna, 'segredo')).toBe(false)
    expect(combinaComBusca(interna, 'eletrica')).toBe(false)
  })
})

describe('ajustes do teste manual — paginação com o grupo de pendentes (item 2)', () => {
  const itens = (prefixo, n) => Array.from({ length: n }, (_, i) => ({ id: `${prefixo}${i + 1}` }))
  const ids = (lista) => lista.map((d) => d.id)
  // Caso do teste manual: 13 demandas, 2 pendentes, 6 por página.
  const grupos = { pendentes: itens('P', 2), demais: itens('D', 11) }

  it('nenhuma demanda se repete entre as páginas e todas aparecem (antes: 8 + 7 = 15 de 13)', () => {
    const vistas = []
    for (let pagina = 1; pagina <= 3; pagina += 1) {
      const p = paginarComPendentes(grupos, pagina, 6)
      vistas.push(...ids(p.pendentes), ...ids(p.demais))
      expect(p.pendentes.length + p.demais.length).toBeLessThanOrEqual(6)
    }
    expect(vistas).toHaveLength(13)
    expect(new Set(vistas).size).toBe(13)
  })

  it('o grupo vem primeiro: página 1 = 2 pendentes + 4; página 3 sem pendentes', () => {
    const p1 = paginarComPendentes(grupos, 1, 6)
    expect(ids(p1.pendentes)).toEqual(['P1', 'P2'])
    expect(ids(p1.demais)).toEqual(['D1', 'D2', 'D3', 'D4'])
    expect(paginarComPendentes(grupos, 3, 6).pendentes).toEqual([])
    expect(p1).toMatchObject({ total: 13, totalPendentes: 2, totalPaginas: 3 })
  })

  it('grupo maior que uma página continua na seguinte', () => {
    const muitos = { pendentes: itens('P', 8), demais: itens('D', 1) }
    expect(ids(paginarComPendentes(muitos, 2, 6).pendentes)).toEqual(['P7', 'P8'])
    expect(ids(paginarComPendentes(muitos, 2, 6).demais)).toEqual(['D1'])
  })

  it('página fora do intervalo vai para a última (ou a primeira); lista vazia tem 1 página', () => {
    expect(paginarComPendentes(grupos, 9, 6).pagina).toBe(3)
    expect(paginarComPendentes(grupos, 0, 6).pagina).toBe(1)
    expect(paginarComPendentes({ pendentes: [], demais: [] }, 1, 6)).toMatchObject({ total: 0, totalPaginas: 1 })
  })
})

describe('ajustes do teste manual — cards da Visão Geral filtram Demandas (item 1)', () => {
  const valor = (indicadores, chave) => indicadores.find((item) => item.chave === chave)
  // Para cada card, o número tem de bater com o que a lista de Demandas mostra com o filtro.
  const naLista = (usuario, indicador, setor = null) => {
    const aba = FILTROS_DO_PAINEL[indicador.filtro]?.aba ?? ABAS.RECEBIDAS
    return filtrarPorPainel(demandasDaAba(LISTA, usuario, aba, setor), indicador.filtro, AGORA).length
  }

  it('gerência: Abertas, A expirar, Vencidas e Aguardando batem com a lista filtrada', () => {
    const ind = indicadoresVisaoGeral(LISTA, admin, AGORA)
    for (const chave of ['abertas', 'a-expirar', 'vencidas', 'aguardando']) {
      expect(naLista(admin, valor(ind, chave))).toBe(valor(ind, chave).valor)
    }
  })

  it('gerência com filtro de setor: os números e a lista usam o mesmo setor', () => {
    const ind = indicadoresVisaoGeral(LISTA, admin, AGORA, 'tecnologia')
    for (const chave of ['abertas', 'a-expirar', 'vencidas', 'aguardando']) {
      expect(naLista(admin, valor(ind, chave), 'tecnologia')).toBe(valor(ind, chave).valor)
    }
    expect(linkDoIndicador(valor(ind, 'vencidas'), 'tecnologia')).toBe('#demandas/tecnologia?filtro=vencidas')
  })

  it('setor: Recebidas abertas e A expirar (aba Recebidas) e Solicitadas em aberto (aba Solicitadas) batem', () => {
    const ind = indicadoresVisaoGeral(LISTA, ti, AGORA)
    for (const chave of ['recebidas-abertas', 'a-expirar', 'solicitadas-abertas']) {
      expect(naLista(ti, valor(ind, chave))).toBe(valor(ind, chave).valor)
    }
    expect(linkDoIndicador(valor(ind, 'solicitadas-abertas'))).toBe('#demandas?filtro=solicitadas-abertas&aba=solicitadas')
  })

  it('o filtro nunca ultrapassa a permissão: Elétrica com "Abertas" não vê demanda de TI', () => {
    const lista = filtrarPorPainel(demandasDaAba(LISTA, eletrica, ABAS.RECEBIDAS), 'abertas', AGORA)
    expect(lista.every((d) => d.destino === 'eletrica')).toBe(true)
  })

  it('filtro desconhecido na URL vira "sem filtro" e não esconde nada', () => {
    expect(filtroDoPainel('xyz')).toBe('')
    expect(filtroDoPainel(null)).toBe('')
    expect(filtroDoPainel('vencidas')).toBe('vencidas')
    expect(filtrarPorPainel(LISTA, '', AGORA)).toHaveLength(LISTA.length)
  })
})

describe('Bloco 4B — fila de triagem e prioridade de atenção', () => {
  const administrativo = { usuario: 'user03', perfil: 'departamento', departamento: 'administrativo' }
  const comHistorico = (d, eventos) => ({ ...d, historico: eventos.map(([tipo, horas]) => ({ tipo, data: horasAntes(horas) })) })

  // P1 pendente há 5 h, P2 pendente há 90 h (atrasada), T1 em triagem desde a recusa há 30 h,
  // U urgente em andamento, M média em andamento. Todas criadas por Administrativo.
  const FILA = [
    comHistorico(demanda('U', 'administrativo', 'tecnologia', STATUS.EM_ANDAMENTO, { prioridade: 'Urgente', criadaEm: horasAntes(2) }), [['criacao', 2]]),
    comHistorico(demanda('P1', 'administrativo', 'eletrica', STATUS.PENDENTE_ACEITE, { prioridade: 'Não definida', criadaEm: horasAntes(5) }), [['criacao', 5]]),
    comHistorico(demanda('M', 'administrativo', 'eletrica', STATUS.EM_ANDAMENTO, { criadaEm: horasAntes(1) }), [['criacao', 1]]),
    comHistorico(demanda('T1', 'administrativo', 'eletrica', STATUS.EM_TRIAGEM, { prioridade: 'Não definida', criadaEm: horasAntes(100) }), [['criacao', 100], ['recusa', 30]]),
    comHistorico(demanda('P2', 'administrativo', 'eletrica', STATUS.PENDENTE_ACEITE, { prioridade: 'Não definida', criadaEm: horasAntes(90) }), [['criacao', 90]]),
  ]

  describe('ordem de atenção x ordem escolhida', () => {
    it('padrão: triagem e pendentes primeiro, a mais antiga antes; depois prioridade e data', () => {
      // T1 parada há 30 h, P2 há 90 h, P1 há 5 h → P2, T1, P1; depois U (Urgente) e M (Média).
      expect(ids(ordenarPorAtencao(FILA, admin))).toEqual(['P2', 'T1', 'P1', 'U', 'M'])
    })

    it('na Visão Geral o resto segue "recentes"', () => {
      expect(ids(ordenarPorAtencao(FILA, admin, 'recentes'))).toEqual(['P2', 'T1', 'P1', 'M', 'U'])
    })

    it('ordem escolhida pelo usuário vale: "Prioridade e data" e "Mais recentes" NÃO põem a fila primeiro', () => {
      expect(ids(ordenarDemandas(FILA, 'padrao'))).toEqual(['U', 'M', 'P1', 'P2', 'T1'])
      expect(ids(ordenarDemandas(FILA, 'recentes'))).toEqual(['M', 'U', 'P1', 'P2', 'T1'])
    })

    it('quem só abriu: a mais antiga é pela CRIAÇÃO (não conhece a data da recusa, RN03)', () => {
      // Para Administrativo: T1 criada há 100 h vem antes de P2 (90 h).
      expect(ids(ordenarPorAtencao(FILA, administrativo))).toEqual(['T1', 'P2', 'P1', 'U', 'M'])
    })
  })

  describe('filtro de status (Demandas)', () => {
    it('vazio = todos; com status, só aquele status', () => {
      expect(filtrarPorStatus(FILA, '')).toHaveLength(FILA.length)
      expect(ids(filtrarPorStatus(FILA, STATUS.PENDENTE_ACEITE))).toEqual(['P1', 'P2'])
      expect(ids(filtrarPorStatus(FILA, STATUS.CANCELADA))).toEqual([])
    })

    it('nunca ultrapassa a permissão: Elétrica filtrando "Em triagem" em Recebidas não vê T1', () => {
      expect(filtrarPorStatus(demandasDaAba(FILA, eletrica, ABAS.RECEBIDAS), STATUS.EM_TRIAGEM)).toEqual([])
      expect(filtrarPorStatus(demandasDaAba(FILA, eletrica, ABAS.SOLICITADAS), STATUS.EM_TRIAGEM)).toEqual([])
    })

    it('setor sem relação não vê nada, com ou sem filtro', () => {
      expect(filtrarPorStatus(demandasDaAba(FILA, ti, ABAS.SOLICITADAS), STATUS.PENDENTE_ACEITE)).toEqual([])
      expect(ids(demandasDaAba(FILA, ti, ABAS.RECEBIDAS))).toEqual(['U'])
    })

    it('combina com o filtro de setor da gerência', () => {
      expect(ids(filtrarPorStatus(demandasDaAba(FILA, admin, ABAS.RECEBIDAS, 'eletrica'), STATUS.PENDENTE_ACEITE))).toEqual(['P1', 'P2'])
      // Em triagem é da gerência: não aparece sob a Elétrica.
      expect(filtrarPorStatus(demandasDaAba(FILA, admin, ABAS.RECEBIDAS, 'eletrica'), STATUS.EM_TRIAGEM)).toEqual([])
    })
  })

  describe('status na URL', () => {
    it('ida e volta para todos os status', () => {
      for (const status of Object.values(STATUS)) {
        const slug = linkDaLista(status).split('status=')[1]
        expect(statusDoSlug(slug)).toBe(status)
      }
    })

    it('link com setor só quando informado', () => {
      expect(linkDaLista(STATUS.EM_TRIAGEM)).toBe('#demandas?status=em-triagem')
      expect(linkDaLista(STATUS.PENDENTE_ACEITE, 'eletrica')).toBe('#demandas/eletrica?status=pendente-de-aceite')
    })

    it('slug inválido vira "todos" (sem erro)', () => {
      expect(statusDoSlug('xyz')).toBe('')
      expect(statusDoSlug(null)).toBe('')
    })
  })

  describe('aba rápida "Em triagem" (Visão Geral)', () => {
    const visiveis = (usuario) => FILA.filter((d) => podeVer(usuario, d))

    it('gerência vê as demandas em triagem', () => {
      expect(ids(filtrarVisaoGeral(visiveis(admin), admin, 'triagem'))).toEqual(['T1'])
    })

    it('setor executor (destino) vê 0', () => {
      expect(filtrarVisaoGeral(visiveis(eletrica), eletrica, 'triagem')).toEqual([])
    })

    it('quem abriu vê as suas', () => {
      expect(ids(filtrarVisaoGeral(visiveis(administrativo), administrativo, 'triagem'))).toEqual(['T1'])
    })

    it('setor sem relação vê 0', () => {
      expect(filtrarVisaoGeral(visiveis(ti), ti, 'triagem')).toEqual([])
    })
  })

  describe('aviso do topo', () => {
    it('gerência: triagem e pendentes de todos', () => {
      expect(avisoDeAtencao(FILA, admin)).toEqual({ triagem: 1, pendentes: 2, total: 3 })
    })

    it('gerência com filtro de setor: triagem fica fora (é da gerência)', () => {
      expect(avisoDeAtencao(FILA, admin, 'eletrica')).toEqual({ triagem: 0, pendentes: 2, total: 2 })
      expect(avisoDeAtencao(FILA, admin, 'hidraulica').total).toBe(0)
    })

    it('setor executor: só as pendentes que ele recebeu; triagem sempre 0', () => {
      expect(avisoDeAtencao(FILA, eletrica)).toEqual({ triagem: 0, pendentes: 2, total: 2 })
    })

    it('quem só abriu NÃO conta nada no aviso (não é ele quem age)', () => {
      expect(avisoDeAtencao(FILA, administrativo).total).toBe(0)
    })

    it('setor sem permissão NÃO conta', () => {
      expect(avisoDeAtencao(FILA, ti).total).toBe(0)
    })
  })

  describe('cards da Visão Geral viram link só quando são de um status', () => {
    it('gerência: pendentes, triagem e concluídas têm status; os demais não', () => {
      const comStatus = indicadoresVisaoGeral(FILA, admin, AGORA).filter((i) => i.status).map((i) => i.chave)
      expect(comStatus).toEqual(['pendentes', 'triagem', 'concluidas'])
    })

    it('setor: pendentes e resolvidas', () => {
      const comStatus = indicadoresVisaoGeral(FILA, eletrica, AGORA).filter((i) => i.status).map((i) => i.chave)
      expect(comStatus).toEqual(['pendentes', 'resolvidas'])
    })

    it('ajuste do teste manual: TODO card tem link (status ou filtro do painel)', () => {
      for (const usuario of [admin, eletrica, ti]) {
        for (const indicador of indicadoresVisaoGeral(FILA, usuario, AGORA)) {
          expect(linkDoIndicador(indicador)).toMatch(/^#demandas\?(status|filtro)=/)
        }
      }
    })

    it('selo do card de pendentes vem da constante (48 h)', () => {
      expect(indicadoresVisaoGeral(FILA, admin, AGORA).find((i) => i.chave === 'pendentes').badge).toBe('48 h para aceitar')
    })
  })
})
