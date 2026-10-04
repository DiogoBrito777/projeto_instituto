# 09 — Testes

## (a) O que faz
Há **245 testes automáticos** (Vitest) que conferem as regras de negócio, o armazenamento e alguns formatos. Os testes de tela foram feitos **à mão** pelo autor e estão registrados em `docs/TESTES_PENDENTES.md`.

## (b) Onde está no código
Rodar: `npm test` (script `vitest run` no `package.json`). Contagem em 04/10/2026:

| Arquivo de teste | Testes | O que cobre |
|---|---|---|
| `src/domain/listas.test.js` | 59 | abas, permissão nas listas, filtros, busca, paginação, ordem de atenção, cards da Visão Geral, aviso |
| `src/domain/acoes.test.js` | 56 | atualizar, aceitar, recusar, redirecionar, Não aplicável, cancelar, estados finais |
| `src/domain/permissoes.test.js` | 29 | quem vê e quem faz o quê; resumo de quem abriu |
| `src/domain/atencao.test.js` | 28 | prazos de 48 h e 24 h, limite exato, selos, prazo depois de redirecionar |
| `src/services/storage.test.js` | 18 | semente, dados corrompidos, falha simulada, gravação, reset, cobertura do seed |
| `src/domain/novaDemanda.test.js` | 16 | validação, limites 60/500, tipo "Outros", origem automática |
| `src/domain/prazos.test.js` | 14 | prazos por prioridade, a expirar, vencida, aguardando > 7 dias |
| `src/domain/limites.test.js` | 10 | aviso de limite, colagem, bug do aviso que voltava |
| `src/domain/status.test.js` | 6 | os 7 status e as transições |
| `src/domain/prioridades.test.js` | 4 | níveis e prazo por extenso |
| `src/services/reset.test.js` | 3 | reset com confirmação (cancelar não apaga) |
| `src/formatos.test.js` | 2 | plural ("1 demanda ativa") |
| **Total** | **245** | |

## (c) Como funciona
1. As regras ficam em **funções puras** (recebem dados e devolvem resposta, sem tela e sem armazenamento). Por isso dá para testar sem abrir o navegador.
2. Funções de prazo recebem o **"agora" por parâmetro**: o teste usa uma data fixa e dá sempre o mesmo resultado.
3. O armazenamento é testado com um "localStorage falso" (`criarBackendFalso` em `storage.test.js`).
4. Os testes manuais seguem o roteiro de `docs/TESTES_PENDENTES.md`. O que passou tem a fonte ao lado; o que não foi feito está como "não executado".

## (d) Demonstração em 1 minuto
1. No CMD: `npm test` → "Test Files 12 passed, Tests 245 passed".
2. Abra `src/domain/atencao.test.js` e leia um teste: "aceite: 47 h e exatamente 48 h NÃO estão atrasadas; 48 h e 1 min está".

## (e) Perguntas prováveis
- **O que os testes NÃO cobrem?** Cliques, foco e o visual: não há biblioteca de teste de interface (jsdom/Testing Library). Isso foi testado à mão.
- **Como testar um prazo de 24 h sem esperar 24 h?** A função recebe o "agora"; o teste monta uma demanda "de 24 h atrás".
- **Como sabem que um setor não vê o que é de outro?** Há testes negativos, ex.: "TI NÃO recebe demanda entre Hidráulica e Elétrica em nenhuma aba".

## (f) O que não está pronto / limitações
- Não há teste de `auth.js` (login) nem de telas.
- Itens manuais **não executados** e a falha F1: ver `docs/TESTES_PENDENTES.md`, seção 0, e o arquivo 92.
