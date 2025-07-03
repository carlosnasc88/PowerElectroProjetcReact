const pool = require('../db/db');

exports.listarInquilinos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.id, i.nome, i.cpf, i.celular, i.email, i.bloco, c.numeroap 
      FROM inquilinos i
      JOIN casas c ON i.casa_id = c.id
      WHERE i.ativo = TRUE
      ORDER BY i.nome;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar inquilinos:', error);
    res.status(500).json({ error: "Erro ao listar inquilinos" });
  }
};


//CRIANDO UM NOVO INQUILINO
exports.adicionarInquilino = async (req, res) => {
  const { nome, cpf, celular, email, bloco, casaId, numerorel, numeroap } = req.body;

  if (!nome || !cpf || !celular || !email || !bloco || !casaId || !numerorel || !numeroap)  {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertQuery = `
      INSERT INTO inquilinos 
      (nome, cpf, celular, email, bloco, casa_id, numerorel,numeroap, ativo)
      VALUES ($1, $2, $3, $4, $5, $6, $7,$8, TRUE)
      RETURNING *`;
    const result = await client.query(insertQuery, [nome, cpf, celular, email, bloco, casaId, numerorel,numeroap]);

    await client.query(`UPDATE casas SET disponivel = FALSE WHERE id = $1`, [casaId]);

    await client.query("COMMIT");

    res.status(201).json({
      message: "Inquilino salvo com sucesso!",
      inquilino: result.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao salvar inquilino:", error);
    res.status(500).json({ error: "Erro ao salvar inquilino" });
  } finally {
    client.release();
  }
};

//EDITAR INQUILINO
exports.buscarInquilinoPorId = async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ error: "ID inválido" });
  
  try {
    const result = await pool.query(`
      SELECT i.id, i.nome, i.cpf, i.celular, i.email, i.bloco,i.casa_id, c.numeroap, i.numerorel
      FROM inquilinos i
      JOIN casas c ON i.casa_id = c.id
      WHERE i.id = $1 AND i.ativo = TRUE
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Inquilino não encontrado" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar inquilino por id:", error);
    res.status(500).json({ error: "Erro ao buscar inquilino" });
  }
};

exports.atualizarInquilino = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, cpf, celular, email, bloco, casaId, numerorel, numeroap } = req.body;

  if (!id || !nome || !cpf || !celular || !email || !bloco || !casaId || !numerorel || !numeroap) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateQuery = `
      UPDATE inquilinos
      SET nome = $1, cpf = $2, celular = $3, email = $4, bloco = $5, casa_id = $6, numerorel = $7, numeroap = $8
      WHERE id = $9 AND ativo = TRUE
      RETURNING *`;

    const result = await client.query(updateQuery, [nome, cpf, celular, email, bloco, casaId, numerorel, numeroap, id]);

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Inquilino não encontrado" });
    }

    await client.query("COMMIT");

    res.json({
      message: "Inquilino atualizado com sucesso!",
      inquilino: result.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao atualizar inquilino:", error);
    res.status(500).json({ error: "Erro ao atualizar inquilino" });
  } finally {
    client.release();
  }
};


//EXCLUIR INQUILINO
exports.excluirInquilino = async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ error: "ID inválido" });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Recupera casaId do inquilino para liberar a casa
    const resInquilino = await client.query('SELECT casa_id FROM inquilinos WHERE id = $1', [id]);
    if (resInquilino.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Inquilino não encontrado" });
    }
    const casaId = resInquilino.rows[0].casa_id;

    // Delete inquilino (ou você pode optar por marcar ativo = FALSE)
    await client.query('DELETE FROM inquilinos WHERE id = $1', [id]);

    // Atualiza casa para disponível
    await client.query('UPDATE casas SET disponivel = TRUE WHERE id = $1', [casaId]);

    await client.query("COMMIT");

    res.json({ message: "Inquilino excluído com sucesso" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao excluir inquilino:", error);
    res.status(500).json({ error: "Erro ao excluir inquilino" });
  } finally {
    client.release();
  }
};
