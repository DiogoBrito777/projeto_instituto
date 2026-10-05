# 17 — Guia de autoavaliação e cola de uma página

> A apresentação é conduzida pelo professor, que pode perguntar qualquer coisa a qualquer integrante, sem ordem. Por isso **cada pessoa deve conseguir responder sozinha** às perguntas de revisão abaixo.
> - Para demonstrar o app, use o roteiro `91-ROTEIRO-DA-APRESENTACAO.md`.
> - Os números citados foram conferidos em 04/10/2026.

## 1. Como usar este guia
1. Cubra a coluna "Resposta" e tente responder em voz alta, em uma ou duas frases.
2. Confira a resposta. Se errou ou hesitou, leia o arquivo indicado.
3. Repita até acertar todas. Ensaie também com outra pessoa perguntando fora de ordem.

## 2. Perguntas de revisão (38)
### Visão geral e arquitetura
| # | Pergunta | Resposta | Conferir em |
|---|---|---|---|
| 1 | Que problema o sistema resolve? | Pedidos entre setores se perdiam; agora há um lugar só para registrar, aceitar, triar e acompanhar. | 90 |
| 2 | Tem back-end? | Não: o enunciado proíbe. Tudo roda no navegador. | 00, 90 |
| 3 | Com o que foi feito? | React 19 com Vite. A tela é escrita em JSX. | 11 |
| 4 | Por onde o app começa? | `index.html` → `src/main.jsx` (monta o React) → `src/App.jsx` (escolhe a tela). | 11 |
| 5 | Como o app troca de tela sem biblioteca de rotas? | Pelo hash do endereço (`#demandas`…). `App.jsx` escuta o evento `hashchange` e `getPageFromHash` escolhe a tela. | 11, 16 |
| 6 | O que é um componente e o que são props? | Componente é uma função que devolve um pedaço de tela. Props são os dados que ele recebe de quem o usa. | 11 |
| 7 | O que é estado (`useState`)? | Um valor que a tela lembra; quando muda, a tela é redesenhada. Ex.: o texto da busca. | 11, 14 |
| 8 | Onde ficam as regras de negócio? | Em `src/domain/`, em funções puras (sem tela e sem armazenamento), cada uma com um `.test.js`. | 00, 09 |

### Dados e armazenamento
| # | Pergunta | Resposta | Conferir em |
|---|---|---|---|
| 9 | Onde os dados ficam? | No `localStorage` do navegador. A sessão fica no `sessionStorage`. | 02, 12 |
| 10 | Quem grava no `localStorage`? | Só `src/services/storage.js`. Nenhuma tela grava direto. | 12 |
| 11 | O JSON muda quando crio uma demanda? | Não. O JSON é só a semente; as mudanças vão para o `localStorage`. | 12 |
| 12 | Quantas demandas há na semente e qual o próximo número depois do reset? | 13 (DM-2001 a DM-2013); a próxima nova é a DM-2014. | 12 |
| 13 | O que o "Resetar dados" apaga? | As chaves de demandas e de contador. Não apaga a sessão nem os arquivos JSON. | 02, 12 |
| 14 | Por que os números da Visão Geral mudam com o tempo? | As datas da semente são "há X horas" a partir do reset, e os prazos usam o relógio. | 12, 90 |
| 15 | E se os dados salvos estiverem corrompidos? | O app mostra uma mensagem com "Resetar dados" e não apaga nada sozinho. | 12 |

### Login e permissões
| # | Pergunta | Resposta | Conferir em |
|---|---|---|---|
| 16 | Como funciona o login? | `auth.js` confere em `usuarios.json` e grava a sessão, sem a senha. | 01 |
| 17 | O login é seguro? | Não: é simulação. As senhas estão em texto. Num sistema real haveria servidor, senha com hash e token. | 01, 12 |
| 18 | O que acontece sem login? | Qualquer endereço leva para `#login`. | 01, 16 |
| 19 | Quem vê o quê? | A gerência vê tudo. O setor vê completo o que recebe e só um resumo do que abriu (RN02/RN03). | 06, 16 |
| 20 | Por que a busca não procura na prioridade nem no histórico? | Quem só abriu a demanda não vê esses campos; a busca não pode revelá-los. | 14 |

### Regras e status
| # | Pergunta | Resposta | Conferir em |
|---|---|---|---|
| 21 | Qual o primeiro status de uma demanda? | Pendente de aceite, com prioridade "Não definida". | 03, 16 |
| 22 | Quem define a prioridade e quando? | O setor que executa, ao aceitar (RN08/RN10). | 06 |
| 23 | O que acontece na recusa? | O motivo é obrigatório e a demanda vai para "Em triagem", que é da gerência. | 06 |
| 24 | O que a gerência pode fazer na triagem? | Redirecionar (setor, tipo e justificativa), marcar Não aplicável ou Cancelar (com justificativa). | 06, 16 |
| 25 | Qual o prazo para aceitar? | 48 h (proposta; o texto da RN09 diz 72 h). Depois de redirecionada: 24 h. | 06, 15 |
| 26 | Qual o prazo de resolução? | Contado do aceite: Urgente 24 h, Alta 48 h, Média 72 h, Baixa 7 dias (RN13). | 15 |
| 27 | O que é "A expirar" e "Vencida"? | A expirar: resta 25% do prazo ou menos. Vencida: o prazo passou (RN15). | 15 |
| 28 | Quais status são finais? | Concluída, Não aplicável e Cancelada. Não mudam mais (RN20). | 16 |
| 29 | Onde fica a lista de mudanças de status permitidas? | `TRANSICOES` em `src/domain/status.js`. | 16 |

### Telas, filtros e destaques
| # | Pergunta | Resposta | Conferir em |
|---|---|---|---|
| 30 | Como o card da Visão Geral leva à lista filtrada? | O card é um link (`#demandas?filtro=...`); `App.jsx` lê o parâmetro e `Demandas.jsx` aplica `filtrarPorPainel`. | 15 |
| 31 | Por que o número do card bate com a lista? | O mesmo teste (`FILTROS_DO_PAINEL`) conta e filtra; há testes automáticos para isso. | 15 |
| 32 | Em que ordem a tela Demandas aplica os filtros? | Permissão/aba → filtro do card → status → busca → ordenação → pendentes no topo → paginação (6 por página). | 14 |
| 33 | O que é a faixa "Precisa de atenção"? | Mostra as demandas paradas esperando alguém (triagem e pendentes de aceite), com link para a lista. | 15 |

### Acessibilidade, testes e limitações
| # | Pergunta | Resposta | Conferir em |
|---|---|---|---|
| 34 | O que o pop-up acessível faz? | O foco entra e fica preso nele, o Esc fecha e o foco volta ao botão que abriu (`Dialogo.jsx`). | 07 |
| 35 | Que cuidados de acessibilidade foram tomados? | Foco visível, foco no título a cada tela, contraste 4,5:1 (texto) e 3:1 (bordas), fonte mínima de 14 px. Lighthouse 100/100 na Visão Geral e na Nova Demanda (admin, desktop). | 08, 13 |
| 36 | Quantos testes automáticos existem e o que cobrem? | 245 (Vitest), em 04/10. Cobrem regras e armazenamento, não cliques na tela. | 09 |
| 37 | Qual a principal falha conhecida? | F1: no celular, pelo IP da rede, o envio trava em "Enviando…". A causa não foi confirmada; há só uma hipótese. | 92 |
| 38 | O app está publicado na internet? | Não. Não há deploy configurado; roda localmente com `npm run dev`. | `package.json`, `vite.config.js`, `.github/` |

## 3. Como responder com honestidade
- **Se souber:** responda curto e diga onde está no código ou na documentação.
- **Se não tiver certeza:** "Não tenho certeza; está registrado em `docs/DOCUMENTACAO.md` (ou `docs/TESTES_PENDENTES.md`) e posso mostrar."
- **Se não foi testado:** diga "não foi testado", nunca "funciona".
- **Se é proposta:** diga que é proposta e que precisa de aprovação (ex.: 48 h para o aceite).
- **Se é falha conhecida:** diga o que acontece, o impacto e a causa, se ela foi confirmada (arquivo 92).

## 4. Cola de uma página
**Arquitetura em 5 linhas**
1. `src/main.jsx` monta o React; `src/App.jsx` lê o endereço (hash) e escolhe a tela.
2. `src/pages/` tem as telas; `src/components/` tem as partes reutilizáveis.
3. `src/domain/` tem as regras, em funções puras, cada uma com testes.
4. `src/services/storage.js` é o **único** que grava no `localStorage`; `src/services/auth.js` cuida da sessão.
5. `src/hooks/` (`useDemandas`, `useSessao`) ligam as telas aos serviços.

**Os 5 usuários (senha = usuário)**
- `admin`: gerência;
- `user01`: TI;
- `user02`: Hidráulica;
- `user03`: Administrativo;
- `user04`: Elétrica.

**Números-chave**
- **245** testes automáticos (em 04/10);
- **13** demandas na semente (DM-2001 a DM-2013);
- depois de um reset, a primeira nova é a DM-2014;
- Lighthouse de acessibilidade **100/100** na Visão Geral e na Nova Demanda (admin, desktop). As outras telas não foram medidas.
- Limites: título 60 e descrição 500 caracteres; 6 demandas por página.

**Prazos**
- Aceite: 48 h (proposta), ou 24 h depois de redirecionada.
- Triagem: 24 h (proposta).
- Resolução: 24 h / 48 h / 72 h / 7 dias, conforme a prioridade.
- A expirar: resta 25% do prazo ou menos.
- Aguardando: mais de 7 dias.
