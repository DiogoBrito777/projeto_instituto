# Demanda de Aço

Projeto do PBL de Programação Web (UnDF), **Problema 1: o formulário das seis caixas de entrada**.

Aplicação web responsiva para **abrir, acompanhar e decidir demandas entre setores** (TI, Hidráulica, Administrativo, Elétrica e Gerenciamento), feita com React e Vite. Nesta etapa o sistema funciona **somente no front-end** e usa dados simulados em arquivos JSON; não é necessário iniciar um back-end.

- **Versão entregue:** tag `v1.0-pbl`, na branch `main`.
- **Experimente online (sem instalar nada):** https://projeto-instituto.vercel.app (funciona no computador e no celular).
- **Wireframes e protótipo (Figma):**
  - Interface (Figma Design): https://www.figma.com/design/Xc0uXdnZjy6oy5cc1datYf/frontendz%C3%A3o-do-prof?node-id=38-53
  - Layout base (Figma Make): https://www.figma.com/make/zNWLi7mmp60RYxb40Yl8wP/Desktop-Web-Interface-Design
  - Capturas e a linha do tempo (esboço, documento técnico, Figma Make, Figma Design): [`docs/wireframes/`](docs/wireframes/LEIAME.md)

## O que o sistema faz

- **Nova demanda:** formulário curto com validação junto ao campo e confirmação de envio.
- **Aceite e recusa:** o setor de destino aceita (define a prioridade) ou recusa informando o motivo.
- **Triagem da Gerência:** o que foi recusado pode ser redirecionado, marcado como não aplicável ou cancelado.
- **Painéis por perfil:** Visão geral (cards e aviso "Precisa de atenção"), Demandas (abas, busca e filtros) e Departamentos.
- **Estados de tela:** carregando, lista vazia, sucesso e erro.
- **Acessibilidade:** navegação por teclado, foco visível, pop-ups acessíveis e contraste revisado.

## Usuários de teste

A senha é igual ao usuário.

| Usuário | Perfil |
| --- | --- |
| `admin` | Gerenciamento |
| `user01` | Tecnologia da Informação (TI) |
| `user02` | Hidráulica |
| `user03` | Administrativo |
| `user04` | Elétrica |

Sugestão de teste: entre como `user02`, crie uma demanda para a TI, saia, entre como `user01` e aceite a demanda. Depois entre como `admin` e veja a Visão geral.

## Requisitos para executar

- Git instalado.
- Node.js (versão 22 ou superior) e npm instalados.

## Clonar e executar

Os comandos abaixo devem ser executados no **CMD (Prompt de Comando do Windows)**.

1. Clone o repositório:

   ```cmd
   git clone https://github.com/DiogoBrito777/projeto_instituto
   ```

2. Entre na pasta do projeto:

   ```cmd
   cd projeto_instituto
   ```

3. Instale as dependências (necessário na primeira execução):

   ```cmd
   npm install
   ```

4. Inicie a aplicação:

   ```cmd
   npm run dev
   ```

5. Abra no navegador o endereço exibido no CMD, normalmente `http://localhost:5173`.

Para encerrar o servidor de desenvolvimento, pressione `Ctrl+C` no CMD.

## Verificação

```cmd
npm test
npm run lint
npm run build
```

`npm test` roda os testes automatizados das regras de negócio (Vitest).

## Como os dados funcionam

- Os dados iniciais vêm de arquivos JSON em `src/data` (13 demandas, 5 usuários e 4 setores).
- As demandas criadas ficam **só no navegador** de quem usou (localStorage). Não há servidor, então **cada pessoa vê apenas as próprias demandas, no próprio aparelho**.
- O botão **Resetar dados**, na tela de login, volta ao estado inicial.
- As senhas ficam em texto simples porque o sistema é uma simulação.

## Parâmetros de demonstração

Servem só para a apresentação. Vão na parte de busca do endereço, **antes do `#`**, e só valem depois de recarregar a página. Sem eles, nada muda.

| Parâmetro | Exemplo | O que faz |
| --- | --- | --- |
| `?falha=1` | `http://localhost:5173/?falha=1#nova-demanda` | As gravações falham de propósito, para mostrar a mensagem de erro (os dados do formulário são mantidos). |
| `?lento=1` | `http://localhost:5173/?lento=1#visao-geral` | Leitura e gravação passam a 2 s (padrões: 150 ms e 250 ms), para mostrar "Carregando demandas…" e "Enviando…" com calma. |

## Falhas e limitações conhecidas

Estão registradas, e não escondidas, em `docs/DOCUMENTACAO.md` (seção 23). As principais: sem aviso de falta de conexão, o formulário se perde ao recarregar e o envio pode travar em celular quando o app é aberto por `http://IP` da rede (pela Vercel, em HTTPS, funciona).

## Documentação

Tudo está na pasta `docs/`:

- `docs/LEIAME.md`: guia da pasta, com a finalidade de cada arquivo.
- `docs/DOCUMENTACAO.md`: visão do produto, requisitos, backlog, matriz de rastreabilidade, plano de testes, limitações e retrospectiva.
- `docs/REQUISITOS_REGRAS_DE_NEGOCIO.md`: regras de negócio.
- `docs/FLUXOS.md`: fluxos e máquina de estados.
- `docs/TESTES_PENDENTES.md` e `docs/evidencias/`: testes e evidências (auditoria axe antes e depois).
- `docs/CHANGELOG.md`: histórico de mudanças.
