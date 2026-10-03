# Tratamento de erros — validação, falhas, mensagens, logs e integridade

Leia ao **alterar formulários, login, storage, offline/rede, rotas com parâmetro ou qualquer fluxo de falha**. Adaptado ao projeto real: sem servidor, sem banco, sem fila externa. "Rede" é simulada (`navigator.onLine` + atraso/falha simulados).

## 1. Princípios
1. **Nunca** sucesso falso: só mostre "enviado/salvo" depois de a gravação ser confirmada.
2. **Nunca** `catch` vazio nem fallback silencioso que esconda perda de dados. Todo `catch` trata, relança ou reporta.
3. Erro **esperado** (campo vazio, sem permissão, offline, demanda inexistente) → mensagem clara ao usuário, sem log de erro. Erro **inesperado** (JSON corrompido, quota cheia, bug) → mensagem genérica ao usuário + causa técnica em `console.error` com contexto.
4. A causa técnica é preservada (objeto de erro original), sem expor segredos nem dados sensíveis na tela.

## 2. Validação nas fronteiras
| Fronteira | O que validar |
|---|---|
| Formulários | Obrigatórios, limites (título 60, descrição 500), destino ≠ próprio setor, tipo válido para o destino. Textos: `docs/MENSAGENS_VALIDACAO.md` |
| Parâmetro de rota (`#demanda/:id`) | ID existe **e** o perfil pode ver (mesma resposta para inexistente e sem permissão) |
| Leitura do storage | É JSON válido e tem o formato esperado antes de usar |
| Login | Campos preenchidos; erro único e genérico para usuário/senha |
| Ações de domínio (aceitar, recusar, redirecionar…) | Validar com as funções puras **antes** de gravar; campos obrigatórios (prioridade, motivo, justificativa) |

A validação na tela dá feedback; a validação no domínio/storage garante a regra. Uma não substitui a outra.

## 3. Mensagens
- Dizem **o que aconteceu e o que fazer**; sem jargão, sem stack, sem códigos internos.
- Ficam **junto ao campo** (`aria-describedby`); foco no primeiro erro; resumo/estado anunciado por `aria-live` (`role="alert"` para erro, `role="status"` para sucesso).
- Estados visíveis em toda tela com dados: **carregando, vazio, sucesso e erro**.

## 4. Logs
Só `console.error`/`console.warn` com contexto (operação, id, chave do storage) e o erro original. **Nunca** logar senha, dados do formulário inteiros ou sessão. Remover `console.log` de depuração antes de concluir. Sem infraestrutura de log.

## 5. Persistência (`localStorage`)
- Todo acesso passa por `src/services/storage.js`, com `try/catch` e **resultado explícito** (sucesso ou erro tratado), não valor padrão silencioso.
- **Primeira carga** = `getItem(chave) === null` (não "lista vazia"). Chave versionada; mudança de formato exige nova versão e migração.
- **JSON corrompido:** não sobrescrever automaticamente. Mostrar erro com ação **"Resetar dados"** (opção explícita do usuário). Registrar a causa no console.
- **Quota/storage bloqueado:** a escrita falha de forma visível (a operação **não** é dada como concluída); o formulário é mantido.
- **Escrita atômica:** ler → alterar → gravar dentro de **uma** função do storage; sem escritas parciais espalhadas pelas telas.
- **IDs únicos** (`crypto.randomUUID()` ou contador persistido). Histórico só recebe itens novos (append-only).
- Limitação a documentar: duas abas editando ao mesmo tempo podem sobrescrever uma à outra (sem back-end).
- Dados são editáveis no DevTools: simulação, não segurança.

## 6. Offline, envio, repetição e recuperação (RF10, RF11, RNF03)
- O **rascunho** do formulário é preservado em qualquer falha ou cancelamento.
- Sem conexão: a demanda vai para **"Pendentes de envio"** com aviso (`aria-live`); nada é marcado como enviado.
- Ao reconectar, o envio da fila é **item a item**: falha em um **não** perde nem trava os demais; cada item sai da fila **somente após** a gravação confirmada.
- **Sem duplicar escrita:** cada pendente tem identificador local; antes de reenviar, confira se já foi gravado. Desabilite o botão durante o envio (evita duplo clique).
- **Retry:** manual ("Tentar de novo") e no máximo **uma tentativa automática por evento "online"**. Sem laços de repetição.
- **Cancelamento:** fechar o pop-up de confirmação ou sair da tela não descarta o rascunho.
- **Falha simulada (`?falha=1`)** existe só para demonstrar o estado de erro; padrão desligado; documentada no README.

## 7. Integridade de dados e de regras
- Mudança de status **somente** por função do domínio que valida quem pode e a transição.
- **Estados finais** (Concluída, Não aplicável, Cancelada) não aceitam nenhuma alteração, nem pela interface nem pelo storage.
- Regras de visibilidade valem na **rota e nos dados** (`resumoParaSolicitante`), não só escondendo elementos.
