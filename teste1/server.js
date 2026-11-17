const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

app.post("/login", (req, res) => {
  // O servidor pega tudo o que vem do formulário, incluindo um possível campo "isAdmin"
  const { usuario, senha, isAdmin } = req.body;

  console.log("Dados recebidos:", req.body);

  // Qualquer utilizador comum entra, mas só quem tem isAdmin verdadeiro vê o painel secreto
  if (isAdmin === "true" || isAdmin === true) {
    return res.send("<h1>PAINEL SECRETO DO ADMINISTRADOR DESBLOQUEADO!</h1>");
  }

  return res.send(
    `<h1>Olá, ${usuario}. Você é apenas um utilizador comum.</h1>`,
  );
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

//<input type="hidden" name="isAdmin" value="true"> no elements antes do form
//document.querySelector('form').insertAdjacentHTML('beforeend', '<input type="hidden" name="isAdmin" value="true">'); no console.
