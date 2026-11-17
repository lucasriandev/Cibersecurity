const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

// Simulando um banco de dados com comentários públicos
const comentarios = [
  { autor: "Ana", texto: "Ótimo sistema, tudo funcionando muito bem!" },
  { autor: "Pedro", texto: "Alguém sabe o horário de atendimento?" },
];

// Rota principal que exibe o formulário e lista os comentários
app.get("/", (req, res) => {
  // Simulando um cookie de sessão secreto salvo no navegador da vítima
  res.setHeader("Set-Cookie", "session_id=TOKEN_SECRETO_DO_ADMIN_998877");

  // FALHA: O servidor pega o texto do usuário e joga direto dentro do HTML sem sanitizar!
  const listaHtml = comentarios
    .map(
      (c) => `<div style="border-bottom: 1px solid #ccc; padding: 8px;">
                  <strong>${escaparHTML(c.autor)}:</strong> ${escaparHTML(c.texto)}
                </div>`,
    )
    .join("");

  res.send(`
    <h2>Mural de Comentários da Empresa</h2>
    <form action="/comentar" method="POST">
      <input type="text" name="autor" placeholder="Seu nome" required><br><br>
      <textarea name="texto" placeholder="Escreva seu comentário..." rows="3" cols="40" required></textarea><br><br>
      <button type="submit">Publicar Comentário</button>
    </form>
    <hr>
    <h3>Comentários Recentes:</h3>
    ${listaHtml}
  `);
});

// Rota que salva o comentário no "banco"
app.post("/comentar", (req, res) => {
  const { autor, texto } = req.body;
  comentarios.push({ autor, texto });
  res.redirect("/");
});

function escaparHTML(texto) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Na hora de exibir:
// <strong>${escaparHTML(c.autor)}:</strong> ${escaparHTML(c.texto)}

app.listen(3000, () => {
  console.log("Mural rodando em http://localhost:3000");
});
