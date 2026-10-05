# 08 — Acessibilidade: o que foi feito e quais são as evidências

## (a) O que faz
O app foi ajustado para quem usa só teclado, leitor de tela, celular ou enxerga pouco: foco visível, contraste, tamanho de letra, títulos e avisos lidos pelo leitor. As evidências estão em `docs/evidencias/` e em `docs/TESTES_PENDENTES.md`.

## (b) Onde está no código
| O quê | Onde |
|---|---|
| Foco visível em tudo que recebe foco (contorno verde, 5,4:1) | `src/index.css` (`:focus-visible`) |
| "Ir para o conteúdo" (skip link) e foco no título a cada troca de tela | `src/App.jsx`, `src/index.css` (`.skip-link`, `.page-title:focus`) |
| Um único `<h1>` por tela | `src/App.jsx` (`page-title`) |
| Fonte mínima de 14 px | `src/fonte-minima.css` (importado por último em `src/main.jsx`) |
| Contraste: texto 4,5:1 e bordas de campos/cards 3:1 | `src/App.css`, `src/pages/VisaoGeral.css`, `src/pages/DetalhesDemanda.css`, `src/components/Sidebar.css` |
| Erros ligados ao campo (`aria-describedby`, `aria-invalid`) e foco no 1º erro | `src/pages/NovaDemanda.jsx`, `Login.jsx`, `TriagemDemanda.jsx`, `AtualizarDemanda.jsx` |
| Contagens e avisos lidos pelo leitor (`role="status"`, `aria-live`) | `VisaoGeralDemandList.jsx`, `Demandas.jsx`, `ContadorLimite.jsx` |
| Abas com `aria-pressed` | `VisaoGeralFilterTabs.jsx`, `Demandas.jsx` |
| Pop-ups acessíveis | `src/components/Dialogo.jsx` (ver o arquivo 07) |
| Menu no celular quebra linha, sem rolagem lateral | `src/components/Sidebar.css` |
| Selos em texto ("Atrasada para aceite"), não só cor | `src/domain/atencao.js` (`seloDeAtencao`) |
| Menos animação para quem pediu isso ao sistema | `src/index.css` (`prefers-reduced-motion`) |

## (c) Evidências (o que existe de verdade)
- **axe "antes"** (`docs/evidencias/antes/RELATORIO_AXE_ANTES.md`): 190 ocorrências, quase todas de contraste.
- **axe "depois"** (`docs/evidencias/depois/RELATORIO_AXE_DEPOIS.md`): **0 violações nas 26 combinações**, em código anterior; rodado pelo assistente na nuvem.
- **Lighthouse 100/100** na Visão Geral e na Nova Demanda (`admin`, desktop): prints `lighthouse_*_admin_desktop.png`.
- **NVDA 2026.2 + Edge InPrivate**, 2 ou 3 rodadas (prints `nvda_edge-inprivate_*.png`); o resultado por tela não foi registrado.
- **Zoom de 200%** no Chrome: OK (print).
- **360 px:** passou no reteste 6.
- **Celular real Android:** telas OK, envio com falha F1.
- **Bloco B:** Nova Demanda inteira só com teclado, passou (relato do autor).

## (d) Demonstração em 1 minuto
1. Recarregue a página e aperte Tab: aparece "Ir para o conteúdo"; Enter leva o foco ao título.
2. Tab pela Visão Geral: o contorno verde aparece em cada card e botão.
3. F12 → modo celular, 360 px: o menu quebra em duas linhas e não há rolagem lateral.

## (e) Perguntas de revisão
- **Como garantiram acessibilidade?** Auditoria automática (axe antes/depois, Lighthouse), teste só com teclado, leitor de tela (NVDA) e celular, além dos testes automáticos das regras. O que não foi feito está registrado.
- **O axe garante tudo?** Não: ele acha só uma parte. Por exemplo, não pegou o skip link por cima da marca; o teste humano pegou.
- **Por que um arquivo separado para a fonte?** Para não reescrever o CSS dos colegas; dá para desfazer apagando um arquivo e uma linha.

## (f) O que não está pronto / limitações
- **Não executados:** nova rodada do axe no código atual, Lighthouse nas outras telas, NVDA na rodada de reteste, zoom de 400% e 500%, Voz de Acesso.
- No zoom de 500% pode haver rolagem lateral (`min-width: 320px` no `index.css`).
- Tema escuro: trabalho futuro.
