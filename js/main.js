import { mostrarSecao, setupHeaderEvents, initDarkMode } from './ui.js';
import { exportarDados, importarDados, resetarDados, abrirPopup, fecharPopup, editarItem, removerItemAtual, configurarFormularios } from './popups.js';
import { renderizarCardsComparacaoMobile, excluirMes, setAtualizarSeletorMeses } from './historico.js';
import { trocarMes, criarNovoMes, atualizarResumoForm, carregarTudo, atualizarSeletorMeses, setAbrirPopup, setAtualizarGrafico } from './meses.js';
import { atualizarGrafico, trocarMesGraficos } from './graficos.js';

// Exporta funções para o escopo global para funcionar com eventos inline
window.trocarMes = trocarMes;
window.criarNovoMes = criarNovoMes;
window.atualizarResumoForm = atualizarResumoForm;
window.abrirPopup = abrirPopup;
window.fecharPopup = fecharPopup;
window.atualizarGrafico = atualizarGrafico;
window.trocarMesGraficos = trocarMesGraficos;
window.editarItem = editarItem;
window.removerItemAtual = removerItemAtual;
window.excluirMes = excluirMes;

// Inicialização do app
window.onload = function() {
  // Configura as funções nos módulos
  setAbrirPopup(abrirPopup);
  setAtualizarGrafico(atualizarGrafico);
  setAtualizarSeletorMeses(atualizarSeletorMeses);
  
  // Inicializa dark mode conforme preferência
  initDarkMode();
  // Configura eventos do header
  setupHeaderEvents();
  // Configura formulários
  configurarFormularios();
  // Carrega dados iniciais
  carregarTudo();
  // Exibe a seção inicial
  mostrarSecao('inicial');

  // Eventos para exportar/importar/resetar dados
  const btnExportar = document.getElementById('btnExportar');
  const btnImportar = document.getElementById('btnImportar');
  const btnResetar = document.getElementById('btnResetar');
  const inputImportar = document.getElementById('inputImportar');

  if (btnExportar) btnExportar.onclick = exportarDados;
  if (btnImportar && inputImportar) {
    btnImportar.onclick = () => inputImportar.click();
    inputImportar.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        importarDados(e.target.files[0], (ok) => {
          if (ok) alert('Dados importados com sucesso! A página será recarregada.');
          else alert('Erro ao importar dados.');
          location.reload();
        });
      }
    };
  }
  if (btnResetar) btnResetar.onclick = resetarDados;

  // Eventos para navegação (desktop)
  const navs = [
    { id: 'btnInicial', secao: 'inicial' },
    { id: 'btnPlanilha', secao: 'planilha' },
    { id: 'btnGraficos', secao: 'graficos' },
    { id: 'btnInvestimentos', secao: 'investimentos' },
    { id: 'btnHistorico', secao: 'historico' }
  ];
  navs.forEach(({ id, secao }) => {
    const btn = document.getElementById(id);
    if (btn) btn.onclick = () => mostrarSecao(secao);
  });

  // Eventos para navegação (mobile)
  const navsMobile = [
    { id: 'btnInicialMobile', secao: 'inicial' },
    { id: 'btnPlanilhaMobile', secao: 'planilha' },
    { id: 'btnGraficosMobile', secao: 'graficos' },
    { id: 'btnInvestimentosMobile', secao: 'investimentos' },
    { id: 'btnHistoricoMobile', secao: 'historico' }
  ];
  navsMobile.forEach(({ id, secao }) => {
    const btn = document.getElementById(id);
    if (btn) btn.onclick = () => {
      mostrarSecao(secao);
      // Renderiza cards mobile ao navegar para histórico
      if (secao === 'historico') renderizarCardsComparacaoMobile();
      // Fecha o menu mobile se estiver aberto
      const navbarMobile = document.getElementById('navbarMobile');
      if (navbarMobile && navbarMobile.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarMobile);
        bsCollapse.hide();
      }
    };
  });

  // Eventos para botões da página inicial
  document.querySelectorAll('.inicial-navegar').forEach(btn => {
    btn.onclick = function() {
      const secao = btn.getAttribute('data-secao');
      mostrarSecao(secao);
      if (secao === 'historico') renderizarCardsComparacaoMobile();
    };
  });

  // Corrigir seleção de mês inválida
  const seletorMes = document.getElementById('seletorMes');
  if (seletorMes) {
    seletorMes.addEventListener('change', function() {
      if (!seletorMes.value) {
        // Seleção inválida, seleciona o primeiro mês válido
        const first = Array.from(seletorMes.options).find(opt => opt.value);
        if (first) seletorMes.value = first.value;
      }
    });
  }
  const seletorMesGraficos = document.getElementById('seletorMesGraficos');
  if (seletorMesGraficos) {
    seletorMesGraficos.addEventListener('change', function() {
      if (!seletorMesGraficos.value) {
        const first = Array.from(seletorMesGraficos.options).find(opt => opt.value);
        if (first) seletorMesGraficos.value = first.value;
      }
    });
  }
}; 