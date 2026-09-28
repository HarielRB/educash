// js/armazenamento.js
// Camada pura de acesso ao Web Storage. Não manipula o DOM, não gera
// marcação, não sabe que existe um formulário — só lê e grava dados.
// Se um dia isso virar uma API real, é este o único arquivo que muda.

const CHAVE_HISTORICO = 'educash:cadastros';

export function obterCadastros() {
  try {
    const bruto = localStorage.getItem(CHAVE_HISTORICO);
    return bruto ? JSON.parse(bruto) : [];
  } catch (erro) {
    console.warn('Não foi possível ler o histórico salvo:', erro);
    return [];
  }
}

export function salvarCadastro(registro) {
  const cadastros = obterCadastros();
  cadastros.push(registro);
  localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(cadastros));
  return cadastros;
}