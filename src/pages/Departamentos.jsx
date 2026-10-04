import { useMemo, useState } from 'react'
import departamentos from '../data/departamentos.json'
import { useDemandas } from '../hooks/useDemandas.js'
import { abertasDoSetor } from '../domain/listas.js'
import { ehGerencia } from '../domain/permissoes.js'
import { Carregando, ErroDados } from '../components/EstadoDados.jsx'

function IconeDepartamento({ tipo }) {
  if (tipo === 'tecnologia') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="12" rx="2" />
        <path d="M8 20h8M12 17v3M8 9h8" />
      </svg>
    )
  }

  if (tipo === 'hidraulica') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3C9.5 6.5 6.5 9.5 6.5 13a5.5 5.5 0 0 0 11 0C17.5 9.5 14.5 6.5 12 3Z" />
        <path d="M9.5 14.5a2.7 2.7 0 0 0 2.7 2.7" />
      </svg>
    )
  }

  if (tipo === 'administrativo') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6" y="5" width="12" height="16" rx="2" />
        <path d="M9 5.5V4h6v1.5M9 10h6M9 14h6M9 18h3" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z" />
    </svg>
  )
}

function Departamentos({ usuario }) {
  const [termoBusca, setTermoBusca] = useState('')
  const { carregando, demandas, erro, resetar } = useDemandas()
  const setoresFiltrados = useMemo(() => {
    const termo = termoBusca.trim().toLocaleLowerCase('pt-BR')
    return departamentos
      // Departamentos são independentes (RN02): um setor vê só o próprio card; a gerência vê todos.
      .filter((departamento) => ehGerencia(usuario) || departamento.id === usuario.departamento)
      .filter((departamento) =>
        `${departamento.nome} ${departamento.descricao}`
          .toLocaleLowerCase('pt-BR')
          .includes(termo),
      )
  }, [termoBusca, usuario])

  return (
    <section className="departments-page" aria-labelledby="departments-heading">
      <div className="departments-intro">
        <h2 id="departments-heading">Central de Atendimento</h2>
        <p>Selecione o setor da demanda</p>
      </div>

      <label className="department-search">
        <span className="sr-only">Buscar setor por nome ou descrição</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4.3 4.3" />
        </svg>
        <input
          type="search"
          value={termoBusca}
          onChange={(event) => setTermoBusca(event.target.value)}
          placeholder="Buscar setor por nome ou descrição..."
        />
      </label>

      {/* Anuncia o resultado da busca ao leitor de tela. */}
      <p className="sr-only" role="status">
        {setoresFiltrados.length} {setoresFiltrados.length === 1 ? 'setor encontrado' : 'setores encontrados'}
      </p>

      {carregando ? (
        <Carregando />
      ) : erro ? (
        <ErroDados erro={erro} onResetar={resetar} />
      ) : setoresFiltrados.length > 0 ? (
        <div className="departments-grid">
          {setoresFiltrados.map((departamento) => (
            <article className="department-card" key={departamento.id}>
              <div className="department-card-top">
                <span className={`department-icon department-icon--${departamento.cor}`}>
                  <IconeDepartamento tipo={departamento.icone} />
                </span>
                <span className={`department-count department-count--${departamento.cor}`}>
                  {abertasDoSetor(demandas, departamento.id)} demandas abertas
                </span>
              </div>
              <h3>{departamento.nome}</h3>
              <p>{departamento.descricao}</p>
              <a href={`#demandas/${departamento.id}`} aria-label={`Acessar setor ${departamento.nome}`}>
                Acessar setor <span aria-hidden="true">›</span>
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className="department-empty-state" role="status">
          Nenhum setor encontrado. Tente outro termo de busca.
        </div>
      )}
    </section>
  )
}

export default Departamentos
