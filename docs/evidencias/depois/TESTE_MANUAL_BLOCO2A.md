# Teste manual — Bloco 2A (telas ligadas aos dados)

- **Data:** 03/10/2026
- **Executado por:** Bruno Diogo (relato do autor)
- **Prints:** `docs/evidencias/antes/teste-manual_bloco2a_atualizar-sem-campo.png` (o defeito, antes da correção)
- **Ambiente:** Microsoft Edge, `npm run dev` (branch `feat/telas-nova-demanda`)
- **Roteiro:** "Teste manual por tela" do relatório da 2A

## Resultados
| Tela / cenário | Requisito | Resultado | Observação |
|---|---|---|---|
| Demandas | RF-R04, RN02, CT-R03 | ✅ Passou | |
| Detalhes | RF-R05, RN03, RN04, CT-R04, CT-R07 | ✅ Passou | |
| Departamentos | RF-R04 | ✅ Passou | |
| Visão Geral | RF-R06 | ✅ Passou | A contagem acompanhou a conclusão da DM-2012 |
| Atualizar | RF-R05, RN22 | ❌ Falhou → corrigido → ✅ reteste passou | Não havia onde escrever (ver abaixo) |
| Atualizar: mudar o tipo de atendimento | RN22 | ✅ Mantido | A mudança fica registrada no histórico |
| Fonte pequena na interface | WCAG 1.4.4 | ⚠️ Pendente | Fica para o **Bloco 3** (acessibilidade) |
| Teclado (Tab/Shift+Tab/Enter/Esc) | CT-R13 | não executado | |
| Leitor de tela | CT-R14 | não executado | |

## Falha encontrada: Atualizar sem campo de texto
- **Como reproduzir (antes da correção):** entrar com `user01` → abrir a DM-2012 → "Atualizar demanda" → tentar escrever no campo de texto.
- **Causa:** a caixa de texto era a "Descrição" da demanda, deixada só leitura porque o texto pertence a quem abriu a demanda.
- **Correção:** no mesmo cartão (layout mantido), a descrição original aparece como texto e a caixa vira "Observação (opcional)", com rótulo associado, limite de 500 caracteres e contador. A observação vai para o histórico junto da mudança, com autor, perfil e data; sozinha, é salva como item próprio. Arquivos: `src/domain/acoes.js` (+ testes), `src/pages/AtualizarDemanda.jsx`.
- **Reteste no Edge:** ✅ passou (03/10/2026), feito pelo autor (Bruno Diogo), conforme relato do autor.
