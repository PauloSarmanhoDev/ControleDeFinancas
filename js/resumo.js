import { mesAtual, meses, obterDadosMes } from './meses.js';

/**
 * Calcula e retorna os totais do mês atual.
 * @returns {object} Totais de despesas fixas, débito, cartão, etc.
 */
function calcularTotaisResumo() {
  const dados = obterDadosMes(mesAtual);
  const totalDespesasFixas = dados.despesasFixas.reduce((s, d) => s + d.valor, 0);
  const totalDebito = dados.debitos.reduce((s, d) => s + d.valor, 0);
  const totalCartao = dados.cartoes.reduce((s, d) => s + d.valor, 0);
  const dinheiroMes = Number(dados.resumo.saldoAnterior) + Number(dados.resumo.salario) + Number(dados.resumo.bonus);
  const fixosMaisDebitoMaisCartao = totalDespesasFixas + totalDebito + totalCartao;
  const dinheiroConta = dinheiroMes - totalDespesasFixas - totalDebito;
  const sobra = dinheiroConta - totalCartao;
  return {
    totalDespesasFixas,
    totalDebito,
    totalCartao,
    dinheiroMes,
    fixosMaisDebitoMaisCartao,
    dinheiroConta,
    sobra
  };
}

/**
 * Atualiza a exibição do resumo na interface.
 */
function atualizarResumoUI() {
  const {
    totalDespesasFixas,
    totalDebito,
    totalCartao,
    dinheiroMes,
    fixosMaisDebitoMaisCartao,
    dinheiroConta,
    sobra
  } = calcularTotaisResumo();
  // Aqui você pode atualizar o DOM conforme necessário
}

export { calcularTotaisResumo, atualizarResumoUI }; 