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
import { statusDoSlug } from './domain/listas.js'
import './App.css'

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="button-icon">
      <path d="M12 5v14M5 12h14" />
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
// O "?" fica de fora: "#demandas/eletrica?status=em-triagem" → "eletrica" (Bloco 4B).
function setorDaRota(hash) {
  const encontrado = hash.match(/^#demandas\/([^/?]+)/)
  return encontrado ? decodeURIComponent(encontrado[1]) : null
}

// "#demandas?status=em-triagem" → "Em triagem" (cards e aviso da Visão Geral; Bloco 4B).
// Com roteamento por hash, o filtro vai depois do "?" dentro do próprio hash.
function statusDaRota(hash) {
  if (!hash.startsWith('#demandas')) return ''
  const consulta = hash.split('?')[1] ?? ''
  return statusDoSlug(new URLSearchParams(consulta).get('status'))
}

function App() {
  // O endereço inteiro fica no estado: assim a tela muda também quando só o id muda.
  const [hash, setHash] = useState(() => window.location.hash)
  const activePage = getPageFromHash(hash)
  const idDemanda = idDaRota(hash)
  const { usuario, entrar, sair } = useSessao()
  const tituloDaPagina = useRef(null)
  const hashAnterior = useRef(hash)
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

  // WCAG 2.4.3: com roteamento por hash o navegador não muda o foco ao trocar de tela, e quem usa
  // leitor de tela não percebe a troca. Por isso o foco vai para o título (h1) a cada mudança de
  // endereço. No primeiro carregamento não move, para não pular o início da página.
  useEffect(() => {
    if (hashAnterior.current === hash) return
    hashAnterior.current = hash
    tituloDaPagina.current?.focus()
  }, [hash])

  if (!usuario) {
    return <Login onEntrar={entrar} />
  }

  return (
    <div className="app-shell">
      {/* WCAG 2.4.1: pular o menu. É botão (e não link "#conteudo") porque com roteamento por
          hash um link trocaria de tela. Leva o foco ao título da tela (h1), que mostra contorno
          visível; antes ia ao <main>, sem contorno, e o Enter parecia não fazer nada. */}
      <button className="skip-link" type="button" onClick={() => tituloDaPagina.current?.focus()}>
        Ir para o conteúdo
      </button>

      <Sidebar
        activeItem={isDetailPage || isUpdatePage ? 'demandas' : activePage}
        usuario={usuario}
        onSair={sair}
      />

      <main className="app-main">
        <header className="topbar">
          {/* O único h1 da tela; tabIndex -1 permite receber o foco por código, sem entrar no Tab. */}
          <h1 className="page-title" ref={tituloDaPagina} tabIndex={-1}>
            {pageTitle}
          </h1>
          {isCreatePage && (
            <button
              className="topbar-action"
              type="button"
              onClick={() => document.getElementById('destino')?.focus()}
            >
              <PlusIcon />
              <span>Criar</span>
            </button>
          )}
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
            key={`${setorDaRota(hash) ?? 'todos'}|${statusDaRota(hash)}`}
            usuario={usuario}
            setorInicial={setorDaRota(hash)}
            statusInicial={statusDaRota(hash)}
          />
        )}
      </main>
    </div>
  )
}

export default App
