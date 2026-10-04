# 07 — O pop-up acessível (`Dialogo`)

## (a) O que faz
Um único componente para todos os pop-ups: "Demanda enviada", aceite, recusa, triagem e "Resetar dados". Ele garante que o teclado e o leitor de tela funcionem: o foco entra no pop-up, fica preso nele, o Esc fecha e o foco volta ao botão que abriu.

## (b) Onde está no código
- `src/components/Dialogo.jsx`: componente `Dialogo`.
  - **Propriedades:** `titulo`, `rotuloSuperior`, `descricao`, `children`, `acoes`, `onFechar` e `retornarFocoPara`.
  - **Visual:** classes de `src/pages/DetalhesDemanda.css`, o desenho que os colegas já tinham feito.
- **Usado em:**
  - `NovaDemanda.jsx`: "Demanda enviada";
  - `AtualizarDemanda.jsx`: aceite e recusa;
  - `TriagemDemanda.jsx`: redirecionar, Não aplicável e Cancelar;
  - `Login.jsx`: "Resetar dados".

## (c) Como funciona
1. Ao abrir, o foco vai para o elemento marcado com `data-autofocus` (ou para o primeiro botão).
2. **Tab e Shift+Tab ficam presos:** no último item, o Tab volta ao primeiro, e vice-versa.
3. **Esc fecha**, assim como o "×" e o clique fora.
4. Ao fechar, o foco volta para `retornarFocoPara`, o botão que abriu o pop-up.
5. Para o leitor de tela: `role="dialog"`, `aria-modal="true"`, título ligado por `aria-labelledby` e texto por `aria-describedby`.
6. Pop-ups com ação destrutiva começam com o foco em **"Voltar"** (ex.: "Resetar dados"), para o Enter não confirmar por engano.

## (d) Demonstração em 1 minuto
1. Login → "Resetar dados" → o foco está em "Voltar".
2. Aperte Tab várias vezes: o foco não sai do pop-up.
3. Esc → o pop-up fecha e o foco volta ao botão "Resetar dados".

## (e) Perguntas prováveis
- **Por que prender o foco?** Quem usa só teclado se perderia "atrás" do pop-up (WCAG 2.1.1 e 2.4.3).
- **Por que devolver o foco?** Para a pessoa continuar de onde estava, e não voltar ao topo da página.
- **Por que um componente só?** Para todos os pop-ups terem o mesmo comportamento; corrigir num lugar corrige em todos.

## (f) O que não está pronto / limitações
- Não há teste automático de interface do `Dialogo` (o projeto não tem biblioteca para isso).
- O teste dos pop-ups com leitor de tela (NVDA) na rodada final **não foi executado**.
