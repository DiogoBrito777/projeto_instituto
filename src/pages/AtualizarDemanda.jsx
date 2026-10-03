import { useState } from 'react'
import data from '../data/demandas.json'
import './DetalhesDemanda.css'

const originalDemand = data.demandas.find((item) => item.id === 'DM-2048')
function getInitialValues() {
  let savedDemand = null
  try {
    savedDemand = JSON.parse(window.localStorage.getItem('demanda-DM-2048') || 'null')
  } catch {
    savedDemand = null
  }

  return {
    titulo: originalDemand.titulo,
    categoria: 'Manutenção',
    departamento: 'Infraestrutura e Serviços',
    origem: originalDemand.origem,
    solicitante: originalDemand.solicitante,
    responsavel: 'Marcos Oliveira',
    prazo: '2025-06-23',
    descricao: 'O sistema de ar-condicionado do 3º andar parou de funcionar de repente. Precisamos da manutenção com urgência para que os colaboradores possam continuar trabalhando.',
    status: originalDemand.status,
    ...savedDemand,
  }
}

const history = [
  { title: 'Demanda em andamento', date: '18 Jun, 2025 às 14:32' },
  { title: 'Em análise técnica', date: '18 Jun, 2025 às 11:40' },
  { title: 'Demanda recebida', date: '18 Jun, 2025 às 08:30' },
  { title: 'Demanda criada', date: '18 Jun, 2025 às 08:30' },
]

function FormField({ label, name, value, onChange, children }) {
  return (
    <label className="update-field">
      <span>{label}</span>
      {children || <input name={name} value={value} onChange={onChange} required />}
    </label>
  )
}

function AtualizarDemanda() {
  const [form, setForm] = useState(getInitialValues)

  function changeField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function save(event) {
    event.preventDefault()
    window.localStorage.setItem('demanda-DM-2048', JSON.stringify(form))
    window.location.hash = '#demanda/DM-2048'
  }

  return (
    <section className="detail-page update-page" aria-label="Atualizar demanda">
      <nav className="detail-breadcrumb" aria-label="Você está em">
        <a href="#demandas">Demandas</a><span>›</span>
        <a href="#departamentos">Infraestrutura e Serviços</a><span>›</span>
        <a href="#demanda/DM-2048">Manutenção do ar-condicionado</a><span>›</span>
        <span aria-current="page">Atualizar</span>
      </nav>

      <div className="detail-layout">
        <form className="detail-main-column update-form" onSubmit={save}>
          <section className="detail-card detail-summary update-summary">
            <div className="detail-summary-top">
              <p className="detail-eyebrow">Código: <span>{originalDemand.id}</span></p>
              <label className="update-status-control">
                <span className="sr-only">Status</span>
                <select name="status" value={form.status} onChange={changeField}>
                  <option>Em andamento</option><option>Pendente</option><option>Concluído</option>
                </select>
              </label>
            </div>
            <FormField label="Título da demanda" name="titulo" value={form.titulo} onChange={changeField} />
            <div className="detail-summary-meta">
              <span>Criado em: <strong>18 de junho, 2025</strong></span>
              <span className="detail-meta-divider" />
              <label className="update-priority-control">Prioridade:
                <select name="prioridade" value={form.prioridade || 'Alta'} onChange={changeField}>
                  <option>Alta</option><option>Média</option><option>Baixa</option>
                </select>
              </label>
            </div>
          </section>

          <section className="detail-card detail-specifications update-specifications">
            <h2 className="detail-section-title">Especificações da Demanda</h2>
            <div className="update-fields-grid">
              <FormField label="Categoria" name="categoria" value={form.categoria} onChange={changeField} />
              <FormField label="Departamento" name="departamento" value={form.departamento} onChange={changeField} />
              <FormField label="Origem" name="origem" value={form.origem} onChange={changeField} />
              <FormField label="Solicitante" name="solicitante" value={form.solicitante} onChange={changeField} />
              <FormField label="Responsável" name="responsavel" value={form.responsavel} onChange={changeField} />
              <FormField label="Prazo" name="prazo" value={form.prazo} onChange={changeField}>
                <input type="date" name="prazo" value={form.prazo} onChange={changeField} required />
              </FormField>
            </div>
          </section>

          <section className="detail-card detail-description update-description">
            <h2 className="detail-section-title">Descrição</h2>
            <label className="update-description-field">
              <span className="sr-only">Descrição da demanda</span>
              <textarea name="descricao" value={form.descricao} onChange={changeField} required />
            </label>
          </section>

          <div className="detail-actions update-actions">
            <button className="detail-button detail-button--primary" type="submit">Salvar alterações</button>
            <button className="detail-button detail-button--outline" type="button" onClick={() => { window.location.hash = '#demanda/DM-2048' }}>Não Salvar</button>
          </div>
        </form>

        <aside className="detail-card detail-history">
          <h2 className="detail-section-title">Histórico de Atualizações</h2>
          <ol className="history-list">
            {history.map((item, index) => (
              <li className={index === 0 ? 'history-item history-item--current' : 'history-item'} key={item.title}>
                <span className="history-marker" />
                <div><strong>{item.title}</strong><time>{item.date}</time></div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  )
}

export default AtualizarDemanda
