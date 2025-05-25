// Exemplo de dados - substitua pelos seus dados reais
const registros = [
  { usuario: "João Silva", vaga: 1, dataInicio: "2025-05-01", dataFim: "2025-05-10" },
  { usuario: "Maria Oliveira", vaga: 2, dataInicio: "2025-05-05", dataFim: "" },
  { usuario: "Carlos Souza", vaga: 3, dataInicio: "2025-04-20", dataFim: "2025-05-01" },
  { usuario: "Ana Paula", vaga: 4, dataInicio: "2025-05-10", dataFim: "" },
];

const tbody = document.getElementById("tabela-registros");
const filtroInput = document.getElementById("filtro-usuario");

function formatarData(dataStr) {
  if (!dataStr) return "-";
  const d = new Date(dataStr);
  if (isNaN(d)) return dataStr;
  return d.toLocaleDateString("pt-BR");
}

function renderizarRegistros(filtro = "") {
  tbody.innerHTML = "";

  // Filtra registros pelo usuário (case insensitive)
  const filtrados = registros.filter(reg =>
    reg.usuario.toLowerCase().includes(filtro.toLowerCase())
  );

  if (filtrados.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-6 text-gray-400 italic">
          Nenhum registro encontrado.
        </td>
      </tr>
    `;
    return;
  }

  filtrados.forEach(reg => {
    const tr = document.createElement("tr");
    tr.classList.add("hover:bg-gray-100", "transition");
    tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">${reg.usuario}</td>
      <td class="px-6 py-4 whitespace-nowrap">${reg.vaga}</td>
      <td class="px-6 py-4 whitespace-nowrap">${formatarData(reg.dataInicio)}</td>
      <td class="px-6 py-4 whitespace-nowrap">${formatarData(reg.dataFim)}</td>
    `;
    tbody.appendChild(tr);
  });
}

filtroInput.addEventListener("input", e => {
  renderizarRegistros(e.target.value);
});

document.addEventListener("DOMContentLoaded", () => renderizarRegistros());
