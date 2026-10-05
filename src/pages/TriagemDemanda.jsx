import { useRef, useState } from 'react'
import departamentos from '../data/departamentos.json'
import { obterStorage } from '../services/storage.js'
import {
  ERROS_ACAO,
  LIMITE_JUSTIFICATIVA,
  cancelarDemanda,
  marcarNaoAplicavel,
  motivoDaTriagem,
  redirecionarDemanda,
} from '../domain/acoes.js'
import { prazoAposRedirecionar } from '../domain/atencao.js'
import { nomeDoSetor, tiposDoSetor } from '../domain/setores.js'
import ContadorLimite from '../components/ContadorLimite.jsx'
import Dialogo from '../components/Dialogo.jsx'
import { useAvisoLimite } from '../hooks/useAvisoLimite.js'
import { MENSAGENS } from '../mensagens.js'
import { formatarData, formatarDataHora } from '../formatos.js'
import './DetalhesDemanda.css'

// "Modo triagem" da tela Atualizar (Bloco 4C): só a gerência, só com a demanda Em triagem
// (AtualizarDemanda.jsx confere com podeRedirecionar antes de mostrar esta tela).
// Mostra por que a demanda foi recusada e quem recusou, e oferece as três saídas da triagem:
// Redirecionar (RN18), Não aplicável e Cancelar (RN19). Cada uma passa por um pop-up de confirmação
// com justificativa obrigatória, e a regra é conferida de novo no storage, com a demanda lida na hora
// de gravar.

const contextoDaAcao = () => ({ agora: new Date(), novoId: () => crypto.randomUUID() })

function mensagemDeErro(erro) {
  if (erro === ERROS_ACAO.FINALIZADA) return MENSAGENS.finalizada
  if (erro === ERROS_ACAO.SETOR_INVALIDO) return MENSAGENS.redirecionarSemSetor
  if (erro === ERROS_ACAO.TIPO_INVALIDO) return MENSAGENS.redirecionarSemTipo
  if (erro === ERROS_ACAO.JUSTIFICATIVA_AUSENTE) return MENSAGENS.justificativaAusente
  if (erro === ERROS_ACAO.JUSTIFICATIVA_LONGA) return MENSAGENS.justificativaLonga
  if (erro === ERROS_ACAO.SEM_PERMISSAO || erro === ERROS_ACAO.TRANSICAO_INVALIDA) return MENSAGENS.semEdicao
  return MENSAGENS.salvarErro
}

// Não aplicável e Cancelar têm o mesmo formato: pop-up com justificativa obrigatória.
const ENCERRAMENTOS = {
  'nao-aplicavel': {
    titulo: 'Marcar como não aplicável',
    descricao: MENSAGENS.naoAplicavelDescricao,
    confirmar: 'Confirmar não aplicável',
    acao: marcarNaoAplicavel,
  },
  cancelar: {
    titulo: 'Cancelar demanda',
    descricao: MENSAGENS.cancelarDescricao,
    confirmar: 'Confirmar cancelamento',
    acao: cancelarDemanda,
  },
}

export default function FormularioTriagem({ demand, usuario }) {
  const [setor, setSetor] = useState('')
  const [tipo, setTipo] = useState('')
  const [erroSetor, setErroSetor] = useState('')
  const [erroTipo, setErroTipo] = useState('')
  const [dialogo, setDialogo] = useState(null)
  const [prazoPrevisto, setPrazoPrevisto] = useState(null)
  const [justificativa, setJustificativa] = useState('')
  const [erroJustificativa, setErroJustificativa] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [mensagemErro, setMensagemErro] = useState('')
  const limiteJustificativa = useAvisoLimite(LIMITE_JUSTIFICATIVA)

  const campoSetor = useRef(null)
  const campoTipo = useRef(null)
  const campoJustificativa = useRef(null)
  const botaoRedirecionar = useRef(null)
  const botaoNaoAplicavel = useRef(null)
  const botaoCancelar = useRef(null)

  const recusa = motivoDaTriagem(demand)
  const historico = [...demand.historico].reverse()
  const encerramento = ENCERRAMENTOS[dialogo]

  // Grava e, dando certo, volta à lista de Demandas (o App leva o foco ao título).
  async function gravar(acao) {
    setSalvando(true)
    setMensagemErro('')
    const resultado = await obterStorage().atualizarDemanda(demand.id, acao)
    setSalvando(false)
    if (resultado.ok) {
      window.location.hash = '#demandas'
      return
    }
    setDialogo(null)
    setMensagemErro(mensagemDeErro(resultado.erro))
  }

  // Sem setor ou sem tipo do novo setor, o pop-up nem abre: a mensagem fica junto do campo.
  function pedirRedirecionamento(event) {
    event.preventDefault()
    if (!setor) {
      setErroSetor(MENSAGENS.redirecionarSemSetor)
      campoSetor.current.focus()
      return
    }
    if (!tiposDoSetor(setor).includes(tipo)) {
      setErroTipo(MENSAGENS.redirecionarSemTipo)
      campoTipo.current.focus()
      return
    }
    // Prazo mostrado no pop-up: o mesmo cálculo que valerá depois (24 h a partir de agora).
    setPrazoPrevisto(prazoAposRedirecionar(new Date()))
    abrirComJustificativa('redirecionar')
  }

  // Os três pop-ups da triagem pedem justificativa (redirecionar: decisão de 04/10, para o relógio
  // de 24 h não ser reiniciado sem motivo; Não aplicável e Cancelar: RN19). Cada abertura começa vazia.
  function abrirComJustificativa(chave) {
    setJustificativa('')
    setErroJustificativa('')
    // O campo começa vazio: o aviso de limite da vez anterior não pode continuar (ajustes, item 5).
    limiteJustificativa.reiniciar('')
    setDialogo(chave)
  }

  // Justificativa vazia não grava: a mensagem fica junto do campo e o foco volta para ele.
  function justificativaPreenchida() {
    if (justificativa.trim()) return true
    setErroJustificativa(MENSAGENS.justificativaAusente)
    campoJustificativa.current.focus()
    return false
  }

  async function confirmarRedirecionamento() {
    if (!justificativaPreenchida()) return
    await gravar((atual) => redirecionarDemanda(atual, { setor, tipo, justificativa }, usuario, contextoDaAcao()))
  }

  async function confirmarEncerramento() {
    if (!justificativaPreenchida()) return
    await gravar((atual) => encerramento.acao(atual, justificativa, usuario, contextoDaAcao()))
  }

  // Campo de justificativa, igual nos três pop-ups (só um pop-up fica aberto por vez).
  const campoDeJustificativa = (
    <>
      <label className="detail-form-field" htmlFor="justificativa">
        <span>Justificativa (obrigatória)</span>
      </label>
      <textarea
        ref={campoJustificativa}
        id="justificativa"
        className="dialog-textarea"
        data-autofocus
        value={justificativa}
        onChange={(event) => {
          limiteJustificativa.aoMudar(event.target.value)
          setJustificativa(event.target.value)
          setErroJustificativa('')
        }}
        onPaste={limiteJustificativa.aoColar}
        maxLength={LIMITE_JUSTIFICATIVA}
        aria-invalid={erroJustificativa ? 'true' : undefined}
        aria-describedby={['justificativa-contador', erroJustificativa && 'justificativa-erro'].filter(Boolean).join(' ')}
      />
      <ContadorLimite
        id="justificativa"
        valor={justificativa}
        limite={LIMITE_JUSTIFICATIVA}
        aviso={limiteJustificativa.aviso}
      />
      {erroJustificativa && (
        <p id="justificativa-erro" className="field-error">
          {erroJustificativa}
        </p>
      )}
    </>
  )

  function fecharDialogo() {
    if (!salvando) setDialogo(null)
  }

  return (
    <section className="detail-page update-page" aria-label="Triar demanda">
      <nav className="detail-breadcrumb" aria-label="Você está em">
        <a href="#demandas">Demandas</a><span>›</span>
        <a href={`#demanda/${demand.id}`}>{demand.titulo}</a><span>›</span>
        <span aria-current="page">Triagem</span>
      </nav>

      <div className="detail-layout">
        <form className="detail-main-column update-form" onSubmit={pedirRedirecionamento} noValidate>
          <section className="detail-card detail-summary">
            <div className="detail-summary-top">
              <p className="detail-eyebrow">Código: <span>{demand.id}</span></p>
              <span className="detail-status"><i />{demand.status}</span>
            </div>
            <h2>{demand.titulo}</h2>
            <div className="detail-summary-meta">
              <span>Criado em: <strong>{formatarData(demand.criadaEm)}</strong></span>
              <span className="detail-meta-divider" />
              <span>Origem: <strong>{nomeDoSetor(demand.origem)}</strong></span>
            </div>
          </section>

          {/* O destino não muda na recusa (auditoria), então ele é o setor que recusou. */}
          <section className="detail-card detail-description">
            <h3 className="detail-section-title">Motivo da recusa</h3>
            {recusa ? (
              <>
                <p>{recusa.texto}</p>
                <p>
                  Recusada por <strong>{recusa.autor}</strong> ({nomeDoSetor(demand.destino)}) em{' '}
                  {formatarDataHora(recusa.data)}.
                </p>
              </>
            ) : (
              <p>Nenhum motivo de recusa registrado no histórico.</p>
            )}
          </section>

          <section className="detail-card detail-specifications update-specifications">
            <h3 className="detail-section-title">Redirecionar para outro departamento</h3>
            <div className="update-fields-grid">
              <label className="update-field">
                <span>Novo departamento (obrigatório)</span>
                <select
                  ref={campoSetor}
                  value={setor}
                  onChange={(event) => {
                    // O tipo depende do setor: trocar o setor limpa o tipo escolhido.
                    setSetor(event.target.value)
                    setTipo('')
                    setErroSetor('')
                    setErroTipo('')
                  }}
                  aria-invalid={erroSetor ? 'true' : undefined}
                  aria-describedby={erroSetor ? 'setor-erro' : undefined}
                >
                  <option value="">Selecione</option>
                  {departamentos.map((item) => (
                    <option key={item.id} value={item.id}>{item.nome}</option>
                  ))}
                </select>
              </label>
              <label className="update-field">
                <span>Tipo de atendimento (obrigatório)</span>
                <select
                  ref={campoTipo}
                  value={tipo}
                  disabled={!setor}
                  onChange={(event) => {
                    setTipo(event.target.value)
                    setErroTipo('')
                  }}
                  aria-invalid={erroTipo ? 'true' : undefined}
                  aria-describedby={erroTipo ? 'tipo-erro' : 'tipo-dica'}
                >
                  <option value="">{setor ? 'Selecione' : 'Escolha primeiro o departamento'}</option>
                  {tiposDoSetor(setor).map((opcao) => (
                    <option key={opcao}>{opcao}</option>
                  ))}
                </select>
              </label>
            </div>
            <p id="tipo-dica" className="sr-only">As opções dependem do departamento escolhido.</p>
            {erroSetor && <p id="setor-erro" className="field-error">{erroSetor}</p>}
            {erroTipo && <p id="tipo-erro" className="field-error">{erroTipo}</p>}
          </section>

          <section className="detail-card detail-description">
            <h3 className="detail-section-title">Descrição</h3>
            <p>{demand.descricao}</p>
          </section>

          <div className="detail-actions update-actions">
            <button ref={botaoRedirecionar} className="detail-button detail-button--primary" type="submit">
              Redirecionar
            </button>
            <button
              ref={botaoNaoAplicavel}
              className="detail-button detail-button--outline"
              type="button"
              onClick={() => abrirComJustificativa('nao-aplicavel')}
            >
              Marcar como não aplicável
            </button>
            <button
              ref={botaoCancelar}
              className="detail-button detail-button--outline"
              type="button"
              onClick={() => abrirComJustificativa('cancelar')}
            >
              Cancelar demanda
            </button>
            <button
              className="detail-button detail-button--outline"
              type="button"
              onClick={() => { window.location.hash = `#demanda/${demand.id}` }}
            >
              Voltar
            </button>
          </div>
          {mensagemErro && (
            <p className="form-error" role="alert">
              {mensagemErro}
            </p>
          )}
        </form>

        <aside className="detail-card detail-history">
          <h2 className="detail-section-title">Histórico de Atualizações</h2>
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
      </div>

      {/* RN18: confirmação com setor, tipo, o novo prazo de aceite e a justificativa obrigatória.
          "Voltar" fecha sem gravar; o campo recebe o foco ao abrir. */}
      {dialogo === 'redirecionar' && (
        <Dialogo
          titulo="Confirmar redirecionamento"
          rotuloSuperior={demand.id}
          descricao={MENSAGENS.redirecionarConfirmacao(
            nomeDoSetor(setor),
            tipo,
            formatarDataHora(prazoPrevisto.toISOString()),
          )}
          onFechar={fecharDialogo}
          retornarFocoPara={botaoRedirecionar}
          acoes={
            <>
              <button className="detail-button detail-button--outline" type="button" onClick={fecharDialogo}>
                Voltar
              </button>
              <button
                className="detail-button detail-button--primary"
                type="button"
                disabled={salvando}
                onClick={confirmarRedirecionamento}
              >
                {salvando ? MENSAGENS.salvando : 'Confirmar redirecionamento'}
              </button>
            </>
          }
        >
          {campoDeJustificativa}
        </Dialogo>
      )}

      {/* RN19: Não aplicável e Cancelar exigem justificativa; o campo recebe o foco ao abrir. */}
      {encerramento && (
        <Dialogo
          titulo={encerramento.titulo}
          rotuloSuperior={demand.id}
          descricao={encerramento.descricao}
          onFechar={fecharDialogo}
          retornarFocoPara={dialogo === 'cancelar' ? botaoCancelar : botaoNaoAplicavel}
          acoes={
            <>
              <button className="detail-button detail-button--outline" type="button" onClick={fecharDialogo}>
                Voltar
              </button>
              <button
                className="detail-button detail-button--primary"
                type="button"
                disabled={salvando}
                onClick={confirmarEncerramento}
              >
                {salvando ? MENSAGENS.salvando : encerramento.confirmar}
              </button>
            </>
          }
        >
          {campoDeJustificativa}
        </Dialogo>
      )}
    </section>
  )
}
