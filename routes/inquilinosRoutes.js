const express = require("express");
const router = express.Router();
const inquilinosController = require("../controllers/inquilinosController");

//POST
router.post("/", inquilinosController.adicionarInquilino);
//GET
router.get('/', inquilinosController.listarInquilinos);

router.get('/historico-consumo/:id', inquilinosController.buscarHistoricoConsumo); 
router.get('/listagem-inquilinos', inquilinosController.listarInquilinos);
router.get('/:id', inquilinosController.buscarInquilinoPorId);
//router.get('/:id/historico', inquilinosController.buscarHistoricoConsumo);
router.get('/:id/historico-consumo', inquilinosController.buscarHistoricoConsumo);

router.get('/inquilinos/:id/historico-consumo', inquilinosController.buscarHistoricoConsumo);
router.get('/:id/historico-completo', inquilinosController.buscarHistoricoCompleto);




//PUT

router.put("/:id/atualizar-kwh", inquilinosController.atualizarKwhInquilino);


//DELET
router.delete('/:id', inquilinosController.excluirInquilino);

module.exports = router;
