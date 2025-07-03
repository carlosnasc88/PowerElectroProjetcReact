const express = require("express");
const router = express.Router();
const casasController = require("../controllers/casasController");

router.post("/", casasController.adicionarCasa);
router.get("/", casasController.listarCasas);
router.get("/CasasAtivas", casasController.listarCasasAtivas);
router.get("/blocos-disponiveis", casasController.blocosDisponiveis);
router.get("/casas-disponiveis/:bloco", casasController.casasDisponiveisPorBloco);
router.get("/numeroaps-disponiveis/:bloco", casasController.numeroApDisponiveisPorBloco);


module.exports = router;
