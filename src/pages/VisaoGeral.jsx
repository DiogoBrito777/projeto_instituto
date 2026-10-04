import { useMemo, useState } from 'react'
import departamentos from '../data/departamentos.json'
import { useDemandas } from '../hooks/useDemandas.js'
import { filtrarVisaoGeral, indicadoresVisaoGeral, ordenarDemandas } from '../domain/listas.js'
import { ehGerencia, podeVer, podeVerDetalhes, resumoParaSolicitante, setorResponsavel } from '../domain/permissoes.js'
import { STATUS, estaFinal } from '../domain/status.js'
import { siglaDoSetor } from '../domain/setores.js'
import { Carregando, ErroDados } from '../components/EstadoDados.jsx'
import { formatarDataHora, iniciais } from '../formatos.js'
import Header from '../components/VisaoGeralHeader.jsx'
import StatsCards from '../components/VisaoGeralStatsCards.jsx'
import SearchBar from '../components/VisaoGeralSearchBar.jsx'
import FilterTabs from '../components/VisaoGeralFilterTabs.jsx'
import DemandList from '../components/VisaoGeralDemandList.jsx'
import './VisaoGeral.css'

// Chave de cor do card a partir do status real (o card dos colegas usa estas chaves).
function chaveDeCor(status) {
  if (status === STATUS.PENDENTE_ACEITE) return 'pendente'
  if (estaFinal(status)) return 'concluida'
  return 'em-andamento'
}

// Converte a demanda da base para o formato que o card da Visão Geral já usava.
// Quem só abriu vê o resumo: sem histórico, então a data mostrada é a de criação (RN03).
function paraCard(demanda, usuario) {
  if (podeVerDetalhes(usuario, demanda)) {
    const ultimoEvento = demanda.historico[demanda.historico.length - 1]
    return {
      id: demanda.id,
      status: chaveDeCor(demanda.status),
      statusLabel: demanda.status,
      titulo: demanda.titulo,
      descricao: demanda.descricao,
      categoria: demanda.tipo,
      responsavel: siglaDoSetor(demanda.destino),
      atualizadoEm: `Atualizada em ${formatarDataHora(ultimoEvento?.data ?? demanda.criadaEm)}`,
    }
  }
  const resumo = resumoParaSolicitante(demanda)
  return {
    id: resumo.id,
    status: chaveDeCor(demanda.status),
    statusLabel: resumo.status,
    titulo: resumo.titulo,
    descricao: resumo.descricao,
    categoria: resumo.tipo,
    responsavel: siglaDoSetor(resumo.setorAtual),
    atualizadoEm: `Criada em ${formatarDataHora(resumo.criadaEm)}`,
  }
}

export default function VisaoGeral({ usuario }) {
  const { carregando, demandas, erro, resetar } = useDemandas()
  const [busca, setBusca] = useState('')
  const [filtroAtivo, setFiltroAtivo] = useState('todas')
  const [setor, setSetor] = useState('')
  // "Agora" fixado quando a tela abre: os números não mudam sozinhos a cada redesenho.
  const [agora] = useState(() => new Date())
  const gerencia = ehGerencia(usuario)

  // Base da tela: só o que o usuário pode ver; a gerência pode recortar por setor (seção 6).
  const base = useMemo(
    () =>
      demandas
        .filter((demanda) => podeVer(usuario, demanda))
        // Em triagem a demanda é da gerência: não aparece sob o setor de destino.
        .filter((demanda) => !gerencia || !setor || setorResponsavel(demanda) === setor),
    [demandas, usuario, gerencia, setor],
  )

  const indicadores = useMemo(
    () => indicadoresVisaoGeral(base, usuario, agora, setor || null),
    [base, usuario, agora, setor],
  )

  const contagens = {
    pendentes: filtrarVisaoGeral(base, usuario, 'pendentes').length,
    'alta-prioridade': filtrarVisaoGeral(base, usuario, 'alta-prioridade').length,
  }

  const demandasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    const filtradas = filtrarVisaoGeral(base, usuario, filtroAtivo).filter(
      (demanda) =>
        termo === '' ||
        demanda.titulo.toLowerCase().includes(termo) ||
        demanda.descricao.toLowerCase().includes(termo) ||
        demanda.tipo.toLowerCase().includes(termo) ||
        demanda.id.toLowerCase().includes(termo),
    )
    return ordenarDemandas(filtradas, 'recentes').map((demanda) => paraCard(demanda, usuario))
  }, [base, usuario, busca, filtroAtivo])

  function abrirNovaDemanda() {
    window.location.hash = '#nova-demanda'
  }

  function abrirDemanda(demanda) {
    window.location.hash = `#demanda/${demanda.id}`
  }

  return (
    <div className="visao-geral">
      <Header onNovaDemanda={abrirNovaDemanda} usuario={iniciais(usuario.nome)} />

      {gerencia && (
        <label className="vg-setor">
          <span>Setor:</span>
          <select value={setor} onChange={(event) => setSetor(event.target.value)}>
            <option value="">Todos</option>
            {departamentos.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </label>
      )}

      {carregando ? (
        <Carregando />
      ) : erro ? (
        <ErroDados erro={erro} onResetar={resetar} />
      ) : (
        <>
          <StatsCards indicadores={indicadores} />

          <SearchBar value={busca} onChange={setBusca} />

          <FilterTabs ativo={filtroAtivo} onChange={setFiltroAtivo} contagens={contagens} />

          <DemandList
            demandas={demandasFiltradas}
            onVerTodas={() => setFiltroAtivo('todas')}
            onAbrirDemanda={abrirDemanda}
          />
        </>
      )}
    </div>
  )
}
