import { useState } from 'react'
import { obterStorage } from '../services/storage.js'

// Lista de demandas como estado do React. A carga acontece no estado inicial (sem useEffect)
// e "recarregar" é chamado por quem gravou algo, por exemplo depois de "Resetar dados".
export function useDemandas() {
  const [carga, setCarga] = useState(() => obterStorage().carregarDemandas())

  function recarregar() {
    setCarga(obterStorage().carregarDemandas())
  }

  function resetar() {
    const resultado = obterStorage().resetarDados()
    if (resultado.ok) recarregar()
    return resultado
  }

  return {
    demandas: carga.ok ? carga.dados : [],
    erro: carga.ok ? null : carga.erro,
    recarregar,
    resetar,
  }
}
