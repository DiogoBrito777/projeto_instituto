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

## 9. Perguntas que podem aparecer (por assunto)

> Não é roteiro para decorar. Cada resposta diz **onde conferir no código**. Se você não souber, diga "não tenho certeza, mas posso abrir o arquivo e mostrar". A lista completa de perguntas curtas está em `docs/estudo/90-PERGUNTAS-RAPIDAS.md`.

### O projeto e as escolhas
- **Qual problema o sistema resolve?** Demandas entre setores chegavam por vários caminhos e se perdiam. Agora há um lugar só para registrar, enviar e acompanhar. *(README e DOCUMENTACAO, seção 1.)*
- **Por que React?** Pela reutilização de componentes. O domínio de React no grupo era limitado; por isso a estrutura inicial foi montada com auxílio de IA em 29/09, a partir dos wireframes do Figma Design e dos documentos que o grupo já tinha, para haver um projeto visível. Depois, as implementações seguiram na mesma stack. *(ADR-01.)*
- **Por que não há back-end?** O enunciado pede dados simulados em JSON ou equivalente. *(DOCUMENTACAO, ADR-02 e seção 20.)*
- **Onde ficam os dados?** O JSON é a semente. A partir da primeira carga, tudo é lido e gravado no `localStorage` do navegador, só por `src/services/storage.js`. Cada navegador tem os seus dados; "Resetar dados" volta ao início.

### Regras do sistema
- **Quem pode ver e fazer o quê?** Depende do papel na demanda (solicitante, executor ou gerência). A regra fica em `src/domain/permissoes.js`; as telas só consultam.
- **O que acontece quando o setor recusa?** A demanda vai para a triagem e passa a ser da gerência, que redireciona, marca como Não aplicável ou cancela, sempre com justificativa. Setor nenhum manda direto para outro. *(`status.js`, `acoes.js`.)*
- **Como o prazo é calculado?** Depois do aceite, pela prioridade: Urgente 24 h, Alta 48 h, Média 72 h, Baixa 7 dias *(`prioridades.js`)*. Para aceitar, o app usa 48 h, e 24 h depois de um redirecionamento *(`atencao.js`)*. Esses números são propostas ainda sem voto, e os documentos antigos (RN09, RN17) dizem 72 h.

### Qualidade
- **Como vocês testaram?** 245 testes automáticos (Vitest, 12 arquivos) das regras e do armazenamento, não dos cliques. Houve também verificação automática de acessibilidade com axe-core e testes manuais. *(`npm test`.)*
- **E a acessibilidade?** Fonte mínima de 14 px, e o axe-core não apontou violações nas telas verificadas. Lighthouse (100/100 em 2 telas) e NVDA são registros do grupo, no `CHANGELOG`. Ferramenta automática não cobre tudo.
- **Os estados de tela do enunciado existem?** Sim: carregando, vazio, sucesso e erro. O "Carregando" é uma espera curta simulada, e o erro pode ser mostrado com `?falha=1`.

### Limites, sem esconder
- **O que acontece se a internet cair ao enviar?** Hoje o app não trata queda de internet: ele grava no navegador e não depende da rede. O aviso de conexão e a fila "Pendentes de envio" foram especificados e adiados (RF10, RNF03). Se o envio falha, o formulário continua preenchido; se a página recarrega, o que foi digitado se perde.
- **O que ficou de fora?** Login real, histórico interno do setor, aviso offline, e a revisão por pares ainda está pendente. *(DOCUMENTACAO, seções 3 e 18; `docs/estudo/92-FALHAS-CONHECIDAS-PARA-FALAR.md`.)*
- **Vocês usaram IA?** Sim, e está declarado: ferramentas de IA ajudaram a montar a base, a partir do que o grupo já tinha, e depois nas regras e nas correções. Todos devem saber explicar o que está no código. *(ADR-06.)*

## 10. Como estudar em 1 hora
1. Rode o app (`npm install`, `npm run dev`) e entre com os 5 usuários.
2. Leia `docs/EXPLICACAO_BLOCO1.md` e abra os arquivos citados, um por vez.
3. Mude **uma coisa pequena** (um texto, uma cor) e veja o efeito; depois volte (`git restore`).
4. Responda em voz alta às perguntas da seção 9, sem olhar.
