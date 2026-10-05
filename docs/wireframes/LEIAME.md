# Wireframes e protótipo (Figma)

Capturas de tela dos arquivos do Figma usados como base do projeto Demanda de Aço.

- **Figma Make (layout base):** https://www.figma.com/make/zNWLi7mmp60RYxb40Yl8wP/Desktop-Web-Interface-Design (arquivos `16` a `22`)
- **Figma Design (interface):** https://www.figma.com/design/Xc0uXdnZjy6oy5cc1datYf/frontendz%C3%A3o-do-prof (arquivos `00` a `15`: login, painel geral, demandas, nova demanda, detalhes, atualizar demanda e departamentos, em desktop e mobile, mais o diagrama de referência dos fluxos)

O layout base foi criado no Figma Make e, a partir dele, o grupo desenhou as telas no Figma Design. A estrutura do código partiu dessas telas (ver `docs/ATAS_RASCUNHO_27-09_e_02-10.md`, itens de 22/09 e 25/09).

## Como chegamos aqui

1. Esboço de baixa fidelidade (arquivos `23` a `26`), feito pelo grupo, que definiu as regras.
2. Documento técnico de 15/09/2026, gerado a partir das atas e discussões, com backlog (H1 a H8), matriz de rastreabilidade e telas previstas em wireframe textual.
3. O grupo concordou com parte do documento e ajustou o resto.
4. Layout base no Figma Make e, a partir dele, interface no Figma Design, desenhada pelo grupo.
5. Implementação em código.

## Rascunhos de baixa fidelidade (referência dos fluxos)

Os arquivos `23` a `26` mostram o primeiro esboço, ainda em traços simples, que definiu as regras antes das telas:

- departamento de "repassagem" que redireciona demandas em caso de dúvida (origem da triagem da Gerência);
- criação de demanda com departamento, tipo definido por departamento e descrição;
- visualização: só o departamento criador altera a descrição; o departamento recebedor altera o status e redireciona; a prioridade é definida pelo recebedor;
- histórico de alterações de status e comentários, visível apenas para o criador e o recebedor;
- login e painel de controle com busca e demandas ordenadas por prioridade e data.
