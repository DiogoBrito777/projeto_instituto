// Recebe os indicadores já calculados (listas.js → indicadoresVisaoGeral): a lista muda conforme o perfil.
// O selo só aparece quando o indicador tem um texto de apoio.
export default function VisaoGeralStatsCards({ indicadores }) {
  return (
    <section className="stats">
      {indicadores.map(({ chave, rotulo, valor, badge, tom }) => (
        <div className="stat-card" key={chave}>
          <div className="stat-card__top">
            <span className="stat-card__label">{rotulo}</span>
            {badge && <span className={`badge badge--${tom ?? 'cinza'}`}>{badge}</span>}
          </div>
          <div className="stat-card__value">{valor}</div>
        </div>
      ))}
    </section>
  )
}
