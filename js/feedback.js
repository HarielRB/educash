// js/feedback.js
// Camada de orquestração da tela de cadastro: liga o formulário ao modal de
// confirmação e ao toast, e ao histórico salvo. NÃO valida campos e NÃO
// acessa o localStorage diretamente — importa essas duas responsabilidades
// de módulos dedicados, mantendo este arquivo focado só na "cola" da UI.
import { ativarValidacaoFormulario } from './validacao.js';
import { obterCadastros, salvarCadastro } from './armazenamento.js';

document.addEventListener('conteudo:carregado', function () {
  const form = document.querySelector('#conteudo form');
  const modal = document.getElementById('modal-confirmacao');
  const toast = document.getElementById('toast-sucesso');

  if (!form || !modal) return; // a rota atual não é a de cadastro

  const { validarTudo, limparTodosOsErros } = ativarValidacaoFormulario(form);

  // ---------- Histórico de cadastros ----------
  function renderizarHistorico() {
    const lista = document.getElementById('historico-cadastros');
    if (!lista) return;
    const cadastros = obterCadastros();
    if (cadastros.length === 0) {
      lista.innerHTML = '<li>Nenhum cadastro enviado neste navegador ainda.</li>';
      return;
    }
    lista.innerHTML = cadastros.map(function (registro) {
      const data = new Date(registro.data).toLocaleDateString('pt-BR');
      return '<li>' + registro.nome + ' — enviado em ' + data + '</li>';
    }).join('');
  }
  renderizarHistorico();

  // ---------- Contador de caracteres da mensagem ----------
  const textareaMensagem = document.getElementById('mensagem');
  const contadorMensagem = document.getElementById('contador-mensagem');
  if (textareaMensagem && contadorMensagem) {
    textareaMensagem.addEventListener('input', function () {
      const restantes = 500 - textareaMensagem.value.length;
      contadorMensagem.textContent = restantes + ' caracteres restantes';
    });
  }

  // ---------- Envio do formulário ----------
  form.addEventListener('submit', function (evento) {
    evento.preventDefault(); // a SPA assume o controle total do fluxo, sempre

    const primeiroCampoInvalido = validarTudo();
    if (primeiroCampoInvalido) {
      primeiroCampoInvalido.focus();
      return; // não abre o modal enquanto houver campo inválido
    }

    modal.showModal();
  });

  const botaoCancelar = modal.querySelector('[data-cancelar]');
  if (botaoCancelar) {
    botaoCancelar.addEventListener('click', function () {
      modal.close();
    });
  }

  const botaoConfirmar = modal.querySelector('[data-confirmar]');
  if (botaoConfirmar) {
    botaoConfirmar.addEventListener('click', function () {
      salvarCadastro({
        nome: form.nome.value,
        data: new Date().toISOString()
      });
      renderizarHistorico();

      modal.close();
      form.reset();
      limparTodosOsErros();
      if (toast) {
        toast.hidden = false;
        window.setTimeout(function () {
          toast.hidden = true;
        }, 6000);
      }
    });
  }
});