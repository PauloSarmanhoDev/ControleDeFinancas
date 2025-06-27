import { salvarDados, carregarDados } from './storage.js';

// Variáveis globais para o mês atual
let mesAtual = null; // Identificador do mês selecionado
let meses = carregarDados('meses', {}); // Dados de todos os meses
let economias = carregarDados('economias', []); // Economias independentes de mês

// Função temporária para abrir popup (será substituída pela importação)
let abrirPopup = null;
let atualizarGrafico = null;

/**
 * Define a função abrirPopup (chamada pelo main.js)
 * @param {Function} fn
 */
function setAbrirPopup(fn) {
  abrirPopup = fn;
}

/**
 * Define a função atualizarGrafico (chamada pelo main.js)
 * @param {Function} fn
 */
function setAtualizarGrafico(fn) {
  atualizarGrafico = fn;
}

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

/**
 * Carrega dados de um mês específico.
 * @param {string} mesId
 */
function carregarDadosMes(mesId) {
  console.log('Carregando dados do mês:', mesId);
  const dados = obterDadosMes(mesId);
  console.log('Dados carregados:', dados);
  
  // Preencher campos do formulário com os dados carregados
  preencherCamposResumo();
  
  // Atualizar interface
  atualizarTabelaDespesasFixas();
  atualizarTabelaDebito();
  atualizarTabelaCartao();
  atualizarTabelaEconomias();
  atualizarResumo();
  
  // Mostrar nome do mês selecionado
  if (mesId) {
    const nomeMes = formatarNomeMes(mesId);
    document.title = `Controle Financeiro - ${nomeMes}`;
  }
}

/**
 * Preenche campos do formulário de resumo.
 */
function preencherCamposResumo() {
  const dados = obterDadosMes(mesAtual);
  const saldoAnterior = document.getElementById('saldoAnterior');
  const salario = document.getElementById('salario');
  const bonus = document.getElementById('bonus');
  
  if (saldoAnterior) saldoAnterior.value = dados.resumo.saldoAnterior || '';
  if (salario) salario.value = dados.resumo.salario || '';
  if (bonus) bonus.value = dados.resumo.bonus || '';
}

/**
 * Salva dados do mês atual.
 */
function salvarDadosAtuais() {
  if (mesAtual) {
    const dados = obterDadosMes(mesAtual);
    console.log('Salvando dados para mês:', mesAtual, dados);
    salvarDadosMes(mesAtual, dados);
  } else {
    console.log('Nenhum mês selecionado para salvar');
  }
}

/**
 * Cria mês inicial automaticamente.
 */
function criarMesInicial() {
  const hoje = new Date();
  const mesAno = hoje.toISOString().slice(0, 7);
  
  if (Object.keys(meses).length === 0) {
    // Primeira vez usando o programa - criar mês atual automaticamente
    const dadosInicial = {
      despesasFixas: [],
      debitos: [],
      cartoes: [],
      resumo: { saldoAnterior: 0, salario: 0, bonus: 0 }
    };
    
    meses[mesAno] = dadosInicial;
    salvarDados('meses', meses);
    mesAtual = mesAno;
  } else {
    // Já existem meses - selecionar o mais recente
    const mesesOrdenados = Object.keys(meses).sort().reverse();
    mesAtual = mesesOrdenados[0];
  }
  
  // Carregar dados do mês selecionado
  carregarDadosMes(mesAtual);
}

/**
 * Formata nome do mês para exibição.
 * @param {string} mesId
 * @returns {string}
 */
function formatarNomeMes(mesId) {
  const [ano, mes] = mesId.split('-');
  const data = new Date(ano, mes - 1);
  return data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

/**
 * Atualiza seletor de meses.
 */
function atualizarSeletorMeses() {
  const seletorMes = document.getElementById('seletorMes');
  const seletorMesGraficos = document.getElementById('seletorMesGraficos');
  
  if (seletorMes) {
    seletorMes.innerHTML = '';
    const mesesOrdenados = Object.keys(meses).sort().reverse();
    
    mesesOrdenados.forEach(mesId => {
      const option = document.createElement('option');
      option.value = mesId;
      option.textContent = formatarNomeMes(mesId);
      seletorMes.appendChild(option);
    });
    
    if (mesAtual) {
      seletorMes.value = mesAtual;
    }
  }
  
  if (seletorMesGraficos) {
    seletorMesGraficos.innerHTML = '';
    const mesesOrdenados = Object.keys(meses).sort().reverse();
    
    mesesOrdenados.forEach(mesId => {
      const option = document.createElement('option');
      option.value = mesId;
      option.textContent = formatarNomeMes(mesId);
      seletorMesGraficos.appendChild(option);
    });
    
    if (mesAtual) {
      seletorMesGraficos.value = mesAtual;
    }
  }
}

/**
 * Sincroniza meses entre planilha e gráficos.
 * @param {string} novoMes
 */
function sincronizarMesesPlanilhaEGrafico(novoMes) {
  const seletorMes = document.getElementById('seletorMes');
  const seletorMesGraficos = document.getElementById('seletorMesGraficos');
  
  if (seletorMes) seletorMes.value = novoMes;
  if (seletorMesGraficos) seletorMesGraficos.value = novoMes;
}

/**
 * Troca o mês selecionado na planilha.
 */
function trocarMes() {
  console.log('Função trocarMes chamada');
  const seletorMes = document.getElementById('seletorMes');
  console.log('Seletor encontrado:', seletorMes);
  if (seletorMes && seletorMes.value) {
    console.log('Valor selecionado:', seletorMes.value);
    mesAtual = seletorMes.value;
    console.log('Mês atual definido como:', mesAtual);
    carregarDadosMes(mesAtual);
    sincronizarMesesPlanilhaEGrafico(mesAtual);
  } else {
    console.log('Seletor não encontrado ou sem valor');
  }
}

/**
 * Troca o mês selecionado nos gráficos.
 */
function trocarMesGraficos() {
  console.log('Função trocarMesGraficos chamada');
  const seletorMesGraficos = document.getElementById('seletorMesGraficos');
  console.log('Seletor encontrado:', seletorMesGraficos);
  if (seletorMesGraficos && seletorMesGraficos.value) {
    console.log('Valor selecionado:', seletorMesGraficos.value);
    mesAtual = seletorMesGraficos.value;
    console.log('Mês atual definido como:', mesAtual);
    carregarDadosMes(mesAtual);
    sincronizarMesesPlanilhaEGrafico(mesAtual);
    
    // Atualizar gráfico se estiver na seção de gráficos
    if (typeof atualizarGrafico === 'function') {
      console.log('Chamando atualizarGrafico');
      atualizarGrafico();
    } else {
      console.log('Função atualizarGrafico não está disponível');
    }
  } else {
    console.log('Seletor não encontrado ou sem valor');
  }
}

/**
 * Cria um novo mês.
 */
function criarNovoMes() {
  if (abrirPopup) {
    abrirPopup('novoMes');
  } else {
    console.error('Função abrirPopup não está disponível');
  }
}

/**
 * Atualiza o formulário de resumo.
 */
function atualizarResumoForm() {
  const getValue = (id) => {
    const element = document.getElementById(id);
    return element ? parseFloat(element.value) || 0 : 0;
  };

  const dados = obterDadosMes(mesAtual);
  dados.resumo.saldoAnterior = getValue('saldoAnterior');
  dados.resumo.salario = getValue('salario');
  dados.resumo.bonus = getValue('bonus');

  salvarDadosMes(mesAtual, dados);
  atualizarResumo();
}

/**
 * Atualiza o resumo financeiro.
 */
function atualizarResumo() {
  const resumoValores = document.getElementById('resumoValores');
  if (!resumoValores) return;

  const dados = obterDadosMes(mesAtual);
  const totalDespesasFixas = dados.despesasFixas.reduce((sum, item) => sum + item.valor, 0);
  const totalDebito = dados.debitos.reduce((sum, item) => sum + item.valor, 0);
  const totalCartao = dados.cartoes.reduce((sum, item) => sum + item.valor, 0);
  const totalFixoDebito = totalDespesasFixas + totalDebito;
  const totalGastos = totalDespesasFixas + totalDebito + totalCartao;
  const receitaTotal = dados.resumo.salario + dados.resumo.bonus;
  const dinheiroMes = dados.resumo.saldoAnterior + receitaTotal;
  const dinheiroEmConta = dinheiroMes - totalDespesasFixas - totalDebito;
  const sobra = dinheiroMes - totalGastos;

  resumoValores.innerHTML = `
    <div class="row g-2">
      <div class="col-6">
        <small class="text-muted">Dinheiro do Mês:</small><br>
        <strong class="text-success">R$ ${dinheiroMes.toFixed(2)}</strong>
      </div>
      <div class="col-6">
        <small class="text-muted">Pagamentos à vista:</small><br>
        <strong class="text-danger">R$ ${totalFixoDebito.toFixed(2)}</strong>
      </div>
      <div class="col-6">
        <small class="text-muted">Débito:</small><br>
        <strong class="text-warning">R$ ${totalDebito.toFixed(2)}</strong>
      </div>
      <div class="col-6">
        <small class="text-muted">Cartão:</small><br>
        <strong class="text-info">R$ ${totalCartao.toFixed(2)}</strong>
      </div>
      <div class="col-6">
        <small class="text-muted">Dinheiro em Conta:</small><br>
        <strong class="text-primary">R$ ${dinheiroEmConta.toFixed(2)}</strong>
      </div>
      <div class="col-6">
        <small class="text-muted">Sobra:</small><br>
        <strong class="${sobra >= 0 ? 'text-success' : 'text-danger'}">R$ ${sobra.toFixed(2)}</strong>
      </div>
    </div>
  `;
}

/**
 * Atualiza tabela de despesas fixas.
 */
function atualizarTabelaDespesasFixas() {
  const tbody = document.querySelector('#tabelaDespesasFixas tbody');
  if (!tbody) return;
  
  const dados = obterDadosMes(mesAtual);
  tbody.innerHTML = '';
  dados.despesasFixas.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td onclick="editarItem('despesasFixas', ${i})">${item.nome}</td>
      <td onclick="editarItem('despesasFixas', ${i})">${item.valor.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
  salvarDadosAtuais();
  atualizarResumo();
}

/**
 * Atualiza tabela de débito.
 */
function atualizarTabelaDebito() {
  const tbody = document.querySelector('#tabelaDebito tbody');
  if (!tbody) return;
  
  const dados = obterDadosMes(mesAtual);
  tbody.innerHTML = '';
  dados.debitos.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td onclick="editarItem('debito', ${i})">${item.nome}</td>
      <td onclick="editarItem('debito', ${i})">${item.valor.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
  salvarDadosAtuais();
  atualizarResumo();
}

/**
 * Atualiza tabela de cartão.
 */
function atualizarTabelaCartao() {
  const tbody = document.querySelector('#tabelaCartao tbody');
  if (!tbody) return;
  
  const dados = obterDadosMes(mesAtual);
  tbody.innerHTML = '';
  dados.cartoes.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td onclick="editarItem('cartao', ${i})">${item.nome}</td>
      <td onclick="editarItem('cartao', ${i})">${item.valor.toFixed(2)}</td>
      <td onclick="editarItem('cartao', ${i})">${item.parcela || ''}</td>
    `;
    tbody.appendChild(tr);
  });
  salvarDadosAtuais();
  atualizarResumo();
}

/**
 * Atualiza tabela de economias.
 */
function atualizarTabelaEconomias() {
  const tbody = document.querySelector('#tabelaEconomias tbody');
  if (!tbody) return;
  
  const economias = JSON.parse(localStorage.getItem('economias') || '[]');
  tbody.innerHTML = '';
  economias.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td onclick="editarItem('economias', ${i})">${item.nome}</td>
      <td onclick="editarItem('economias', ${i})">${item.valor.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
  salvarDados('economias', economias);
}

/**
 * Carrega todos os dados iniciais.
 */
function carregarTudo() {
  criarMesInicial();
  atualizarSeletorMeses();
  atualizarTabelaEconomias();
}

// Exporta variáveis e funções
export { 
  mesAtual, meses, economias,
  obterDadosMes, salvarDadosMes, carregarDadosMes, preencherCamposResumo,
  salvarDadosAtuais, criarMesInicial, formatarNomeMes, atualizarSeletorMeses,
  sincronizarMesesPlanilhaEGrafico, trocarMes, trocarMesGraficos, criarNovoMes,
  atualizarResumoForm, atualizarResumo, atualizarTabelaDespesasFixas,
  atualizarTabelaDebito, atualizarTabelaCartao, atualizarTabelaEconomias,
  carregarTudo, setAbrirPopup, setAtualizarGrafico
}; 