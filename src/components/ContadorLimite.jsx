// Contador "N/limite caracteres" + aviso de limite anunciado pelo leitor de tela.
// A área role="status" existe sempre (mesmo vazia) para o anúncio funcionar quando o texto aparece.
export default function ContadorLimite({ id, valor, limite, aviso }) {
  return (
    <>
      <span id={`${id}-contador`} className="form-counter">
        {valor.length}/{limite} caracteres
      </span>
      <span className="form-limit" role="status">
        {aviso}
      </span>
    </>
  )
}
