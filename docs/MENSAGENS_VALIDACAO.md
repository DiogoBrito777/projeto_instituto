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

Acréscimos do Bloco 2B (**proposta** — revisar em grupo):
- Origem: a instrução ganhou a frase "Data e hora são registradas no envio." (RN07: data automática).
- Destino igual ao próprio setor: "Escolha um departamento diferente do seu." (a lista já não oferece o próprio setor; a mensagem cobre a regra no domínio).
- Título e Descrição mostram o contador "N/60 caracteres" e "N/500 caracteres".
- Campos travados no limite (Título 60, Descrição 500, Observação 500), com aviso anunciado (`role="status"`): ao chegar ao limite, "Limite de N caracteres atingido."; ao colar texto maior que o espaço, "Limite de N caracteres atingido. O texto foi cortado."
- Botão durante o envio: "Enviando…". Pop-up de sucesso: título "Demanda enviada" + "Demanda DM-XXXX enviada com sucesso." com os botões "Ver demanda" e "Criar outra".

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

## Atualizar demanda (**proposta, Bloco 2A** — revisar em grupo)
| Situação | Mensagem |
|---|---|
| Perfil sem ação disponível naquele status | "Você pode consultar esta demanda, mas não há alterações disponíveis para o seu perfil neste status." |
| Salvar sem mudar nada | "Nenhuma alteração para salvar." |
| Erro ao salvar | "Não foi possível salvar. Suas alterações continuam no formulário. Tente novamente." |
| Botão durante a gravação | "Salvando…" |
| Observação (instrução visível) | Rótulo "Observação (opcional)" + contador "N/500 caracteres" |
| Observação acima do limite | "A observação deve ter no máximo 500 caracteres." |

## Aceite e recusa na tela Atualizar (**proposta, Bloco 4-A** — revisar em grupo)
Usam os textos já aprovados da seção abaixo ("Aceitar sem prioridade", "Pop-up do aceite", "Recusar sem motivo"); [Y] = "24 horas", "48 horas", "72 horas" ou "7 dias". Acréscimos:
| Situação | Texto |
|---|---|
| Botão em Detalhes (executor, demanda pendente) | "Aceitar ou recusar" |
| Botões na tela Atualizar | "Aceitar demanda", "Recusar demanda", "Voltar"; no pop-up: "Confirmar aceite" / "Confirmar recusa" e "Cancelar" |
| Pop-up da recusa (explicação) | "A demanda vai para a triagem do Gerenciamento, que decide o destino." |
| Campo do pop-up da recusa | Rótulo "Motivo da recusa (obrigatório)" + contador "N/500 caracteres" |
| Motivo acima do limite | "O motivo deve ter no máximo 500 caracteres." |

## Triagem pela gerência na tela Atualizar (**proposta, Bloco 4C** — revisar em grupo)
Usam os textos já aprovados da seção abaixo ("Redirecionar sem escolher setor", "Não aplicável / Cancelar sem justificativa", "Demanda finalizada"). Acréscimos:
| Situação | Texto |
|---|---|
| Botão em Detalhes (gerência, demanda em triagem) | "Triar demanda" |
| Botões na tela de triagem | "Redirecionar", "Marcar como não aplicável", "Cancelar demanda", "Voltar" |
| Campos do redirecionamento | "Novo departamento (obrigatório)" e "Tipo de atendimento (obrigatório)"; antes de escolher o setor, o tipo mostra "Escolha primeiro o departamento" |
| Redirecionar sem escolher o tipo | "Escolha o tipo de atendimento do novo departamento." |
| Pop-up do redirecionamento | "A demanda vai para [setor], com o tipo "[tipo]", e volta a Pendente de aceite. O setor terá até [data e hora] para aceitar. Confirmar?" — botões "Voltar" / "Confirmar redirecionamento" |
| Pop-up de Não aplicável | "A demanda será encerrada como "Não aplicável" (nenhum setor tem competência) e não poderá mais ser alterada." — botões "Voltar" / "Confirmar não aplicável" |
| Pop-up de Cancelar | "A demanda será cancelada e não poderá mais ser alterada." — botões "Voltar" / "Confirmar cancelamento" (não "Cancelar", para não confundir com a própria ação) |
| Campo dos pop-ups de encerramento | Rótulo "Justificativa (obrigatória)" + contador "N/500 caracteres" |
| Justificativa acima do limite | "A justificativa deve ter no máximo 500 caracteres." |

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
