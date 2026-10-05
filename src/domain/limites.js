// Aviso de limite de caracteres nos campos de texto (falha do teste manual da 2B).
// A tela trava o campo no limite (maxLength); esta função decide qual aviso mostrar.
// tamanhoFinal = o que ficou no campo; tamanhoTentado = o que a pessoa tentou pôr (ex.: ao colar).

export const AVISOS_LIMITE = {
  NENHUM: null,
  ATINGIDO: 'atingido',
  CORTADO: 'cortado',
}

export function avisoDeLimite(tamanhoFinal, limite, tamanhoTentado = tamanhoFinal) {
  // O navegador corta o texto colado sem avisar; aqui a pessoa fica sabendo que perdeu uma parte.
  // Só houve corte se o campo FICOU no limite. Um "tentado" acima do limite com o campo abaixo dele
  // é resto de uma colagem antiga (ajustes do teste manual, item 5: o aviso voltava no 1º caractere).
  if (tamanhoTentado > limite && tamanhoFinal >= limite) return AVISOS_LIMITE.CORTADO
  if (tamanhoFinal >= limite) return AVISOS_LIMITE.ATINGIDO
  return AVISOS_LIMITE.NENHUM
}

// Quantos caracteres o campo teria depois de colar, antes do corte do navegador:
// o texto atual, menos o trecho selecionado (que é substituído), mais o colado.
export function tamanhoAposColar(tamanhoAtual, inicioSelecao, fimSelecao, tamanhoColado) {
  return tamanhoAtual - (fimSelecao - inicioSelecao) + tamanhoColado
}
