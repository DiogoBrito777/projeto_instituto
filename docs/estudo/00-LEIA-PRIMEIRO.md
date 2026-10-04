# Material de estudo — Demanda de Aço (LEIA PRIMEIRO)

> Para quem **não escreveu o código** conseguir explicar na apresentação (terça, 06/10/2026, à noite).
> Tudo aqui cita arquivos e funções que existem de verdade no projeto (conferido em 04/10/2026). Se algo não estiver pronto, está escrito.

## Como usar este material
1. Leia este arquivo inteiro (10 min).
2. Escolha a parte que você vai apresentar e leia o arquivo dela (01 a 10).
3. Rode o app e faça a "demonstração em 1 minuto" do seu arquivo.
4. Leia as perguntas rápidas (`90-PERGUNTAS-RAPIDAS.md`) e as falhas conhecidas (`92-FALHAS-CONHECIDAS-PARA-FALAR.md`).
5. Ensaie com o roteiro (`91-ROTEIRO-DA-APRESENTACAO.md`).

## Índice
| Arquivo | Assunto |
|---|---|
| `01-login-e-sessao.md` | Login simulado, sessão, Sair, guarda de rotas |
| `02-armazenamento-seed-reset.md` | Onde os dados ficam, a semente (seed) e o "Resetar dados" |
| `03-nova-demanda.md` | Formulário, validação, limites 60/500, `?falha=1`, pop-up "Demanda enviada" |
| `04-demandas-lista.md` | Abas, busca, filtros, ordenação, paginação |
| `05-visao-geral-e-filtro-para-demandas.md` | Painel, aviso "Precisa de atenção" e como o card leva a Demandas já filtrada |
| `06-aceite-recusa-triagem-atualizar.md` | Regras de negócio: aceite, recusa, triagem, redirecionar, cancelar, atualizar |
| `07-dialogo-acessivel.md` | O pop-up acessível (foco preso, Esc, foco de volta) |
| `08-acessibilidade.md` | O que foi feito de acessibilidade e as evidências |
| `09-testes.md` | Testes automáticos (Vitest) e testes manuais |
| `10-processo-git.md` | Branches, PRs, como o trabalho foi organizado |
| `90-PERGUNTAS-RAPIDAS.md` | 26 perguntas prováveis com resposta curta |
| `91-ROTEIRO-DA-APRESENTACAO.md` | Roteiro de 8 a 10 minutos |
| `92-FALHAS-CONHECIDAS-PARA-FALAR.md` | Como falar das falhas e do que não foi feito |

## Mapa do projeto (pastas)
| Pasta / arquivo | Para que serve |
|---|---|
| `src/main.jsx` | Ponto de entrada: monta o React e importa os CSS (o `fonte-minima.css` por último) |
| `src/App.jsx` | "Roteador": lê o endereço (`#visao-geral`, `#demandas`…), protege as telas sem login, move o foco para o título |
| `src/pages/` | As telas: `Login`, `VisaoGeral`, `Demandas`, `Departamentos`, `NovaDemanda`, `DetalhesDemanda`, `AtualizarDemanda`, `TriagemDemanda` |
| `src/components/` | Pedaços reutilizáveis: `Sidebar`, `Dialogo`, `EstadoDados`, `ContadorLimite` e as partes da Visão Geral (`VisaoGeral*.jsx`) |
| `src/domain/` | **As regras de negócio**, em funções puras (sem tela, sem armazenamento): `permissoes.js`, `status.js`, `acoes.js`, `prazos.js`, `atencao.js`, `listas.js`, `novaDemanda.js`, `prioridades.js`, `setores.js`, `limites.js`. Cada uma tem um `.test.js` |
| `src/services/` | Armazenamento (`storage.js`), semente (`seed.js`), login (`auth.js`), reset com confirmação (`reset.js`) |
| `src/hooks/` | Ligam as telas aos serviços: `useDemandas`, `useSessao`, `useAvisoLimite` |
| `src/data/` | JSON: `seed-demandas.json` (semente), `usuarios.json`, `departamentos.json`. **`demandas.json` e `VisaoGeral.json` são antigos e não são mais usados** |
| `src/mensagens.js`, `src/formatos.js` | Textos das mensagens; formatação de datas e plural |
| `docs/` | Documentação: requisitos, CHANGELOG, testes, evidências e este material |

## Como rodar (no CMD, dentro da pasta do projeto)
```cmd
npm install
npm run dev
```
Abra `http://localhost:5173`. Outros comandos:
- `npm test`: roda os testes automáticos (245, em 04/10);
- `npm run lint`: procura erros de código;
- `npm run build`: gera a versão final.

## Usuários de teste (senha = usuário)
| Usuário | Perfil | Setor |
|---|---|---|
| `admin` | gerenciamento | — |
| `user01` | departamento | TI (`tecnologia`) |
| `user02` | departamento | Hidráulica |
| `user03` | departamento | Administrativo |
| `user04` | departamento | Elétrica |

## O que é simulado (diga isso logo no começo)
- **Não há back-end.** O enunciado proíbe; tudo roda no navegador.
- Dados no **`localStorage`** do navegador, partindo de uma semente em JSON. Sessão no **`sessionStorage`**.
- Login fictício: as senhas estão em texto num JSON. **Não é segurança, é simulação.**
- Antes de demonstrar, sempre: tela de login → **"Resetar dados"** → confirmar.
