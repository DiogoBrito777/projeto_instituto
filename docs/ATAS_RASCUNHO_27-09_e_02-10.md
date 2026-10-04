# Rascunhos de ata — 27/09/2026 e 02/10/2026

> **Registro retroativo.** Estes rascunhos foram elaborados em 02/10/2026 **a partir do chat do grupo**; não existiam atas dessas datas. Devem ser **revisados e corrigidos por quem participou** antes de entrar no repositório. Campos `☐` não constam nas fontes e precisam ser confirmados. Ao publicar, mantenha a observação de que o registro é retroativo: isso é honesto e continua valendo como evidência.

---
# Ata de Reunião — 27/09/2026 (domingo)
**Meio:** Google Meet · **Horário:** definido por enquete (21h venceu); a discussão no chat começa por volta de 22h20 · **Elaborada com base:** chat do grupo
**Participantes:** mencionados no chat durante a reunião: Pedro, Vinícius, Kauã, Pietra · ☐ confirmar os demais (Bruno, Carlos, Raíssa)

## 1. Pauta
Dividir as páginas do projeto entre os integrantes (a reunião de 26/09 foi remarcada para dar tempo de terminar os designs).

## 2. Itens discutidos
- Pedro informou que seriam **6 páginas** e apresentou uma tela com o **nível de dificuldade** de cada uma; pediu que ninguém ficasse com duas páginas difíceis.
- Itens listados para escolha: detalhes da demanda com atualizar demanda; visão geral com nova demanda; lista das demandas; atualizar demanda.
- **Nova Demanda:** Kauã entendia que a página seria excluída; Vinícius defendeu que é essencial, embora sem serventia real por não haver back-end; Pedro respondeu que não seria (☐ confirmar a decisão).
- **Atualizar demanda:** esclarecido que é a página aberta pelo botão "atualizar demanda" na tela de Detalhe da Demanda (feita por Pietra).
- Pietra propôs juntar **Lista de demandas** e **Nova demanda**, já que a Visão Geral foi classificada como difícil.
- Vinícius sugeriu: Detalhes da demanda com Atualizar demanda; Visão geral com Nova demanda.

## 3. Encaminhamentos (conforme o chat)
- Pedro: infraestrutura do projeto, componentes e página de login (se der tempo).
- Demais grupos: Raíssa e Pietra; Vinícius e Carlos; Kauã e Bruno — escolheram entre os itens acima pelo grupo do WhatsApp.
- A divisão consolidada consta na **Ata de 29/09**.

## 4. Pendências
☐ Confirmar quem estava presente · ☐ Confirmar se Nova Demanda foi mantida · ☐ Registrar o prazo definido para as páginas.

---
# Ata de Reunião — 02/10/2026 (sexta-feira)
**Meio:** Google Meet · **Horário:** 20h (definido por enquete em 01/10) · **Elaborada com base:** chat do grupo
**Participantes:** ☐ confirmar (Raíssa informou que poderia ficar pelo menos 30 minutos)
**Material:** enunciado "Problema 01 — Versão Aluno" compartilhado durante a reunião.

## 1. Pauta (proposta por Vinícius em 01/10)
Alinhar **acessibilidade** e **telas de carregamento** e conferir o que já foi feito.

## 2. Pontos levantados por tela
**Nova demanda**
- Origem preenchida automaticamente (ou nem exibida); Destino em dropdown. *(Há duas redações no chat: uma diz que origem e destino devem ser dropdown/autopreenchidos; a outra, origem automática e destino dropdown. ☐ confirmar.)*

**Demandas**
- Deve haver campo para **selecionar e filtrar por departamento**.

**Detalhes da demanda**
- Campo **responsável** deve ser um **setor**; **solicitante** deve mencionar o **departamento**.
- Em "atribuir responsável", selecionar um **departamento**, não uma pessoa.

**Departamentos**
- Deve levar à tela de demandas apresentando as demandas **do departamento específico**.

## 3. O que falta implementar (segundo o enunciado, listado em reunião)
- Compatibilidade com **leitor de tela** e **navegação por teclado**.
- **WCAG e eMAG**, além de **auditorias manuais** de acessibilidade.
- **Pop-up de confirmação** de envio e **salvamento dos dados do formulário (em localStorage)** para posterior envio quando não houver conexão.
- Formulários com **rótulos, instruções e mensagens de validação** claras e compreensíveis (☐ definir o texto das mensagens).
- Estados de **carregamento, lista vazia, sucesso e erro**.

## 4. Decisão técnica registrada
Uso de **localStorage** para guardar os dados do formulário de envio, citado no chat durante a reunião. Relaciona-se ao requisito "nenhuma perda do formulário em caso de problema técnico" (Ata 15/09).

## 5. Pendências
☐ Responsáveis por cada item · ☐ Prazo · ☐ Lista oficial de status (G09 e ADR-08 de DOCUMENTACAO.md) · ☐ Data e horário da apresentação.

---
# Anexo — Linha do tempo de decisões (extraída do chat e das atas)
Para reconstruir o histórico e a rastreabilidade. Texto neutro, sem atribuir culpa.

| Data | Evento | Fonte |
|---|---|---|
| 01/09 | Aula conduzida pelo professor: ideias, questões, fatos e metas; levantamento inicial | Relatório 01/09 |
| 08/09 | Ata: árvore de acessos (a definir), prioridades, notificações, formulário, requisitos | Ata 08/09 |
| 14/09 | Sugerido usar uma IA (Manus) para ter noção do que entregar; reuniões fixadas às terças, 19h–21h, até o retorno do professor em outubro | Chat |
| 15/09 | Ata: tipos do sistema, ordem de atendimento, formulário, requisitos funcionais e não funcionais; documentação técnica gerada com apoio de IA e compartilhada como norte | Ata 15/09, chat, doc. técnico |
| 20/09 | Repositório criado e acessos compartilhados | Chat |
| 22/09 | Ata: Figma como guia, 5 telas + detalhe, "Acompanhamento Público" descartado, tarefas com prazo 26/09. Layout base criado no Figma Make; Pedro cria o Figma de design, shell do site e componentes | Ata 22/09, chat |
| 22/09 (noite) | Alteração no layout do Figma Make que servia de base; orientação de voltar a versão anterior (histórico de versões) | Chat |
| 25/09 | Esclarecido que o Figma de design serve para criar a interface e depois recriá-la em código; nova demanda com campo de texto no lugar do select de tipo, apontado como divergência do previsto | Chat |
| 26/09 | Reunião remarcada; telas mobile no Figma; Raíssa avisa que entrega no dia seguinte | Chat |
| 27/09 | Reunião de divisão das páginas (sem ata) | Chat |
| 29/09 | Ata: React.js e mais de um JSON; tarefas redistribuídas. Projeto React criado e enviado ao GitHub; README com instruções; "um JSON por página" informado no chat | Ata 29/09, chat |
| 30/09 | Lembrete de que o professor avaliará aspectos técnicos; uso de IA no desenvolvimento admitido pelo grupo | Chat |
| 01/10 | Kauã conclui a parte dele; Pietra adiciona a Visão Geral ao Git; convocada reunião para alinhar acessibilidade e estados de carregamento | Chat |
| 02/10 | Reunião de alinhamento (este documento) | Chat |

---
# Rascunho de ata — 03/10/2026 (proposta; confirmar presentes e votar)
**Origem:** análise do código do Git e alinhamento feito por um integrante. **Não é ata oficial** até a equipe revisar.

## Constatações (Git de 03/10)
Sem camada de dados; Detalhe e Atualizar fixos na DM-2048; sem login/perfis; "Sair" sem ação; auditoria automática (axe) aponta contraste insuficiente em todas as telas (`docs/evidencias/antes/`).

## Propostas a votar
1. **Perfis e logins:** `admin` (gerenciamento) e `user01`–`user04` (um por departamento), senha igual ao usuário.
2. **Departamentos independentes:** só o setor executor e a gerência veem a operação interna; quem abriu vê só status e setor atual.
3. **Aceite:** demanda chega como "Pendente de aceite"; o setor aceita definindo a prioridade (Urgente 24 h, Alta 48 h, Média 72 h, Baixa 7 dias), que fica travada; ou recusa com motivo.
4. **Gerência:** redireciona, marca "Não aplicável" ou cancela (com justificativa), cobra no histórico; **não define prioridade**; setor nunca envia direto a outro setor.
5. **Concluída, Não aplicável e Cancelada** são finais e imutáveis.
6. **Status (7):** Pendente de aceite, Em andamento, Aguardando (processamento interno), Em triagem, Concluída, Não aplicável, Cancelada.
7. **Dashboard** para todos os perfis, filtrado; lista com abas Recebidas/Solicitadas.
8. **Adiado (futuro):** chat, reabrir com citação, "visualizada", responsável individual.
9. **Entrega em blocos**, um PR por bloco, com revisão por pares e CHANGELOG.
10. **Tipo de atendimento "Outros"** no fim da lista de cada um dos 4 setores, para pedidos que não se encaixam nos tipos existentes (já implementado no Bloco 2; aplicado no código antes da votação).
11. **Limitação a 4 setores** (TI, Hidráulica, Administrativo, Elétrica). Pedido de uma área fora deles segue o fluxo existente: o setor devolve à triagem e a gerência redireciona ou marca "Não aplicável" com justificativa. Cadastro de novos setores é melhoria futura.
12. **Em triagem pertence à gerência (esclarece a RN11)** — ☐ a confirmar. Quando o setor recusa, a demanda vai para "Em triagem" e passa a ser da gerência: sai das listas, dos contadores e do acesso do setor que recusou (inclusive pela URL), e aparece para a gerência. O campo destino não muda (auditoria e futuro redirecionamento). Quem abriu continua vendo status e "Setor atual: Gerenciamento". Já implementado no Bloco 4, parte A, antes da votação.
13. **Em triagem e Pendente de aceite têm prioridade de atenção: destaque e ordem primeiro** — ☐ a confirmar. Selos "Em triagem · parada há X", "Aguardando aceite há X" e "Atrasada para …"; aviso no topo da Visão Geral; essas demandas vêm primeiro na ordem padrão das listas (a escolha do usuário em "Ordenar por" continua valendo). Já implementado no Bloco 4B, antes da votação.
14. **Prazo de 48h para aceitar e 24h para triar; hoje 72h na RN09** — ☐ a confirmar. A RN17 também diz 72 h para a triagem e recebeu a mesma nota. Passar do prazo só gera o selo; nenhuma outra consequência. Já implementado no Bloco 4B (constantes em `src/domain/atencao.js`), antes da votação. *Atualização (Bloco 4C): as 48 h valem para a demanda que nunca foi redirecionada; depois de um redirecionamento vale a proposta 15.*
15. **Redirecionamento pela gerência: novo prazo de aceite de 24h, com teto de 48h desde a abertura e 24h cheias se o teto já venceu** — ☐ a confirmar. A gerência escolhe o novo setor e o tipo de atendimento dele; a demanda volta a Pendente de aceite e o histórico registra setor e tipo. Caso-limite conhecido: redirecionada a poucos minutos do teto, o novo setor fica só com esses minutos. Já implementado no Bloco 4C, antes da votação.

## Pendências
☐ Quem revisa cada PR · ☐ Responsável pelo login (Ata 29/09: Pedro, "se der tempo") · ☐ Limites de caracteres · ☐ Horário da apresentação (terça, 06/10, à noite).
