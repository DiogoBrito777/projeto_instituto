// Login simulado e sessão (RN01; RF-R01; ADR-07).
// A sessão fica no sessionStorage: some ao fechar a aba. É simulação para a demonstração,
// não segurança: qualquer pessoa pode editar pelo DevTools (limitação documentada).

import usuarios from '../data/usuarios.json'

const CHAVE_SESSAO = 'demanda-de-aco:v1:sessao'

// A sessão guarda só o necessário para as permissões. A senha nunca é gravada.
function paraSessao({ usuario, nome, perfil, departamento }) {
  return { usuario, nome, perfil, departamento }
}

export function criarAuth({ backend, listaUsuarios = usuarios }) {
  function entrar(usuario, senha) {
    const encontrado = listaUsuarios.find(
      (item) => item.usuario === usuario.trim() && item.senha === senha,
    )
    // Mesma resposta para usuário inexistente e senha errada: não revela qual dos dois falhou.
    if (!encontrado) return { ok: false, erro: 'credenciais' }

    const sessao = paraSessao(encontrado)
    try {
      backend.setItem(CHAVE_SESSAO, JSON.stringify(sessao))
      return { ok: true, dados: sessao }
    } catch (causa) {
      console.error('[auth] não foi possível gravar a sessão', causa)
      return { ok: false, erro: 'indisponivel' }
    }
  }

  function sair() {
    try {
      backend.removeItem(CHAVE_SESSAO)
    } catch (causa) {
      console.error('[auth] não foi possível apagar a sessão', causa)
    }
  }

  function usuarioLogado() {
    try {
      const sessao = JSON.parse(backend.getItem(CHAVE_SESSAO))
      // Só aceita sessão de um usuário que existe; qualquer outra coisa vale como "sem login".
      const valido = listaUsuarios.some((item) => item.usuario === sessao?.usuario)
      return valido ? paraSessao(listaUsuarios.find((item) => item.usuario === sessao.usuario)) : null
    } catch (causa) {
      console.warn('[auth] sessão ilegível; tratando como sem login', causa)
      return null
    }
  }

  return { entrar, sair, usuarioLogado }
}

let instancia = null

function sessionStorageDoNavegador() {
  try {
    return window.sessionStorage
  } catch (causa) {
    // Sem sessionStorage, entrar() devolve "indisponivel" em vez de quebrar o app.
    console.error('[auth] sessionStorage indisponível', causa)
    return null
  }
}

export function obterAuth() {
  if (!instancia) instancia = criarAuth({ backend: sessionStorageDoNavegador() })
  return instancia
}
