// Nomes e tipos de atendimento dos setores, a partir de departamentos.json.
// "gerenciamento" não é um departamento, mas aparece como origem (RN07) e como setor atual em triagem (RN03).

import departamentos from '../data/departamentos.json'
import { ORIGEM_GERENCIAMENTO } from './permissoes.js'

export function nomeDoSetor(id) {
  if (id === ORIGEM_GERENCIAMENTO) return 'Gerenciamento'
  return departamentos.find((departamento) => departamento.id === id)?.nome ?? 'Setor desconhecido'
}

// Sigla curta para o avatar dos cards da Visão Geral.
export function siglaDoSetor(id) {
  if (id === 'tecnologia') return 'TI'
  return (id ?? '').slice(0, 2).toUpperCase()
}

export function tiposDoSetor(id) {
  return departamentos.find((departamento) => departamento.id === id)?.tiposAtendimento ?? []
}
