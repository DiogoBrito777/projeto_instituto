# Engenharia — diagnóstico, implementação, revisão e escopo

Leia ao **implementar, corrigir ou refatorar** código.

## 1. Antes de mexer
- Inspecione o que existe: estrutura `src/` (`pages/`, `components/`, `data/`, `App.jsx` com rotas por hash, um `.css` por tela). Siga esses padrões; não invente scripts nem convenções. Scripts reais: `dev`, `build`, `lint`, `preview` (e `test`, após o Bloco 1).
- Defina o **comportamento esperado** e os **critérios de aceitação** (CA-R no `REQUISITOS_REGRAS_DE_NEGOCIO.md`) antes de mudanças relevantes. Se o requisito for ambíguo, pergunte.
- **Bug:** reproduza, ache a causa, corrija a causa. Não mascare o sintoma (ex.: esconder um botão em vez de corrigir a regra). Registre como reproduzir.

## 2. Implementação
- **Menor alteração coerente** que resolve o pedido. Preserve comportamento não solicitado e compatibilidade com dados já gravados (chave versionada do storage).
- **Telas existentes:** mantenha layout e classes CSS; mudança visual só por acessibilidade, registrada no CHANGELOG.
- **Regras no domínio, não na tela.** Permissão, transição de status e prazo ficam em funções puras (`src/domain/`), sem React nem `localStorage`; a tela só pergunta "posso?". O "agora" entra por parâmetro.
- **Dados só pela camada `storage`.** Nenhuma tela chama `localStorage` diretamente.
- **Sem dependências, abstrações, refatorações ou formatação global** sem necessidade justificada no plano (`vitest` é o único esperado).
- Nomes em português, claros. Funções curtas. Sem código comentado e sem `console.log` esquecido.
- **Comentários explicam o porquê** (regra de negócio, decisão, referência RF/RN), nunca repetem o código (ver `CONVENCOES.md`).

## 3. Acessibilidade ao implementar (WCAG 2.2 AA / eMAG)
Todo componente novo ou alterado: `<label>` ligado ao campo; erro em texto junto ao campo (`aria-describedby`) e foco no primeiro erro; operável por teclado (Tab, Shift+Tab, Enter, Espaço, Esc) com **foco visível**; contraste ≥ 4,5:1; um `<h1>` por tela; mudanças dinâmicas anunciadas (`aria-live`); diálogo com foco preso, Esc e retorno do foco; não usar só cor para transmitir estado.

## 4. Revisão antes de entregar
- Releia o `diff` completo; remova o que não é do pedido.
- Confira: escopo, regras de `ERROR_HANDLING.md`, acessibilidade (seção 3), e o que mudou nos dados (migração/versão da chave).
- Se algo estiver fora do escopo, **liste como sugestão**, não implemente.

## 5. Controle de escopo
- Pedido específico → mudança específica. Sem "já que estou aqui".
- Um bloco por vez; um tema por commit. Mensagem de commit sugerida: `tipo(escopo): resumo (RF/RN/CA)`, corpo com o porquê.
- Itens marcados como **Futuro** (chat, reabrir, "visualizada", responsável individual) **não** são implementados.
- Cada mudança relevante liga a um requisito (RF/RN/CA) no commit e no `docs/CHANGELOG.md`.
