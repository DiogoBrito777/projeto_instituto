import { useRef, useState } from 'react'
import departamentos from '../data/departamentos.json'
import { obterStorage } from '../services/storage.js'
import {
  LIMITE_DESCRICAO,
  LIMITE_TITULO,
  montarNovaDemanda,
  origemDoUsuario,
  primeiroCampoComErro,
  validarNovaDemanda,
} from '../domain/novaDemanda.js'
import { nomeDoSetor, tiposDoSetor } from '../domain/setores.js'
import Dialogo from '../components/Dialogo.jsx'
import ContadorLimite from '../components/ContadorLimite.jsx'
import { useAvisoLimite } from '../hooks/useAvisoLimite.js'
import { ERROS_NOVA_TEXTO, INSTRUCOES_NOVA, MENSAGENS } from '../mensagens.js'

const VAZIO = { destino: '', tipo: '', titulo: '', descricao: '' }

// Liga o campo à instrução, ao contador e ao erro, para o leitor de tela ler tudo junto (aria-describedby).
function descritores(id, erro, temContador = false) {
  return [`${id}-instrucao`, temContador && `${id}-contador`, erro && `${id}-erro`].filter(Boolean).join(' ')
}

function Ajuda({ id, erro, contador }) {
  return (
    <>
      <p id={`${id}-instrucao`} className="field-hint">
        {INSTRUCOES_NOVA[id]}
      </p>
      {contador}
      {erro && (
        <p id={`${id}-erro`} className="field-error">
          {erro}
        </p>
      )}
    </>
  )
}

function NovaDemanda({ usuario }) {
  const [campos, setCampos] = useState(VAZIO)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState('')
  const [enviada, setEnviada] = useState(null)
  const campoDestino = useRef(null)
  const campoTipo = useRef(null)
  const campoTitulo = useRef(null)
  const campoDescricao = useRef(null)
  const botaoEnviar = useRef(null)
  const limiteTitulo = useAvisoLimite(LIMITE_TITULO)
  const limiteDescricao = useAvisoLimite(LIMITE_DESCRICAO)

  // RN07: origem automática; o destino nunca inclui o próprio setor (a gerência vê os 4).
  const origem = origemDoUsuario(usuario)
  const destinos = departamentos.filter((departamento) => departamento.id !== origem)
  const tipos = campos.destino ? tiposDoSetor(campos.destino) : []
  const texto = (campo) => (erros[campo] ? ERROS_NOVA_TEXTO[erros[campo]] : null)

  function atualizar(event) {
    const { name, value } = event.target
    if (name === 'titulo') limiteTitulo.aoMudar(value)
    if (name === 'descricao') limiteDescricao.aoMudar(value)
    setCampos((atuais) => ({
      ...atuais,
      [name]: value,
      // Trocar o destino limpa o tipo: os tipos de um setor não valem para outro.
      ...(name === 'destino' ? { tipo: '' } : {}),
    }))
    // O erro do campo some quando a pessoa começa a corrigir.
    setErros((atuais) => ({ ...atuais, [name]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (enviando) return

    const novosErros = validarNovaDemanda(campos, usuario)
    const primeiro = primeiroCampoComErro(novosErros)
    setErros(novosErros)
    setErroEnvio('')
    if (primeiro) {
      const elementoDoCampo = { destino: campoDestino, tipo: campoTipo, titulo: campoTitulo, descricao: campoDescricao }
      elementoDoCampo[primeiro].current.focus()
      return
    }

    setEnviando(true)
    const resultado = await obterStorage().criarDemanda(
      montarNovaDemanda(campos, usuario, { agora: new Date(), novoId: () => crypto.randomUUID() }),
    )
    setEnviando(false)

    if (!resultado.ok) {
      // Sem sucesso falso: o formulário continua preenchido para tentar de novo (ERROR_HANDLING.md, seção 1).
      setErroEnvio(MENSAGENS.envioErro)
      return
    }
    setCampos(VAZIO)
    limiteTitulo.limpar()
    limiteDescricao.limpar()
    setEnviada(resultado.dados.id)
  }

  return (
    <section className="page-content" aria-label="Cadastro de demanda">
      <form className="demand-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid form-grid--locations">
          <div className="field">
            <label htmlFor="origem">Origem</label>
            <input id="origem" name="origem" type="text" value={nomeDoSetor(origem)} readOnly aria-describedby="origem-instrucao" />
            <Ajuda id="origem" />
          </div>

          <div className="field">
            <label htmlFor="destino">Destino</label>
            <select
              ref={campoDestino}
              id="destino"
              name="destino"
              value={campos.destino}
              onChange={atualizar}
              aria-invalid={erros.destino ? 'true' : undefined}
              aria-describedby={descritores('destino', erros.destino)}
            >
              <option value="">Selecione</option>
              {destinos.map((departamento) => (
                <option key={departamento.id} value={departamento.id}>
                  {departamento.nome}
                </option>
              ))}
            </select>
            <Ajuda id="destino" erro={texto('destino')} />
          </div>
        </div>

        <div className="form-grid form-grid--details">
          <div className="field">
            <label htmlFor="tipo">Tipo de atendimento</label>
            <select
              ref={campoTipo}
              id="tipo"
              name="tipo"
              value={campos.tipo}
              onChange={atualizar}
              disabled={!campos.destino}
              aria-invalid={erros.tipo ? 'true' : undefined}
              aria-describedby={descritores('tipo', erros.tipo)}
            >
              <option value="">{campos.destino ? 'Selecione' : 'Escolha primeiro o destino'}</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            <Ajuda id="tipo" erro={texto('tipo')} />
          </div>

          <div className="field">
            <label htmlFor="titulo">Título</label>
            <input
              ref={campoTitulo}
              id="titulo"
              name="titulo"
              type="text"
              value={campos.titulo}
              onChange={atualizar}
              onPaste={limiteTitulo.aoColar}
              maxLength={LIMITE_TITULO}
              aria-invalid={erros.titulo ? 'true' : undefined}
              aria-describedby={descritores('titulo', erros.titulo, true)}
            />
            <Ajuda
              id="titulo"
              erro={texto('titulo')}
              contador={
                <ContadorLimite id="titulo" valor={campos.titulo} limite={LIMITE_TITULO} aviso={limiteTitulo.aviso} />
              }
            />
          </div>
        </div>

        <div className="field field--description">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            ref={campoDescricao}
            id="descricao"
            name="descricao"
            rows="5"
            value={campos.descricao}
            onChange={atualizar}
            onPaste={limiteDescricao.aoColar}
            maxLength={LIMITE_DESCRICAO}
            aria-invalid={erros.descricao ? 'true' : undefined}
            aria-describedby={descritores('descricao', erros.descricao, true)}
          />
          <Ajuda
            id="descricao"
            erro={texto('descricao')}
            contador={
              <ContadorLimite
                id="descricao"
                valor={campos.descricao}
                limite={LIMITE_DESCRICAO}
                aviso={limiteDescricao.aviso}
              />
            }
          />
        </div>

        <div className="form-footer">
          <button ref={botaoEnviar} className="submit-button" type="submit" disabled={enviando}>
            {enviando ? MENSAGENS.enviando : 'Criar Nova Demanda'}
          </button>
          <p className="form-notice" role="status">
            {enviando ? MENSAGENS.enviando : enviada ? MENSAGENS.envioSucesso(enviada) : ''}
          </p>
          {erroEnvio && (
            <p className="form-error" role="alert">
              {erroEnvio}
            </p>
          )}
        </div>
      </form>

      {enviada && (
        <Dialogo
          titulo="Demanda enviada"
          rotuloSuperior={enviada}
          descricao={MENSAGENS.envioSucesso(enviada)}
          onFechar={() => setEnviada(null)}
          retornarFocoPara={botaoEnviar}
          acoes={
            <>
              <button className="detail-button detail-button--outline" type="button" onClick={() => setEnviada(null)}>
                Criar outra
              </button>
              <button
                className="detail-button detail-button--primary"
                type="button"
                data-autofocus
                onClick={() => {
                  window.location.hash = `#demanda/${enviada}`
                }}
              >
                Ver demanda
              </button>
            </>
          }
        />
      )}
    </section>
  )
}

export default NovaDemanda
