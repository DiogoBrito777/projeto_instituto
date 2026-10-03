// "Alta prioridade" agora filtra pela prioridade (Alta ou Urgente), não por um status inventado (G05).
// As contagens vêm calculadas da base (listas.js → filtrarVisaoGeral).
export default function VisaoGeralFilterTabs({ ativo, onChange, contagens }) {
  const tabs = [
    { key: 'todas', label: 'Todas' },
    { key: 'pendentes', label: 'Pendentes', count: contagens.pendentes },
    {
      key: 'alta-prioridade',
      label: 'Alta prioridade',
      count: contagens['alta-prioridade'],
    },
    { key: 'concluidas', label: 'Concluídas' },
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
