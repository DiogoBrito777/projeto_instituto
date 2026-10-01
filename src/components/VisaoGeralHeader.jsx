import { Plus } from 'lucide-react'

const dataFormatada = new Date(2026, 5, 16)
  .toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })
  .toUpperCase()

export default function VisaoGeralHeader({ onNovaDemanda, usuario = 'MA' }) {
  return (
    <header className="header">
      <div>
        <p className="header__eyebrow">{dataFormatada}</p>
        <h1 className="header__title">Painel de Gerenciamento</h1>
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
