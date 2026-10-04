# 03 — Nova Demanda

## (a) O que faz
Qualquer perfil registra uma demanda para outro setor: a origem e a data são automáticas, o destino é escolhido numa lista e o tipo depende do destino. Ao enviar com sucesso, abre o pop-up "Demanda enviada" com o número.

## (b) Onde está no código
| Arquivo | Função / parte |
|---|---|
| `src/pages/NovaDemanda.jsx` | a tela: `atualizar`, `handleSubmit`, pop-up "Demanda enviada" |
| `src/domain/novaDemanda.js` | `validarNovaDemanda`, `primeiroCampoComErro`, `montarNovaDemanda`, `origemDoUsuario`, `LIMITE_TITULO` (60), `LIMITE_DESCRICAO` (500) |
| `src/domain/setores.js` | `tiposDoSetor` (tipos de atendimento de cada setor) |
| `src/hooks/useAvisoLimite.js` + `src/domain/limites.js` | aviso "Limite de N caracteres atingido" |
| `src/components/ContadorLimite.jsx` | contador "N/limite caracteres" |
| `src/mensagens.js` | textos (`ERROS_NOVA_TEXTO`, `INSTRUCOES_NOVA`, `MENSAGENS.envioErro`…) |
| `src/services/storage.js` | `criarDemanda` (com a falha simulada `?falha=1`) |

## (c) Como funciona
1. **Origem:** `origemDoUsuario` usa o setor de quem está logado (gerência = "Gerenciamento"). O campo é só leitura.
2. **Destino:** a lista não inclui o próprio setor. Trocar o destino limpa o tipo.
3. **Rótulos:** dizem "(obrigatório)", e os campos têm `required` e `aria-required`. O formulário usa `noValidate`, para valerem as mensagens do próprio app, e não os balões do navegador.
4. **Limites:** título até 60 e descrição até 500 caracteres, travados por `maxLength`, com contador. Ao chegar no limite, ou ao colar texto maior, aparece um aviso lido pelo leitor de tela.
5. **Enviar:** `validarNovaDemanda` devolve os erros; a mensagem aparece junto de cada campo e o foco vai para o primeiro erro (`primeiroCampoComErro`).
6. Sem erros, `montarNovaDemanda` cria a demanda com status **Pendente de aceite**, prioridade **"Não definida"** (quem abre não escolhe: RN08) e o item "Demanda criada." no histórico.
7. `criarDemanda` grava com um número novo, e abre o pop-up "Demanda enviada" com o foco em "Ver demanda". Esc fecha e o foco volta ao botão de envio.
8. **Falha simulada:** abrindo `http://localhost:5173/?falha=1#nova-demanda`, a gravação falha de propósito. Aparece "Não foi possível enviar. Seus dados continuam salvos. Tente novamente.", o formulário continua preenchido e nada é criado.

## (d) Demonstração em 1 minuto
1. `user01` → Nova Demanda → "Criar Nova Demanda" vazio → 4 erros, foco no Destino.
2. Destino Elétrica → Tipo "Outros" → título e descrição → enviar → pop-up com o número.
3. Abra `http://localhost:5173/?falha=1#nova-demanda` (o `?falha=1` vem **antes** do `#`), envie → mensagem de erro e formulário mantido.

## (e) Perguntas de revisão
- **Por que não tem campo de prioridade?** Quem executa conhece a urgência real e define a prioridade no aceite (RN08, RN10).
- **Como o leitor de tela sabe do erro?** O erro fica ligado ao campo (`aria-describedby`), o campo fica `aria-invalid` e recebe o foco.
- **O que é o `?falha=1`?** Um gancho de teste para mostrar o estado de erro, já que não há servidor real que possa falhar.
- **Os dados se perdem se o envio falhar?** Não: o formulário continua preenchido. Mas **se recarregar a página, se perdem** (ver f).

## (f) O que não está pronto / limitações
- **Falha F1:** no celular real, acessando pelo IP da rede, o envio trava em "Enviando…". Causa não investigada (ver o arquivo 92).
- **Achado A13:** o erro "Escolha primeiro o destino." pode ficar no Tipo depois de escolher o Destino. Não foi confirmado se ainda ocorre.
- **O1:** o campo Origem (só leitura) recebe o foco com o texto selecionado.
- Sem modo offline, sem rascunho guardado e sem aviso de conexão (RF10 não atendido).
