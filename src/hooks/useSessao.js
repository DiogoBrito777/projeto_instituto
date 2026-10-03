import { useState } from 'react'
import { obterAuth } from '../services/auth.js'

// Usuário logado como estado do React. A sessão é lida já no estado inicial (função passada ao
// useState), sem useEffect: assim não há uma renderização "sem usuário" antes da leitura.
export function useSessao() {
  const [usuario, setUsuario] = useState(() => obterAuth().usuarioLogado())

  function entrar(nome, senha) {
    const resultado = obterAuth().entrar(nome, senha)
    if (resultado.ok) setUsuario(resultado.dados)
    return resultado
  }

  function sair() {
    obterAuth().sair()
    setUsuario(null)
  }

  return { usuario, entrar, sair }
}
