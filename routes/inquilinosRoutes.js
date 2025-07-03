

const express = require("express");
const router = express.Router();
const inquilinosController = require("../controllers/inquilinosController");

router.post("/", inquilinosController.adicionarInquilino);
router.get('/', inquilinosController.listarInquilinos);
router.delete('/:id', inquilinosController.excluirInquilino);
router.get('/listagem-inquilinos', inquilinosController.listarInquilinos);
router.get("/:id", inquilinosController.buscarInquilinoPorId);
router.put("/:id", inquilinosController.atualizarInquilino);




module.exports = router;
