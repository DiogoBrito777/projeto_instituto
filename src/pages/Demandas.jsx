import { useMemo, useState } from 'react'
import departmentData from '../data/demandas.json'

const ITEMS_PER_PAGE = 6
const priorityOrder = { Alta: 1, 'Média': 2, Baixa: 3 }

function formatDate(dateValue) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(new Date(`${dateValue}T12:00:00`))
    .replace(/\s+de\s+/g, ' ')
}

function statusModifier(status) {
  if (status === 'Concluído') return 'done'
  if (status === 'Pendente') return 'pending'
  return 'progress'
}

function DemandCard({ demand }) {
  return (
    <article className="demand-card">
      <div className="demand-card-heading">
        <span className="demand-id">#{demand.id}</span>
        <span className={`priority priority--${priorityOrder[demand.prioridade]}`}>
          {demand.prioridade}
        </span>
      </div>

      <h3 className="demand-title">{demand.titulo}</h3>

      <div className="demand-meta">
        <p>
          <span>Origem:</span> {demand.origem}
        </p>
        <p>
          <span>Solicitante:</span> {demand.solicitante}
        </p>
      </div>

      <div className="demand-card-footer">
        <span className={`demand-status demand-status--${statusModifier(demand.status)}`}>
          {demand.status}
        </span>
        <time dateTime={demand.data}>{formatDate(demand.data)}</time>
      </div>
    </article>
  )
}

function Demandas({ searchInput }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recentes')
  const [currentPage, setCurrentPage] = useState(1)

  const sortedDemands = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLocaleLowerCase('pt-BR')
    const filtered = departmentData.demandas.filter((demand) =>
      [demand.id, demand.titulo, demand.solicitante, demand.origem]
        .some((value) => value.toLocaleLowerCase('pt-BR').includes(normalizedTerm)),
    )

    return filtered.sort((first, second) => {
      if (sortBy === 'antigas') {
        return first.data.localeCompare(second.data) || first.id.localeCompare(second.id)
      }

      if (sortBy === 'maior-prioridade') {
        return priorityOrder[first.prioridade] - priorityOrder[second.prioridade]
      }

      if (sortBy === 'menor-prioridade') {
        return priorityOrder[second.prioridade] - priorityOrder[first.prioridade]
      }

      return second.data.localeCompare(first.data) || second.id.localeCompare(first.id)
    })
  }, [searchTerm, sortBy])

  const pageCount = Math.max(1, Math.ceil(sortedDemands.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const visibleDemands = sortedDemands.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  function updateSearch(value) {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return (
    <section className="demands-page" aria-labelledby="department-name">
      <div className="department-heading">
        <div>
          <p className="eyebrow">Departamento</p>
          <h2 id="department-name">{departmentData.departamento}</h2>
          <p className="department-description">{departmentData.descricaoDepartamento}</p>
        </div>
        <p className="active-count">{departmentData.demandasAtivas} demandas ativas</p>
      </div>

      <div className="demands-toolbar">
        <label className="search-field">
          <span className="sr-only">Buscar por título, ID ou solicitante</span>
          <input
            ref={searchInput}
            type="search"
            value={searchTerm}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Buscar por título, ID ou solicitante..."
          />
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
            <option value="recentes">Mais recentes</option>
            <option value="antigas">Mais antigas</option>
            <option value="maior-prioridade">Maior prioridade</option>
            <option value="menor-prioridade">Menor prioridade</option>
          </select>
        </label>
      </div>

      <p className="results-count" aria-live="polite">
        Exibindo {visibleDemands.length} de {sortedDemands.length} demandas
      </p>

      {visibleDemands.length > 0 ? (
        <div className="demands-grid">
          {visibleDemands.map((demand) => (
            <DemandCard demand={demand} key={demand.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Nenhuma demanda encontrada</h3>
          <p>Tente buscar por outro título, ID ou solicitante.</p>
        </div>
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
    </section>
  )
}

export default Demandas
