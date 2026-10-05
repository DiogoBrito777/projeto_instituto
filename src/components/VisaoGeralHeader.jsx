import { Plus } from 'lucide-react'

// Data de hoje (antes era fixa em 16/06/2026).
function dataDeHoje() {
  return new Date()
    .toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    })
    .toUpperCase()
}

export default function VisaoGeralHeader({ onNovaDemanda, usuario }) {
  const dataFormatada = dataDeHoje()
  return (
    <header className="header">
      <div>
        <p className="header__eyebrow">{dataFormatada}</p>
        {/* h2: o h1 da tela é o título da barra do topo (um único h1 por tela, WCAG 1.3.1). */}
        <h2 className="header__title">Painel de Gerenciamento</h2>
        <p className="header__subtitle">
          Acompanhe demandas, prioridades e o ritmo da equipe.
        </p>
      </div>

      <div className="header__actions">
        <button className="btn-primary" onClick={onNovaDemanda}>
          <Plus size={16} strokeWidth={2.5} />
          Nova demanda
        </button>
        <div className="avatar" title={usuario}>
          {usuario}
        </div>
      </div>
    </header>
  )
}
