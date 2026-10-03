# Verificação — testes e evidências para declarar uma tarefa concluída

Leia ao **planejar e validar** alterações. Regra de ouro: **sem evidência, não diga "corrigido", "testado" ou "compatível"**; diga "não executado".

## 1. Comandos reais do projeto
`npm install` · `npm run lint` · `npm run build` · `npm test` (após o Bloco 1) · `npm run dev` (teste manual).
**Linha de base do `main` de 03/10:** lint sem avisos, build OK, **sem testes**. Qualquer aviso novo é **seu**; corrija. O que já falhava antes: registre como "preexistente".

## 2. Testes proporcionais ao risco
| Mudança | Verificação mínima |
|---|---|
| Regras (permissão, transição, prazo) | Testes unitários (`vitest`) **incluindo caminhos negativos** (ex.: `user01` **não** vê demanda de outro setor; gerência **não** define prioridade; estado final não muda) |
| Storage | Testes com backend de armazenamento **falso injetado** (sem `jsdom`): seed, primeira carga, JSON corrompido, quota cheia, versão de chave |
| Telas / fluxos | Checklist manual no navegador, com os 5 logins; registrar o que foi visto |
| Formulários | Vazio, limite, válido, offline, falha simulada (`?falha=1`), recarregar a página |
| Acessibilidade | axe automático + teclado + leitor de tela (seção 4) |
| Mudança só de documentação | Conferir links e consistência com os requisitos |

## 3. Falha nova × preexistente × não executada
Em todo relatório separe: **falha nova** (causada por você: corrigir), **falha preexistente** (anote, não conserte sem pedido) e **verificação não executada** (diga por quê). Analise a saída real; não presuma sucesso.

## 4. Evidência de acessibilidade (peso alto na nota)
- **Antes:** já existe em `docs/evidencias/antes/` (axe-core 4.13.0 sobre o build do `main` de 03/10; 6 rotas × 1280/360 px).
- **Depois:** **não** gere nem invente. A equipe repete o mesmo procedimento e salva em `docs/evidencias/depois/`. Também: Lighthouse no Chrome, **teste só com teclado** (Tab/Shift+Tab/Enter/Espaço/Esc) e **leitor de tela** (NVDA/VoiceOver), anotando **quem executou e quando**.
- Auditoria automática cobre só parte; os itens manuais continuam abertos até alguém executá-los.

## 5. Definição de pronto (por tarefa)
☐ Comportamento esperado e critérios de aceitação definidos · ☐ Lint, build e testes rodados e resultados lidos · ☐ Caminhos de falha relevantes testados · ☐ Checklist manual feito (ou "não executado") · ☐ Acessibilidade da tela conferida · ☐ `docs/CHANGELOG.md` atualizado · ☐ `docs/EXPLICACAO_BLOCO<N>.md` escrito · ☐ Mensagens de commit sugeridas · ☐ Sem `console.log` de depuração nem código comentado.

## 6. Modelo do relatório final
```
Arquivos alterados: ...
Comportamento resultante: ...
Requisitos/CA cobertos: ...
Verificações: lint [resultado] · build [resultado] · test [N passaram, M falharam] · manual [o que foi feito / não executado]
Falhas: novas [...] · preexistentes [...] · não executadas [... por quê]
Limitações: ...
Sugestões fora do escopo: ...
Commits sugeridos: ...
```
