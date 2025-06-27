import { obterDadosMes, salvarDadosMes, mesAtual, atualizarTabelaDespesasFixas, atualizarTabelaDebito, atualizarTabelaCartao, atualizarTabelaEconomias } from './meses.js';
import { salvarDados } from './storage.js';
import { mostrarSecao } from './ui.js';

/**
 * Abre um popup pelo tipo.
 * @param {string} tipo
 */
function abrirPopup(tipo) {
  const popup = document.getElementById(`popup${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
  popup.style.display = 'block';

  // Preenchimento automático para novo mês
  if (tipo === 'novoMes') {
    const dados = obterDadosMes(mesAtual);
    if (dados) {
      // Preencher salário
      document.getElementById('novoMesSalario').value = dados.resumo.salario || '';
      // Calcular sobra
      const totalDespesasFixas = (dados.despesasFixas || []).reduce((sum, item) => sum + item.valor, 0);
      const totalDebito = (dados.debitos || []).reduce((sum, item) => sum + item.valor, 0);
      const totalCartao = (dados.cartoes || []).reduce((sum, item) => sum + item.valor, 0);
      const receitaTotal = Number(dados.resumo.salario) + Number(dados.resumo.bonus);
      const dinheiroEmConta = Number(dados.resumo.saldoAnterior) + receitaTotal;
      const sobra = dinheiroEmConta - totalDespesasFixas - totalDebito - totalCartao;
      document.getElementById('novoMesSaldoAnterior').value = sobra.toFixed(2);
    }
  }
}

/**
 * Fecha um popup pelo tipo.
 * @param {string} tipo
 */
function fecharPopup(tipo) {
  document.getElementById(`popup${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).style.display = 'none';
}

/**
 * Edita um item específico.
 * @param {string} tipo
 * @param {number} index
 */
function editarItem(tipo, index) {
  const dados = obterDadosMes(mesAtual);
  const item = {
    'despesasFixas': dados.despesasFixas[index],
    'debito': dados.debitos[index],
    'cartao': dados.cartoes[index],
    'economias': JSON.parse(localStorage.getItem('economias') || '[]')[index]
  }[tipo];

  document.getElementById('editIndex').value = index;
  document.getElementById('editTipo').value = tipo;
  document.getElementById('editNome').value = item.nome;
  document.getElementById('editValor').value = item.valor;
  document.getElementById('editCategoria').value = item.categoria || '';
  document.getElementById('editParcela').value = item.parcela || '';
  
  // Ajusta visibilidade dos campos baseado no tipo
  document.getElementById('editCategoria').style.display = tipo === 'economias' ? 'none' : 'block';
  document.getElementById('editParcela').style.display = tipo === 'cartao' ? 'block' : 'none';
  
  abrirPopup('editar');
}

/**
 * Remove o item atual sendo editado.
 */
function removerItemAtual() {
  const index = parseInt(document.getElementById('editIndex').value);
  const tipo = document.getElementById('editTipo').value;
  
  const dados = obterDadosMes(mesAtual);
  
  switch(tipo) {
    case 'despesasFixas':
      dados.despesasFixas.splice(index, 1);
      salvarDadosMes(mesAtual, dados);
      atualizarTabelaDespesasFixas();
      break;
    case 'debito':
      dados.debitos.splice(index, 1);
      salvarDadosMes(mesAtual, dados);
      atualizarTabelaDebito();
      break;
    case 'cartao':
      dados.cartoes.splice(index, 1);
      salvarDadosMes(mesAtual, dados);
      atualizarTabelaCartao();
      break;
    case 'economias':
      const economias = JSON.parse(localStorage.getItem('economias') || '[]');
      economias.splice(index, 1);
      localStorage.setItem('economias', JSON.stringify(economias));
      atualizarTabelaEconomias();
      break;
  }
  
  fecharPopup('editar');
}

/**
 * Configura os eventos dos formulários.
 */
function configurarFormularios() {
  // Formulário de edição
  const formEditar = document.getElementById('formEditar');
  if (formEditar) {
    formEditar.onsubmit = function(e) {
      e.preventDefault();
      const index = parseInt(document.getElementById('editIndex').value);
      const tipo = document.getElementById('editTipo').value;
      const item = {
        nome: document.getElementById('editNome').value,
        valor: parseFloat(document.getElementById('editValor').value),
        categoria: document.getElementById('editCategoria').value,
        parcela: document.getElementById('editParcela').value
      };
    
      const dados = obterDadosMes(mesAtual);
    
      switch(tipo) {
        case 'despesasFixas':
          dados.despesasFixas[index] = { ...item, categoria: 'Contas Fixas' };
          salvarDadosMes(mesAtual, dados);
          atualizarTabelaDespesasFixas();
          break;
        case 'debito':
          dados.debitos[index] = item;
          salvarDadosMes(mesAtual, dados);
          atualizarTabelaDebito();
          break;
        case 'cartao':
          dados.cartoes[index] = item;
          salvarDadosMes(mesAtual, dados);
          atualizarTabelaCartao();
          break;
        case 'economias':
          const economias = JSON.parse(localStorage.getItem('economias') || '[]');
          economias[index] = { nome: item.nome, valor: item.valor };
          localStorage.setItem('economias', JSON.stringify(economias));
          atualizarTabelaEconomias();
          break;
      }
    
      fecharPopup('editar');
    };
  }

  // Formulário de despesas fixas
  const formDespesasFixas = document.getElementById('formDespesasFixas');
  if (formDespesasFixas) {
    formDespesasFixas.onsubmit = function(e) {
      e.preventDefault();
      const dados = obterDadosMes(mesAtual);
      dados.despesasFixas.push({
        nome: document.getElementById('despesaFixaNome').value,
        valor: parseFloat(document.getElementById('despesaFixaValor').value),
        categoria: 'Contas Fixas'
      });
      salvarDadosMes(mesAtual, dados);
      this.reset();
      fecharPopup('despesasFixas');
      atualizarTabelaDespesasFixas();
    };
  }

  // Formulário de débito
  const formDebito = document.getElementById('formDebito');
  if (formDebito) {
    formDebito.onsubmit = function(e) {
      e.preventDefault();
      const dados = obterDadosMes(mesAtual);
      dados.debitos.push({
        nome: document.getElementById('debitoNome').value,
        valor: parseFloat(document.getElementById('debitoValor').value),
        categoria: document.getElementById('debitoCategoria').value
      });
      salvarDadosMes(mesAtual, dados);
      this.reset();
      fecharPopup('debito');
      atualizarTabelaDebito();
    };
  }

  // Formulário de cartão
  const formCartao = document.getElementById('formCartao');
  if (formCartao) {
    formCartao.onsubmit = function(e) {
      e.preventDefault();
      const dados = obterDadosMes(mesAtual);
      dados.cartoes.push({
        nome: document.getElementById('cartaoNome').value,
        valor: parseFloat(document.getElementById('cartaoValor').value),
        categoria: document.getElementById('cartaoCategoria').value,
        parcela: document.getElementById('cartaoParcela').value
      });
      salvarDadosMes(mesAtual, dados);
      this.reset();
      fecharPopup('cartao');
      atualizarTabelaCartao();
    };
  }

  // Formulário de economias
  const formEconomias = document.getElementById('formEconomias');
  if (formEconomias) {
    formEconomias.onsubmit = function(e) {
      e.preventDefault();
      const economias = JSON.parse(localStorage.getItem('economias') || '[]');
      economias.push({
        nome: document.getElementById('ecoNome').value,
        valor: parseFloat(document.getElementById('ecoValor').value)
      });
      localStorage.setItem('economias', JSON.stringify(economias));
      this.reset();
      fecharPopup('economias');
      atualizarTabelaEconomias();
    };
  }

  // Formulário de novo mês
  const formNovoMes = document.getElementById('formNovoMes');
  if (formNovoMes) {
    formNovoMes.onsubmit = function(e) {
      e.preventDefault();
      const mesAno = document.getElementById('novoMesAno').value;
      const saldoAnterior = parseFloat(document.getElementById('novoMesSaldoAnterior').value) || 0;
      const salario = parseFloat(document.getElementById('novoMesSalario').value) || 0;
      const bonus = parseFloat(document.getElementById('novoMesBonus').value) || 0;
      const copiarDespesasFixas = document.getElementById('copiarDespesasFixas').checked;
      
      // Obter dados do mês atual para copiar despesas fixas
      const dadosAtual = obterDadosMes(mesAtual);
      
      // Criar novo mês
      const dadosNovoMes = {
        despesasFixas: copiarDespesasFixas ? [...dadosAtual.despesasFixas] : [],
        debitos: [],
        cartoes: [],
        resumo: { saldoAnterior, salario, bonus }
      };
      
      // Salvar novo mês
      const meses = JSON.parse(localStorage.getItem('meses') || '{}');
      meses[mesAno] = dadosNovoMes;
      localStorage.setItem('meses', JSON.stringify(meses));
      
      // Redirecionar para a planilha na próxima inicialização
      localStorage.setItem('abrirPlanilhaAoIniciar', '1');
      setTimeout(() => location.reload(), 100);
    };
  }
}

/**
 * Exporta todos os dados do sistema como um arquivo JSON.
 */
function exportarDados() {
  const dados = localStorage;
  const blob = new Blob([JSON.stringify(dados)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'financas-save.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Importa dados de um arquivo JSON e sobrescreve o localStorage.
 * @param {File} file
 * @param {Function} callback
 */
function importarDados(file, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const dados = JSON.parse(e.target.result);
      for (const key in dados) {
        localStorage.setItem(key, dados[key]);
      }
      if (callback) callback(true);
    } catch (err) {
      if (callback) callback(false);
    }
  };
  reader.readAsText(file);
}

/**
 * Reseta todos os dados do sistema (limpa o localStorage).
 */
function resetarDados() {
  if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
    localStorage.clear();
    location.reload();
  }
}

export { 
  abrirPopup, fecharPopup, editarItem, removerItemAtual, configurarFormularios,
  exportarDados, importarDados, resetarDados 
}; 