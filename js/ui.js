import { atualizarTabelaComparacao } from './historico.js';
import { atualizarResumoUI } from './resumo.js';
import { atualizarGraficoPizza } from './graficos.js';

/**
 * Mostra a seção informada e esconde as demais.
 * @param {string} secao
 */
function mostrarSecao(secao) {
  document.getElementById('inicialSection').style.display = 'none';
  document.getElementById('planilhaSection').style.display = 'none';
  document.getElementById('investimentosSection').style.display = 'none';
  document.getElementById('graficosSection').style.display = 'none';
  document.getElementById('historicoSection').style.display = 'none';
  document.getElementById(`${secao}Section`).style.display = 'block';
  if (secao === 'historico') atualizarTabelaComparacao();
  if (secao === 'graficos') atualizarGraficoPizza();
  if (secao === 'planilha') atualizarResumoUI();
}

export { mostrarSecao }; 