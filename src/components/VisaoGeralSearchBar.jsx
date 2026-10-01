import { Search } from 'lucide-react'

export default function VisaoGeralSearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <Search size={18} strokeWidth={2} />
      <input
        type="text"
        placeholder="Pesquisar demanda..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="kbd">Ctrl K</span>
    </div>
  )
}
