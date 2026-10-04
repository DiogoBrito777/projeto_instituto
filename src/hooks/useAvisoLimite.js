import { useRef, useState } from 'react'
import { avisoDeLimite, tamanhoAposColar } from '../domain/limites.js'
import { MENSAGENS } from '../mensagens.js'

// Aviso de limite de um campo de texto travado com maxLength.
// Ao colar, guarda quantos caracteres a pessoa TENTOU pôr; quando o valor muda (já cortado pelo
// navegador), compara e escolhe o aviso. O aviso aparece numa área role="status" (leitor de tela).
export function useAvisoLimite(limite) {
  const tentado = useRef(null)
  const [aviso, setAviso] = useState('')

  function aoColar(event) {
    const campo = event.currentTarget
    const colado = event.clipboardData.getData('text')
    tentado.current = tamanhoAposColar(campo.value.length, campo.selectionStart, campo.selectionEnd, colado.length)
  }

  function aoMudar(valor) {
    const tipo = avisoDeLimite(valor.length, limite, tentado.current ?? valor.length)
    tentado.current = null
    setAviso(tipo ? MENSAGENS.limite[tipo](limite) : '')
  }

  function limpar() {
    tentado.current = null
    setAviso('')
  }

  return { aviso, aoColar, aoMudar, limpar }
}
