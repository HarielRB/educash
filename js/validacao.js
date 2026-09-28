// js/validacao.js
// Camada de verificação de consistência dos campos: lê a Constraint
// Validation API nativa (campo.validity) e injeta/remove mensagens de erro
// no DOM. Não sabe nada sobre modal, toast ou localStorage — só valida.

function textoErro(campo) {
  const v = campo.validity;
  if (v.valueMissing) return 'Preencha este campo.';
  if (v.patternMismatch) return campo.title || 'Formato inválido.';
  if (v.tooShort) return 'Use pelo menos ' + campo.minLength + ' caracteres.';
  if (v.typeMismatch) return 'Informe um valor no formato correto.';
  return campo.validationMessage || 'Campo inválido.';
}

function mostrarErro(campo) {
  const id = 'erro-' + campo.name;
  // Para grupos de rádio, o atributo "required" só existe no primeiro
  // <input>, então usar campo.closest('p') prenderia a mensagem ao lado da
  // primeira opção, e não do grupo inteiro — confuso quando a pessoa nem
  // olhou para lá. Nesse caso a mensagem vai no <fieldset>, perto do <legend>.
  const container = campo.type === 'radio'
    ? (campo.closest('fieldset') || campo.parentElement)
    : (campo.closest('p') || campo.closest('fieldset') || campo.parentElement);
  let elementoErro = document.getElementById(id);
  if (!elementoErro) {
    elementoErro = document.createElement('small');
    elementoErro.id = id;
    elementoErro.setAttribute('role', 'alert');
    elementoErro.setAttribute('data-erro-campo', '');
    container.appendChild(elementoErro);
  }
  elementoErro.textContent = textoErro(campo);
  campo.setAttribute('aria-invalid', 'true');
  campo.setAttribute('aria-describedby', id);
}

function limparErro(campo) {
  const id = 'erro-' + campo.name;
  const elementoErro = document.getElementById(id);
  if (elementoErro) elementoErro.remove();
  campo.removeAttribute('aria-invalid');
  campo.removeAttribute('aria-describedby');
}

// Liga os listeners de validação (blur/input/change) a um formulário e
// devolve funções de controle para quem chamou (js/feedback.js) usar no
// envio do formulário, sem essa camada precisar saber o que é "enviar".
export function ativarValidacaoFormulario(form) {
  const camposValidaveis = form.querySelectorAll('[required], [pattern], [minlength]');

  camposValidaveis.forEach(function (campo) {
    campo.addEventListener('blur', function () {
      if (campo.checkValidity()) limparErro(campo); else mostrarErro(campo);
    });
    campo.addEventListener('input', function () {
      if (campo.getAttribute('aria-invalid') === 'true' && campo.checkValidity()) {
        limparErro(campo);
      }
    });
    campo.addEventListener('change', function () {
      if (campo.checkValidity()) limparErro(campo); else mostrarErro(campo);
    });
  });

  function validarTudo() {
    let primeiroCampoInvalido = null;
    camposValidaveis.forEach(function (campo) {
      if (!campo.checkValidity()) {
        mostrarErro(campo);
        if (!primeiroCampoInvalido) primeiroCampoInvalido = campo;
      } else {
        limparErro(campo);
      }
    });
    return primeiroCampoInvalido;
  }

  function limparTodosOsErros() {
    camposValidaveis.forEach(limparErro);
  }

  return { validarTudo, limparTodosOsErros };
}