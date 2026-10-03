import { ERROS } from '../services/storage.js'
import { MENSAGENS } from '../mensagens.js'

// Estados comuns às telas com dados (enunciado: carregando, vazio, sucesso e erro).
// Reaproveita a classe .empty-state das telas existentes.

export function Carregando() {
  return (
    <div className="empty-state" role="status">
      <p>{MENSAGENS.carregando}</p>
    </div>
  )
}

// Dados corrompidos: o usuário decide resetar (ERROR_HANDLING.md, seção 5); nada é apagado sozinho.
export function ErroDados({ erro, onResetar }) {
  return (
    <div className="empty-state" role="alert">
      <p>{erro === ERROS.CORROMPIDO ? MENSAGENS.dadosCorrompidos : MENSAGENS.dadosIndisponiveis}</p>
      <button className="submit-button" type="button" onClick={onResetar}>
        Resetar dados
      </button>
    </div>
  )
}

// RN04: inexistente e sem permissão mostram a mesma mensagem.
export function SemPermissao() {
  return (
    <div className="empty-state" role="alert">
      <p>{MENSAGENS.semPermissao}</p>
      <a href="#demandas">Voltar para Demandas</a>
    </div>
  )
}
