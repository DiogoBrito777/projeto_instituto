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
  // Aceite e recusa (Bloco 4-A). Textos do catálogo, seção "Aceite, recusa e encerramento".
  aceiteSemPrioridade: 'Escolha a prioridade para aceitar a demanda.',
  aceiteConfirmacao: (prioridade, prazo) =>
    `Você vai aceitar com prioridade ${prioridade}. O prazo será de ${prazo}. A prioridade não poderá ser alterada depois. Confirmar?`,
  recusaSemMotivo: 'Explique por que esta demanda não é do seu setor.',
  // Propostas do Bloco 4-A (o catálogo não tinha texto para estes casos).
  recusaDescricao: 'A demanda vai para a triagem do Gerenciamento, que decide o destino.',
  motivoLongo: 'O motivo deve ter no máximo 500 caracteres.',
  // Triagem pela gerência (Bloco 4C). Do catálogo: redirecionarSemSetor e justificativaAusente.
  // As demais são PROPOSTAS (o catálogo não tinha texto para estes casos).
  redirecionarSemSetor: 'Escolha o departamento que deve receber a demanda.',
  redirecionarSemTipo: 'Escolha o tipo de atendimento do novo departamento.',
  justificativaAusente: 'Informe a justificativa.',
  justificativaLonga: 'A justificativa deve ter no máximo 500 caracteres.',
  redirecionarConfirmacao: (setor, tipo, prazo) =>
    `A demanda vai para ${setor}, com o tipo "${tipo}", e volta a Pendente de aceite. O setor terá até ${prazo} para aceitar. Confirmar?`,
  naoAplicavelDescricao:
    'A demanda será encerrada como "Não aplicável" (nenhum setor tem competência) e não poderá mais ser alterada.',
  cancelarDescricao: 'A demanda será cancelada e não poderá mais ser alterada.',
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
