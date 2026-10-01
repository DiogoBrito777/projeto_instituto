import { useMemo, useState } from 'react'
import dados from '../data/VisaoGeral.json'
import Header from '../components/VisaoGeralHeader.jsx'
import StatsCards from '../components/VisaoGeralStatsCards.jsx'
import SearchBar from '../components/VisaoGeralSearchBar.jsx'
import FilterTabs from '../components/VisaoGeralFilterTabs.jsx'
import DemandList from '../components/VisaoGeralDemandList.jsx'
import './VisaoGeral.css'

export default function VisaoGeral() {
  const [busca, setBusca] = useState('')
  const [filtroAtivo, setFiltroAtivo] = useState('todas')

  const demandasFiltradas = useMemo(() => {
    return dados.demandas.filter((demanda) => {
      const combinaFiltro =
        filtroAtivo === 'todas' || demanda.status === filtroAtivo

      const termo = busca.trim().toLowerCase()
      const combinaBusca =
        termo === '' ||
        demanda.titulo.toLowerCase().includes(termo) ||
        demanda.descricao.toLowerCase().includes(termo) ||
        demanda.categoria.toLowerCase().includes(termo) ||
        demanda.id.toLowerCase().includes(termo)

      return combinaFiltro && combinaBusca
    })
  }, [busca, filtroAtivo])

  function abrirNovaDemanda() {
    window.location.hash = '#nova-demanda'
  }

  function abrirDemanda(demanda) {
    window.location.hash = `#demanda/${demanda.id}`
  }

  return (
    <div className="visao-geral">
      <Header
        onNovaDemanda={abrirNovaDemanda}
        usuario={dados.usuario.iniciais}
      />

      <StatsCards indicadores={dados.indicadores} />

      <SearchBar value={busca} onChange={setBusca} />

      <FilterTabs
        ativo={filtroAtivo}
        onChange={setFiltroAtivo}
        indicadores={dados.indicadores}
      />

      <DemandList
        demandas={demandasFiltradas}
        onVerTodas={() => setFiltroAtivo('todas')}
        onAbrirDemanda={abrirDemanda}
      />
    </div>
  )
}
