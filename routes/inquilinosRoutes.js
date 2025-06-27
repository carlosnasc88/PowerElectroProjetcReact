

const express = require("express");
const router = express.Router();
const inquilinosController = require("../controllers/inquilinosController");

router.post("/", inquilinosController.adicionarInquilino);
//router.get("/blocos-disponiveis", inquilinosController.blocosDisponiveis);
// router.get("/casas-disponiveis/:bloco", inquilinosController.casasDisponiveisPorBloco);


module.exports = router;
