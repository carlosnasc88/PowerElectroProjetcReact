// server.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const port = 5500;

let casas = []; 

app.post("/casas", (req, res) => {
  const casa = req.body;
  casas.push(casa);
  res.status(201).json({ message: "Casa salva com sucesso!", casa });
});

app.get("/casas", (req, res) => {
  res.json(casas);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
