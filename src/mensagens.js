// Textos exibidos nas telas ligadas aos dados, copiados de docs/MENSAGENS_VALIDACAO.md.
// Os marcados como "proposta" no catálogo ainda precisam de aprovação do grupo.

export const MENSAGENS = {
  carregando: 'Carregando demandas…',
  listaVazia: 'Nenhuma demanda encontrada. Tente outra busca ou outro departamento.',
  semPermissao: 'Demanda não encontrada ou sem permissão.',
  finalizada: 'Esta demanda foi finalizada e não pode mais ser alterada.',
  dadosCorrompidos:
    'Os dados salvos neste aparelho estão com problema. Clique em Resetar dados para voltar aos dados de demonstração.',
  dadosIndisponiveis:
    'Não foi possível acessar os dados deste aparelho. Verifique se o navegador permite armazenamento local.',
  // Propostas do Bloco 2A.
  semEdicao: 'Você pode consultar esta demanda, mas não há alterações disponíveis para o seu perfil neste status.',
  salvarErro: 'Não foi possível salvar. Suas alterações continuam no formulário. Tente novamente.',
  semAlteracao: 'Nenhuma alteração para salvar.',
  observacaoLonga: 'A observação deve ter no máximo 500 caracteres.',
  salvando: 'Salvando…',
  // Nova Demanda (Bloco 2B).
  enviando: 'Enviando…',
  envioErro: 'Não foi possível enviar. Seus dados continuam salvos. Tente novamente.',
  envioSucesso: (id) => `Demanda ${id} enviada com sucesso.`,
  // Aviso de limite dos campos de texto (proposta, correção do teste manual da 2B).
  limite: {
    atingido: (limite) => `Limite de ${limite} caracteres atingido.`,
    cortado: (limite) => `Limite de ${limite} caracteres atingido. O texto foi cortado.`,
  },
}

// Instrução sempre visível, antes de qualquer erro (catálogo, "Nova Demanda").
export const INSTRUCOES_NOVA = {
  // A frase sobre data e hora é proposta do Bloco 2B (RN07: data automática).
  origem: 'Preenchida automaticamente com o seu departamento. Data e hora são registradas no envio.',
  destino: 'Escolha o departamento que deve resolver.',
  tipo: 'As opções dependem do destino escolhido.',
  titulo: 'Resuma em até 60 caracteres.',
  descricao: 'Conte o que aconteceu e onde. Até 500 caracteres.',
}

// Texto de cada código de erro de domain/novaDemanda.js.
export const ERROS_NOVA_TEXTO = {
  'destino-vazio': 'Escolha o departamento de destino.',
  // Proposta do Bloco 2B: o catálogo não tinha texto para "destino = próprio setor".
  'destino-proprio': 'Escolha um departamento diferente do seu.',
  'tipo-vazio': 'Escolha o tipo de atendimento.',
  'tipo-sem-destino': 'Escolha primeiro o destino.',
  'tipo-invalido': 'Escolha o tipo de atendimento.',
  'titulo-vazio': 'Informe um título.',
  'titulo-longo': 'O título deve ter no máximo 60 caracteres.',
  'descricao-vazia': 'Descreva a demanda para que o setor possa atender.',
  'descricao-longa': 'A descrição deve ter no máximo 500 caracteres.',
}
