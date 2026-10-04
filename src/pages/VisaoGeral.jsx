import { useMemo, useState } from 'react'
import departamentos from '../data/departamentos.json'
import { useDemandas } from '../hooks/useDemandas.js'
import {
  avisoDeAtencao,
  filtrarVisaoGeral,
  indicadoresVisaoGeral,
  linkDaLista,
  ordenarPorAtencao,
} from '../domain/listas.js'
import { ehGerencia, podeVer, podeVerDetalhes, resumoParaSolicitante, setorResponsavel } from '../domain/permissoes.js'
import { seloDeAtencao } from '../domain/atencao.js'
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
// Bloco 4B: "selo" de atenção só para executor/gerência; o resumo de quem abriu não tem selo.
function paraCard(demanda, usuario, agora) {
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
      selo: seloDeAtencao(demanda, usuario, agora),
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

  // Bloco 4B: card de um único status vira link para Demandas já filtrada (com o setor da gerência).
  const indicadores = useMemo(
    () =>
      indicadoresVisaoGeral(base, usuario, agora, setor || null).map((indicador) => ({
        ...indicador,
        href: indicador.status ? linkDaLista(indicador.status, setor || null) : null,
      })),
    [base, usuario, agora, setor],
  )

  const aviso = useMemo(() => avisoDeAtencao(base, usuario, setor || null), [base, usuario, setor])

  const contagens = {
    pendentes: filtrarVisaoGeral(base, usuario, 'pendentes').length,
    'alta-prioridade': filtrarVisaoGeral(base, usuario, 'alta-prioridade').length,
    triagem: filtrarVisaoGeral(base, usuario, 'triagem').length,
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
    // Bloco 4B: triagem e pendentes primeiro (a mais antiga antes); o resto continua por "recentes".
    return ordenarPorAtencao(filtradas, usuario, 'recentes').map((demanda) => paraCard(demanda, usuario, agora))
  }, [base, usuario, busca, filtroAtivo, agora])

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
          {/* Bloco 4B: só aparece quando há algo esperando ação de quem está logado. */}
          {aviso.total > 0 && (
            <section className="vg-aviso" aria-labelledby="vg-aviso-titulo">
              <h2 id="vg-aviso-titulo" className="vg-aviso__titulo">
                Precisa de atenção:
              </h2>
              <ul className="vg-aviso__lista">
                {aviso.triagem > 0 && (
                  <li>
                    <a href={linkDaLista(STATUS.EM_TRIAGEM, setor || null)}>
                      {aviso.triagem} aguardando triagem
                    </a>
                  </li>
                )}
                {aviso.pendentes > 0 && (
                  <li>
                    <a href={linkDaLista(STATUS.PENDENTE_ACEITE, setor || null)}>
                      {aviso.pendentes} {aviso.pendentes === 1 ? 'pendente' : 'pendentes'} de aceite
                    </a>
                  </li>
                )}
              </ul>
            </section>
          )}

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
