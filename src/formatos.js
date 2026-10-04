// Formatação para exibição (pt-BR). As demandas guardam datas em ISO (texto UTC).

const CONECTIVOS = ['de', 'da', 'do', 'e']

// "Equipe de TI" → "ET"; usado nos avatares.
export function iniciais(nome) {
  return nome
    .split(' ')
    .filter((parte) => parte && !CONECTIVOS.includes(parte))
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('')
}

// "1 demanda ativa", "0 demandas ativas", "3 demandas ativas" (ajustes do teste manual, item 4:
// a tela mostrava "1 demandas ativas"). Em português, só o 1 fica no singular.
export function quantidade(numero, singular, plural) {
  return `${numero} ${numero === 1 ? singular : plural}`
}

export function formatarData(iso) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(new Date(iso))
    .replace(/\s+de\s+/g, ' ')
}

export function formatarDataHora(iso) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}
