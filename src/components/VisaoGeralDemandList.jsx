import DemandCard from './VisaoGeralDemandCard.jsx'

export default function VisaoGeralDemandList({ demandas, onVerTodas, onAbrirDemanda }) {
  return (
    <section>
      <div className="section-header">
        <h2 className="section-header__title">Demandas recentes</h2>
        <button className="section-header__link" onClick={onVerTodas}>
          Ver todas
        </button>
      </div>

      <div className="demand-grid">
        {demandas.length === 0 ? (
          <div className="empty-state">
            Nenhuma demanda encontrada para esse filtro.
          </div>
        ) : (
          demandas.map((demanda) => (
            <DemandCard
              key={demanda.id}
              demanda={demanda}
              onAbrir={onAbrirDemanda}
            />
          ))
        )}
      </div>
    </section>
  )
}
