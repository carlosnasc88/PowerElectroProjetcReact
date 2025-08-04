const express = require("express");
const cors = require("cors");

const casasRoutes = require("../powereletecreact/routes/casasRoutes");
const inquilinosRoutes = require("../powereletecreact/routes/inquilinosRoutes");
const quemSomosRoutes = require("./routes/quemSomosRoutes");
const relatorioRoutes = require("./controllers/relatorioController");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/casas", casasRoutes);
app.use('/', casasRoutes);
app.use("/CasasAtivas", casasRoutes);
app.use("/bloco", casasRoutes);
app.use("/inquilinos", inquilinosRoutes);
app.use("/listagem-inquilinos",inquilinosRoutes)
app.use("/usuarios", require("./routes/usuarioRoutes"));
app.use("/usuarios/listar", require("./routes/usuarioRoutes"));
app.use("/QuemSomos", quemSomosRoutes);
app.use('/relatorios', relatorioRoutes);




const port = 5500;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
