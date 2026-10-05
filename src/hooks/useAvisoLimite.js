import { useRef, useState } from 'react'
import { AVISOS_LIMITE, avisoDeLimite, tamanhoAposColar } from '../domain/limites.js'
import { MENSAGENS } from '../mensagens.js'

// Aviso de limite de um campo de texto travado com maxLength.
// Ao colar, guarda quantos caracteres a pessoa TENTOU pôr; quando o valor muda (já cortado pelo
// navegador), compara e escolhe o aviso. O aviso aparece numa área role="status" (leitor de tela).
//
// Ajustes do teste manual (item 5): o aviso "Limite de 500 caracteres atingido" continuava depois de
// fechar e reabrir o pop-up, com o texto apagado, e só sumia no 2º caractere digitado. Causas:
// 1. o estado do aviso não era reiniciado ao abrir o pop-up (o componente continua montado);
// 2. uma colagem bloqueada no limite não muda o valor, então o onChange não vinha e o tamanho
//    "tentado" ficava guardado para a próxima digitação.
// Correções: reiniciar(valor) ao abrir; a regra (limites.js) ignora o "tentado" velho; e a colagem
// que não cabe mostra o aviso na hora, sem depender do onChange.
export function useAvisoLimite(limite) {
  const tentado = useRef(null)
  const [aviso, setAviso] = useState('')

  function mensagem(tipo) {
    return tipo ? MENSAGENS.limite[tipo](limite) : ''
  }

  function aoColar(event) {
    const campo = event.currentTarget
    const colado = event.clipboardData.getData('text')
    tentado.current = tamanhoAposColar(campo.value.length, campo.selectionStart, campo.selectionEnd, colado.length)
    if (tentado.current > limite) setAviso(mensagem(AVISOS_LIMITE.CORTADO))
  }

  function aoMudar(valor) {
    const tipo = avisoDeLimite(valor.length, limite, tentado.current ?? valor.length)
    tentado.current = null
    setAviso(mensagem(tipo))
  }

  // Recomeça a partir do texto atual do campo (vazio, por padrão): usado ao abrir um pop-up.
  function reiniciar(valor = '') {
    tentado.current = null
    setAviso(mensagem(avisoDeLimite(valor.length, limite)))
  }

  return { aviso, aoColar, aoMudar, reiniciar, limpar: () => reiniciar('') }
}
