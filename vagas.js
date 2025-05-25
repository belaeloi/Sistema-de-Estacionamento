// Dados iniciais das vagas
let vagas = [
  { numero: 1, tipoVeiculo: "Carro", status: "Disponível" },
  { numero: 2, tipoVeiculo: "Moto", status: "Ocupado" },
  { numero: 3, tipoVeiculo: "Carro", status: "Reservado" },
  { numero: 4, tipoVeiculo: "Caminhão", status: "Disponível" },
];

// Referências HTML
const tbody = document.querySelector("#tabela-vagas tbody");
const modal = document.getElementById("modal-vaga");
const form = document.getElementById("form-vaga");
const inputNumero = document.getElementById("vaga-numero");
const inputTipo = document.getElementById("vaga-tipo");
const inputStatus = document.getElementById("vaga-status");
const btnSalvar = document.getElementById("btn-salvar");
const btnFechar = document.getElementById("btn-fechar");

let editIndex = null; // controla se é edição ou nova vaga

// Função para renderizar tabela
function renderizarVagas() {
  tbody.innerHTML = "";
  if (vagas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center; padding:1rem; color:#666;">
          Nenhuma vaga cadastrada.
        </td>
      </tr>
    `;
    return;
  }

  vagas.forEach((vaga, index) => {
    const tr = document.createElement("tr");

    let statusColor = "";
    switch (vaga.status.toLowerCase()) {
      case "disponível": statusColor = "green"; break;
      case "ocupado": statusColor = "red"; break;
      case "reservado": statusColor = "orange"; break;
      default: statusColor = "gray";
    }

    tr.innerHTML = `
      <td>${vaga.numero}</td>
      <td>${vaga.tipoVeiculo}</td>
      <td style="color:${statusColor}; font-weight:bold;">${vaga.status}</td>
      <td>
        <button onclick="editarVaga(${index})">Editar</button>
        <button onclick="excluirVaga(${index})" style="color:red;">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Abrir modal para nova vaga
function novaVaga() {
  editIndex = null;
  inputNumero.value = "";
  inputTipo.value = "";
  inputStatus.value = "Disponível";
  modal.style.display = "flex";
}

// Abrir modal para editar vaga existente
function editarVaga(index) {
  editIndex = index;
  const vaga = vagas[index];
  inputNumero.value = vaga.numero;
  inputTipo.value = vaga.tipoVeiculo;
  inputStatus.value = vaga.status;
  modal.style.display = "flex";
}

// Excluir vaga
function excluirVaga(index) {
  if (confirm("Deseja realmente excluir esta vaga?")) {
    vagas.splice(index, 1);
    renderizarVagas();
  }
}

// Fechar modal
function fecharModal() {
  modal.style.display = "none";
}

// Salvar vaga (adicionar ou editar)
function salvarVaga(event) {
  event.preventDefault();

  const numero = parseInt(inputNumero.value);
  const tipo = inputTipo.value.trim();
  const status = inputStatus.value;

  if (!numero || !tipo) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const vagaExistente = vagas.find((v, i) => v.numero === numero && i !== editIndex);
  if (vagaExistente) {
    alert("Já existe uma vaga com este número.");
    return;
  }

  const novaVaga = { numero, tipoVeiculo: tipo, status };

  if (editIndex === null) {
    vagas.push(novaVaga);
  } else {
    vagas[editIndex] = novaVaga;
  }

  fecharModal();
  renderizarVagas();
}

// Eventos do DOM
document.addEventListener("DOMContentLoaded", () => {
  renderizarVagas();

  document.getElementById("btn-nova-vaga").addEventListener("click", novaVaga);
  btnFechar.addEventListener("click", fecharModal);
  form.addEventListener("submit", salvarVaga);
});

// Exponha as funções editarVaga e excluirVaga para o escopo global
window.editarVaga = editarVaga;
window.excluirVaga = excluirVaga;
