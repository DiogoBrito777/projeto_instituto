import { useState } from 'react'

function NovaDemanda() {
  const [notice, setNotice] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setNotice('Cadastro simulado. A integração com o backend será feita futuramente.')
  }

  return (
    <section className="page-content" aria-label="Cadastro de demanda">
      <form className="demand-form" onSubmit={handleSubmit}>
        <div className="form-grid form-grid--locations">
          <div className="field">
            <label htmlFor="origem">Origem</label>
            <input id="origem" name="origem" type="text" autoComplete="organization" required />
          </div>

          <div className="field">
            <label htmlFor="destino">Destino</label>
            <input id="destino" name="destino" type="text" autoComplete="organization" required />
          </div>
        </div>

        <div className="form-grid form-grid--details">
          <div className="field">
            <label htmlFor="tipo">Tipo de Demanda</label>
            <select id="tipo" name="tipo" defaultValue="" required>
              <option value="" disabled>
                Selecione
              </option>
              <option value="melhoria">Melhoria de processo</option>
              <option value="correcao">Correção</option>
              <option value="servico">Solicitação de serviço</option>
              <option value="projeto">Projeto</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="titulo">Título</label>
            <input id="titulo" name="titulo" type="text" required />
          </div>
        </div>

        <div className="field field--description">
          <label htmlFor="descricao">Descrição</label>
          <textarea id="descricao" name="descricao" rows="5" required />
        </div>

        <div className="form-footer">
          <button className="submit-button" type="submit">
            Criar Nova Demanda
          </button>
          {notice && (
            <p className="form-notice" role="status" aria-live="polite">
              {notice}
            </p>
          )}
        </div>
      </form>
    </section>
  )
}

export default NovaDemanda
