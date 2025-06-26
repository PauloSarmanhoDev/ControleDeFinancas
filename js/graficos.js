import { mesAtual, obterDadosMes } from './meses.js';

/**
 * Atualiza o gráfico de pizza com os dados do mês atual.
 */
function atualizarGraficoPizza() {
  const dados = obterDadosMes(mesAtual);
  // Aqui você pode montar os dados para o Chart.js ou outro lib
}

export { atualizarGraficoPizza }; 