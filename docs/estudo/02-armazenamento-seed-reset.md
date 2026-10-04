# 02 — Armazenamento, semente (seed) e "Resetar dados"

## (a) O que faz
Guarda as demandas no próprio navegador (`localStorage`), começando de uma lista de exemplo (a "semente"). O botão "Resetar dados" volta tudo para os dados de exemplo, depois de pedir confirmação.

## (b) Onde está no código
| Arquivo | Função / parte |
|---|---|
| `src/data/seed-demandas.json` | as 13 demandas de exemplo, com datas no formato "há X horas" |
| `src/services/seed.js` | `criarSemente(agora)`: troca "há X horas" por datas reais |
| `src/services/storage.js` | `criarStorage` → `carregarDemandas`, `lerDemandas`, `criarDemanda`, `atualizarDemanda`, `resetarDados`; `obterStorage`; constantes `CHAVES` e `ERROS` |
| `src/services/reset.js` | `resetarComConfirmacao(confirmado, resetar)` |
| `src/hooks/useDemandas.js` | `useDemandas`: lê as demandas e mostra "carregando" e "erro" |
| `src/pages/Login.jsx` | botão "Resetar dados" + pop-up de confirmação |
| `src/components/EstadoDados.jsx` | `Carregando`, `ErroDados` (com "Resetar dados") e `SemPermissao` |

## (c) Como funciona
1. **Primeira vez:** `carregarDemandas` não acha a chave `demanda-de-aco:v1:demandas` e grava a semente gerada por `criarSemente`. As datas são calculadas **a partir de agora**.
2. **Depois:** toda leitura e gravação vai ao `localStorage`. Nenhuma tela mexe nele direto; só o `storage.js`.
3. Ao gravar (criar ou atualizar), a regra de negócio roda **de novo** com a demanda lida naquele momento; se a regra recusar, nada é gravado.
4. O número novo (DM-2014, DM-2015…) vem de um contador na chave `demanda-de-aco:v1:contador`.
5. **Resetar dados:** pede confirmação. "Voltar" ou Esc não apagam nada. Confirmar apaga as duas chaves (demandas e contador), e a próxima leitura recria a semente com datas novas. A sessão não é apagada.
6. **Dados estragados** (JSON inválido): `carregarDemandas` devolve erro `corrompido`, **não apaga sozinho**, e a tela mostra a mensagem com o botão "Resetar dados".
7. **Nada altera os arquivos JSON.** O navegador não consegue escrever em arquivos do projeto.

## (d) Demonstração em 1 minuto
1. Crie uma demanda (ver 03).
2. Recarregue (F5): ela continua lá.
3. Saia → "Resetar dados" → "Voltar": ela continua. "Resetar dados" → confirmar: aparece "Dados de demonstração restaurados." e ela some.
4. F12 → Application → Local Storage: mostre a chave `demanda-de-aco:v1:demandas`.

## (e) Perguntas prováveis
- **Por que `localStorage`?** O enunciado proíbe back-end e aceita "JSON ou equivalente". O JSON é só a semente; o `localStorage` guarda as mudanças (ADR-02).
- **Por que as datas são "há X horas"?** Para sempre haver demandas no prazo, a expirar e vencidas no dia da apresentação.
- **Por que os números mudam durante o dia?** Os prazos usam o relógio do navegador; com o tempo, uma demanda passa do prazo. Por isso: Resetar antes de demonstrar.
- **E se o `localStorage` estiver cheio ou bloqueado?** A gravação devolve erro e nada é dado como salvo (há teste: "cota cheia…").

## (f) O que não está pronto / limitações
- Dados presos a um navegador; outro computador não vê as mesmas demandas.
- Editável pelo F12 (não é segurança).
- O teste manual de "dados corrompidos pelo F12" **não foi executado**; está coberto só por teste automático (`storage.test.js`, "JSON corrompido devolve erro…").
