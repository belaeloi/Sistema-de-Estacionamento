// Dados de login simulados (você pode mudar depois)
const user = {
    username: "admin",
    password: "1234"
  };
  
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const inputUser = document.getElementById("username").value;
    const inputPass = document.getElementById("password").value;
  
    if (inputUser === user.username && inputPass === user.password) {
      // Salva um "token" no localStorage simulando autenticação
      localStorage.setItem("token", "usuario-logado");
  
      // Redireciona para o sistema (index.html ou dashboard.html se quiser)
      window.location.href = "index.html";
    } else {
      document.getElementById("loginError").textContent = "Usuário ou senha incorretos.";
    }
  });