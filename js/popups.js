import { obterDadosMes, salvarDadosMes } from './meses.js';

/**
 * Abre um popup pelo tipo.
 * @param {string} tipo
 */
function abrirPopup(tipo) {
  document.getElementById(`popup${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).style.display = 'block';
}

/**
 * Fecha um popup pelo tipo.
 * @param {string} tipo
 */
function fecharPopup(tipo) {
  document.getElementById(`popup${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).style.display = 'none';
}

export { abrirPopup, fecharPopup }; 