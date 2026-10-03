import { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Departamentos from './pages/Departamentos.jsx'
import Demandas from './pages/Demandas.jsx'
import NovaDemanda from './pages/NovaDemanda.jsx'
import DetalhesDemanda from './pages/DetalhesDemanda.jsx'
import AtualizarDemanda from './pages/AtualizarDemanda.jsx'
import VisaoGeral from './pages/VisaoGeral.jsx' // NOVO
import Login from './pages/Login.jsx'
import { useSessao } from './hooks/useSessao.js'
import './App.css'

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="button-icon">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="search-icon">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.3 4.3" />
    </svg>
  )
}

function getPageFromHash(hash) {
  if (hash === '#login') return 'login'
  if (hash === '#visao-geral') return 'visao-geral' // NOVO
  if (hash === '#nova-demanda') return 'nova-demanda'
  if (hash === '#departamentos') return 'departamentos'
  if (hash.startsWith('#demanda/') && hash.endsWith('/editar')) return 'atualizar-demanda'
  if (hash.startsWith('#demanda/')) return 'detalhes-demanda'
  return 'demandas'
}

// "#demanda/DM-2003" e "#demanda/DM-2003/editar" → "DM-2003" (RF-R05).
function idDaRota(hash) {
  const encontrado = hash.match(/^#demanda\/([^/]+)/)
  return encontrado ? decodeURIComponent(encontrado[1]) : null
}

// "#demandas/hidraulica" → "hidraulica" ("Acessar setor" em Departamentos).
function setorDaRota(hash) {
  const encontrado = hash.match(/^#demandas\/([^/]+)/)
  return encontrado ? decodeURIComponent(encontrado[1]) : null
}

function App() {
  // O endereço inteiro fica no estado: assim a tela muda também quando só o id muda.
  const [hash, setHash] = useState(() => window.location.hash)
  const activePage = getPageFromHash(hash)
  const idDemanda = idDaRota(hash)
  const { usuario, entrar, sair } = useSessao()
  const searchInput = useRef(null)
  const isHomePage = activePage === 'visao-geral' // NOVO
  const isCreatePage = activePage === 'nova-demanda'
  const isDepartmentsPage = activePage === 'departamentos'
  const isDetailPage = activePage === 'detalhes-demanda'
  const isUpdatePage = activePage === 'atualizar-demanda'
  const pageTitle = isHomePage ? 'Visão geral' : isCreatePage ? 'Nova demanda' : isDepartmentsPage ? 'Departamentos' : isUpdatePage ? 'Atualizar Demanda' : isDetailPage ? 'Detalhes da Demanda' : 'Demandas'

  useEffect(() => {
    function handleHashChange() {
      setHash(window.location.hash)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // RN01 / CA-R10: sem sessão só existe o login; com sessão, o login leva à Visão Geral.
  // location.replace troca o endereço sem criar entrada no histórico, então o botão Voltar
  // não reabre telas protegidas depois de Sair.
  useEffect(() => {
    if (!usuario && activePage !== 'login') window.location.replace('#login')
    if (usuario && activePage === 'login') window.location.replace('#visao-geral')
  }, [usuario, activePage])

  useEffect(() => {
    document.title = `${usuario ? pageTitle : 'Entrar'} | Demanda de aço`
  }, [usuario, pageTitle])

  if (!usuario) {
    return <Login onEntrar={entrar} />
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeItem={isDetailPage || isUpdatePage ? 'demandas' : activePage}
        usuario={usuario}
        onSair={sair}
      />

      <main className="app-main">
        <header className="topbar">
          <h1 className="page-title">{pageTitle}</h1>
          {isCreatePage ? (
            <button
              className="topbar-action"
              type="button"
              onClick={() => document.getElementById('destino')?.focus()}
            >
              <PlusIcon />
              <span>Criar</span>
            </button>
          ) : !isHomePage && !isDepartmentsPage && !isDetailPage && !isUpdatePage ? (
            <button
              className="topbar-search"
              type="button"
              onClick={() => searchInput.current?.focus()}
              aria-label="Buscar demandas"
            >
              <SearchIcon />
            </button>
          ) : null}
        </header>

        {isCreatePage ? (
          <NovaDemanda usuario={usuario} />
        ) : isHomePage ? (
          <VisaoGeral usuario={usuario} />
        ) : isDepartmentsPage ? (
          <Departamentos usuario={usuario} />
        ) : isDetailPage ? (
          <DetalhesDemanda key={idDemanda} id={idDemanda} usuario={usuario} />
        ) : isUpdatePage ? (
          <AtualizarDemanda key={idDemanda} id={idDemanda} usuario={usuario} />
        ) : (
          <Demandas
            key={setorDaRota(hash) ?? 'todos'}
            searchInput={searchInput}
            usuario={usuario}
            setorInicial={setorDaRota(hash)}
          />
        )}
      </main>
    </div>
  )
}

export default App
