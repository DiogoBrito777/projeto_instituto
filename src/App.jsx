import { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Departamentos from './pages/Departamentos.jsx'
import Demandas from './pages/Demandas.jsx'
import NovaDemanda from './pages/NovaDemanda.jsx'
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

function getPageFromHash() {
  if (window.location.hash === '#nova-demanda') return 'nova-demanda'
  if (window.location.hash === '#departamentos') return 'departamentos'
  return 'demandas'
}

function App() {
  const [activePage, setActivePage] = useState(getPageFromHash)
  const searchInput = useRef(null)
  const isCreatePage = activePage === 'nova-demanda'
  const isDepartmentsPage = activePage === 'departamentos'
  const pageTitle = isCreatePage ? 'Nova demanda' : isDepartmentsPage ? 'Departamentos' : 'Demandas'

  useEffect(() => {
    function handleHashChange() {
      setActivePage(getPageFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    document.title = `${pageTitle} | Demanda de aço`
  }, [pageTitle])

  return (
    <div className="app-shell">
      <Sidebar activeItem={activePage} />

      <main className="app-main">
        <header className="topbar">
          <h1 className="page-title">{pageTitle}</h1>
          {isCreatePage ? (
            <button
              className="topbar-action"
              type="button"
              onClick={() => document.getElementById('origem')?.focus()}
            >
              <PlusIcon />
              <span>Criar</span>
            </button>
          ) : !isDepartmentsPage ? (
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
          <NovaDemanda />
        ) : isDepartmentsPage ? (
          <Departamentos />
        ) : (
          <Demandas searchInput={searchInput} />
        )}
      </main>
    </div>
  )
}

export default App
