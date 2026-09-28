// js/dados.js
// Fonte de dados dos projetos. Separada de js/templates.js de propósito:
// no futuro, esta lista pode vir de um fetch a uma API em vez de estar fixa
// aqui — só este arquivo mudaria.
export const dadosProjetos = [
  {
    id: 'jovens',
    titulo: 'Primeiro Salário',
    publico: 'jovens',
    publicoLabel: 'Jovens',
    status: 'andamento',
    statusLabel: 'Em andamento',
    descricao: 'Oficinas para jovens de 16 a 24 anos sobre salário, orçamento e uso responsável do crédito.',
    imagemBase: 'projeto-primeiro-salario',
    legenda: 'Roda de conversa em turma de 2026.'
  },
  {
    id: 'familias',
    titulo: 'Contas em Dia',
    publico: 'familias',
    publicoLabel: 'Famílias',
    status: 'andamento',
    statusLabel: 'Em andamento',
    descricao: 'Atendimento a famílias para organizar dívidas, montar reserva de emergência e planejar o mês.',
    imagemBase: 'projeto-contas-em-dia',
    legenda: 'Atendimento individual a uma família.'
  },
  {
    id: 'empreendedores',
    titulo: 'Negócio no Azul',
    publico: 'empreendedores',
    publicoLabel: 'Empreendedores',
    status: 'planejamento',
    statusLabel: 'Em planejamento',
    descricao: 'Noções de fluxo de caixa para microempreendedores. As turmas abrem em 2027.',
    imagemBase: null,
    legenda: null
  }
];