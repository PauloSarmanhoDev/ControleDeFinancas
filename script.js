// Utilidades para Local Storage
function salvarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
  }
  function carregarDados(chave, padrao) {
    return JSON.parse(localStorage.getItem(chave)) || padrao;
  }
  
  // Sistema de meses
  let mesAtual = null; // Identificador do mês selecionado
  let meses = carregarDados('meses', {}); // Dados de todos os meses
  let economias = carregarDados('economias', []); // Economias independentes de mês
  
  // Função para obter dados do mês
  function obterDadosMes(mesId) {
    return meses[mesId] || {
      despesasFixas: [],
      debitos: [],
      cartoes: [],
      resumo: { saldoAnterior: 0, salario: 0, bonus: 0 }
    };
  }
  
  // Função para salvar dados do mês
  function salvarDadosMes(mesId, dados) {
    meses[mesId] = dados;
    salvarDados('meses', meses);
  }
  
  // Função para carregar dados de um mês específico
  function carregarDadosMes(mesId) {
    console.log('Carregando dados do mês:', mesId);
    const dados = obterDadosMes(mesId);
    console.log('Dados carregados:', dados);
    
    despesasFixas = dados.despesasFixas;
    debitos = dados.debitos;
    cartoes = dados.cartoes;
    resumo = dados.resumo;
    
    console.log('Resumo carregado:', resumo);
    
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
  
  // Função para preencher campos do formulário de resumo
  function preencherCamposResumo() {
    document.getElementById('saldoAnterior').value = resumo.saldoAnterior || '';
    document.getElementById('salario').value = resumo.salario || '';
    document.getElementById('bonus').value = resumo.bonus || '';
  }
  
  // Função para salvar dados do mês atual
  function salvarDadosAtuais() {
    if (mesAtual) {
      const dados = {
        despesasFixas,
        debitos,
        cartoes,
        resumo
      };
      console.log('Salvando dados para mês:', mesAtual, dados);
      salvarDadosMes(mesAtual, dados);
    } else {
      console.log('Nenhum mês selecionado para salvar');
    }
  }
  
  // Função para criar mês inicial automaticamente
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
  
  // Variáveis globais para o mês atual
  let despesasFixas = [];
  let debitos = [];
  let cartoes = [];
  let resumo = { saldoAnterior: 0, salario: 0, bonus: 0 };
  
  // Funções para gerenciar popups
  function abrirPopup(tipo) {
    if (tipo === 'resumo') return; // Não abre popup para resumo
    document.getElementById(`popup${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).style.display = 'block';
  }
  function fecharPopup(tipo) {
    if (tipo === 'resumo') return; // Não fecha popup para resumo
    document.getElementById(`popup${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).style.display = 'none';
  }
  
  // Função para editar item
  function editarItem(tipo, index) {
    const item = {
      'despesasFixas': despesasFixas[index],
      'debito': debitos[index],
      'cartao': cartoes[index],
      'economias': economias[index]
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
  
  // Função para editar item
  document.getElementById('formEditar').onsubmit = function(e) {
    e.preventDefault();
    const index = parseInt(editIndex.value);
    const tipo = editTipo.value;
    const item = {
      nome: editNome.value,
      valor: parseFloat(editValor.value),
      categoria: editCategoria.value,
      parcela: editParcela.value
    };
  
    switch(tipo) {
      case 'despesasFixas':
        despesasFixas[index] = { ...item, categoria: 'Contas Fixas' };
        atualizarTabelaDespesasFixas();
        break;
      case 'debito':
        debitos[index] = item;
        atualizarTabelaDebito();
        break;
      case 'cartao':
        cartoes[index] = item;
        atualizarTabelaCartao();
        break;
      case 'economias':
        economias[index] = { nome: item.nome, valor: item.valor };
        atualizarTabelaEconomias();
        break;
    }
  
    fecharPopup('editar');
  };
  
  // Funções para atualizar tabelas
  function atualizarTabelaDespesasFixas() {
    const tbody = document.querySelector('#tabelaDespesasFixas tbody');
    tbody.innerHTML = '';
    despesasFixas.forEach((item, i) => {
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
  function atualizarTabelaDebito() {
    const tbody = document.querySelector('#tabelaDebito tbody');
    tbody.innerHTML = '';
    debitos.forEach((item, i) => {
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
  function atualizarTabelaCartao() {
    const tbody = document.querySelector('#tabelaCartao tbody');
    tbody.innerHTML = '';
    cartoes.forEach((item, i) => {
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
  function atualizarTabelaEconomias() {
    const tbody = document.querySelector('#tabelaEconomias tbody');
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
  
  // Remover itens
  window.removerDespesaFixa = function(i) {
    despesasFixas.splice(i, 1);
    atualizarTabelaDespesasFixas();
  };
  window.removerDebito = function(i) {
    debitos.splice(i, 1);
    atualizarTabelaDebito();
  };
  window.removerCartao = function(i) {
    cartoes.splice(i, 1);
    atualizarTabelaCartao();
  };
  window.removerEconomia = function(i) {
    economias.splice(i, 1);
    atualizarTabelaEconomias();
  };
  
  // Adicionar itens
  document.getElementById('formDespesasFixas').onsubmit = function(e) {
    e.preventDefault();
    despesasFixas.push({
      nome: despesaFixaNome.value,
      valor: parseFloat(despesaFixaValor.value),
      categoria: 'Contas Fixas'
    });
    this.reset();
    fecharPopup('despesasFixas');
    atualizarTabelaDespesasFixas();
  };
  document.getElementById('formDebito').onsubmit = function(e) {
    e.preventDefault();
    debitos.push({
      nome: debitoNome.value,
      valor: parseFloat(debitoValor.value),
      categoria: debitoCategoria.value
    });
    this.reset();
    fecharPopup('debito');
    atualizarTabelaDebito();
  };
  document.getElementById('formCartao').onsubmit = function(e) {
    e.preventDefault();
    cartoes.push({
      nome: cartaoNome.value,
      valor: parseFloat(cartaoValor.value),
      categoria: cartaoCategoria.value,
      parcela: cartaoParcela.value
    });
    this.reset();
    fecharPopup('cartao');
    atualizarTabelaCartao();
  };
  document.getElementById('formEconomias').onsubmit = function(e) {
    e.preventDefault();
    economias.push({
      nome: ecoNome.value,
      valor: parseFloat(ecoValor.value)
    });
    this.reset();
    fecharPopup('economias');
    atualizarTabelaEconomias();
  };
  
  // Resumo
  function atualizarResumoForm() {
    // Converte valores vazios para 0
    const getValue = (id) => {
      const value = document.getElementById(id).value;
      return value === '' ? 0 : Number(value);
    };

    // Atualizar apenas os valores do resumo com os dados dos campos
    resumo.saldoAnterior = getValue('saldoAnterior');
    resumo.salario = getValue('salario');
    resumo.bonus = getValue('bonus');
    
    // Salvar dados e atualizar resumo
    salvarDadosAtuais();
    atualizarResumo();
  }

  function atualizarResumo() {
    // Totais
    const totalDespesasFixas = despesasFixas.reduce((s, d) => s + d.valor, 0);
    const totalDebito = debitos.reduce((s, d) => s + d.valor, 0);
    const totalCartao = cartoes.reduce((s, d) => s + d.valor, 0);
    const dinheiroMes = Number(resumo.saldoAnterior) + Number(resumo.salario) + Number(resumo.bonus);
    const totalDespesas = totalDespesasFixas + totalDebito + totalCartao;
    const dinheiroConta = dinheiroMes - totalDespesas;
    const sobra = dinheiroConta - totalCartao;

    document.getElementById('resumoValores').innerHTML = `
      <b>SALDO ANTERIOR:</b> R$ ${Number(resumo.saldoAnterior).toFixed(2)}<br>
      <b>SALÁRIO:</b> R$ ${Number(resumo.salario).toFixed(2)}<br>
      <b>BÔNUS:</b> R$ ${Number(resumo.bonus).toFixed(2)}<br>
      <hr>
      <b>DINHEIRO DO MÊS:</b> R$ ${dinheiroMes.toFixed(2)} <button type="button" class="btn btn-link p-0 ms-1" onclick="mostrarAjuda('dinheiroMes')" title="Clique para mais informações" style="color: #0d6efd; text-decoration: none; font-size: 1.1rem;">❓</button><br>
      <b>DESPESAS FIXAS:</b> R$ ${totalDespesasFixas.toFixed(2)}<br>
      <b>DÉBITO:</b> R$ ${totalDebito.toFixed(2)}<br>
      <b>FATURA CARTÃO:</b> R$ ${totalCartao.toFixed(2)}<br>
      <b>TOTAL DESPESAS:</b> R$ ${totalDespesas.toFixed(2)}<br>
      <b>DINHEIRO EM CONTA:</b> R$ ${dinheiroConta.toFixed(2)} <button type="button" class="btn btn-link p-0 ms-1" onclick="mostrarAjuda('dinheiroConta')" title="Clique para mais informações" style="color: #0d6efd; text-decoration: none; font-size: 1.1rem;">❓</button><br>
      <b>SOBRA:</b> <span style="color:blue"><b>R$ ${sobra.toFixed(2)}</b></span> <button type="button" class="btn btn-link p-0 ms-1" onclick="mostrarAjuda('sobra')" title="Clique para mais informações" style="color: #0d6efd; text-decoration: none; font-size: 1.1rem;">❓</button>
    `;
  }
  
  // Carregar dados ao iniciar
  function carregarTudo() {
    // Criar mês inicial ou carregar mês existente
    criarMesInicial();
    
    // Carregar economias independentes
    economias = carregarDados('economias', []);
    
    // Atualizar tabelas
    atualizarTabelaDespesasFixas();
    atualizarTabelaDebito();
    atualizarTabelaCartao();
    atualizarTabelaEconomias();
    atualizarResumo();
    
    // Inicializar seletor de meses
    atualizarSeletorMeses();
  }

  // Navegação entre seções
  function mostrarSecao(secao) {
    // Esconder todas as seções
    document.getElementById('inicialSection').style.display = 'none';
    document.getElementById('planilhaSection').style.display = 'none';
    document.getElementById('investimentosSection').style.display = 'none';
    document.getElementById('graficosSection').style.display = 'none';
    document.getElementById('historicoSection').style.display = 'none';
    
    // Mostrar a seção selecionada
    document.getElementById(`${secao}Section`).style.display = 'block';
    
    // Atualizar botões desktop
    document.getElementById('btnInicial').classList.remove('active', 'btn-primary');
    document.getElementById('btnInicial').classList.add('btn-outline-light');
    document.getElementById('btnPlanilha').classList.remove('active', 'btn-success');
    document.getElementById('btnPlanilha').classList.add('btn-outline-light');
    document.getElementById('btnInvestimentos').classList.remove('active', 'btn-success');
    document.getElementById('btnInvestimentos').classList.add('btn-outline-light');
    document.getElementById('btnGraficos').classList.remove('active', 'btn-success');
    document.getElementById('btnGraficos').classList.add('btn-outline-light');
    document.getElementById('btnHistorico').classList.remove('active', 'btn-success');
    document.getElementById('btnHistorico').classList.add('btn-outline-light');
    
    // Atualizar botões mobile
    document.getElementById('btnInicialMobile').classList.remove('active', 'btn-primary');
    document.getElementById('btnInicialMobile').classList.add('btn-outline-light');
    document.getElementById('btnPlanilhaMobile').classList.remove('active', 'btn-success');
    document.getElementById('btnPlanilhaMobile').classList.add('btn-outline-light');
    document.getElementById('btnInvestimentosMobile').classList.remove('active', 'btn-success');
    document.getElementById('btnInvestimentosMobile').classList.add('btn-outline-light');
    document.getElementById('btnGraficosMobile').classList.remove('active', 'btn-success');
    document.getElementById('btnGraficosMobile').classList.add('btn-outline-light');
    document.getElementById('btnHistoricoMobile').classList.remove('active', 'btn-success');
    document.getElementById('btnHistoricoMobile').classList.add('btn-outline-light');
    
    // Ativar o botão correto
    switch(secao) {
      case 'inicial':
        document.getElementById('btnInicial').classList.remove('btn-outline-light');
        document.getElementById('btnInicial').classList.add('active', 'btn-primary');
        document.getElementById('btnInicialMobile').classList.remove('btn-outline-light');
        document.getElementById('btnInicialMobile').classList.add('active', 'btn-primary');
        break;
      case 'planilha':
        document.getElementById('btnPlanilha').classList.remove('btn-outline-light');
        document.getElementById('btnPlanilha').classList.add('active', 'btn-success');
        document.getElementById('btnPlanilhaMobile').classList.remove('btn-outline-light');
        document.getElementById('btnPlanilhaMobile').classList.add('active', 'btn-success');
        break;
      case 'investimentos':
        document.getElementById('btnInvestimentos').classList.remove('btn-outline-light');
        document.getElementById('btnInvestimentos').classList.add('active', 'btn-success');
        document.getElementById('btnInvestimentosMobile').classList.remove('btn-outline-light');
        document.getElementById('btnInvestimentosMobile').classList.add('active', 'btn-success');
        break;
      case 'graficos':
        document.getElementById('btnGraficos').classList.remove('btn-outline-light');
        document.getElementById('btnGraficos').classList.add('active', 'btn-success');
        document.getElementById('btnGraficosMobile').classList.remove('btn-outline-light');
        document.getElementById('btnGraficosMobile').classList.add('active', 'btn-success');
        atualizarGrafico();
        break;
      case 'historico':
        document.getElementById('btnHistorico').classList.remove('btn-outline-light');
        document.getElementById('btnHistorico').classList.add('active', 'btn-success');
        document.getElementById('btnHistoricoMobile').classList.remove('btn-outline-light');
        document.getElementById('btnHistoricoMobile').classList.add('active', 'btn-success');
        atualizarTabelaComparacao();
        break;
    }
  }

  // Event listeners para navegação
  document.getElementById('btnInicial').addEventListener('click', () => mostrarSecao('inicial'));
  document.getElementById('btnPlanilha').addEventListener('click', () => mostrarSecao('planilha'));
  document.getElementById('btnInvestimentos').addEventListener('click', () => mostrarSecao('investimentos'));
  document.getElementById('btnGraficos').addEventListener('click', () => mostrarSecao('graficos'));
  document.getElementById('btnHistorico').addEventListener('click', () => mostrarSecao('historico'));

  // Event listeners para navegação mobile
  document.getElementById('btnInicialMobile').addEventListener('click', () => {
    mostrarSecao('inicial');
    // Fechar menu mobile
    const navbarMobile = document.getElementById('navbarMobile');
    const bsCollapse = new bootstrap.Collapse(navbarMobile, {toggle: false});
    bsCollapse.hide();
  });
  document.getElementById('btnPlanilhaMobile').addEventListener('click', () => {
    mostrarSecao('planilha');
    const navbarMobile = document.getElementById('navbarMobile');
    const bsCollapse = new bootstrap.Collapse(navbarMobile, {toggle: false});
    bsCollapse.hide();
  });
  document.getElementById('btnInvestimentosMobile').addEventListener('click', () => {
    mostrarSecao('investimentos');
    const navbarMobile = document.getElementById('navbarMobile');
    const bsCollapse = new bootstrap.Collapse(navbarMobile, {toggle: false});
    bsCollapse.hide();
  });
  document.getElementById('btnGraficosMobile').addEventListener('click', () => {
    mostrarSecao('graficos');
    const navbarMobile = document.getElementById('navbarMobile');
    const bsCollapse = new bootstrap.Collapse(navbarMobile, {toggle: false});
    bsCollapse.hide();
  });
  document.getElementById('btnHistoricoMobile').addEventListener('click', () => {
    mostrarSecao('historico');
    const navbarMobile = document.getElementById('navbarMobile');
    const bsCollapse = new bootstrap.Collapse(navbarMobile, {toggle: false});
    bsCollapse.hide();
  });

  // Função para mostrar popups de ajuda
  function mostrarAjuda(tipo) {
    console.log('Função mostrarAjuda chamada com tipo:', tipo); // Debug
    
    const explicacoes = {
      'dinheiroMes': 'Dinheiro total disponível no mês = Saldo Anterior + Salário + Bônus',
      'dinheiroConta': 'Dinheiro que sobra após pagar todas as despesas = Dinheiro do Mês - Total de Despesas',
      'sobra': 'Valor que sobra após reservar para a fatura do cartão do próximo mês = Dinheiro em Conta - Fatura do Cartão'
    };
    
    const explicacao = explicacoes[tipo];
    if (explicacao) {
      console.log('Explicação encontrada:', explicacao); // Debug
      
      // Remover popup anterior se existir
      const popupAnterior = document.querySelector('.popup-ajuda');
      if (popupAnterior) {
        popupAnterior.remove();
      }
      
      // Criar popup de ajuda
      const popup = document.createElement('div');
      popup.className = 'popup-ajuda';
      popup.innerHTML = `
        <div class="popup-ajuda-content">
          <span class="close-ajuda" onclick="fecharPopupAjuda()">&times;</span>
          <h6><i class="bi bi-info-circle text-primary"></i> Explicação</h6>
          <p>${explicacao}</p>
        </div>
      `;
      document.body.appendChild(popup);
      
      // Adicionar evento de clique fora do popup para fechar
      popup.addEventListener('click', function(e) {
        if (e.target === popup) {
          fecharPopupAjuda();
        }
      });
      
      // Remover popup após 5 segundos
      setTimeout(() => {
        fecharPopupAjuda();
      }, 5000);
    } else {
      console.log('Explicação não encontrada para tipo:', tipo); // Debug
    }
  }

  // Função para fechar popup de ajuda
  function fecharPopupAjuda() {
    const popup = document.querySelector('.popup-ajuda');
    if (popup) {
      popup.remove();
    }
  }

  // Tornar funções globais
  window.mostrarAjuda = mostrarAjuda;
  window.fecharPopupAjuda = fecharPopupAjuda;

  // Variável global para o gráfico
  let graficoPizza = null;

  // Função para criar/atualizar gráfico
  function atualizarGrafico() {
    // Usar dados do mês atual
    const dados = obterDadosMes(mesAtual);
    atualizarGraficoComDados(dados);
  }

  // Função para atualizar gráfico com dados específicos
  function atualizarGraficoComDados(dados) {
    const filtroTipo = document.getElementById('filtroTipo').value;
    let dadosFiltrados = [];
    
    // Coletar dados baseado no filtro
    if (filtroTipo === 'todos' || filtroTipo === 'despesasFixas') {
      dados.despesasFixas.forEach(item => {
        dadosFiltrados.push({
          categoria: item.categoria,
          valor: item.valor,
          tipo: 'Despesas Fixas'
        });
      });
    }
    
    if (filtroTipo === 'todos' || filtroTipo === 'debito') {
      dados.debitos.forEach(item => {
        dadosFiltrados.push({
          categoria: item.categoria,
          valor: item.valor,
          tipo: 'Débito'
        });
      });
    }
    
    if (filtroTipo === 'todos' || filtroTipo === 'cartao') {
      dados.cartoes.forEach(item => {
        dadosFiltrados.push({
          categoria: item.categoria,
          valor: item.valor,
          tipo: 'Cartão'
        });
      });
    }
    
    // Agrupar por categoria
    const gastosPorCategoria = {};
    dadosFiltrados.forEach(item => {
      if (gastosPorCategoria[item.categoria]) {
        gastosPorCategoria[item.categoria] += item.valor;
      } else {
        gastosPorCategoria[item.categoria] = item.valor;
      }
    });
    
    // Preparar dados para o gráfico
    const categorias = Object.keys(gastosPorCategoria);
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
    const ctx = document.getElementById('graficoPizza').getContext('2d');
    graficoPizza = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categorias,
        datasets: [{
          data: valores,
          backgroundColor: cores.slice(0, categorias.length),
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
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: R$ ${context.parsed.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
    
    // Atualizar resumo dos gráficos
    atualizarResumoGraficos(gastosPorCategoria);
  }

  // Função para atualizar resumo dos gráficos
  function atualizarResumoGraficos(gastosPorCategoria) {
    const total = Object.values(gastosPorCategoria).reduce((a, b) => a + b, 0);
    const categorias = Object.keys(gastosPorCategoria);
    
    let html = `<h6>Total: R$ ${total.toFixed(2)}</h6><hr>`;
    
    categorias.forEach(categoria => {
      const valor = gastosPorCategoria[categoria];
      const porcentagem = ((valor / total) * 100).toFixed(1);
      html += `
        <div class="mb-2">
          <strong>${categoria}:</strong><br>
          R$ ${valor.toFixed(2)} (${porcentagem}%)
        </div>
      `;
    });
    
    document.getElementById('resumoGraficos').innerHTML = html;
  }

  window.onload = carregarTudo;

  // Função para remover item atual
  window.removerItemAtual = function() {
    const index = parseInt(document.getElementById('editIndex').value);
    const tipo = document.getElementById('editTipo').value;
    
    if (confirm('Tem certeza que deseja remover este item?')) {
      switch(tipo) {
        case 'despesasFixas':
          despesasFixas.splice(index, 1);
          atualizarTabelaDespesasFixas();
          break;
        case 'debito':
          debitos.splice(index, 1);
          atualizarTabelaDebito();
          break;
        case 'cartao':
          cartoes.splice(index, 1);
          atualizarTabelaCartao();
          break;
        case 'economias':
          economias.splice(index, 1);
          atualizarTabelaEconomias();
          break;
      }
      fecharPopup('editar');
    }
  };

  // Funções para gerenciar meses
  function formatarNomeMes(mesId) {
    const [ano, mes] = mesId.split('-');
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${meses[parseInt(mes) - 1]}/${ano}`;
  }

  function atualizarSeletorMeses() {
    const seletor = document.getElementById('seletorMes');
    const seletorGraficos = document.getElementById('seletorMesGraficos');
    
    // Atualizar seletor da planilha
    seletor.innerHTML = '';
    
    // Verificar se há meses cadastrados
    if (Object.keys(meses).length === 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Nenhum mês cadastrado';
      option.disabled = true;
      seletor.appendChild(option);
    } else {
      // Adicionar todos os meses ordenados (mais recente primeiro)
      Object.keys(meses).sort().reverse().forEach(mesId => {
        const option = document.createElement('option');
        option.value = mesId;
        option.textContent = formatarNomeMes(mesId);
        seletor.appendChild(option);
      });
    }
    
    // Selecionar mês atual na planilha
    if (mesAtual) {
      seletor.value = mesAtual;
    }
    
    // Atualizar seletor dos gráficos
    if (seletorGraficos) {
      seletorGraficos.innerHTML = '';
      
      if (Object.keys(meses).length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Nenhum mês cadastrado';
        option.disabled = true;
        seletorGraficos.appendChild(option);
      } else {
        Object.keys(meses).sort().reverse().forEach(mesId => {
          const option = document.createElement('option');
          option.value = mesId;
          option.textContent = formatarNomeMes(mesId);
          seletorGraficos.appendChild(option);
        });
      }
      
      // Selecionar mês atual nos gráficos
      if (mesAtual) {
        seletorGraficos.value = mesAtual;
      }
    }
  }

  function trocarMes() {
    const novoMes = document.getElementById('seletorMes').value;
    if (novoMes && novoMes !== mesAtual) {
      // Salvar dados do mês atual antes de trocar
      if (mesAtual) {
        console.log('Salvando dados do mês atual:', mesAtual, resumo);
        salvarDadosAtuais();
      }
      
      console.log('Trocando para mês:', novoMes);
      mesAtual = novoMes;
      carregarDadosMes(mesAtual);
    }
  }

  function trocarMesGraficos() {
    const novoMes = document.getElementById('seletorMesGraficos').value;
    if (novoMes) {
      console.log('Trocando mês nos gráficos para:', novoMes);
      // Carregar dados do mês selecionado para os gráficos
      const dados = obterDadosMes(novoMes);
      
      // Atualizar gráfico com os dados do mês selecionado
      atualizarGraficoComDados(dados);
    }
  }

  function criarNovoMes() {
    // Definir próximo mês como padrão
    const hoje = new Date();
    const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
    const mesAno = proximoMes.toISOString().slice(0, 7);
    
    // Calcular sobra do mês atual
    const dadosAtual = obterDadosMes(mesAtual);
    const receitaAtual = dadosAtual.resumo.saldoAnterior + dadosAtual.resumo.salario + dadosAtual.resumo.bonus;
    const totalDespesasAtual = dadosAtual.despesasFixas.reduce((s, d) => s + d.valor, 0) + 
                               dadosAtual.debitos.reduce((s, d) => s + d.valor, 0) + 
                               dadosAtual.cartoes.reduce((s, d) => s + d.valor, 0);
    const sobra = receitaAtual - totalDespesasAtual;
    
    document.getElementById('novoMesAno').value = mesAno;
    document.getElementById('novoMesSaldoAnterior').value = sobra.toFixed(2);
    document.getElementById('novoMesSalario').value = dadosAtual.resumo.salario || '';
    document.getElementById('novoMesBonus').value = '';
    document.getElementById('copiarDespesasFixas').checked = false;
    
    abrirPopup('novoMes');
  }

  // Event listener para o formulário de novo mês
  document.getElementById('formNovoMes').onsubmit = function(e) {
    e.preventDefault();
    
    const mesAno = document.getElementById('novoMesAno').value;
    const saldoAnterior = parseFloat(document.getElementById('novoMesSaldoAnterior').value) || 0;
    const salario = parseFloat(document.getElementById('novoMesSalario').value) || 0;
    const bonus = parseFloat(document.getElementById('novoMesBonus').value) || 0;
    const copiarDespesasFixas = document.getElementById('copiarDespesasFixas').checked;
    
    // Verificar se o mês já existe
    if (meses[mesAno]) {
      alert('Este mês já existe! Escolha outro mês.');
      return;
    }
    
    // Obter dados do mês mais recente para copiar despesas fixas
    const mesesOrdenados = Object.keys(meses).sort().reverse();
    const mesMaisRecente = mesesOrdenados[0];
    const dadosMesRecente = mesMaisRecente ? obterDadosMes(mesMaisRecente) : null;
    
    // Criar dados do novo mês
    const dadosNovoMes = {
      despesasFixas: copiarDespesasFixas && dadosMesRecente ? [...dadosMesRecente.despesasFixas] : [],
      debitos: [],
      cartoes: [],
      resumo: {
        saldoAnterior: saldoAnterior,
        salario: salario,
        bonus: bonus
      }
    };
    
    // Salvar novo mês
    meses[mesAno] = dadosNovoMes;
    salvarDados('meses', meses);
    
    // Atualizar seletor
    atualizarSeletorMeses();
    
    // Selecionar o novo mês
    document.getElementById('seletorMes').value = mesAno;
    trocarMes();
    
    // Fechar popup
    fecharPopup('novoMes');
    this.reset();
  };

  // Função para atualizar tabela de comparação
  function atualizarTabelaComparacao() {
    const tbody = document.querySelector('#tabelaComparacao tbody');
    tbody.innerHTML = '';
    
    // Adicionar todos os meses ordenados (mais recente primeiro)
    Object.keys(meses).sort().reverse().forEach(mesId => {
      const dados = meses[mesId];
      const receita = dados.resumo.saldoAnterior + dados.resumo.salario + dados.resumo.bonus;
      const despesasFixas = dados.despesasFixas.reduce((s, d) => s + d.valor, 0);
      const debito = dados.debitos.reduce((s, d) => s + d.valor, 0);
      const cartao = dados.cartoes.reduce((s, d) => s + d.valor, 0);
      const totalGastos = despesasFixas + debito + cartao;
      const saldoFinal = receita - totalGastos;
      
      const tr = document.createElement('tr');
      // Destacar o mês selecionado atualmente
      if (mesId === mesAtual) {
        tr.className = 'table-primary';
      }
      tr.innerHTML = `
        <td>${mesId === mesAtual ? '<strong>' + formatarNomeMes(mesId) + '</strong>' : formatarNomeMes(mesId)}</td>
        <td>R$ ${receita.toFixed(2)}</td>
        <td>R$ ${despesasFixas.toFixed(2)}</td>
        <td>R$ ${debito.toFixed(2)}</td>
        <td>R$ ${cartao.toFixed(2)}</td>
        <td>R$ ${totalGastos.toFixed(2)}</td>
        <td>${mesId === mesAtual ? '<strong>R$ ' + saldoFinal.toFixed(2) + '</strong>' : 'R$ ' + saldoFinal.toFixed(2)}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="excluirMes('${mesId}')" title="Excluir mês">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Função para excluir mês
  function excluirMes(mesId) {
    if (confirm(`Tem certeza que deseja excluir o mês ${formatarNomeMes(mesId)}? Esta ação não pode ser desfeita.`)) {
      // Remover o mês
      delete meses[mesId];
      salvarDados('meses', meses);
      
      // Se o mês excluído era o atual, selecionar o mais recente
      if (mesId === mesAtual) {
        const mesesRestantes = Object.keys(meses).sort().reverse();
        if (mesesRestantes.length > 0) {
          mesAtual = mesesRestantes[0];
          carregarDadosMes(mesAtual);
        } else {
          // Se não há mais meses, criar um novo
          criarMesInicial();
        }
      }
      
      // Atualizar interface
      atualizarSeletorMeses();
      atualizarTabelaComparacao();
    }
  }

  // Tornar funções globais
  window.trocarMes = trocarMes;
  window.criarNovoMes = criarNovoMes;
  window.excluirMes = excluirMes;
  window.trocarMesGraficos = trocarMesGraficos;