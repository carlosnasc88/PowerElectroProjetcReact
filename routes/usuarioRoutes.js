const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuarioController"); // caminho correto

router.post("/", UsuarioController.criarUsuario);
router.get("/", UsuarioController.listarUsuarios);
router.put("/:id", UsuarioController.atualizarUsuario);
router.delete("/:id", UsuarioController.deletarUsuario);

module.exports = router;
