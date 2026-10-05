import { Search } from 'lucide-react'

// Rótulo para leitor de tela (antes só havia placeholder, que some ao digitar; WCAG 1.3.1, 3.3.2).
// O "Ctrl K" foi removido: era só decorativo e o atalho não existia.
export default function VisaoGeralSearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <Search size={18} strokeWidth={2} aria-hidden="true" />
      <label htmlFor="busca-visao-geral" className="sr-only">
        Pesquisar demanda
      </label>
      <input
        id="busca-visao-geral"
        type="text"
        placeholder="Pesquisar demanda..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
