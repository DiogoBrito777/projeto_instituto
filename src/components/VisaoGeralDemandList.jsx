import DemandCard from './VisaoGeralDemandCard.jsx'

export default function VisaoGeralDemandList({ demandas, onVerTodas, onAbrirDemanda }) {
  return (
    <section>
      <div className="section-header">
        <h2 className="section-header__title">Demandas recentes</h2>
        <button className="section-header__link" type="button" onClick={onVerTodas}>
          Ver todas
        </button>
      </div>

      {/* Anuncia ao leitor de tela quantas demandas sobraram depois da busca ou do filtro. */}
      <p className="sr-only" role="status">
        {demandas.length} {demandas.length === 1 ? 'demanda exibida' : 'demandas exibidas'}
      </p>

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
