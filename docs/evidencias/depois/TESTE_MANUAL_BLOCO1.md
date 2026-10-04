# Teste manual — Bloco 1 (login, sessão e Sair)

- **Data:** 03/10/2026
- **Executado por:** Bruno Diogo (relato do autor)
- **Prints:** guardados pelo autor, a anexar
- **Ambiente:** Microsoft Edge, navegação privada, `npm run dev` (branch `feat/fundacao`)
- **Usuários de teste:** `admin`, `user01`, `user02`, `user03`, `user04` (senha = usuário)

## Resultados
| Cenário | Requisito | Resultado | Observação |
|---|---|---|---|
| Login com os 5 usuários (`admin`, `user01`–`user04`) | CT-R02, RF-R01 | ✅ Passou | |
| Entrar e sair do perfil | CT-R11, CA-R10 | ✅ Passou | |
| Fechar o navegador e abrir de novo | RN01 | ✅ Passou | Pede login de novo |
| Voltar para a URL na mesma aba | RN01 | ✅ Comportamento esperado | A sessão continua ativa porque fica no `sessionStorage`; só o **Sair** encerra a sessão. **Decisão de projeto, não bug.** |
| Recarregar a página (F5) | RN01, ADR-02 | ✅ Passou | Sessão e dados mantidos |
| Celular 360 px (modo celular do F12) | RN01, WCAG 2.1.1 | ❌ Falhou → corrigido → ✅ reteste passou | Não havia como fazer **Sair** (ver "Falha encontrada" abaixo). Reteste: relato do autor |
| Teclado (Tab/Shift+Tab/Enter) | CT-R13 | ⚠️ Parcial | TAB inconsistente nas telas antigas: fica para o **Bloco 3** (acessibilidade) |
| Dados corrompidos ("Resetar dados") | ERROR_HANDLING §5 | não executado | |

## Falha encontrada: Sair indisponível no celular
- **Como reproduzir:** F12 → modo celular, largura 360 px → entrar com qualquer usuário → procurar o botão Sair.
- **Causa:** em `src/components/Sidebar.css`, dentro de `@media (max-width: 760px)`, o bloco `.sidebar-profile` (avatar, nome e botão Sair) estava com `display: none`.
- **Correção (menor mudança possível, só CSS da Sidebar):** no celular o perfil volta a aparecer, numa linha abaixo do menu, e o botão Sair ganha alvo de toque de 34 × 34 px, igual aos itens do menu no celular. O visual no computador não muda (a regra fica só dentro do `@media`).
- **Verificação da correção pelo assistente (Claude Code):** feita em 03/10/2026 no navegador embutido do app Claude, **não no Edge**, com tela de 360 × 740 e `user01`. O perfil "Equipe de TI" e o Sair aparecem abaixo do menu. Com 6 Tabs o foco chega ao Sair (34 × 34 px, contorno de foco visível). Enter leva a `#login` e apaga a sessão.
- **Reteste no Edge, em 360 px:** ✅ passou, conforme relato do autor (Bruno Diogo), com o DevTools em modo dispositivo. Data não registrada.
