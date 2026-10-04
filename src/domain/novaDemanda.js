// Validação e montagem de uma demanda nova (RN07, RN08, RN09, RN22; RF-R03).
// Funções puras: a tela usa para mostrar os erros, e a mesma regra decide o que é gravado.

import { ORIGEM_GERENCIAMENTO, ehGerencia } from './permissoes.js'
import { NAO_DEFINIDA } from './prioridades.js'
import { tiposDoSetor } from './setores.js'
import { STATUS } from './status.js'

// Limites padrão (a confirmar com o grupo; requisitos, "Decisões").
export const LIMITE_TITULO = 60
export const LIMITE_DESCRICAO = 500

// Códigos de erro por campo; os textos ficam no catálogo (docs/MENSAGENS_VALIDACAO.md).
export const ERROS_NOVA = {
  DESTINO_VAZIO: 'destino-vazio',
  DESTINO_PROPRIO: 'destino-proprio',
  TIPO_VAZIO: 'tipo-vazio',
  TIPO_SEM_DESTINO: 'tipo-sem-destino',
  TIPO_INVALIDO: 'tipo-invalido',
  TITULO_VAZIO: 'titulo-vazio',
  TITULO_LONGO: 'titulo-longo',
  DESCRICAO_VAZIA: 'descricao-vazia',
  DESCRICAO_LONGA: 'descricao-longa',
}

// RN07: a origem não é escolhida; vem do perfil logado.
export function origemDoUsuario(usuario) {
  return ehGerencia(usuario) ? ORIGEM_GERENCIAMENTO : usuario.departamento
}

// Ordem dos campos na tela: o primeiro erro desta ordem recebe o foco.
export const ORDEM_DOS_CAMPOS = ['destino', 'tipo', 'titulo', 'descricao']

// Devolve { campo: códigoDoErro } só para os campos com problema. Objeto vazio = tudo certo.
export function validarNovaDemanda(campos, usuario) {
  const erros = {}
  const titulo = campos.titulo.trim()
  const descricao = campos.descricao.trim()

  if (!campos.destino) erros.destino = ERROS_NOVA.DESTINO_VAZIO
  // CA-R11 / RN07: o destino nunca é o próprio setor de quem abre.
  else if (campos.destino === origemDoUsuario(usuario)) erros.destino = ERROS_NOVA.DESTINO_PROPRIO

  if (!campos.destino) erros.tipo = ERROS_NOVA.TIPO_SEM_DESTINO
  else if (!campos.tipo) erros.tipo = ERROS_NOVA.TIPO_VAZIO
  else if (!tiposDoSetor(campos.destino).includes(campos.tipo)) erros.tipo = ERROS_NOVA.TIPO_INVALIDO

  if (!titulo) erros.titulo = ERROS_NOVA.TITULO_VAZIO
  else if (titulo.length > LIMITE_TITULO) erros.titulo = ERROS_NOVA.TITULO_LONGO

  if (!descricao) erros.descricao = ERROS_NOVA.DESCRICAO_VAZIA
  else if (descricao.length > LIMITE_DESCRICAO) erros.descricao = ERROS_NOVA.DESCRICAO_LONGA

  return erros
}

export function primeiroCampoComErro(erros) {
  return ORDEM_DOS_CAMPOS.find((campo) => erros[campo]) ?? null
}

// Monta a demanda a gravar (sem id: o número é dado pelo storage).
// Só os campos permitidos são copiados: mesmo que chegue uma "prioridade", ela é ignorada (RN08).
export function montarNovaDemanda(campos, usuario, contexto) {
  const data = contexto.agora.toISOString()
  return {
    titulo: campos.titulo.trim(),
    descricao: campos.descricao.trim(),
    tipo: campos.tipo,
    origem: origemDoUsuario(usuario),
    destino: campos.destino,
    solicitante: usuario.nome,
    // RN09: nasce pendente de aceite e sem prioridade; quem define é o setor ao aceitar (RN10).
    status: STATUS.PENDENTE_ACEITE,
    prioridade: NAO_DEFINIDA,
    criadaEm: data,
    aceitaEm: null,
    prazo: null,
    redirecionadaEm: null,
    aguardandoDesde: null,
    historico: [
      {
        id: contexto.novoId(),
        data,
        autor: usuario.nome,
        perfil: usuario.perfil,
        tipo: 'criacao',
        texto: 'Demanda criada.',
      },
    ],
  }
}
