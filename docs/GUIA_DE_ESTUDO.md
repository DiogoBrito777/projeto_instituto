# Guia de estudo — entender o projeto para explicar ao professor

> Texto para quem vai apresentar. Está escrito para aprender, não para decorar. Os arquivos mencionados com `src/...` são os do projeto; os que o agente criar nos blocos ganham explicação própria em `docs/EXPLICACAO_BLOCO<N>.md`.

## 1. O que o projeto é, em 4 frases
É uma aplicação **só de front-end** (roda no navegador, sem servidor). As telas são feitas em **React**. Os dados de exemplo vêm de arquivos **JSON** e, depois, ficam guardados no **localStorage** do navegador. Quem entra (login) define **o que vê e o que pode fazer**.

## 2. React: o mínimo que você precisa saber
- **Componente** = uma função que devolve um pedaço de tela (JSX). Ex.: `Sidebar`, `Demandas`.
- **Props** = dados que o pai passa ao filho (como parâmetros de função).
- **Estado (`useState`)** = memória do componente. Quando muda, a tela redesenha. Ex.: o texto digitado na busca.
- **Efeito (`useEffect`)** = código que roda *depois* de desenhar, para falar com o "mundo de fora" (ex.: escutar `hashchange`, ler dados).
- **Lista** = `array.map(...)` gera um item por elemento, com `key` única.
- **Condicional** = `cond ? A : B` ou `cond && A` mostra uma coisa ou outra.

## 3. Rotas por hash (`src/App.jsx`)
O endereço `#demandas` ou `#demanda/DM-2048` fica depois do `#`. O `App` lê `window.location.hash` (função `getPageFromHash`), guarda a página no estado e escuta o evento `hashchange` para trocar de tela sem recarregar. Vantagem: simples, sem biblioteca. Cuidado: a gente precisa **mover o foco e atualizar o título** a cada troca, por acessibilidade.

## 4. Dados: JSON como semente + localStorage
1. O `.json` é só a **semente** (dados iniciais). O navegador **não consegue gravar** de volta no arquivo.
2. Na primeira vez (`localStorage.getItem(chave) === null`), copiamos o JSON para o `localStorage`.
3. Depois, **toda leitura e escrita** é no `localStorage` (texto; usamos `JSON.stringify`/`JSON.parse`).
4. A chave tem versão (`...:v1:...`) para podermos trocar a semente. Há um "Resetar dados".
5. Limites: ~5 MB, só texto, editável no DevTools → **serve para demonstração, não para segurança**.
6. A camada `storage.js` é o único lugar que mexe no `localStorage`; as telas pedem dados por ali. Se um dia houver servidor, só essa camada muda.
7. O atraso curto e a falha simulável (`?falha=1`) existem para mostrar os estados de **carregando** e **erro**, exigidos no enunciado.

## 5. Funções puras e por que testamos
Uma **função pura** sempre devolve o mesmo resultado para a mesma entrada e não mexe em nada fora dela. As regras (quem pode ver, quais status podem vir depois, se o prazo venceu) ficam em funções puras em `src/domain/`. Assim:
- dá para **testar sem abrir o navegador** (`npm test`);
- a regra existe **num lugar só**; a tela apenas pergunta "posso?";
- esconder um botão **não é** regra de acesso; a regra é a função (e a rota também a consulta).
O "agora" entra como parâmetro para os testes não dependerem do relógio.

## 6. As regras do sistema em uma página
- Perfis: `admin` (gerenciamento) e `user01`–`user04` (um por setor).
- **Cada setor vê só o que é dele**; quem abriu vê só status e setor atual; a gerência vê tudo.
- Demanda nasce **Pendente de aceite**. O setor **aceita definindo a prioridade** (ela fica travada) ou **recusa com motivo**.
- Prazo por prioridade: Urgente 24 h, Alta 48 h, Média 72 h, Baixa 7 dias. O setor pode registrar novo prazo **com justificativa**.
- Só a gerência redireciona, marca Não aplicável ou cancela. **Concluída/Cancelada/Não aplicável: ninguém altera.**
Detalhes e critérios: `docs/REQUISITOS_REGRAS_DE_NEGOCIO.md`.

## 7. Acessibilidade: o que cada coisa faz
- **`<label>` ligado ao campo**: o leitor de tela diz o nome do campo; clicar no texto foca o campo.
- **Foco visível**: quem usa só teclado precisa ver onde está (WCAG 2.4.7).
- **Contraste ≥ 4,5:1** para texto normal (WCAG 1.4.3): quem enxerga mal consegue ler. Medimos com o axe; a auditoria "antes" achou 24 combinações reprovadas.
- **`aria-live`**: o leitor de tela anuncia mudanças (ex.: "3 demandas encontradas", erros) sem o foco ir até lá.
- **Um `<h1>` por tela** e títulos em ordem: dá o mapa da página.
- **Skip link**: "pular para o conteúdo", para não tabular pelo menu toda vez.
- **Diálogo (pop-up)**: o foco entra, fica preso dentro, Esc fecha e o foco volta ao botão que abriu.
- **Mensagem de erro junto ao campo** (`aria-describedby`) e foco no primeiro erro.
- Auditoria automática pega só parte dos problemas; **por isso há teste manual** (teclado e leitor de tela).

## 8. Git e o processo (20% da nota)
- **Branch** por bloco → **commits pequenos** com mensagem clara → **Pull Request** com revisão de outra pessoa → **merge** → tag da versão.
- Cada commit liga a um requisito (RF/RN/CA). O `CHANGELOG` conta o que mudou e por quê.
- Uso de IA: registrar no PR (ferramenta usada e quem revisou).

## 9. Perguntas prováveis (e respostas curtas)
1. **Por que React?** Decidido por votação (Ata 29/09): componentes reutilizáveis e domínio da equipe.
2. **Por que localStorage e não só o JSON?** O navegador não grava no arquivo; o JSON é a semente e o localStorage guarda as alterações. É a "solução equivalente" a um banco, permitida pelo enunciado.
3. **Isso é seguro?** Não: é simulação para o MVP; perfil e dados são editáveis no navegador. Com back-end, a autenticação e a autorização passam a ser do servidor.
4. **Como o sistema sabe o que cada usuário pode ver?** Pelo perfil e setor da sessão, passando por `podeVer`/`resumoParaSolicitante` em `src/domain/permissoes.js`; a rota também consulta essa função.
5. **O que acontece se a internet cair ao enviar?** O formulário vai para "Pendentes de envio" e é enviado quando a conexão volta; o rascunho não se perde.
6. **Como o prazo é calculado?** Pela prioridade escolhida no aceite (24 h/48 h/72 h/7 dias), a partir do aceite; funções puras recebem o "agora" por parâmetro.
7. **Por que o setor não pode mandar a demanda direto a outro setor?** Departamentos são independentes; só a gerência redireciona, para ninguém ver a operação interna do outro.
8. **O que é acessibilidade na prática aqui?** Navegação por teclado, foco visível, contraste, rótulos, anúncios por `aria-live`, foco gerenciado em rotas e diálogos.
9. **Como vocês verificaram?** Auditoria automática com axe (antes e depois), teste manual de teclado e leitor de tela, e testes automáticos das regras (`npm test`). **Só diga o que foi de fato executado.**
10. **O que ficou de fora e por quê?** Chat, reabrir com citação, "visualizada", responsável individual: especificados, não implementados por prazo (ver `DOCUMENTACAO.md`, seção 18).

## 10. Como estudar em 1 hora
1. Rode o app (`npm install`, `npm run dev`) e entre com os 5 usuários.
2. Leia `docs/EXPLICACAO_BLOCO1.md` e abra os arquivos citados, um por vez.
3. Mude **uma coisa pequena** (um texto, uma cor) e veja o efeito; depois volte (`git restore`).
4. Responda em voz alta às perguntas da seção 9, sem olhar.
