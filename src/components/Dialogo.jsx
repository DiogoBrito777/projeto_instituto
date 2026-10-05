import { useEffect, useRef } from 'react'
import '../pages/DetalhesDemanda.css'

// Pop-up acessível (WCAG 2.1.1, 2.4.3; ENGINEERING.md, seção 3), com o visual do diálogo que os
// colegas fizeram em DetalhesDemanda.css:
// - ao abrir, o foco entra no elemento marcado com data-autofocus (ou no primeiro botão);
// - Tab e Shift+Tab ficam presos dentro do pop-up;
// - Esc, o × e o clique fora fecham;
// - ao fechar, o foco volta para "retornarFocoPara" (o botão que originou o pop-up).
// "descricao" é o texto lido junto com o título (aria-describedby); "children" é conteúdo extra,
// como um campo de formulário (Bloco 4-A: motivo da recusa), que não pode ficar dentro de um <p>.
const FOCAVEIS = 'button:not([disabled]), [href], select:not([disabled]), textarea, input:not([disabled])'

export default function Dialogo({ titulo, rotuloSuperior, descricao, children, acoes, onFechar, retornarFocoPara }) {
  const caixa = useRef(null)
  // Guarda a função mais recente sem reiniciar o efeito a cada renderização do pai.
  const fechar = useRef(onFechar)

  useEffect(() => {
    fechar.current = onFechar
  })

  useEffect(() => {
    const elementos = () => [...caixa.current.querySelectorAll(FOCAVEIS)]
    const inicial = caixa.current.querySelector('[data-autofocus]') ?? elementos()[0]
    inicial?.focus()

    function teclado(event) {
      if (event.key === 'Escape') {
        fechar.current()
        return
      }
      if (event.key !== 'Tab') return
      const lista = elementos()
      const primeiro = lista[0]
      const ultimo = lista[lista.length - 1]
      if (event.shiftKey && document.activeElement === primeiro) {
        event.preventDefault()
        ultimo.focus()
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault()
        primeiro.focus()
      }
    }

    const destinoDoFoco = retornarFocoPara?.current
    document.addEventListener('keydown', teclado)
    return () => {
      document.removeEventListener('keydown', teclado)
      destinoDoFoco?.focus()
    }
  }, [retornarFocoPara])

  return (
    <div
      className="detail-dialog-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onFechar()}
    >
      <section
        ref={caixa}
        className="detail-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialogo-titulo"
        aria-describedby={descricao ? 'dialogo-texto' : undefined}
      >
        <button className="detail-dialog-close" type="button" onClick={onFechar} aria-label="Fechar">
          ×
        </button>
        {rotuloSuperior && <p className="detail-eyebrow">{rotuloSuperior}</p>}
        <h2 id="dialogo-titulo">{titulo}</h2>
        {descricao && (
          <p id="dialogo-texto" className="detail-dialog-copy">
            {descricao}
          </p>
        )}
        {children}
        <div className="detail-dialog-actions">{acoes}</div>
      </section>
    </div>
  )
}
