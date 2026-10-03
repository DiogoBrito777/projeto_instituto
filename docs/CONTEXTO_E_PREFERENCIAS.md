# Contexto e preferências (leia antes de começar)

> Este arquivo existe porque o trabalho começou em outra conversa. Não há como transferir o histórico, então tudo o que importa está aqui e em `docs/`.

## Projeto e forma de comunicação
- Disciplina Programação Web (UnDF, Brasília), PBL, Problema 1: "O formulário das seis caixas de entrada". Grupo de 7 pessoas.
- Responda em **português do Brasil**, tom informal, **curto e em tópicos**.
- Quem apresenta **precisa entender o código** para explicá-lo ao professor. Explique o porquê, em linguagem simples, sem jargão solto. Se pedirem "explica", faça passo a passo.
- Faça poucas perguntas; quando houver padrão razoável, adote-o e diga qual adotou. Não peça confirmação para o que já foi definido.
- Prefira passos pequenos e concretos.

## Prazo
- Entrega e apresentação: **terça, 06/10/2026, à noite, na universidade**.
- Tempo de desenvolvimento: **sábado 03/10 e parte do domingo 04/10**.
- O professor disse: não precisa entregar tudo; o que não for entregue deve ser **justificável**; todos precisam explicar cada parte do código; IA é permitida se souberem explicar.
- Prioridade: Bloco 1 → 2 → 3 → 4 de `docs/PROMPT_BLOCOS.md`. O que não couber vira "adiado" em `docs/DOCUMENTACAO.md` (seção 18), com justificativa honesta.
- Pesos da nota: requisitos/rastreabilidade 25%, front-end responsivo e acessível 30%, processo de engenharia 20%, testes e evidências 15%, demonstração/colaboração/reflexão 10%.

## Como trabalhar neste computador
- Pasta do projeto: `C:\Users\Adm\Documents\GitHub\projeto_instituto` (clone real, GitHub Desktop).
- **O `git` não está no PATH.** Não tente commitar nem dar push. **Edite os arquivos e, ao final de cada bloco, entregue as mensagens de commit sugeridas** (formato em `docs/CONVENCOES.md`); o commit e o push são feitos pelo GitHub Desktop, depois do teste local.
- Nunca altere o `main` nem faça push.
- Comandos usados no CMD do Windows: `npm install`, `npm run dev`, `npm run lint`, `npm run build` e `npm test`.

## Honestidade (regra de ouro)
- **Nunca invente evidências**: resultado de teste, auditoria, print, ata "como se tivessem ocorrido". O que não foi executado: "não executado".
- Já existe uma evidência real: `docs/evidencias/antes/` (axe-core 4.13.0 no `main` de 03/10, gerada fora desta máquina). A auditoria "depois" **não existe**; não a crie, apenas deixe o espaço.

## Decisões (resumo; detalhes em `docs/REQUISITOS_REGRAS_DE_NEGOCIO.md`)
- Logins: `admin` (gerenciamento) e `user01`–`user04` (TI, Hidráulica, Administrativo, Elétrica), senha igual ao usuário.
- **Departamentos são independentes**: só o setor executor e a gerência veem a operação interna. Quem abriu vê só status e setor atual.
- Setor **nunca** envia direto a outro setor. Só a gerência redireciona, marca Não aplicável ou cancela (com justificativa). Gerência **não define prioridade**.
- Aceite pelo setor com prioridade obrigatória e travada (Urgente 24 h, Alta 48 h, Média 72 h, Baixa 7 dias); 72 h para aceitar; novo prazo só com justificativa registrada; concluídas/canceladas/não aplicáveis são imutáveis.
- Quem abre a demanda **não escolhe** prioridade. Moderação de urgência e demanda vinculada foram **descartadas**.
- Chat, reabrir com citação, "visualizada" e responsável individual: **adiados** (não implementar).
- Limites padrão: título 60, descrição 500 caracteres (a confirmar com o grupo).
- As regras de negócio de 03/10 **ainda não foram votadas em ata** (rascunho em `docs/ATAS_RASCUNHO_27-09_e_02-10.md`).
- Layouts das telas existentes (Visão Geral, Detalhes, Atualizar etc.) são mantidos; só são ligados aos dados.
- Login: responsável na Ata 29/09 era o Pedro; o Bloco 1 cobre o login — alinhar com ele.

## Primeiro passo sugerido
Leia `CLAUDE.md`, `AGENTS.md`, este arquivo, `docs/PROMPT_BLOCOS.md` e `docs/REQUISITOS_REGRAS_DE_NEGOCIO.md`. Depois **mostre o plano do bloco** e espere a aprovação antes de editar.
