const express = require("express");
const cors = require("cors");

const casasRoutes = require("../powereletecreact/routes/casasRoutes");
const inquilinosRoutes = require("../powereletecreact/routes/inquilinosRoutes");
//const ListagemCasasAtivas = require("./")
const app = express();
app.use(cors());
app.use(express.json());

app.use("/casas", casasRoutes);
app.use("/CasasAtivas", casasRoutes);
app.use("/inquilinos", inquilinosRoutes);

const port = 5500;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
