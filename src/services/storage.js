// Camada única de dados (ADR-02; ERROR_HANDLING.md, seção 5).
// O JSON de semente é lido só na primeira carga; depois tudo vem do localStorage.
// Nenhuma tela chama localStorage direto: todas passam por aqui.
// Toda função devolve um resultado explícito: { ok: true, dados } ou { ok: false, erro }.

import { criarSemente } from './seed.js'

// Chave versionada: se o formato mudar, troca-se v1 → v2 e os dados antigos não quebram o app.
const PREFIXO = 'demanda-de-aco:v1:'

export const CHAVES = {
  demandas: `${PREFIXO}demandas`,
  contador: `${PREFIXO}contador`,
}

export const ERROS = {
  INDISPONIVEL: 'indisponivel',
  CORROMPIDO: 'corrompido',
  GRAVACAO: 'gravacao',
  FALHA_SIMULADA: 'falha-simulada',
  NAO_ENCONTRADA: 'nao-encontrada',
}

function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms))
}

function formatoValido(lista) {
  return Array.isArray(lista) && lista.every((item) => typeof item?.id === 'string')
}

function numeroDoId(id) {
  return Number(id.replace('DM-', '')) || 0
}

// backend: objeto com getItem/setItem/removeItem (o localStorage do navegador ou um falso nos testes).
// gerarSemente: função chamada só na primeira carga, para as datas serem relativas a esse momento.
export function criarStorage({
  backend,
  gerarSemente,
  atrasoMs = 250,
  atrasoLeituraMs = 150,
  falhaSimulada = false,
}) {
  function ler(chave) {
    if (!backend) return { ok: false, erro: ERROS.INDISPONIVEL }
    try {
      return { ok: true, dados: backend.getItem(chave) }
    } catch (causa) {
      console.error(`[storage] não foi possível ler "${chave}"`, causa)
      return { ok: false, erro: ERROS.INDISPONIVEL }
    }
  }

  function gravar(chave, valor) {
    if (!backend) return { ok: false, erro: ERROS.INDISPONIVEL }
    try {
      backend.setItem(chave, JSON.stringify(valor))
      return { ok: true, dados: valor }
    } catch (causa) {
      // Ex.: cota cheia ou armazenamento bloqueado. A operação NÃO é dada como concluída.
      console.error(`[storage] não foi possível gravar "${chave}"`, causa)
      return { ok: false, erro: ERROS.GRAVACAO }
    }
  }

  function carregarDemandas() {
    const leitura = ler(CHAVES.demandas)
    if (!leitura.ok) return leitura

    // Primeira carga = a chave não existe (null). Lista vazia é um estado válido e não recria a semente.
    if (leitura.dados === null) return gravar(CHAVES.demandas, gerarSemente())

    try {
      const lista = JSON.parse(leitura.dados)
      if (formatoValido(lista)) return { ok: true, dados: lista }
      console.error(`[storage] formato inesperado em "${CHAVES.demandas}"`)
    } catch (causa) {
      console.error(`[storage] JSON inválido em "${CHAVES.demandas}"`, causa)
    }
    // Dados corrompidos não são apagados sozinhos: o usuário decide com "Resetar dados".
    return { ok: false, erro: ERROS.CORROMPIDO }
  }

  // Leitura usada pelas telas. A espera curta existe só para o estado "Carregando demandas…" ser
  // visível na demonstração (exigência do enunciado); desvio do kit registrado no CHANGELOG (Bloco 2A).
  async function lerDemandas() {
    await esperar(atrasoLeituraMs)
    return carregarDemandas()
  }

  // Atraso curto e falha simulada (?falha=1) só nas gravações, para demonstrar carregando e erro.
  async function antesDeGravar() {
    await esperar(atrasoMs)
    return falhaSimulada ? { ok: false, erro: ERROS.FALHA_SIMULADA } : { ok: true }
  }

  // Contador persistido: o próximo número é sempre maior que o maior ID já usado.
  function proximoId(lista) {
    const leitura = ler(CHAVES.contador)
    if (!leitura.ok) return leitura
    const maiorNaLista = Math.max(0, ...lista.map((demanda) => numeroDoId(demanda.id)))
    const ultimo = Math.max(Number(leitura.dados) || 0, maiorNaLista)
    const gravacao = gravar(CHAVES.contador, ultimo + 1)
    return gravacao.ok ? { ok: true, dados: `DM-${ultimo + 1}` } : gravacao
  }

  async function criarDemanda(dados) {
    const permissao = await antesDeGravar()
    if (!permissao.ok) return permissao

    const carga = carregarDemandas()
    if (!carga.ok) return carga

    const id = proximoId(carga.dados)
    if (!id.ok) return id

    const nova = { ...dados, id: id.dados }
    const gravacao = gravar(CHAVES.demandas, [...carga.dados, nova])
    return gravacao.ok ? { ok: true, dados: nova } : gravacao
  }

  // Ler → validar → gravar numa função só, para não haver gravação pela metade espalhada nas telas.
  // "alterar" recebe a demanda ATUAL (lida agora, não a da tela) e devolve um resultado:
  // { ok: true, dados: novaDemanda } ou { ok: false, erro }. Se a regra recusar, nada é gravado.
  async function atualizarDemanda(id, alterar) {
    const permissao = await antesDeGravar()
    if (!permissao.ok) return permissao

    const carga = carregarDemandas()
    if (!carga.ok) return carga

    const atual = carga.dados.find((demanda) => demanda.id === id)
    if (!atual) return { ok: false, erro: ERROS.NAO_ENCONTRADA }

    const alteracao = alterar(atual)
    if (!alteracao.ok) return alteracao

    const lista = carga.dados.map((demanda) => (demanda.id === id ? alteracao.dados : demanda))
    const gravacao = gravar(CHAVES.demandas, lista)
    return gravacao.ok ? { ok: true, dados: alteracao.dados } : gravacao
  }

  // Apaga só as chaves deste app; a próxima carga recria a semente com datas de agora.
  function resetarDados() {
    if (!backend) return { ok: false, erro: ERROS.INDISPONIVEL }
    try {
      Object.values(CHAVES).forEach((chave) => backend.removeItem(chave))
      return { ok: true }
    } catch (causa) {
      console.error('[storage] não foi possível resetar os dados', causa)
      return { ok: false, erro: ERROS.GRAVACAO }
    }
  }

  return { carregarDemandas, lerDemandas, criarDemanda, atualizarDemanda, resetarDados }
}

// Instância usada pelo app. Criada só quando alguém pede, porque os testes rodam sem navegador.
let instancia = null

function localStorageDoNavegador() {
  try {
    return window.localStorage
  } catch (causa) {
    // Navegador com armazenamento bloqueado: o app mostra erro em vez de quebrar.
    console.error('[storage] localStorage indisponível', causa)
    return null
  }
}

export function obterStorage() {
  if (!instancia) {
    // ?falha=1 simula erro nas gravações; ?lento=1 deixa leitura e gravação em 2 s, para a
    // demonstração mostrar "Carregando demandas…" e "Enviando…" com calma. Sem eles, nada muda.
    const params = new URLSearchParams(window.location.search)
    instancia = criarStorage({
      backend: localStorageDoNavegador(),
      gerarSemente: () => criarSemente(new Date()),
      falhaSimulada: params.get('falha') === '1',
      ...(params.get('lento') === '1' ? { atrasoMs: 2000, atrasoLeituraMs: 2000 } : {}),
    })
  }
  return instancia
}
