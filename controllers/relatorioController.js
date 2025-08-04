const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // ajuste o caminho do seu arquivo de conexão com o banco

// Rota para gerar relatório completo
router.get('/relatorio-completo', async (req, res) => {
  try {
    const query = `
      SELECT 
        i.id AS inquilino_id,
        i.nome,
        i.cpf,
        i.celular,
        i.email,
        i.bloco,
        i.numeroap,
        i.casa_id,
        c.mes,
        c.ano,
        c.kwh_inicial,
        c.kwh_atual,
        c.kwh_gasto,
        f.valor_total,
        f.valor_kwh
      FROM inquilinos i
      LEFT JOIN consumo_mensal c ON i.id = c.inquilino_id
      LEFT JOIN fatura_mensal f ON i.id = f.inquilino_id AND f.mes = c.mes AND f.ano = c.ano
      WHERE i.ativo = true
      ORDER BY i.nome, c.ano DESC, c.mes DESC;
    `;

    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Erro ao gerar relatório:', err.message);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});

module.exports = router;
