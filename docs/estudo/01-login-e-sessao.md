# 01 — Login e sessão

## (a) O que faz
Só deixa usar o sistema quem entrou com um dos 5 usuários de teste, e cada usuário vê só o que o perfil dele permite. "Sair" encerra a sessão; sem sessão, qualquer endereço volta para o login.

## (b) Onde está no código
| Arquivo | Função / parte |
|---|---|
| `src/services/auth.js` | `criarAuth` → `entrar`, `sair`, `usuarioLogado`; `obterAuth` |
| `src/hooks/useSessao.js` | `useSessao` (guarda o usuário logado no estado do React) |
| `src/pages/Login.jsx` | formulário de login e mensagens de erro |
| `src/App.jsx` | guarda de rotas (efeito que chama `window.location.replace('#login')`) |
| `src/components/Sidebar.jsx` | mostra o usuário logado e o botão Sair (`onSair`) |
| `src/data/usuarios.json` | os 5 usuários (senha = usuário) |

## (c) Como funciona
1. A pessoa digita usuário e senha. `Login.jsx` confere se os campos estão preenchidos; se não, mostra o erro junto do campo e põe o foco nele.
2. `entrar` (em `auth.js`) procura no `usuarios.json`. Se não achar, devolve `credenciais`, e a tela mostra "Usuário ou senha incorretos. Confira e tente de novo." (mesma mensagem para usuário e senha errados, para não revelar qual falhou).
3. Se achar, grava no `sessionStorage`, na chave `demanda-de-aco:v1:sessao`, **só** usuário, nome, perfil e departamento. **A senha nunca é gravada.**
4. `App.jsx`: sem usuário, qualquer tela vai para `#login`; com usuário, `#login` vai para `#visao-geral`. Usa `location.replace`, então o botão Voltar não reabre telas protegidas depois de Sair.
5. Sair: `sair` apaga a chave da sessão. Fechar o navegador também encerra, porque `sessionStorage` vive só enquanto a aba está aberta.

## (d) Demonstração em 1 minuto
1. Login com `admin` / `x` → aparece a mensagem de erro.
2. Login com `admin` / `admin` → Visão Geral.
3. Clique em Sair (no menu lateral) → volta ao login.
4. Entre com `user03` → o menu mostra "Equipe Administrativa".

## (e) Perguntas de revisão
- **Onde fica a senha?** Em `usuarios.json`, em texto. É simulação; num sistema real, ficaria guardada como hash, num servidor.
- **Por que `sessionStorage` e não `localStorage`?** Para a sessão acabar ao fechar a aba. As demandas ficam no `localStorage` porque precisam continuar.
- **Dá para burlar?** Sim: editando o `sessionStorage` pelo F12. Está documentado como limitação (DOCUMENTACAO, seção 20.4).
- **O que acontece se eu digitar um endereço sem estar logado?** `App.jsx` manda para `#login`.

## (f) O que não está pronto / limitações
- Não há autenticação real, criptografia nem servidor.
- O teste "Sair e depois Voltar do navegador" **não está registrado** como executado à parte (TESTES 1.5); o código usa `location.replace` para isso.
- Não existe teste automático de `auth.js`.
