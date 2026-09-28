// js/app.js
// Roteador simples de página única (SPA), baseado no hash da URL.
// Rotas: #/  #/projetos  #/cadastro  (e âncoras opcionais, ex.: #/projetos/jovens)
// Não importa nada dos outros módulos: a comunicação com eles é só pelo
// evento customizado "conteudo:carregado", para não criar acoplamento direto.

const rotas = {
  '/': 'html/inicio.html',
  '/projetos': 'html/projetos.html',
  '/cadastro': 'html/cadastro.html'
};

const conteudo = document.getElementById('conteudo');
const linksNav = document.querySelectorAll('nav a[data-rota]');
const checkboxMenu = document.getElementById('menu-alternador');
const rotuloMenu = document.querySelector('nav label[for]');

let sequenciaRequisicao = 0; // contador para descartar respostas antigas fora de ordem

function fecharMenuMovel() {
  if (!checkboxMenu) return;
  checkboxMenu.checked = false;
  // checkboxMenu.checked = false NÃO dispara o evento "change" (só interação
  // do usuário dispara). Por isso o aria-expanded precisa ser atualizado aqui
  // também, e não só dentro do listener de "change" logo abaixo.
  if (rotuloMenu) rotuloMenu.setAttribute('aria-expanded', 'false');
}

if (checkboxMenu && rotuloMenu) {
  checkboxMenu.addEventListener('change', function () {
    rotuloMenu.setAttribute('aria-expanded', checkboxMenu.checked ? 'true' : 'false');
  });
}

document.addEventListener('click', function (evento) {
  const link = evento.target.closest('nav a[href^="#"]');
  if (!link) return;
  evento.preventDefault();
  const destino = link.getAttribute('href');
  if (window.location.hash === destino) {
    carregarRota();
  } else {
    window.location.hash = destino;
  }
});

function analisarHash() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const partes = hash.split('/').filter(Boolean);
  const rotaBase = partes.length ? '/' + partes[0] : '/';
  const ancora = partes[1] || null;
  return { rotaBase, ancora };
}

function atualizarNavegacaoAtiva(rotaBase) {
  linksNav.forEach(function (link) {
    if (link.dataset.rota === rotaBase) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function carregarRota() {
  const analise = analisarHash();
  const arquivo = rotas[analise.rotaBase] || rotas['/'];

  sequenciaRequisicao += 1;
  const numeroDestaRequisicao = sequenciaRequisicao;

  fetch(arquivo)
    .then(function (resposta) {
      if (!resposta.ok) throw new Error('Não foi possível carregar ' + arquivo);
      return resposta.text();
    })
    .then(function (html) {
      // Se o usuário já navegou de novo enquanto esta requisição estava no
      // ar, uma chamada mais recente de carregarRota() já incrementou
      // sequenciaRequisicao. Descartar esta resposta evita que ela chegue
      // depois e sobrescreva um conteúdo mais novo já na tela.
      if (numeroDestaRequisicao !== sequenciaRequisicao) return;

      conteudo.innerHTML = html;
      atualizarNavegacaoAtiva(analise.rotaBase);
      fecharMenuMovel();

      document.dispatchEvent(new CustomEvent('conteudo:carregado', { detail: analise }));

      if (analise.ancora) {
        const alvo = document.getElementById(analise.ancora);
        if (alvo) alvo.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
    })
    .catch(function (erro) {
      if (numeroDestaRequisicao !== sequenciaRequisicao) return;
      conteudo.innerHTML = '<section><h1>Não foi possível carregar esta página</h1>' +
        '<p>Tente novamente em instantes.</p></section>';
      console.error(erro);
    });
}

window.addEventListener('hashchange', carregarRota);
carregarRota();