import { useState } from 'react'
import data from '../data/demandas.json'
import './DetalhesDemanda.css'

const demand = data.demandas.find((item) => item.id === 'DM-2048')
function getSavedDemand() {
  try {
    return JSON.parse(window.localStorage.getItem('demanda-DM-2048') || 'null')
  } catch {
    return null
  }
}

const history = [
  { title: 'Demanda em andamento', date: '18 Jun, 2025 às 14:32', current: true },
  { title: 'Em análise técnica', date: '18 Jun, 2025 às 11:40' },
  { title: 'Demanda recebida', date: '18 Jun, 2025 às 08:30' },
  { title: 'Demanda criada', date: '18 Jun, 2025 às 08:30' },
]

function DetailField({ label, children }) {
  return (
    <div className="detail-field">
      <span>{label}</span>
      <strong>{children}</strong>
    </div>
  )
}

function Dialog({ mode, onClose, onSave, assignee, status }) {
  const [nextAssignee, setNextAssignee] = useState(assignee)
  const [nextStatus, setNextStatus] = useState(status)

  function submit(event) {
    event.preventDefault()
    onSave({ assignee: nextAssignee, status: nextStatus })
  }

  return (
    <div className="detail-dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <button className="detail-dialog-close" type="button" onClick={onClose} aria-label="Fechar">×</button>
        <p className="detail-eyebrow">DM-2048</p>
        <h2 id="dialog-title">{mode === 'assign' ? 'Atribuir responsável' : 'Atualizar demanda'}</h2>
        <p className="detail-dialog-copy">Manutenção do ar-condicionado</p>
        <form onSubmit={submit}>
          <label className="detail-form-field">
            <span>Responsável</span>
            <select value={nextAssignee} onChange={(event) => setNextAssignee(event.target.value)}>
              <option>Marcos Oliveira</option>
              <option>Márcio Almeida</option>
              <option>Paula Ferreira</option>
              <option>Rafael Gomes</option>
            </select>
          </label>
          {mode === 'update' && (
            <label className="detail-form-field">
              <span>Status</span>
              <select value={nextStatus} onChange={(event) => setNextStatus(event.target.value)}>
                <option>Em andamento</option>
                <option>Pendente</option>
                <option>Concluído</option>
              </select>
            </label>
          )}
          <div className="detail-dialog-actions">
            <button className="detail-button detail-button--outline" type="button" onClick={onClose}>Cancelar</button>
            <button className="detail-button detail-button--primary" type="submit">Salvar alterações</button>
          </div>
        </form>
      </section>
    </div>
  )
}

function DetalhesDemanda() {
  const savedDemand = getSavedDemand()
  const [assignee, setAssignee] = useState(savedDemand?.responsavel || 'Marcos Oliveira')
  const status = savedDemand?.status || demand.status
  const [dialog, setDialog] = useState(null)

  const statusLabel = status === 'Concluído' ? 'Concluída' : status
  const title = savedDemand?.titulo || demand.titulo

  return (
    <section className="detail-page" aria-label="Detalhes da demanda">
      <nav className="detail-breadcrumb" aria-label="Você está em">
        <a href="#demandas">Demandas</a><span>›</span>
        <a href="#departamentos">Infraestrutura e Serviços</a><span>›</span>
        <span aria-current="page">{title}</span>
      </nav>

      <div className="detail-layout">
        <div className="detail-main-column">
          <section className="detail-card detail-summary">
            <div className="detail-summary-top">
              <p className="detail-eyebrow">Código: <span>{demand.id}</span></p>
              <span className="detail-status"><i />{statusLabel}</span>
            </div>
            <h2>{title}</h2>
            <div className="detail-summary-meta">
              <span>Criado em: <strong>18 de junho, 2025</strong></span>
              <span className="detail-meta-divider" />
              <span>Prioridade: <strong className="detail-priority">{savedDemand?.prioridade || demand.prioridade}</strong></span>
            </div>
          </section>

          <section className="detail-card detail-specifications">
            <h3 className="detail-section-title">Especificações da Demanda</h3>
            <div className="detail-fields-grid">
              <DetailField label="Categoria">{savedDemand?.categoria || 'Manutenção'}</DetailField>
              <DetailField label="Departamento">{savedDemand?.departamento || 'Infraestrutura e Serviços'}</DetailField>
              <DetailField label="Origem">{savedDemand?.origem || demand.origem}</DetailField>
              <DetailField label="Solicitante">{savedDemand?.solicitante || demand.solicitante}</DetailField>
              <DetailField label="Responsável">{assignee}</DetailField>
              <DetailField label="Prazo">{savedDemand?.prazo ? new Date(`${savedDemand.prazo}T12:00:00`).toLocaleDateString('pt-BR') : '23/06/2025'}</DetailField>
            </div>
          </section>

          <section className="detail-card detail-description">
            <h3 className="detail-section-title">Descrição</h3>
            <p>{savedDemand?.descricao || 'O sistema de ar-condicionado do 3º andar parou de funcionar de repente. Precisamos da manutenção com urgência para que os colaboradores possam continuar trabalhando.'}</p>
          </section>

          <div className="detail-actions">
            <button className="detail-button detail-button--primary" type="button" onClick={() => setDialog('assign')}>Atribuir responsável</button>
            <button className="detail-button detail-button--outline" type="button" onClick={() => { window.location.hash = '#demanda/DM-2048/editar' }}>Atualizar demanda</button>
          </div>
        </div>

        <aside className="detail-card detail-history">
          <h3 className="detail-section-title">Histórico de Atualizações</h3>
          <ol className="history-list">
            {history.map((item) => (
              <li className={item.current ? 'history-item history-item--current' : 'history-item'} key={item.title}>
                <span className="history-marker" />
                <div><strong>{item.title}</strong><time>{item.date}</time></div>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      {dialog && (
        <Dialog
          mode={dialog}
          assignee={assignee}
          status={status}
          onClose={() => setDialog(null)}
          onSave={({ assignee: nextAssignee }) => {
            setAssignee(nextAssignee)
            const latest = JSON.parse(window.localStorage.getItem('demanda-DM-2048') || '{}')
            window.localStorage.setItem('demanda-DM-2048', JSON.stringify({ ...latest, responsavel: nextAssignee }))
            setDialog(null)
          }}
        />
      )}
    </section>
  )
}

export default DetalhesDemanda
