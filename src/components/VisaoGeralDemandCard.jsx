const TOM_POR_STATUS = {
  'em-andamento': 'azul',
  pendente: 'ambar',
  'alta-prioridade': 'vermelho',
  concluida: 'verde',
}

export default function DemandCard({ demanda, onAbrir }) {
  const tom = TOM_POR_STATUS[demanda.status] ?? 'azul'

  return (
    <article className="demand-card">
      <div className="demand-card__top">
        <span className={`badge badge--${tom}`}>{demanda.statusLabel}</span>
        <span className="demand-card__ref">{demanda.id}</span>
      </div>

      <h3 className="demand-card__title">{demanda.titulo}</h3>
      <p className="demand-card__desc">{demanda.descricao}</p>

      <hr className="demand-card__divider" />

      <div className="demand-card__bottom">
        <div className="demand-card__owner">
          <div className="avatar avatar--sm">{demanda.responsavel}</div>
          <div className="demand-card__owner-text">
            <span className="demand-card__category">{demanda.categoria}</span>
            <span className="demand-card__time">{demanda.atualizadoEm}</span>
          </div>
        </div>
        <button className="btn-outline" onClick={() => onAbrir?.(demanda)}>
          Abrir
        </button>
      </div>
    </article>
  )
}
