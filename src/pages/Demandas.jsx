import { useMemo, useState } from 'react'
import departamentos from '../data/departamentos.json'
import { useDemandas } from '../hooks/useDemandas.js'
import {
  ABAS,
  FILTROS_DO_PAINEL,
  abasDoPerfil,
  combinaComBusca,
  demandasDaAba,
  filtrarPorPainel,
  filtrarPorStatus,
  ordenarDemandas,
  ordenarPorAtencao,
  paginarComPendentes,
  separarPendentes,
} from '../domain/listas.js'
import { ehGerencia, podeVerDetalhes, resumoParaSolicitante } from '../domain/permissoes.js'
import { STATUS, estaFinal } from '../domain/status.js'
import { seloDeAtencao } from '../domain/atencao.js'
import { nomeDoSetor } from '../domain/setores.js'
import { Carregando, ErroDados } from '../components/EstadoDados.jsx'
import { formatarData, quantidade } from '../formatos.js'

const ITEMS_PER_PAGE = 6

function statusModifier(status) {
  if (estaFinal(status)) return 'done'
  if (status === STATUS.PENDENTE_ACEITE || status === 'Não aceita pelo setor') return 'pending'
  return 'progress'
}

function priorityModifier(prioridade) {
  return prioridade
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
}

// Todos os cards abrem o detalhe (defeito G04). Quem só abriu a demanda vê o resumo:
// status e setor atual, sem prioridade (RN03, RN12).
function DemandCard({ demand, usuario, agora }) {
  const completa = podeVerDetalhes(usuario, demand)
  const exibida = completa ? demand : resumoParaSolicitante(demand)
  // Bloco 4B: "Aguardando aceite há X", "Em triagem · parada há X" ou "Atrasada para …".
  // Quem só abriu não recebe selo (atencao.js → seloDeAtencao).
  const selo = seloDeAtencao(demand, usuario, agora)

  return (
    <a className="demand-card demand-card--link" href={`#demanda/${demand.id}`}>
      <div className="demand-card-heading">
        <span className="demand-id">#{demand.id}</span>
        {completa && (
          <span className={`priority priority--${priorityModifier(demand.prioridade)}`}>
            {demand.prioridade}
          </span>
        )}
      </div>

      <h3 className="demand-title">{demand.titulo}</h3>

      {selo && (
        <p className={`attention-tag${selo.atrasada ? ' attention-tag--late' : ''}`}>{selo.texto}</p>
      )}

      <div className="demand-meta">
        {completa ? (
          <p>
            <span>Origem:</span> {nomeDoSetor(demand.origem)}
          </p>
        ) : (
          <p>
            <span>Setor atual:</span> {nomeDoSetor(exibida.setorAtual)}
          </p>
        )}
        <p>
          <span>Solicitante:</span> {demand.solicitante}
        </p>
      </div>

      <div className="demand-card-footer">
        <span className={`demand-status demand-status--${statusModifier(exibida.status)}`}>
          {exibida.status}
        </span>
        <time dateTime={demand.criadaEm}>{formatarData(demand.criadaEm)}</time>
      </div>
      <span className="sr-only">Abrir detalhes da demanda</span>
    </a>
  )
}

function Demandas({ usuario, setorInicial, statusInicial = '', filtroInicial = '', abaInicial = ABAS.RECEBIDAS }) {
  const { carregando, demandas, erro, resetar } = useDemandas()
  const gerencia = ehGerencia(usuario)
  const abas = abasDoPerfil(usuario)
  const [aba, setAba] = useState(abaInicial)
  // Filtro que veio de um card da Visão Geral (Vencidas, A expirar…): aparece em destaque e pode ser limpo.
  const [filtroPainel, setFiltroPainel] = useState(filtroInicial)
  // Setor fica travado no próprio departamento; só a gerência escolhe (RF-R04).
  const [setor, setSetor] = useState(gerencia ? (setorInicial ?? '') : usuario.departamento)
  const [searchTerm, setSearchTerm] = useState('')
  // Bloco 4B: o padrão é "atenção primeiro"; qualquer outra escolha do usuário vale no lugar dela.
  const [sortBy, setSortBy] = useState('atencao')
  // Bloco 4B: filtro de status; os cards da Visão Geral já chegam com ele preenchido pela URL.
  const [statusFiltro, setStatusFiltro] = useState(statusInicial)
  const [currentPage, setCurrentPage] = useState(1)
  // "Agora" fixado quando a tela abre, como na Visão Geral: o tempo parado não muda sozinho.
  const [agora] = useState(() => new Date())

  const listaDaAba = useMemo(
    () => demandasDaAba(demandas, usuario, aba, setor || null),
    [demandas, usuario, aba, setor],
  )

  const { pendentes, demais } = useMemo(() => {
    // Status e filtro do painel filtram a lista JÁ recortada pela permissão: nunca mostram além do que o perfil vê.
    // A busca é a mesma da Visão Geral (listas.js → combinaComBusca).
    const filtered = filtrarPorStatus(filtrarPorPainel(listaDaAba, filtroPainel, agora), statusFiltro).filter((demand) =>
      combinaComBusca(demand, searchTerm),
    )
    const sorted =
      sortBy === 'atencao' ? ordenarPorAtencao(filtered, usuario) : ordenarDemandas(filtered, sortBy)
    // "Pendentes de aceite" no topo só faz sentido para quem recebe (seção 5 dos requisitos).
    return aba === ABAS.RECEBIDAS ? separarPendentes(sorted) : { pendentes: [], demais: sorted }
  }, [listaDaAba, searchTerm, sortBy, aba, statusFiltro, usuario, filtroPainel, agora])

  // Lista inteira paginada, grupo de pendentes primeiro, sem repetir nada entre as páginas.
  const pagina = paginarComPendentes({ pendentes, demais }, currentPage, ITEMS_PER_PAGE)
  const pageCount = pagina.totalPaginas
  const pendentesDaPagina = pagina.pendentes
  const visibleDemands = pagina.demais
  const ativas = listaDaAba.filter((demand) => !estaFinal(demand.status)).length

  const departamentoAtual = departamentos.find((item) => item.id === setor)
  const titulo = departamentoAtual ? departamentoAtual.nome : 'Todos os departamentos'
  const descricao = departamentoAtual ? departamentoAtual.descricao : 'Demandas de todos os setores.'

  function updateSearch(value) {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  function trocarAba(novaAba) {
    setAba(novaAba)
    setCurrentPage(1)
  }

  return (
    <section className="demands-page" aria-labelledby="department-name">
      <div className="department-heading">
        <div>
          <p className="eyebrow">Departamento</p>
          <h2 id="department-name">{titulo}</h2>
          <p className="department-description">{descricao}</p>
        </div>
        <p className="active-count">{quantidade(ativas, 'demanda ativa', 'demandas ativas')}</p>
      </div>

      <div className="demand-tabs" role="group" aria-label="Lista de demandas">
        {abas.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`demand-tab${aba === item.id ? ' demand-tab--active' : ''}`}
            aria-pressed={aba === item.id}
            onClick={() => trocarAba(item.id)}
          >
            {item.rotulo}
          </button>
        ))}
      </div>

      <div className="demands-toolbar">
        <label className="search-field">
          <span className="sr-only">Buscar por título, ID ou solicitante</span>
          {/* Lupa dentro da busca, como em Departamentos e na Visão Geral (substitui o botão do topo). */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 4.3 4.3" />
          </svg>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Buscar por título, ID ou solicitante..."
          />
        </label>

        <div className="demands-filters">
          <label className="sort-control">
            <span>Departamento:</span>
            <select
              value={setor}
              disabled={!gerencia}
              onChange={(event) => {
                setSetor(event.target.value)
                setCurrentPage(1)
              }}
            >
              {gerencia && <option value="">Todos</option>}
              {departamentos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="sort-control">
            <span>Status:</span>
            <select
              value={statusFiltro}
              onChange={(event) => {
                setStatusFiltro(event.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="">Todos</option>
              {Object.values(STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="sort-control">
            <span>Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="atencao">Atenção primeiro</option>
              <option value="padrao">Prioridade e data</option>
              <option value="recentes">Mais recentes</option>
              <option value="antigas">Mais antigas</option>
              <option value="maior-prioridade">Maior prioridade</option>
              <option value="menor-prioridade">Menor prioridade</option>
            </select>
          </label>
        </div>
      </div>

      {carregando ? (
        <Carregando />
      ) : erro ? (
        <ErroDados erro={erro} onResetar={resetar} />
      ) : (
        <>
          {FILTROS_DO_PAINEL[filtroPainel] && (
            <div className="active-filter">
              <p>
                Filtro da Visão Geral: <strong>{FILTROS_DO_PAINEL[filtroPainel].rotulo}</strong>
              </p>
              <button
                type="button"
                className="active-filter__clear"
                onClick={() => {
                  setFiltroPainel('')
                  setCurrentPage(1)
                }}
              >
                Limpar filtro
              </button>
            </div>
          )}

          <p className="results-count" aria-live="polite">
            Exibindo {pendentesDaPagina.length + visibleDemands.length} de {pagina.total}{' '}
            {pagina.total === 1 ? 'demanda' : 'demandas'}
          </p>

          {pendentesDaPagina.length > 0 && (
            <section className="pending-section" aria-labelledby="pendentes-titulo">
              {/* O número é o total do grupo, mesmo quando ele continua na página seguinte. */}
              <h3 id="pendentes-titulo" className="pending-title">
                Pendentes de aceite ({pagina.totalPendentes})
              </h3>
              <div className="demands-grid">
                {pendentesDaPagina.map((demand) => (
                  <DemandCard demand={demand} usuario={usuario} agora={agora} key={demand.id} />
                ))}
              </div>
            </section>
          )}

          {visibleDemands.length > 0 ? (
            <div className="demands-grid">
              {visibleDemands.map((demand) => (
                <DemandCard demand={demand} usuario={usuario} agora={agora} key={demand.id} />
              ))}
            </div>
          ) : (
            pendentesDaPagina.length === 0 && (
              <div className="empty-state">
                <h3>Nenhuma demanda encontrada</h3>
                <p>Tente outra busca, outro status ou outro departamento.</p>
              </div>
            )
          )}

          {pageCount > 1 && (
            <nav className="pagination" aria-label="Paginação das demandas">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                ‹
              </button>
              <span>
                {currentPage} / {pageCount}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                disabled={currentPage === pageCount}
                aria-label="Próxima página"
              >
                ›
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  )
}

export default Demandas
