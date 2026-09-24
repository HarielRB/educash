/* js/mascaras.js
   Máscaras de entrada (CPF, telefone e CEP) e validações extras do formulário
   de cadastro, em JavaScript puro e sem bibliotecas.
   Os campos são localizados pelo atributo name, pois o HTML não usa id. */
(function () {
  'use strict';

  function somenteDigitos(texto) {
    return texto.replace(/\D/g, '');
  }

  // 000.000.000-00
  function formatarCPF(texto) {
    var d = somenteDigitos(texto).slice(0, 11);
    if (d.length > 9) return d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6, 9) + '-' + d.slice(9);
    if (d.length > 6) return d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6);
    if (d.length > 3) return d.slice(0, 3) + '.' + d.slice(3);
    return d;
  }

  // (00) 0000-0000 ou (00) 00000-0000
  function formatarTelefone(texto) {
    var d = somenteDigitos(texto);
    // Preenchimento automático costuma trazer o prefixo do país (+55)
    if (d.length > 11 && d.slice(0, 2) === '55') d = d.slice(2);
    d = d.slice(0, 11);
    if (d.length > 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
    if (d.length > 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    if (d.length > 2) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length > 0) return '(' + d;
    return '';
  }

  // 00000-000
  function formatarCEP(texto) {
    var d = somenteDigitos(texto).slice(0, 8);
    return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
  }

  // Confere os dois dígitos verificadores do CPF
  function cpfValido(texto) {
    var d = somenteDigitos(texto);
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
    for (var t = 9; t < 11; t++) {
      var soma = 0;
      for (var i = 0; i < t; i++) soma += Number(d.charAt(i)) * (t + 1 - i);
      var digito = ((soma * 10) % 11) % 10;
      if (digito !== Number(d.charAt(t))) return false;
    }
    return true;
  }

  // Reescreve o valor com a máscara e mantém o cursor na posição certa
  function aplicarMascara(campo, formatar) {
    var formatado = formatar(campo.value);
    if (formatado === campo.value) return;

    var emFoco = document.activeElement === campo;
    var digitosAntes = emFoco ? somenteDigitos(campo.value.slice(0, campo.selectionStart)).length : 0;
    campo.value = formatado;

    if (emFoco) {
      var posicao = formatado.length;
      if (digitosAntes === 0) {
        posicao = 0;
      } else {
        var contados = 0;
        for (var i = 0; i < formatado.length; i++) {
          if (/\d/.test(formatado.charAt(i))) contados++;
          if (contados === digitosAntes) { posicao = i + 1; break; }
        }
      }
      campo.setSelectionRange(posicao, posicao);
    }
  }

  // O pattern só confere o formato; aqui conferimos os dígitos verificadores
  function validarCPF(campo) {
    var completo = somenteDigitos(campo.value).length === 11;
    campo.setCustomValidity(completo && !cpfValido(campo.value)
      ? 'CPF inválido. Confira os números digitados.'
      : '');
  }

  function ligar(nome, formatar, validar) {
    var campo = document.querySelector('input[name="' + nome + '"]');
    if (!campo) return;
    function tratar() {
      aplicarMascara(campo, formatar);
      if (validar) validar(campo);
    }
    campo.addEventListener('input', tratar);
    tratar();
  }

  ligar('cpf', formatarCPF, validarCPF);
  ligar('telefone', formatarTelefone);
  ligar('cep', formatarCEP);

  // Data de nascimento não pode ser futura
  var nascimento = document.querySelector('input[name="nascimento"]');
  if (nascimento) {
    var agora = new Date();
    var local = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000);
    nascimento.max = local.toISOString().slice(0, 10);
  }
})();
