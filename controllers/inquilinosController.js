const pool = require('../db/db');
exports.adicionarInquilino = async (req, res) => {
  const { nome, cpf, celular, email, bloco, casaId, numerorel } = req.body;

  if (!nome || !cpf || !celular || !email || !bloco || !casaId || !numerorel) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertQuery = `
      INSERT INTO inquilinos 
      (nome, cpf, celular, email, bloco, casa_id, numerorel, ativo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
      RETURNING *`;
    const result = await client.query(insertQuery, [nome, cpf, celular, email, bloco, casaId, numerorel]);

    await client.query(`UPDATE casas SET disponivel = FALSE WHERE id = $1`, [casaId]);

    await client.query("COMMIT");

    res.status(201).json({
      message: "Inquilino salvo com sucesso!",
      inquilino: result.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Erro ao salvar inquilino" });
  } finally {
    client.release();
  }
};
