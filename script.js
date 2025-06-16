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
      <b>DINHEIRO DO MÊS = SALDO ANTERIOR + SALÁRIO + BÔNUS: R$ </b>${dinheiroMes.toFixed(2)}<br>
      <b>DESPESAS FIXAS:</b> R$ ${totalDespesasFixas.toFixed(2)}<br>
      <b>DÉBITO:</b> R$ ${totalDebito.toFixed(2)}<br>
      <b>FATURA CARTÃO:</b> R$ ${totalCartao.toFixed(2)}<br>
      <b>TOTAL DESPESAS:</b> R$ ${totalDespesas.toFixed(2)}<br>
      <b>DINHEIRO EM CONTA (DINHEIRO DO MÊS - DESPESAS):</b> R$ ${dinheiroConta.toFixed(2)}<br>
      <b>SOBRA (Dinheiro em conta - fatura do próximo mês):</b> <span style="color:blue"><b>R$ ${sobra.toFixed(2)}</b></span>
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