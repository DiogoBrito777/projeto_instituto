import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Fonte mínima de 14 px (Bloco 3). Fica DEPOIS do App, cujo CSS (e o das telas) já foi carregado,
// para vencer com a mesma especificidade. Para desfazer: apague esta linha e src/fonte-minima.css.
import './fonte-minima.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
