# 90 — Perguntas rápidas (respostas curtas)

1. **O que o sistema resolve?** Demandas chegavam por seis caminhos diferentes e se perdiam; agora há um lugar só para registrar, confirmar o envio e acompanhar.
2. **Tem back-end?** Não. O enunciado proíbe; tudo roda no navegador.
3. **Por que `localStorage`?** É o "equivalente ao JSON" que o enunciado aceita: o JSON é a semente e o `localStorage` guarda as mudanças entre recarregamentos (ADR-02).
4. **Os arquivos JSON mudam quando crio uma demanda?** Não. O navegador não escreve em arquivos do projeto; só no `localStorage`.
5. **Como funciona o login?** Simulado: `auth.js` confere em `usuarios.json` e guarda a sessão no `sessionStorage`, sem a senha.
6. **Isso é seguro?** Não, e está documentado: senhas em texto e dados editáveis pelo F12. Num sistema real: servidor, senhas com hash e token.
7. **Quem vê o quê?** A gerência vê tudo; o setor vê o que recebe (completo) e o que abriu (só o resumo). Regras em `permissoes.js`.
8. **Quem define a prioridade?** O setor que executa, ao aceitar. Quem abre não escolhe e a gerência não define.
9. **Como é calculado o prazo?** A partir do aceite: Urgente 24 h, Alta 48 h, Média 72 h, Baixa 7 dias.
10. **E o prazo para aceitar?** 48 h (proposta; o texto atual da RN09 diz 72 h). Depois de redirecionada: 24 h.
11. **O que é "Em triagem"?** O setor recusou; a demanda passa a ser da gerência, que redireciona, marca Não aplicável ou cancela.
12. **Por que a justificativa no redirecionamento?** Cada redirecionamento dá mais 24 h; sem motivo, o prazo poderia ser esticado sem rastro.
13. **O que é o aviso "Precisa de atenção"?** Mostra as demandas paradas esperando alguém agir (triagem e pendentes de aceite), com link para a lista.
14. **Como o filtro vem de outra tela?** O card é um link `#demandas?filtro=vencidas`; o `App.jsx` lê o parâmetro e a tela Demandas aplica (`filtrarPorPainel`). Dá para limpar com "Limpar filtro".
15. **Como o número do card bate com a lista?** O mesmo teste conta e filtra (`FILTROS_DO_PAINEL`), com teste automático para cada card.
16. **Por que os números mudam durante o dia?** Os prazos usam o relógio do navegador; com o tempo, uma demanda passa do prazo. Antes de demonstrar: "Resetar dados".
17. **O que é o `?falha=1`?** Um gancho de teste que faz a gravação falhar de propósito, para mostrar a mensagem de erro e o formulário mantido.
18. **Como garantiram acessibilidade?** axe antes/depois (0 violações em código anterior), Lighthouse 100/100 em 2 telas, NVDA, teclado, celular real, contraste calculado e fonte mínima de 14 px.
19. **O axe garante tudo?** Não; acha só uma parte. Por isso houve teste humano com teclado, leitor de tela e celular.
20. **Como o leitor de tela sabe que a tela mudou?** O foco vai para o título (`<h1>`) a cada troca de endereço.
21. **Como funciona o pop-up acessível?** O foco entra, fica preso, o Esc fecha e o foco volta ao botão que abriu (`Dialogo.jsx`).
22. **Quantos testes automáticos?** 245, em 12 arquivos (Vitest). Cobrem regras e armazenamento, não cliques.
23. **O que ficou de fora e por quê?** Novo prazo, cobrança, modo offline, chat, reabrir, tema escuro. Motivo: prazo de 3 dias; prioridade ao fluxo principal e à acessibilidade (DOCUMENTACAO, seção 18).
24. **Tem alguma falha conhecida?** Sim. A principal é a F1: no celular, pelo IP da rede, o envio trava em "Enviando…". Não deu tempo de investigar; está registrada (arquivo 92).
25. **O que não foi testado?** NVDA no reteste, axe no código atual, Lighthouse nas outras telas, zoom de 400% e 500%, dados corrompidos pelo F12, aviso de limite ao reabrir, Voz de Acesso.
26. **Como o trabalho foi organizado?** Em blocos, uma branch e um PR por bloco, CHANGELOG e um arquivo de explicação por bloco.
