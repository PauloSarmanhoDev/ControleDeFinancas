import { salvarDados, carregarDados } from './storage.js';

// Variáveis globais para o mês atual
let mesAtual = null; // Identificador do mês selecionado
let meses = carregarDados('meses', {}); // Dados de todos os meses
let economias = carregarDados('economias', []); // Economias independentes de mês

/**
 * Obtém os dados de um mês pelo ID.
 * @param {string} mesId
 * @returns {object}
 */
function obterDadosMes(mesId) {
  return meses[mesId] || {
    despesasFixas: [],
    debitos: [],
    cartoes: [],
    resumo: { saldoAnterior: 0, salario: 0, bonus: 0 }
  };
}

/**
 * Salva os dados de um mês específico.
 * @param {string} mesId
 * @param {object} dados
 */
function salvarDadosMes(mesId, dados) {
  meses[mesId] = dados;
  salvarDados('meses', meses);
}

// Exporta variáveis e funções
export { mesAtual, meses, economias, obterDadosMes, salvarDadosMes }; 