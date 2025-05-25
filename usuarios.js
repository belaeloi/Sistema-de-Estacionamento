// usuarios.js

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

function renderizarUsuarios() {
  const tbody = document.getElementById("tabela-usuarios");
  tbody.innerHTML = "";

  usuarios.forEach((usuario, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="py-2 px-4 border-b">${usuario.nome}</td>
      <td class="py-2 px-4 border-b">${usuario.email}</td>
      <td class="py-2 px-4 border-b">${usuario.tipo}</td>
      <td class="py-2 px-4 border-b text-center">
        <button onclick="editarUsuario(${index})" class="text-blue-500 hover:underline mr-2">Editar</button>
        <button onclick="excluirUsuario(${index})" class="text-red-500 hover:underline">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function abrirFormulario() {
  document.getElementById("formulario-usuario").classList.remove("hidden");
  document.getElementById("usuario-id").value = "";
  document.getElementById("usuario-nome").value = "";
  document.getElementById("usuario-email").value = "";
  document.getElementById("usuario-tipo").value = "admin";
}

function fecharFormulario() {
  document.getElementById("formulario-usuario").classList.add("hidden");
}

function salvarUsuario(event) {
  event.preventDefault();

  const id = document.getElementById("usuario-id").value;
  const nome = document.getElementById("usuario-nome").value;
  const email = document.getElementById("usuario-email").value;
  const tipo = document.getElementById("usuario-tipo").value;

  const novoUsuario = { nome, email, tipo };

  if (id === "") {
    usuarios.push(novoUsuario);
  } else {
    usuarios[parseInt(id)] = novoUsuario;
  }

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  fecharFormulario();
  renderizarUsuarios();
}

function editarUsuario(index) {
  const usuario = usuarios[index];

  document.getElementById("usuario-id").value = index;
  document.getElementById("usuario-nome").value = usuario.nome;
  document.getElementById("usuario-email").value = usuario.email;
  document.getElementById("usuario-tipo").value = usuario.tipo;

  abrirFormulario();
}

function excluirUsuario(index) {
  if (confirm("Tem certeza que deseja excluir este usuário?")) {
    usuarios.splice(index, 1);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    renderizarUsuarios();
  }
}

document.addEventListener("DOMContentLoaded", renderizarUsuarios);
