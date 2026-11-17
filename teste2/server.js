const express = require("express");
const app = express();

// Simulando um banco de dados de usuários com dados sensíveis
const bancoDeUsuarios = {
  1: { id: 1, nome: "João (Você)", saldo: "R$ 150,00", cpf: "111.111.111-11" },
  2: {
    id: 2,
    nome: "Maria Silva",
    saldo: "R$ 45.800,00",
    cpf: "222.222.222-22",
  },
  3: {
    id: 3,
    nome: "Diretor Carlos",
    saldo: "R$ 320.000,00",
    cpf: "333.333.333-33",
  },
};

// Simulando que você já fez login e sua sessão pertence ao ID 1
const USUARIO_LOGADO_ID = 1;

// Página inicial com um link direto para o seu perfil
app.get("/", (req, res) => {
  res.send(`
    <h2>Bem-vindo ao Banco Seguro</h2>
    <p>Você está logado como: <strong>João</strong></p>
    <a href="/perfil?id=${USUARIO_LOGADO_ID}">Ver meus dados bancários</a>
  `);
});

// Rota vulnerável a IDOR
app.get("/perfil", (req, res) => {
  const idSolicitado = req.query.id; // Pega o número que vem depois de ?id= na URL
  const usuario = bancoDeUsuarios[idSolicitado];

  if (!usuario) {
    return res.status(404).send("<h1>Usuário não encontrado</h1>");
  }

  // Antes de devolver os dados, valida a posse do recurso:
  if (Number(idSolicitado) !== USUARIO_LOGADO_ID) {
    return res
      .status(403)
      .send(
        "<h1>Acesso Negado (403): Você não pode ver dados de terceiros!</h1>",
      );
  }
  // FALHA: O servidor busca o ID da URL sem conferir se é o mesmo USUARIO_LOGADO_ID!
  res.send(`
    <h2>Dados Confidenciais</h2>
    <p><strong>Nome:</strong> ${usuario.nome}</p>
    <p><strong>CPF:</strong> ${usuario.cpf}</p>
    <p><strong>Saldo em conta:</strong> ${usuario.saldo}</p>
    <br><a href="/">Voltar</a>
  `);
});

app.listen(3000, () => {
  console.log("Banco rodando em http://localhost:3000");
});
