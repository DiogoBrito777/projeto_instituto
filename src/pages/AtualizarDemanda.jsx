import { useState } from 'react'
import departamentos from '../data/departamentos.json'
import { useDemandas } from '../hooks/useDemandas.js'
import { obterStorage } from '../services/storage.js'
import { podeVer } from '../domain/permissoes.js'
import { ERROS_ACAO, LIMITE_OBSERVACAO, podeEditar, salvarAtualizacao, statusParaEdicao } from '../domain/acoes.js'
import { prazoResolucao } from '../domain/prazos.js'
import { estaFinal } from '../domain/status.js'
import { nomeDoSetor, tiposDoSetor } from '../domain/setores.js'
import { Carregando, ErroDados, SemPermissao } from '../components/EstadoDados.jsx'
import ContadorLimite from '../components/ContadorLimite.jsx'
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
  return MENSAGENS.salvarErro
}

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
function FormularioAtualizacao({ demand, usuario }) {
  const [form, setForm] = useState({ status: demand.status, tipo: demand.tipo, observacao: '' })
  const [salvando, setSalvando] = useState(false)
  const [mensagemErro, setMensagemErro] = useState('')
  const limiteObservacao = useAvisoLimite(LIMITE_OBSERVACAO)
  const prazo = prazoResolucao(demand)
  const historico = [...demand.historico].reverse()

  function changeField(event) {
    const { name, value } = event.target
    if (name === 'observacao') limiteObservacao.aoMudar(value)
    setForm((current) => ({ ...current, [name]: value }))
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
        <form className="detail-main-column update-form" onSubmit={save}>
          <section className="detail-card detail-summary update-summary">
            <div className="detail-summary-top">
              <p className="detail-eyebrow">Código: <span>{demand.id}</span></p>
              <label className="update-status-control">
                <span className="sr-only">Status</span>
                <select name="status" value={form.status} onChange={changeField}>
                  {statusParaEdicao(usuario, demand).map((opcao) => (
                    <option key={opcao}>{opcao}</option>
                  ))}
                </select>
              </label>
            </div>
            <FormField label="Título da demanda">
              <input name="titulo" value={demand.titulo} readOnly />
            </FormField>
            <div className="detail-summary-meta">
              <span>Criado em: <strong>{formatarData(demand.criadaEm)}</strong></span>
              <span className="detail-meta-divider" />
              <label className="update-priority-control">Prioridade:
                <select name="prioridade" value={demand.prioridade} disabled>
                  <option>{demand.prioridade}</option>
                </select>
              </label>
            </div>
          </section>

          <section className="detail-card detail-specifications update-specifications">
            <h2 className="detail-section-title">Especificações da Demanda</h2>
            <div className="update-fields-grid">
              <FormField label="Tipo de atendimento">
                <select name="tipo" value={form.tipo} onChange={changeField}>
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
          </section>

          <div className="detail-actions update-actions">
            <button className="detail-button detail-button--primary" type="submit" disabled={salvando}>
              {salvando ? MENSAGENS.salvando : 'Salvar alterações'}
            </button>
            <button className="detail-button detail-button--outline" type="button" onClick={() => { window.location.hash = `#demanda/${demand.id}` }}>Não Salvar</button>
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
  if (!podeEditar(usuario, demand)) return <Aviso demand={demand} texto={MENSAGENS.semEdicao} />

  return <FormularioAtualizacao demand={demand} usuario={usuario} />
}

export default AtualizarDemanda
