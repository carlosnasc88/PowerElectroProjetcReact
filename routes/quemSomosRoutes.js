const express = require('express');
const router = express.Router();

// Rota de exemplo
router.get('/', (req, res) => {
  res.json({ mensagem: 'Quem somos: rota funcionando!' });
});


module.exports = router;
