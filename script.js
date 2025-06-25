// Utilidades para Local Storage
function salvarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
  }
  function carregarDados(chave, padrao) {
    return JSON.parse(localStorage.getItem(chave)) || padrao;
  }
  
  // Dados iniciais
  let despesasFixas = carregarDados('despesasFixas', []);
  let debitos = carregarDados('debitos', []);
  let cartoes = carregarDados('cartoes', []);
  let economias = carregarDados('economias', []);
  let resumo = carregarDados('resumo', {
    saldoAnterior: 0, salario: 0, bonus: 0
  });
  
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
    salvarDados('despesasFixas', despesasFixas);
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
    salvarDados('debitos', debitos);
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
    salvarDados('cartoes', cartoes);
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
  
  // Editar item
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
  
  // Resumo
  function atualizarResumoForm() {
    // Converte valores vazios para 0
    const getValue = (id) => {
      const value = document.getElementById(id).value;
      return value === '' ? 0 : Number(value);
    };

    resumo = {
      saldoAnterior: getValue('saldoAnterior'),
      salario: getValue('salario'),
      bonus: getValue('bonus')
    };
    
    salvarDados('resumo', resumo);
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
  
  // Função para resetar tudo
  window.resetarTudo = function() {
    if (confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      despesasFixas = [];
      debitos = [];
      cartoes = [];
      economias = [];
      resumo = {
        saldoAnterior: 0,
        salario: 0,
        bonus: 0
      };
      
      salvarDados('despesasFixas', despesasFixas);
      salvarDados('debitos', debitos);
      salvarDados('cartoes', cartoes);
      salvarDados('economias', economias);
      salvarDados('resumo', resumo);
      
      document.getElementById('saldoAnterior').value = '';
      document.getElementById('salario').value = '';
      document.getElementById('bonus').value = '';
      
      atualizarTabelaDespesasFixas();
      atualizarTabelaDebito();
      atualizarTabelaCartao();
      atualizarTabelaEconomias();
      atualizarResumo();
    }
  };

  // Função para novo mês
  window.novoMes = function() {
    if (confirm('Deseja iniciar um novo mês? As despesas fixas serão mantidas e a sobra será transferida para o saldo anterior.')) {
      const sobra = Number(resumo.saldoAnterior) + Number(resumo.salario) + Number(resumo.bonus) -
        (despesasFixas.reduce((s, d) => s + d.valor, 0) + 
         debitos.reduce((s, d) => s + d.valor, 0) + 
         cartoes.reduce((s, d) => s + d.valor, 0));
      
      debitos = [];
      cartoes = [];
      resumo = {
        saldoAnterior: sobra,
        salario: 0,
        bonus: 0
      };
      
      salvarDados('debitos', debitos);
      salvarDados('cartoes', cartoes);
      salvarDados('resumo', resumo);
      
      document.getElementById('saldoAnterior').value = sobra;
      document.getElementById('salario').value = '';
      document.getElementById('bonus').value = '';
      
      atualizarTabelaDebito();
      atualizarTabelaCartao();
      atualizarResumo();
    }
  };
  
  // Carregar dados ao iniciar
  function carregarTudo() {
    // Preencher formulários
    saldoAnterior.value = resumo.saldoAnterior;
    salario.value = resumo.salario;
    bonus.value = resumo.bonus;
    atualizarTabelaDespesasFixas();
    atualizarTabelaDebito();
    atualizarTabelaCartao();
    atualizarTabelaEconomias();
    atualizarResumo();
  }

  // Navegação entre seções
  function mostrarSecao(secao) {
    // Esconder todas as seções
    document.getElementById('inicialSection').style.display = 'none';
    document.getElementById('planilhaSection').style.display = 'none';
    document.getElementById('investimentosSection').style.display = 'none';
    document.getElementById('graficosSection').style.display = 'none';
    
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
    
    // Atualizar botões mobile
    document.getElementById('btnInicialMobile').classList.remove('active', 'btn-primary');
    document.getElementById('btnInicialMobile').classList.add('btn-outline-light');
    document.getElementById('btnPlanilhaMobile').classList.remove('active', 'btn-success');
    document.getElementById('btnPlanilhaMobile').classList.add('btn-outline-light');
    document.getElementById('btnInvestimentosMobile').classList.remove('active', 'btn-success');
    document.getElementById('btnInvestimentosMobile').classList.add('btn-outline-light');
    document.getElementById('btnGraficosMobile').classList.remove('active', 'btn-success');
    document.getElementById('btnGraficosMobile').classList.add('btn-outline-light');
    
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
    }
  }

  // Event listeners para navegação
  document.getElementById('btnInicial').addEventListener('click', () => mostrarSecao('inicial'));
  document.getElementById('btnPlanilha').addEventListener('click', () => mostrarSecao('planilha'));
  document.getElementById('btnInvestimentos').addEventListener('click', () => mostrarSecao('investimentos'));
  document.getElementById('btnGraficos').addEventListener('click', () => mostrarSecao('graficos'));

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
    const filtroTipo = document.getElementById('filtroTipo').value;
    let dados = [];
    
    // Coletar dados baseado no filtro
    if (filtroTipo === 'todos' || filtroTipo === 'despesasFixas') {
      despesasFixas.forEach(item => {
        dados.push({
          categoria: item.categoria,
          valor: item.valor,
          tipo: 'Despesas Fixas'
        });
      });
    }
    
    if (filtroTipo === 'todos' || filtroTipo === 'debito') {
      debitos.forEach(item => {
        dados.push({
          categoria: item.categoria,
          valor: item.valor,
          tipo: 'Débito'
        });
      });
    }
    
    if (filtroTipo === 'todos' || filtroTipo === 'cartao') {
      cartoes.forEach(item => {
        dados.push({
          categoria: item.categoria,
          valor: item.valor,
          tipo: 'Cartão'
        });
      });
    }
    
    // Agrupar por categoria
    const gastosPorCategoria = {};
    dados.forEach(item => {
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