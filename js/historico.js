import { meses, mesAtual, obterDadosMes } from './meses.js';

/**
 * Renderiza a tabela de comparação de meses (desktop).
 */
function atualizarTabelaComparacao() {
  const tbody = document.querySelector('#tabelaComparacao tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  Object.keys(meses).sort().reverse().forEach(mesId => {
    const dados = meses[mesId];
    const receita = dados.resumo.saldoAnterior + dados.resumo.salario + dados.resumo.bonus;
    const despesasFixas = dados.despesasFixas.reduce((s, d) => s + d.valor, 0);
    const debito = dados.debitos.reduce((s, d) => s + d.valor, 0);
    const cartao = dados.cartoes.reduce((s, d) => s + d.valor, 0);
    const totalGastos = despesasFixas + debito + cartao;
    const saldoFinal = receita - totalGastos;
    const tr = document.createElement('tr');
    if (mesId === mesAtual) tr.className = 'table-primary';
    tr.innerHTML = `
      <td>${mesId === mesAtual ? '<strong>' + mesId + '</strong>' : mesId}</td>
      <td>R$ ${receita.toFixed(2)}</td>
      <td>R$ ${despesasFixas.toFixed(2)}</td>
      <td>R$ ${debito.toFixed(2)}</td>
      <td>R$ ${cartao.toFixed(2)}</td>
      <td>R$ ${totalGastos.toFixed(2)}</td>
      <td>${mesId === mesAtual ? '<strong>R$ ' + saldoFinal.toFixed(2) + '</strong>' : 'R$ ' + saldoFinal.toFixed(2)}</td>
      <td><button class="btn btn-danger btn-sm" onclick="excluirMes('${mesId}')" title="Excluir mês"><i class="bi bi-trash"></i></button></td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Renderiza os cards de comparação no mobile.
 */
function renderizarCardsComparacaoMobile() {
  const container = document.getElementById('cardsComparacaoMobile');
  if (!container) return;
  container.innerHTML = '';
  Object.keys(meses).sort().reverse().forEach(mesId => {
    const dados = meses[mesId];
    const receita = dados.resumo.saldoAnterior + dados.resumo.salario + dados.resumo.bonus;
    const despesasFixas = dados.despesasFixas.reduce((s, d) => s + d.valor, 0);
    const debito = dados.debitos.reduce((s, d) => s + d.valor, 0);
    const cartao = dados.cartoes.reduce((s, d) => s + d.valor, 0);
    const totalGastos = despesasFixas + debito + cartao;
    const saldoFinal = receita - totalGastos;
    const card = document.createElement('div');
    card.className = 'card mb-3';
    card.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <strong>${mesId}</strong>
          <button class="btn btn-danger btn-sm" onclick="excluirMes('${mesId}')" title="Excluir mês">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div><b>Receita Total:</b> R$ ${receita.toFixed(2)}</div>
        <div><b>Despesas Fixas:</b> R$ ${despesasFixas.toFixed(2)}</div>
        <div><b>Débito:</b> R$ ${debito.toFixed(2)}</div>
        <div><b>Cartão:</b> R$ ${cartao.toFixed(2)}</div>
        <div><b>Total Gastos:</b> R$ ${totalGastos.toFixed(2)}</div>
        <div><b>Saldo Final:</b> <b>R$ ${saldoFinal.toFixed(2)}</b></div>
      </div>
    `;
    if (mesId === mesAtual) card.classList.add('border-primary');
    container.appendChild(card);
  });
}

export { atualizarTabelaComparacao, renderizarCardsComparacaoMobile }; 