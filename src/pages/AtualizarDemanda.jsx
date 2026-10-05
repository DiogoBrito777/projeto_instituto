import { useRef, useState } from 'react'
import departamentos from '../data/departamentos.json'
import { useDemandas } from '../hooks/useDemandas.js'
import { obterStorage } from '../services/storage.js'
import { podeAceitar, podeVer } from '../domain/permissoes.js'
import {
  ERROS_ACAO,
  LIMITE_MOTIVO,
  LIMITE_OBSERVACAO,
  aceitarDemanda,
  podeEditar,
  recusarDemanda,
  salvarAtualizacao,
  statusParaEdicao,
} from '../domain/acoes.js'
import { PRIORIDADES, descreverPrazo, ehPrioridadeValida } from '../domain/prioridades.js'
import { prazoResolucao } from '../domain/prazos.js'
import { estaFinal } from '../domain/status.js'
import { nomeDoSetor, tiposDoSetor } from '../domain/setores.js'
import { Carregando, ErroDados, SemPermissao } from '../components/EstadoDados.jsx'
import ContadorLimite from '../components/ContadorLimite.jsx'
import Dialogo from '../components/Dialogo.jsx'
import { useAvisoLimite } from '../hooks/useAvisoLimite.js'
import { MENSAGENS } from '../mensagens.js'
import { formatarData, formatarDataHora } from '../formatos.js'
import './DetalhesDemanda.css'

function FormField({ label, name, value, onChange, children }) {
  return (
    <label className="update-field">
      <span>{label}</span>
      {children || <input name={name} value={value} onChange={onChange} required />}
    </label>
  )
}

// Mensagem de erro conforme o motivo. Erros de gravação mantêm o formulário (ERROR_HANDLING.md, seção 6).
function mensagemDeErro(erro) {
  if (erro === ERROS_ACAO.SEM_ALTERACAO) return MENSAGENS.semAlteracao
  if (erro === ERROS_ACAO.FINALIZADA) return MENSAGENS.finalizada
  if (erro === ERROS_ACAO.OBSERVACAO_LONGA) return MENSAGENS.observacaoLonga
  if (erro === ERROS_ACAO.PRIORIDADE_AUSENTE) return MENSAGENS.aceiteSemPrioridade
  if (erro === ERROS_ACAO.MOTIVO_AUSENTE) return MENSAGENS.recusaSemMotivo
  if (erro === ERROS_ACAO.MOTIVO_LONGO) return MENSAGENS.motivoLongo
  return MENSAGENS.salvarErro
}

const contextoDaAcao = () => ({ agora: new Date(), novoId: () => crypto.randomUUID() })

function Aviso({ demand, texto }) {
  return (
    <section className="detail-page update-page" aria-label="Atualizar demanda">
      <div className="empty-state" role="alert">
        <p>{texto}</p>
        <a href={`#demanda/${demand.id}`}>Voltar para os detalhes</a>
      </div>
    </section>
  )
}

// Só o setor executor altera, e só o que não pede dado extra: status simples e tipo de atendimento.
// Setor, origem e responsável aparecem como listas travadas (redirecionar é só da gerência, RN18);
// prioridade fica travada depois do aceite (RN10); novo prazo exige justificativa (RN14, Bloco 4).
//
// "Modo aceite" (Bloco 4-A): com a demanda Pendente de aceite, o executor escolhe a prioridade e
// aceita (com pop-up de confirmação, RN10) ou recusa com motivo (RN11). Nada mais é editável.
function FormularioAtualizacao({ demand, usuario }) {
  const [form, setForm] = useState({ status: demand.status, tipo: demand.tipo, observacao: '' })
  const [salvando, setSalvando] = useState(false)
  const [mensagemErro, setMensagemErro] = useState('')
  const limiteObservacao = useAvisoLimite(LIMITE_OBSERVACAO)
  const prazo = prazoResolucao(demand)
  const historico = [...demand.historico].reverse()

  const modoAceite = podeAceitar(usuario, demand)
  const [prioridade, setPrioridade] = useState('')
  const [erroPrioridade, setErroPrioridade] = useState('')
  const [dialogo, setDialogo] = useState(null)
  const [motivo, setMotivo] = useState('')
  const [erroMotivo, setErroMotivo] = useState('')
  const limiteMotivo = useAvisoLimite(LIMITE_MOTIVO)
  const campoPrioridade = useRef(null)
  const campoMotivo = useRef(null)
  const botaoAceitar = useRef(null)
  const botaoRecusar = useRef(null)

  function changeField(event) {
    const { name, value } = event.target
    if (name === 'observacao') limiteObservacao.aoMudar(value)
    setForm((current) => ({ ...current, [name]: value }))
  }

  // Grava uma ação do domínio. A regra é conferida de novo com a demanda lida na hora de gravar.
  // "destino" é para onde ir depois do sucesso.
  async function gravarAcao(acao, destino = `#demanda/${demand.id}`) {
    setSalvando(true)
    setMensagemErro('')
    const resultado = await obterStorage().atualizarDemanda(demand.id, acao)
    setSalvando(false)
    if (resultado.ok) window.location.hash = destino
    return resultado
  }

  // CA-R03: sem prioridade, o aceite nem abre o pop-up; o erro fica junto do campo.
  function pedirAceite(event) {
    event.preventDefault()
    if (!ehPrioridadeValida(prioridade)) {
      setErroPrioridade(MENSAGENS.aceiteSemPrioridade)
      campoPrioridade.current.focus()
      return
    }
    setDialogo('aceite')
  }

  async function confirmarAceite() {
    const resultado = await gravarAcao((atual) => aceitarDemanda(atual, prioridade, usuario, contextoDaAcao()))
    if (!resultado.ok) {
      setDialogo(null)
      setMensagemErro(mensagemDeErro(resultado.erro))
    }
  }

  // CA-R04: motivo vazio bloqueia a recusa, com a mensagem junto do campo e o foco nele.
  async function confirmarRecusa() {
    if (!motivo.trim()) {
      setErroMotivo(MENSAGENS.recusaSemMotivo)
      campoMotivo.current.focus()
      return
    }
    // Depois da recusa a demanda é da gerência e o setor perde o acesso: volta para a lista, e não
    // para o detalhe (que mostraria "não encontrada").
    const resultado = await gravarAcao(
      (atual) => recusarDemanda(atual, motivo, usuario, contextoDaAcao()),
      '#demandas',
    )
    if (!resultado.ok) {
      setDialogo(null)
      setMensagemErro(mensagemDeErro(resultado.erro))
    }
  }

  function fecharDialogo() {
    if (!salvando) setDialogo(null)
  }

  async function save(event) {
    event.preventDefault()
    setSalvando(true)
    setMensagemErro('')

    // A regra é conferida de novo com a demanda lida na hora de gravar, não com a da tela.
    const resultado = await obterStorage().atualizarDemanda(demand.id, (atual) =>
      salvarAtualizacao(atual, form, usuario, {
        agora: new Date(),
        novoId: () => crypto.randomUUID(),
        tiposValidos: tiposDoSetor(atual.destino),
      }),
    )

    setSalvando(false)
    if (resultado.ok) {
      window.location.hash = `#demanda/${demand.id}`
      return
    }
    setMensagemErro(mensagemDeErro(resultado.erro))
  }

  return (
    <section className="detail-page update-page" aria-label="Atualizar demanda">
      <nav className="detail-breadcrumb" aria-label="Você está em">
        <a href="#demandas">Demandas</a><span>›</span>
        <a href={`#demandas/${demand.destino}`}>{nomeDoSetor(demand.destino)}</a><span>›</span>
        <a href={`#demanda/${demand.id}`}>{demand.titulo}</a><span>›</span>
        <span aria-current="page">Atualizar</span>
      </nav>

      <div className="detail-layout">
        <form className="detail-main-column update-form" onSubmit={modoAceite ? pedirAceite : save}>
          <section className="detail-card detail-summary update-summary">
            <div className="detail-summary-top">
              <p className="detail-eyebrow">Código: <span>{demand.id}</span></p>
              <label className="update-status-control">
                <span className="sr-only">Status</span>
                {modoAceite ? (
                  <select name="status" value={demand.status} disabled>
                    <option>{demand.status}</option>
                  </select>
                ) : (
                  <select name="status" value={form.status} onChange={changeField}>
                    {statusParaEdicao(usuario, demand).map((opcao) => (
                      <option key={opcao}>{opcao}</option>
                    ))}
                  </select>
                )}
              </label>
            </div>
            <FormField label="Título da demanda">
              <input name="titulo" value={demand.titulo} readOnly />
            </FormField>
            <div className="detail-summary-meta">
              <span>Criado em: <strong>{formatarData(demand.criadaEm)}</strong></span>
              <span className="detail-meta-divider" />
              <label className="update-priority-control">Prioridade:
                {modoAceite ? (
                  // RN10: só aqui, no aceite, a prioridade é escolhida; depois fica travada.
                  <select
                    ref={campoPrioridade}
                    name="prioridade"
                    value={prioridade}
                    onChange={(event) => {
                      setPrioridade(event.target.value)
                      setErroPrioridade('')
                    }}
                    aria-invalid={erroPrioridade ? 'true' : undefined}
                    aria-describedby={erroPrioridade ? 'prioridade-erro' : undefined}
                  >
                    <option value="">Selecione</option>
                    {PRIORIDADES.map((opcao) => (
                      <option key={opcao}>{opcao}</option>
                    ))}
                  </select>
                ) : (
                  <select name="prioridade" value={demand.prioridade} disabled>
                    <option>{demand.prioridade}</option>
                  </select>
                )}
              </label>
            </div>
            {erroPrioridade && (
              <p id="prioridade-erro" className="field-error">
                {erroPrioridade}
              </p>
            )}
          </section>

          <section className="detail-card detail-specifications update-specifications">
            <h2 className="detail-section-title">Especificações da Demanda</h2>
            <div className="update-fields-grid">
              <FormField label="Tipo de atendimento">
                <select name="tipo" value={form.tipo} onChange={changeField} disabled={modoAceite}>
                  {tiposDoSetor(demand.destino).map((tipo) => (
                    <option key={tipo}>{tipo}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Departamento">
                <select name="departamento" value={demand.destino} disabled>
                  {departamentos.map((item) => (
                    <option key={item.id} value={item.id}>{item.nome}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Origem">
                <select name="origem" value={demand.origem} disabled>
                  <option value="gerenciamento">Gerenciamento</option>
                  {departamentos.map((item) => (
                    <option key={item.id} value={item.id}>{item.nome}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Solicitante">
                <input name="solicitante" value={demand.solicitante} readOnly />
              </FormField>
              <FormField label="Responsável (setor)">
                <select name="responsavel" value={demand.destino} disabled>
                  {departamentos.map((item) => (
                    <option key={item.id} value={item.id}>{item.nome}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Prazo">
                <input name="prazo" value={prazo ? formatarDataHora(prazo.toISOString()) : '—'} readOnly />
              </FormField>
            </div>
          </section>

          <section className="detail-card detail-description update-description">
            <h2 className="detail-section-title">Descrição</h2>
            {/* A descrição é de quem abriu a demanda e não muda; o setor registra o que fez na observação,
                que vai para o histórico junto da mudança (RN22). */}
            <p>{demand.descricao}</p>
            {/* No modo aceite não há observação: o que se registra é o aceite ou o motivo da recusa. */}
            {!modoAceite && (
              <>
                <label className="update-description-field">
                  <span className="update-observacao-label">Observação (opcional)</span>
                  <textarea
                    name="observacao"
                    value={form.observacao}
                    onChange={changeField}
                    onPaste={limiteObservacao.aoColar}
                    maxLength={LIMITE_OBSERVACAO}
                    aria-describedby="observacao-contador"
                  />
                </label>
                <ContadorLimite
                  id="observacao"
                  valor={form.observacao}
                  limite={LIMITE_OBSERVACAO}
                  aviso={limiteObservacao.aviso}
                />
              </>
            )}
          </section>

          {modoAceite ? (
            <div className="detail-actions update-actions">
              <button ref={botaoAceitar} className="detail-button detail-button--primary" type="submit">
                Aceitar demanda
              </button>
              <button
                ref={botaoRecusar}
                className="detail-button detail-button--outline"
                type="button"
                onClick={() => {
                  setErroMotivo('')
                  setDialogo('recusa')
                }}
              >
                Recusar demanda
              </button>
              <button className="detail-button detail-button--outline" type="button" onClick={() => { window.location.hash = `#demanda/${demand.id}` }}>Voltar</button>
            </div>
          ) : (
            <div className="detail-actions update-actions">
              <button className="detail-button detail-button--primary" type="submit" disabled={salvando}>
                {salvando ? MENSAGENS.salvando : 'Salvar alterações'}
              </button>
              <button className="detail-button detail-button--outline" type="button" onClick={() => { window.location.hash = `#demanda/${demand.id}` }}>Não Salvar</button>
            </div>
          )}
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

      {/* RN10: pop-up que resume prioridade e prazo antes de travar a prioridade. */}
      {dialogo === 'aceite' && (
        <Dialogo
          titulo="Confirmar aceite"
          rotuloSuperior={demand.id}
          descricao={MENSAGENS.aceiteConfirmacao(prioridade, descreverPrazo(prioridade))}
          onFechar={fecharDialogo}
          retornarFocoPara={botaoAceitar}
          acoes={
            <>
              <button className="detail-button detail-button--outline" type="button" onClick={fecharDialogo}>
                Cancelar
              </button>
              <button
                className="detail-button detail-button--primary"
                type="button"
                data-autofocus
                disabled={salvando}
                onClick={confirmarAceite}
              >
                {salvando ? MENSAGENS.salvando : 'Confirmar aceite'}
              </button>
            </>
          }
        />
      )}

      {/* RN11: recusa com motivo obrigatório; o campo recebe o foco ao abrir. */}
      {dialogo === 'recusa' && (
        <Dialogo
          titulo="Recusar demanda"
          rotuloSuperior={demand.id}
          descricao={MENSAGENS.recusaDescricao}
          onFechar={fecharDialogo}
          retornarFocoPara={botaoRecusar}
          acoes={
            <>
              <button className="detail-button detail-button--outline" type="button" onClick={fecharDialogo}>
                Cancelar
              </button>
              <button
                className="detail-button detail-button--primary"
                type="button"
                disabled={salvando}
                onClick={confirmarRecusa}
              >
                {salvando ? MENSAGENS.salvando : 'Confirmar recusa'}
              </button>
            </>
          }
        >
          <label className="detail-form-field" htmlFor="motivo-recusa">
            <span>Motivo da recusa (obrigatório)</span>
          </label>
          <textarea
            ref={campoMotivo}
            id="motivo-recusa"
            className="dialog-textarea"
            data-autofocus
            value={motivo}
            onChange={(event) => {
              limiteMotivo.aoMudar(event.target.value)
              setMotivo(event.target.value)
              setErroMotivo('')
            }}
            onPaste={limiteMotivo.aoColar}
            maxLength={LIMITE_MOTIVO}
            aria-invalid={erroMotivo ? 'true' : undefined}
            aria-describedby={['motivo-contador', erroMotivo && 'motivo-erro'].filter(Boolean).join(' ')}
          />
          <ContadorLimite id="motivo" valor={motivo} limite={LIMITE_MOTIVO} aviso={limiteMotivo.aviso} />
          {erroMotivo && (
            <p id="motivo-erro" className="field-error">
              {erroMotivo}
            </p>
          )}
        </Dialogo>
      )}
    </section>
  )
}

function AtualizarDemanda({ id, usuario }) {
  const { carregando, demandas, erro, resetar } = useDemandas()

  if (carregando || erro) {
    return (
      <section className="detail-page update-page" aria-label="Atualizar demanda">
        {carregando ? <Carregando /> : <ErroDados erro={erro} onResetar={resetar} />}
      </section>
    )
  }

  const demand = demandas.find((item) => item.id === id)
  if (!demand || !podeVer(usuario, demand)) {
    return (
      <section className="detail-page update-page" aria-label="Atualizar demanda">
        <SemPermissao />
      </section>
    )
  }
  // RN20 / CA-R07: demanda final não tem nenhuma ação, para nenhum perfil.
  if (estaFinal(demand.status)) return <Aviso demand={demand} texto={MENSAGENS.finalizada} />
  // Entra quem pode editar (Em andamento/Aguardando) ou aceitar/recusar (Pendente de aceite), só o executor.
  if (!podeEditar(usuario, demand) && !podeAceitar(usuario, demand)) {
    return <Aviso demand={demand} texto={MENSAGENS.semEdicao} />
  }

  return <FormularioAtualizacao demand={demand} usuario={usuario} />
}

export default AtualizarDemanda
