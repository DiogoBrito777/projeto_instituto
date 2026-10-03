# Catálogo de mensagens e instruções (proposta — responde ao "determinar?" de 02/10)

Princípios: dizer **o que fazer**, não só "inválido"; texto junto ao campo (`aria-describedby`); foco no primeiro erro; resumo anunciado por `aria-live`; instrução do campo visível **antes** do erro. Revisar e aprovar em grupo.

## Nova Demanda
| Campo | Instrução (sempre visível) | Mensagem de erro |
|---|---|---|
| Origem | Preenchida automaticamente com o seu departamento. | — (somente leitura) |
| Destino | Escolha o departamento que deve resolver. | "Escolha o departamento de destino." |
| Tipo de atendimento | As opções dependem do destino escolhido. | "Escolha o tipo de atendimento." / "Escolha primeiro o destino." |
| Título | Resuma em até 60 caracteres. | "Informe um título." / "O título deve ter no máximo 60 caracteres." |
| Descrição | Conte o que aconteceu e onde. Até 500 caracteres. | "Descreva a demanda para que o setor possa atender." / "A descrição deve ter no máximo 500 caracteres." |

## Login
| Situação | Mensagem |
|---|---|
| Usuário vazio | "Informe o seu usuário." |
| Senha vazia | "Informe a sua senha." |
| Credencial errada | "Usuário ou senha incorretos. Confira e tente de novo." (sem dizer qual dos dois está errado) |
| Sessão não pôde ser gravada (**proposta, Bloco 1**) | "Não foi possível entrar agora. Recarregue a página e tente de novo." |

## Dados de demonstração (**proposta, Bloco 1** — revisar em grupo)
| Situação | Mensagem |
|---|---|
| Dados salvos corrompidos | "Os dados salvos neste aparelho estão com problema. Clique em Resetar dados para voltar aos dados de demonstração." |
| Armazenamento indisponível | "Não foi possível acessar os dados deste aparelho. Verifique se o navegador permite armazenamento local." |
| Reset concluído | "Dados de demonstração restaurados." |
| Reset falhou | "Não foi possível resetar os dados. Recarregue a página e tente de novo." |

## Aceite, recusa e encerramento
| Situação | Mensagem |
|---|---|
| Aceitar sem prioridade | "Escolha a prioridade para aceitar a demanda." |
| Pop-up do aceite | "Você vai aceitar com prioridade [X]. O prazo será de [Y]. A prioridade não poderá ser alterada depois. Confirmar?" |
| Recusar sem motivo | "Explique por que esta demanda não é do seu setor." |
| Redirecionar sem escolher setor | "Escolha o departamento que deve receber a demanda." |
| Não aplicável / Cancelar sem justificativa | "Informe a justificativa." |
| Novo prazo sem justificativa | "Informe a justificativa para o novo prazo." |
| Cobrança / resposta vazia | "Escreva a mensagem." |
| Demanda finalizada | "Esta demanda foi finalizada e não pode mais ser alterada." |

## Estados e avisos (anunciados por `aria-live`)
| Estado | Mensagem |
|---|---|
| Carregando | "Carregando demandas…" |
| Lista vazia | "Nenhuma demanda encontrada. Tente outra busca ou outro departamento." |
| Envio com sucesso | "Demanda DM-XXXX enviada com sucesso." |
| Envio com erro | "Não foi possível enviar. Seus dados continuam salvos. Tente novamente." |
| Offline | "Você está sem conexão. A demanda foi salva neste aparelho e será enviada quando a conexão voltar." |
| Reconectado | "Conexão restabelecida. Enviando demandas pendentes…" |
| Sem permissão | "Demanda não encontrada ou sem permissão." |
