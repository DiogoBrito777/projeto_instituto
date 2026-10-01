const CARDS = [
  { key: 'total', label: 'Total de demandas' },
  { key: 'pendentes', label: 'Pendentes' },
  { key: 'altaPrioridade', label: 'Alta prioridade' },
  { key: 'concluidas', label: 'Concluídas' },
]

export default function VisaoGeralStatsCards({ indicadores }) {
  return (
    <section className="stats">
      {CARDS.map(({ key, label }) => {
        const dado = indicadores[key]
        if (!dado) return null

        return (
          <div className="stat-card" key={key}>
            <div className="stat-card__top">
              <span className="stat-card__label">{label}</span>
              <span className={`badge badge--${dado.tom}`}>{dado.badge}</span>
            </div>
            <div className="stat-card__value">{dado.valor}</div>
          </div>
        )
      })}
    </section>
  )
}
