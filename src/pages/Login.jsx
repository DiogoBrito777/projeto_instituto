import { useRef, useState } from 'react'
import { useDemandas } from '../hooks/useDemandas.js'
import { ERROS } from '../services/storage.js'
import './Login.css'

// Textos de docs/MENSAGENS_VALIDACAO.md (os marcados "proposta" foram acrescentados no Bloco 1).
const MENSAGENS = {
  usuarioVazio: 'Informe o seu usuário.',
  senhaVazia: 'Informe a sua senha.',
  credenciais: 'Usuário ou senha incorretos. Confira e tente de novo.',
  indisponivel: 'Não foi possível entrar agora. Recarregue a página e tente de novo.',
  dadosCorrompidos:
    'Os dados salvos neste aparelho estão com problema. Clique em Resetar dados para voltar aos dados de demonstração.',
  dadosIndisponiveis:
    'Não foi possível acessar os dados deste aparelho. Verifique se o navegador permite armazenamento local.',
  resetOk: 'Dados de demonstração restaurados.',
  resetFalhou: 'Não foi possível resetar os dados. Recarregue a página e tente de novo.',
}

function Login({ onEntrar }) {
  const [valores, setValores] = useState({ usuario: '', senha: '' })
  const [erros, setErros] = useState({})
  const [avisoReset, setAvisoReset] = useState('')
  const campoUsuario = useRef(null)
  const campoSenha = useRef(null)
  const { erro: erroDados, resetar } = useDemandas()

  function atualizar(event) {
    const { name, value } = event.target
    setValores((atuais) => ({ ...atuais, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const novosErros = {}
    if (!valores.usuario.trim()) novosErros.usuario = MENSAGENS.usuarioVazio
    if (!valores.senha) novosErros.senha = MENSAGENS.senhaVazia

    if (novosErros.usuario || novosErros.senha) {
      setErros(novosErros)
      // Foco no primeiro campo com erro, para quem usa teclado ou leitor de tela saber onde corrigir.
      const primeiroComErro = novosErros.usuario ? campoUsuario : campoSenha
      primeiroComErro.current.focus()
      return
    }

    const resultado = onEntrar(valores.usuario, valores.senha)
    if (!resultado.ok) {
      // Mensagem única para usuário ou senha errados: não revela qual dos dois falhou.
      const mensagem = resultado.erro === 'credenciais' ? MENSAGENS.credenciais : MENSAGENS.indisponivel
      setErros({ usuario: mensagem })
      campoUsuario.current.focus()
    }
  }

  function handleResetar() {
    const resultado = resetar()
    setAvisoReset(resultado.ok ? MENSAGENS.resetOk : MENSAGENS.resetFalhou)
  }

  return (
    <main className="login-page">
      <form className="demand-form login-form" onSubmit={handleSubmit} noValidate>
        <h1 className="login-title">Demanda de aço</h1>
        <p className="login-subtitle">Entre com o usuário do seu departamento.</p>

        <div className="field">
          <label htmlFor="usuario">Usuário</label>
          <input
            ref={campoUsuario}
            id="usuario"
            name="usuario"
            type="text"
            autoComplete="username"
            value={valores.usuario}
            onChange={atualizar}
            aria-invalid={erros.usuario ? 'true' : undefined}
            aria-describedby={erros.usuario ? 'usuario-erro' : undefined}
          />
          {erros.usuario && (
            <p className="login-field-error" id="usuario-erro">
              {erros.usuario}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input
            ref={campoSenha}
            id="senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            value={valores.senha}
            onChange={atualizar}
            aria-invalid={erros.senha ? 'true' : undefined}
            aria-describedby={erros.senha ? 'senha-erro' : undefined}
          />
          {erros.senha && (
            <p className="login-field-error" id="senha-erro">
              {erros.senha}
            </p>
          )}
        </div>

        <button className="submit-button login-submit" type="submit">
          Entrar
        </button>
      </form>

      <section className="login-demo" aria-labelledby="login-demo-titulo">
        <h2 id="login-demo-titulo">Dados de demonstração</h2>
        {erroDados && (
          <p className="login-field-error" role="alert">
            {erroDados === ERROS.CORROMPIDO ? MENSAGENS.dadosCorrompidos : MENSAGENS.dadosIndisponiveis}
          </p>
        )}
        <button className="login-reset" type="button" onClick={handleResetar}>
          Resetar dados
        </button>
        <p className="login-reset-status" role="status">
          {avisoReset}
        </p>
      </section>
    </main>
  )
}

export default Login
