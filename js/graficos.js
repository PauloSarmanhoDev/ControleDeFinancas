import { mesAtual, obterDadosMes } from './meses.js';

let graficoPizza = null;

/**
 * Atualiza o gráfico de pizza com os dados do mês atual.
 */
function atualizarGrafico() {
  const considerarFixas = document.getElementById('considerarFixasGrafico')?.checked ?? true;
  const filtroTipo = document.getElementById('filtroTipo')?.value ?? 'todos';
  
  const dados = obterDadosMes(mesAtual);
  let dadosParaGrafico = [];
  
  if (considerarFixas && (filtroTipo === 'todos' || filtroTipo === 'despesasFixas')) {
    dados.despesasFixas.forEach(item => {
      dadosParaGrafico.push({
        categoria: item.categoria,
        valor: item.valor,
        tipo: 'Despesas Fixas'
      });
    });
  }
  
  if (filtroTipo === 'todos' || filtroTipo === 'debito') {
    dados.debitos.forEach(item => {
      dadosParaGrafico.push({
        categoria: item.categoria,
        valor: item.valor,
        tipo: 'Débito'
      });
    });
  }
  
  if (filtroTipo === 'todos' || filtroTipo === 'cartao') {
    dados.cartoes.forEach(item => {
      dadosParaGrafico.push({
        categoria: item.categoria,
        valor: item.valor,
        tipo: 'Cartão'
      });
    });
  }
  
  atualizarGraficoComDados(dadosParaGrafico);
}

/**
 * Atualiza o gráfico com dados específicos.
 * @param {Array} dados
 */
function atualizarGraficoComDados(dados) {
  const canvas = document.getElementById('graficoPizza');
  if (!canvas) return;
  
  // Agrupar por categoria
  const gastosPorCategoria = {};
  dados.forEach(item => {
    if (!gastosPorCategoria[item.categoria]) {
      gastosPorCategoria[item.categoria] = 0;
    }
    gastosPorCategoria[item.categoria] += item.valor;
  });
  
  // Preparar dados para o gráfico
  const labels = Object.keys(gastosPorCategoria);
  const valores = Object.values(gastosPorCategoria);
  
  // Cores para as categorias
  const cores = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
  ];
  
  // Destruir gráfico anterior se existir
  if (graficoPizza) {
    graficoPizza.destroy();
  }
  
  // Criar novo gráfico
  const ctx = canvas.getContext('2d');
  graficoPizza = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: valores,
        backgroundColor: cores.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
  
  // Atualizar resumo dos gráficos
  atualizarResumoGraficos(gastosPorCategoria);
}

/**
 * Atualiza o resumo dos gráficos.
 * @param {Object} gastosPorCategoria
 */
function atualizarResumoGraficos(gastosPorCategoria) {
  const resumoGraficos = document.getElementById('resumoGraficos');
  if (!resumoGraficos) return;
  
  const total = Object.values(gastosPorCategoria).reduce((sum, valor) => sum + valor, 0);
  
  let html = `<h6>Total: R$ ${total.toFixed(2)}</h6>`;
  html += '<div class="mt-3">';
  
  Object.entries(gastosPorCategoria)
    .sort(([,a], [,b]) => b - a)
    .forEach(([categoria, valor]) => {
      const porcentagem = ((valor / total) * 100).toFixed(1);
      html += `
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="small">${categoria}</span>
          <span class="small fw-bold">R$ ${valor.toFixed(2)} (${porcentagem}%)</span>
        </div>
      `;
    });
  
  html += '</div>';
  resumoGraficos.innerHTML = html;
}

export { 
  atualizarGrafico, atualizarGraficoComDados, atualizarResumoGraficos, 
  graficoPizza 
}; 