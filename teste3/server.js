const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(express.urlencoded({ extended: true }));

// Cria um banco de dados SQL real na memória RAM
const db = new sqlite3.Database(":memory:");

// Configura a tabela e insere o usuário administrador
db.serialize(() => {
  db.run(
    "CREATE TABLE usuarios (id INT, usuario TEXT, senha TEXT, cargo TEXT)",
  );
  db.run(
    "INSERT INTO usuarios VALUES (1, 'admin', 'SenhaUltraComplexa#2026', 'Diretor Geral')",
  );
  db.run("INSERT INTO usuarios VALUES (2, 'lucas', '123456', 'Estagiário')");
});

// Página de login
app.get("/", (req, res) => {
  res.send(`
    <h2>Sistema Corporativo (Banco SQL)</h2>
    <form action="/login" method="POST">
      <input type="text" name="usuario" placeholder="Usuário" required><br><br>
      <input type="password" name="senha" placeholder="Senha" required><br><br>
      <button type="submit">Entrar</button>
    </form>
  `);
});

// Rota vulnerável a SQL Injection
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  // FALHA CRÍTICA: Concatenar diretamente o input do usuário na query SQL!
  const query = `SELECT * FROM usuarios WHERE usuario = '${usuario}' AND senha = '${senha}'`;

  console.log("\n--- Query SQL executada no banco ---");
  console.log(query);

  db.get(query, (err, row) => {
    if (err) {
      return res
        .status(500)
        .send(`<h1>Erro no Banco de Dados:</h1><pre>${err.message}</pre>`);
    }

    if (row) {
      return res.send(`
        <h1>Acesso Liberado!</h1>
        <p>Bem-vindo, <strong>${row.usuario}</strong> (Cargo: ${row.cargo})</p>
        <a href="/">Sair</a>
      `);
    }

    return res.send(
      "<h1>Acesso Negado! Usuário ou senha inválidos.</h1><a href='/'>Tentar novamente</a>",
    );
  });
});

app.listen(3000, () => {
  console.log("Servidor SQL rodando em http://localhost:3000");
});

//' OR '1'='1' --
