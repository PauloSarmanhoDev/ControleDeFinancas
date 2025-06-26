// Funções utilitárias para armazenamento local usando localStorage

/**
 * Salva dados no localStorage com a chave informada.
 * @param {string} chave - Nome da chave.
 * @param {any} dados - Dados a serem salvos.
 */
function salvarDados(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

/**
 * Carrega dados do localStorage pela chave, ou retorna um valor padrão se não existir.
 * @param {string} chave - Nome da chave.
 * @param {any} padrao - Valor padrão caso não exista.
 * @returns {any}
 */
function carregarDados(chave, padrao) {
  return JSON.parse(localStorage.getItem(chave)) || padrao;
}

// Exporta as funções para uso em outros arquivos
export { salvarDados, carregarDados }; 