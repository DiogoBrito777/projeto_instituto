import departamentos from '../data/departamentos.json'
import { iniciais } from '../formatos.js'
import './Sidebar.css'

const navigation = [
  { id: 'nova-demanda', label: 'Nova demanda', icon: 'plus', href: '#nova-demanda' },
  { id: 'visao-geral', label: 'Visão geral', icon: 'calendar', href: '#visao-geral' },
  { id: 'demandas', label: 'Demandas', icon: 'inbox', href: '#demandas' },
  { id: 'departamentos', label: 'Departamentos', icon: 'users', href: '#departamentos' },
]

function Icon({ name }) {
  const shared = {
    'aria-hidden': true,
    className: 'nav-icon',
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
  }

  if (name === 'plus') {
    return (
      <svg {...shared}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    )
  }

  if (name === 'calendar') {
    return (
      <svg {...shared}>
        <rect x="4" y="6" width="16" height="14" rx="2" />
        <path d="M8 3v5M16 3v5M4 10h16" />
        <path d="M8 14h3v3H8z" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (name === 'inbox') {
    return (
      <svg {...shared}>
        <path d="M4 5.5h16v13H4z" />
        <path d="M4 13h4l1.5 2h5L16 13h4" />
      </svg>
    )
  }

  if (name === 'users') {
    return (
      <svg {...shared}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19v-1.2A4.8 4.8 0 0 1 8.3 13h1.4a4.8 4.8 0 0 1 4.8 4.8V19z" />
        <path d="M16 5.5a3 3 0 0 1 0 5.8M17 13h.7a3.8 3.8 0 0 1 3.8 3.8V19H17" />
      </svg>
    )
  }

  return (
    <svg {...shared}>
      <path d="M10 17l5-5-5-5M15 12H4" />
      <path d="M13 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
    </svg>
  )
}

// Gerência aparece como "Gerenciamento"; setor aparece com o nome do departamento.
function descricaoDoPerfil(usuario) {
  if (usuario.perfil === 'gerenciamento') return 'Gerenciamento'
  return departamentos.find((item) => item.id === usuario.departamento)?.nome ?? 'Departamento'
}

function Sidebar({ activeItem, usuario, onSair }) {
  return (
    <aside className="sidebar">
      <a className="sidebar-brand" href="#inicio">
        Demanda de aço
      </a>

      <nav className="sidebar-nav" aria-label="Navegação principal">
        {navigation.map((item) => (
          <a
            className={`nav-link${activeItem === item.id ? ' nav-link--active' : ''}`}
            href={item.href}
            aria-current={activeItem === item.id ? 'page' : undefined}
            key={item.id}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-profile">
        <div className="profile-avatar" aria-hidden="true">
          {iniciais(usuario.nome)}
        </div>
        <div className="profile-copy">
          <span className="profile-name">{usuario.nome}</span>
          <span className="profile-role">{descricaoDoPerfil(usuario)}</span>
        </div>
        <button className="logout-button" type="button" aria-label="Sair" onClick={onSair}>
          <Icon name="logout" />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
