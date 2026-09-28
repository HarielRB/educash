// js/templates.js
// Sistema de templates via Template Literals + innerHTML: transforma cada
// item de dadosProjetos (importado de js/dados.js) em um <article> e injeta
// diretamente nas <section id="secao-andamento">/"secao-planejamento"> de
// html/projetos.html. Não sabe nada sobre storage ou formulário.
import { dadosProjetos } from './dados.js';

function criarFiguraProjeto(projeto) {
  if (!projeto.imagemBase) return '';
  return `
    <figure>
      <picture>
        <source srcset="imagens/${projeto.imagemBase}.webp" type="image/webp">
        <img src="imagens/${projeto.imagemBase}.jpg" alt="${projeto.titulo}" width="800" height="450" loading="lazy">
      </picture>
      <figcaption>${projeto.legenda}</figcaption>
    </figure>`;
}

function criarCartaoProjeto(projeto) {
  return `
    <article id="${projeto.id}">
      <h3>
        ${projeto.titulo}
        <span data-etiqueta="${projeto.publico}">${projeto.publicoLabel}</span>
        <span data-etiqueta="${projeto.status}">${projeto.statusLabel}</span>
      </h3>
      ${criarFiguraProjeto(projeto)}
      <p>${projeto.descricao}</p>
    </article>`;
}

export function renderizarProjetos() {
  const secaoAndamento = document.getElementById('secao-andamento');
  const secaoPlanejamento = document.getElementById('secao-planejamento');
  if (!secaoAndamento || !secaoPlanejamento) return; // a rota atual não é a de projetos

  const andamento = dadosProjetos.filter((p) => p.status === 'andamento');
  const planejamento = dadosProjetos.filter((p) => p.status === 'planejamento');

  secaoAndamento.insertAdjacentHTML('beforeend', andamento.map(criarCartaoProjeto).join(''));
  secaoPlanejamento.insertAdjacentHTML('beforeend', planejamento.map(criarCartaoProjeto).join(''));
}

document.addEventListener('conteudo:carregado', renderizarProjetos);