// "Resetar dados" só apaga depois de a pessoa confirmar no pop-up (ajustes do teste manual, item 9:
// antes apagava tudo no primeiro clique). Cancelar não toca em nada.
// resetar: a função do storage (obterStorage().resetarDados), que devolve { ok } ou { ok: false, erro }.
export function resetarComConfirmacao(confirmado, resetar) {
  if (!confirmado) return { executado: false, ok: true }
  const resultado = resetar()
  return { executado: true, ok: resultado.ok }
}
