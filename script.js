// --- Dados armazenados ---
// vagasOcupadas = {vagaNum: veiculoObjeto}
// historico = array de veículos que saíram

// --- Inicialização dos dados ---
let vagasOcupadas = JSON.parse(localStorage.getItem('vagasOcupadas')) || {};
let historico = JSON.parse(localStorage.getItem('historico')) || [];

// --- Elementos DOM ---
const vagasButtons = document.querySelectorAll('.vaga:not([disabled])');
const vagaSelecionadaInput = document.getElementById('vagaSelecionada');
const btnRegistrar = document.getElementById('btnRegistrar');
const msgVaga = document.getElementById('msgVaga');

const formRegistro = document.getElementById('formRegistro');
const tbodyVeiculos = document.querySelector("#vehicleTable tbody") || document.getElementById('tbodyVeiculos');
const tbodyHistorico = document.querySelector("#historyTable tbody") || document.getElementById('tbodyHistorico');

const totalVeiculosEl = document.getElementById('totalVeiculos');
const totalArrecadadoEl = document.getElementById('totalArrecadado');
const ultimaEntradaEl = document.getElementById('ultimaEntrada');
const totalHistoricoEl = document.getElementById('totalHistorico');
const btnLimparHistorico = document.getElementById('btnLimparHistorico');

let vagaSelecionada = null;

// --- Controle de exibição body e autenticação ---
if (!localStorage.getItem('token')) {
  window.location.href = 'login.html';
} else {
  document.body.classList.remove('hidden');
}

// --- Função para salvar dados no localStorage ---
function salvarLocalStorage() {
  localStorage.setItem('vagasOcupadas', JSON.stringify(vagasOcupadas));
  localStorage.setItem('historico', JSON.stringify(historico));
}

// --- Atualiza o UI das vagas ---
function atualizarVagasUI() {
  vagasButtons.forEach(btn => {
    const num = btn.dataset.vaga;
    if (vagasOcupadas[num]) {
      btn.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-red-500');
      btn.classList.add('bg-gray-700', 'cursor-not-allowed');
      btn.disabled = true;
      btn.setAttribute('aria-label', `Vaga ${num} ocupada`);
    } else {
      btn.disabled = false;
      btn.classList.remove('bg-gray-700', 'cursor-not-allowed');
      const cor = (num % 3 === 1) ? 'bg-green-500 hover:bg-green-600' :
                  (num % 3 === 2) ? 'bg-yellow-500 hover:bg-yellow-600' :
                                   'bg-red-500 hover:bg-red-600';
      btn.className = `vaga text-white font-bold py-3 rounded ${cor}`;
      btn.setAttribute('aria-label', `Vaga ${num} disponível`);
    }
  });
}

// --- Atualiza tabela de veículos estacionados ---
function atualizarTabelaVeiculos() {
  tbodyVeiculos.innerHTML = '';
  for (const vaga in vagasOcupadas) {
    const v = vagasOcupadas[vaga];
    const tr = document.createElement('tr');
    tr.className = 'border-b hover:bg-gray-50';

    const horaEntrada = new Date(v.entrada);
    const horaStr = horaEntrada.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    tr.innerHTML = `
      <td class="py-2 px-3">${vaga}</td>
      <td class="py-2 px-3">${v.nome}</td>
      <td class="py-2 px-3">${v.placa}</td>
      <td class="py-2 px-3 capitalize">${v.tipo}</td>
      <td class="py-2 px-3">${horaStr}</td>
      <td class="py-2 px-3">
        <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded btnRegistrarSaida" data-vaga="${vaga}">
          Registrar Saída
        </button>
      </td>
    `;
    tbodyVeiculos.appendChild(tr);
  }
}

// --- Atualiza tabela histórico ---
function atualizarHistoricoUI() {
  tbodyHistorico.innerHTML = '';
  historico.forEach(reg => {
    const tr = document.createElement('tr');
    tr.className = 'border-b hover:bg-gray-50';

    tr.innerHTML = `
      <td class="py-2 px-3">${reg.vaga || '-'}</td>
      <td class="py-2 px-3">${reg.nome}</td>
      <td class="py-2 px-3">${reg.placa}</td>
      <td class="py-2 px-3">${reg.tempo}</td>
      <td class="py-2 px-3">R$ ${reg.valor.toFixed(2)}</td>
    `;
    tbodyHistorico.appendChild(tr);
  });
}

// --- Atualiza painel administrativo ---
function atualizarPainel() {
  totalVeiculosEl.textContent = Object.keys(vagasOcupadas).length;
  const arrecadado = historico.reduce((acc, cur) => acc + cur.valor, 0);
  totalArrecadadoEl.textContent = `R$ ${arrecadado.toFixed(2)}`;

  if (Object.keys(vagasOcupadas).length > 0) {
    const ultEntrada = Object.values(vagasOcupadas).reduce((a,b) => new Date(a.entrada) > new Date(b.entrada) ? a : b);
    ultimaEntradaEl.textContent = new Date(ultEntrada.entrada).toLocaleString();
  } else {
    ultimaEntradaEl.textContent = '—';
  }

  totalHistoricoEl.textContent = historico.length;
}

// --- Seleção de vaga ---
vagasButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    vagaSelecionada = btn.dataset.vaga;
    vagaSelecionadaInput.value = vagaSelecionada;
    btnRegistrar.disabled = false;
    msgVaga.classList.add('hidden');

   
  // Alternar visual de seleção
btn.classList.toggle('ring-4');
btn.classList.toggle('ring-blue-400');

  });
});

// --- Registrar entrada ---
formRegistro.addEventListener('submit', e => {
  e.preventDefault();

  if (!vagaSelecionada) {
    msgVaga.classList.remove('hidden');
    return;
  }

  if (vagasOcupadas[vagaSelecionada]) {
    alert('Essa vaga já está ocupada!');
    return;
  }

  const nome = formRegistro.nome.value.trim();
  const placa = formRegistro.placa.value.trim().toUpperCase();
  const tipo = formRegistro.tipo.value;

  // Salvar entrada na vaga selecionada
  vagasOcupadas[vagaSelecionada] = {
    nome,
    placa,
    tipo,
    entrada: new Date().toISOString(),
  };

  // Reset form
  formRegistro.reset();
  vagaSelecionada = null;
  vagaSelecionadaInput.value = '';
  btnRegistrar.disabled = true;

  atualizarVagasUI();
  atualizarTabelaVeiculos();
  atualizarPainel();
  salvarLocalStorage();
});

// --- Registrar saída ---
tbodyVeiculos.addEventListener('click', e => {
  if (e.target.classList.contains('btnRegistrarSaida')) {
    const vaga = e.target.dataset.vaga;
    const veiculo = vagasOcupadas[vaga];
    if (!veiculo) return;

    const entrada = new Date(veiculo.entrada);
    const saida = new Date();

    // Calcula minutos estacionados
    const diffMs = saida - entrada;
    const minutos = Math.ceil(diffMs / (1000 * 60));

    // Regra de preço:
    // R$ 1,00 por minuto até 60 minutos, depois R$ 0,50 por minuto adicional
    let valor = 0;
    if (minutos <= 60) {
      valor = minutos * 1.0;
    } else {
      valor = 60 * 1.0 + (minutos - 60) * 0.5;
    }

    // Adiciona ao histórico
    historico.push({
      vaga,
      nome: veiculo.nome,
      placa: veiculo.placa,
      tempo: minutos,
      valor,
      entrada: veiculo.entrada,
      saida: saida.toISOString(),
    });

    // Remove da vaga ocupada
    delete vagasOcupadas[vaga];

    atualizarVagasUI();
    atualizarTabelaVeiculos();
    atualizarHistoricoUI();
    atualizarPainel();
    salvarLocalStorage();

    alert(`Saída registrada!\nTempo: ${minutos} minutos\nValor: R$ ${valor.toFixed(2)}`);
  }
});

// --- Limpar histórico ---
btnLimparHistorico.addEventListener('click', () => {
  if (confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
    historico = [];
    atualizarHistoricoUI();
    atualizarPainel();
    salvarLocalStorage();
  }
});

// --- Logout ---
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// --- Inicialização da página ---
document.addEventListener("DOMContentLoaded", () => {
  atualizarVagasUI();
  atualizarTabelaVeiculos();
  atualizarHistoricoUI();
  atualizarPainel();
});
