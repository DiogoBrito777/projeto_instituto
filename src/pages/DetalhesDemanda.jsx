import { useDemandas } from '../hooks/useDemandas.js'
import {
  podeAceitar,
  podeRedirecionar,
  podeVer,
  podeVerDetalhes,
  resumoParaSolicitante,
  setorResponsavel,
} from '../domain/permissoes.js'
import { podeEditar } from '../domain/acoes.js'
import { prazoResolucao } from '../domain/prazos.js'
import { prazoDeAceite } from '../domain/atencao.js'
import { STATUS, estaFinal } from '../domain/status.js'
import { nomeDoSetor } from '../domain/setores.js'
import { Carregando, ErroDados, SemPermissao } from '../components/EstadoDados.jsx'
import { MENSAGENS } from '../mensagens.js'
import { formatarData, formatarDataHora } from '../formatos.js'
import './DetalhesDemanda.css'

// O botão "Atribuir responsável" e o diálogo dele saíram no Bloco 2A: gravavam direto no
// localStorage e permitiam trocar o setor sem regra. Voltaram no Bloco 4C como "Triar demanda" →
// "Redirecionar", só da gerência e em triagem (RN18). A seção 4 dos requisitos exige só o novo
// destino (e o tipo do novo setor, decisão de 04/10), sem justificativa.

function DetailField({ label, children }) {
  return (
    <div className="detail-field">
      <span>{label}</span>
      <strong>{children}</strong>
    </div>
  )
}

function DetalhesDemanda({ id, usuario }) {
  const { carregando, demandas, erro, resetar } = useDemandas()

  if (carregando || erro) {
    return (
      <section className="detail-page" aria-label="Detalhes da demanda">
        {carregando ? <Carregando /> : <ErroDados erro={erro} onResetar={resetar} />}
      </section>
    )
  }

  const demand = demandas.find((item) => item.id === id)
  // RN04: inexistente e sem permissão dão a mesma resposta.
  if (!demand || !podeVer(usuario, demand)) {
    return (
      <section className="detail-page" aria-label="Detalhes da demanda">
        <SemPermissao />
      </section>
    )
  }

  // RN02/RN03: quem só abriu a demanda vê o resumo, nunca histórico, prazo ou prioridade.
  const completa = podeVerDetalhes(usuario, demand)
  const exibida = completa ? demand : resumoParaSolicitante(demand)
  const setorDoCaminho = completa ? demand.destino : exibida.setorAtual
  const prazo = completa ? prazoResolucao(demand) : null
  const historico = completa ? [...demand.historico].reverse() : []

  return (
    <section className="detail-page" aria-label="Detalhes da demanda">
      <nav className="detail-breadcrumb" aria-label="Você está em">
        <a href="#demandas">Demandas</a><span>›</span>
        <a href={`#demandas/${setorDoCaminho}`}>{nomeDoSetor(setorDoCaminho)}</a><span>›</span>
        <span aria-current="page">{exibida.titulo}</span>
      </nav>

      <div className="detail-layout">
        <div className="detail-main-column">
          <section className="detail-card detail-summary">
            <div className="detail-summary-top">
              <p className="detail-eyebrow">Código: <span>{exibida.id}</span></p>
              <span className="detail-status"><i />{exibida.status}</span>
            </div>
            <h2>{exibida.titulo}</h2>
            <div className="detail-summary-meta">
              <span>Criado em: <strong>{formatarData(exibida.criadaEm)}</strong></span>
              {completa && (
                <>
                  <span className="detail-meta-divider" />
                  <span>Prioridade: <strong className="detail-priority">{demand.prioridade}</strong></span>
                </>
              )}
            </div>
          </section>

          <section className="detail-card detail-specifications">
            <h3 className="detail-section-title">Especificações da Demanda</h3>
            <div className="detail-fields-grid">
              <DetailField label="Tipo de atendimento">{exibida.tipo}</DetailField>
              <DetailField label="Origem">{nomeDoSetor(exibida.origem)}</DetailField>
              <DetailField label="Solicitante (departamento)">
                {exibida.solicitante} ({nomeDoSetor(exibida.origem)})
              </DetailField>
              {completa ? (
                <>
                  <DetailField label="Departamento">{nomeDoSetor(demand.destino)}</DetailField>
                  {/* Em triagem, o responsável é a gerência; "Departamento" segue mostrando o destino. */}
                  <DetailField label="Responsável (setor)">{nomeDoSetor(setorResponsavel(demand))}</DetailField>
                  <DetailField label="Prazo">{prazo ? formatarDataHora(prazo.toISOString()) : 'Definido no aceite'}</DetailField>
                  {/* Bloco 4C: pendente mostra até quando aceitar (48 h, ou 24 h após redirecionar). */}
                  {demand.status === STATUS.PENDENTE_ACEITE && (
                    <DetailField label="Aceitar até">{formatarDataHora(prazoDeAceite(demand).toISOString())}</DetailField>
                  )}
                </>
              ) : (
                <DetailField label="Setor atual">{nomeDoSetor(exibida.setorAtual)}</DetailField>
              )}
            </div>
          </section>

          <section className="detail-card detail-description">
            <h3 className="detail-section-title">Descrição</h3>
            <p>{exibida.descricao}</p>
          </section>

          {/* Pendente de aceite: o executor vai à tela Atualizar para aceitar ou recusar (Bloco 4-A). */}
          {completa && (podeEditar(usuario, demand) || podeAceitar(usuario, demand)) && (
            <div className="detail-actions">
              <button className="detail-button detail-button--outline" type="button" onClick={() => { window.location.hash = `#demanda/${demand.id}/editar` }}>
                {podeAceitar(usuario, demand) ? 'Aceitar ou recusar' : 'Atualizar demanda'}
              </button>
            </div>
          )}
          {/* Bloco 4C: em triagem, só a gerência tria (redirecionar, não aplicável ou cancelar; RN18, RN19). */}
          {podeRedirecionar(usuario, demand) && (
            <div className="detail-actions">
              <button className="detail-button detail-button--outline" type="button" onClick={() => { window.location.hash = `#demanda/${demand.id}/editar` }}>
                Triar demanda
              </button>
            </div>
          )}
          {completa && estaFinal(demand.status) && <p>{MENSAGENS.finalizada}</p>}
        </div>

        {completa && (
          <aside className="detail-card detail-history">
            <h3 className="detail-section-title">Histórico de Atualizações</h3>
            <ol className="history-list">
              {historico.map((item, index) => (
                <li className={index === 0 ? 'history-item history-item--current' : 'history-item'} key={item.id}>
                  <span className="history-marker" />
                  <div>
                    <strong>{item.texto}</strong>
                    <time dateTime={item.data}>{formatarDataHora(item.data)} · {item.autor}</time>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        )}
      </div>
    </section>
  )
}

export default DetalhesDemanda
