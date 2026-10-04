// Recebe os indicadores já calculados (listas.js → indicadoresVisaoGeral): a lista muda conforme o perfil.
// O selo só aparece quando o indicador tem um texto de apoio.
// Bloco 4B: o card que tem "href" (um único status) é um link de verdade (<a>), que funciona com
// Tab e Enter e leva à lista de Demandas já filtrada. Os outros continuam só informativos.
export default function VisaoGeralStatsCards({ indicadores }) {
  return (
    <section className="stats">
      {indicadores.map(({ chave, rotulo, valor, badge, tom, href }) => {
        const conteudo = (
          <>
            <div className="stat-card__top">
              <span className="stat-card__label">{rotulo}</span>
              {badge && <span className={`badge badge--${tom ?? 'cinza'}`}>{badge}</span>}
            </div>
            <div className="stat-card__value">{valor}</div>
          </>
        )

        return href ? (
          <a className="stat-card stat-card--link" href={href} key={chave}>
            {conteudo}
            <span className="stat-card__acao">Ver na lista</span>
          </a>
        ) : (
          <div className="stat-card" key={chave}>
            {conteudo}
          </div>
        )
      })}
    </section>
  )
}
