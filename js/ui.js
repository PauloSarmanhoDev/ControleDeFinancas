import { atualizarTabelaComparacao } from './historico.js';
import { atualizarGrafico } from './graficos.js';

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
  document.getElementById('configSection').style.display = 'none';
  document.getElementById(`${secao}Section`).style.display = 'block';
  if (secao === 'historico') atualizarTabelaComparacao();
  if (secao === 'graficos') atualizarGrafico();
}

/**
 * Alterna o modo escuro (dark mode) e salva a preferência no localStorage.
 */
function toggleDarkMode(force) {
  const body = document.body;
  let dark = force;
  if (typeof dark === 'undefined') {
    dark = !body.classList.contains('dark-mode');
  }
  if (dark) {
    body.classList.add('dark-mode');
    localStorage.setItem('darkMode', '1');
  } else {
    body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', '0');
  }
  // Sincroniza toggles
  const toggle = document.getElementById('toggleDarkModeConfig');
  if (toggle) toggle.checked = body.classList.contains('dark-mode');
}

// Eventos para botões do header e mobile
function setupHeaderEvents() {
  // Botões de configurações
  const btnConfig = document.getElementById('btnConfig');
  const btnConfigMobile = document.getElementById('btnConfigMobile');
  if (btnConfig) btnConfig.onclick = () => mostrarSecao('config');
  if (btnConfigMobile) btnConfigMobile.onclick = () => mostrarSecao('config');
  // Botões de dark mode
  const btnDark = document.getElementById('btnDarkMode');
  const btnDarkMobile = document.getElementById('btnDarkModeMobile');
  if (btnDark) btnDark.onclick = () => toggleDarkMode();
  if (btnDarkMobile) btnDarkMobile.onclick = () => toggleDarkMode();
  // Toggle na página de configurações
  const toggle = document.getElementById('toggleDarkModeConfig');
  if (toggle) toggle.onchange = () => toggleDarkMode(toggle.checked);
}

// Inicializa dark mode conforme preferência salva
function initDarkMode() {
  const dark = localStorage.getItem('darkMode') === '1';
  toggleDarkMode(dark);
}

export { mostrarSecao, toggleDarkMode, setupHeaderEvents, initDarkMode }; 