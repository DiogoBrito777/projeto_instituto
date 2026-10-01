export default function VisaoGeralFilterTabs({ ativo, onChange, indicadores }) {
  const tabs = [
    { key: 'todas', label: 'Todas' },
    { key: 'pendente', label: 'Pendentes', count: indicadores.pendentes.valor },
    {
      key: 'alta-prioridade',
      label: 'Alta prioridade',
      count: indicadores.altaPrioridade.valor,
    },
    { key: 'concluida', label: 'Concluídas' },
  ]

  return (
    <section className="filters">
      <div className="filters__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab ${ativo === tab.key ? 'tab--active' : ''}`}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span className="tab__count">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
      <span className="filters__sort">Ordenar: Recentes</span>
    </section>
  )
}
