import { useEffect, useState } from 'react'
import { obterStorage } from '../services/storage.js'

// Lista de demandas como estado do React, com os estados de carregando e erro.
// A leitura é assíncrona (espera curta do storage) para "Carregando demandas…" aparecer.
// O setCarga acontece quando a leitura TERMINA (dentro do .then), não direto no useEffect;
// "ativo" evita atualizar uma tela que já foi fechada.
export function useDemandas() {
  const [carga, setCarga] = useState(null)
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    let ativo = true
    obterStorage()
      .lerDemandas()
      .then((resultado) => {
        if (ativo) setCarga(resultado)
      })
    return () => {
      ativo = false
    }
  }, [versao])

  function recarregar() {
    setCarga(null)
    setVersao((atual) => atual + 1)
  }

  function resetar() {
    const resultado = obterStorage().resetarDados()
    if (resultado.ok) recarregar()
    return resultado
  }

  return {
    carregando: carga === null,
    demandas: carga?.ok ? carga.dados : [],
    erro: carga && !carga.ok ? carga.erro : null,
    recarregar,
    resetar,
  }
}
