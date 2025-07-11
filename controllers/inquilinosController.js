const pool = require('../db/db');

// LISTAR INQUILINOS COM CONSUMO E FATURA MAIS RECENTES
exports.listarInquilinos = async (req, res) => {
  try {
    const result = await pool.query(`
SELECT 
  i.id,
  i.nome,
  i.cpf,
  i.celular,
  i.bloco,
  i.numeroap,
  cm.kwh_atual,
  fm.valor_total
FROM inquilinos i

LEFT JOIN (
  SELECT DISTINCT ON (consumo_mensal.inquilino_id)
    consumo_mensal.*
  FROM consumo_mensal
  ORDER BY consumo_mensal.inquilino_id, consumo_mensal.ano DESC, consumo_mensal.mes DESC, consumo_mensal.id DESC
) AS cm ON cm.inquilino_id = i.id

LEFT JOIN (
  SELECT DISTINCT ON (fatura_mensal.inquilino_id)
    fatura_mensal.*
  FROM fatura_mensal
  ORDER BY fatura_mensal.inquilino_id, fatura_mensal.ano DESC, fatura_mensal.mes DESC, fatura_mensal.id DESC
) AS fm ON fm.inquilino_id = i.id


    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar inquilinos:", error);
    res.status(500).json({ error: "Erro ao listar inquilinos" });
  }
};


// ADICIONAR NOVO INQUILINO
exports.adicionarInquilino = async (req, res) => {
  const { nome, cpf, celular, email, bloco, casaId, numerorel, numeroap, kwhatual } = req.body;

  if (!nome || !cpf || !celular || !email || !bloco || !casaId || !numerorel || !numeroap || !kwhatual) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(`
      INSERT INTO inquilinos 
        (nome, cpf, celular, email, bloco, casa_id, numerorel, numeroap, ativo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
      RETURNING id
    `, [nome, cpf, celular, email, bloco, casaId, numerorel, numeroap]);

    const inquilinoId = result.rows[0].id;

    await client.query(`UPDATE casas SET disponivel = FALSE WHERE id = $1`, [casaId]);

    const now = new Date();
    const mes = now.getMonth() + 1;
    const ano = now.getFullYear();

    await client.query(`
      INSERT INTO consumo_mensal (inquilino_id, mes, ano, kwh_inicial, kwh_atual, kwh_gasto)
      VALUES ($1, $2, $3, $4, $4, 0)
    `, [inquilinoId, mes, ano, kwhatual]);

    // Obter valor do kWh da casa
    const valorKwhResult = await client.query(`
      SELECT valorkwh FROM casas WHERE id = $1
    `, [casaId]);

    const valorKwh = parseFloat(valorKwhResult.rows[0].valorkwh);

    await client.query(`
      INSERT INTO fatura_mensal (inquilino_id, mes, ano, valor_total, valor_kwh)
      VALUES ($1, $2, $3, 0, $4)
    `, [inquilinoId, mes, ano, valorKwh]);

    await client.query("COMMIT");

    res.status(201).json({
      message: "Inquilino cadastrado com sucesso!",
      inquilinoId
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao cadastrar inquilino:", error);
    res.status(500).json({ error: "Erro ao cadastrar inquilino" });
  } finally {
    client.release();
  }
};

// BUSCAR INQUILINO POR ID
exports.buscarInquilinoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT i.*, c.numeroap
      FROM inquilinos i
      JOIN casas c ON i.casa_id = c.id
      WHERE i.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Inquilino não encontrado." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar inquilino por ID:", error);
    res.status(500).json({ error: "Erro ao buscar inquilino" });
  }
};

// ATUALIZAR SOMENTE O KWH ATUAL DO INQUILINO
exports.atualizarKwhInquilino = async (req, res) => {
  const { id } = req.params;
  const { kwhatual } = req.body;

  if (isNaN(kwhatual)) {
    return res.status(400).json({ error: "Valor de KWh inválido." });
  }

  const now = new Date();
  const mes = now.getMonth() + 1;
  const ano = now.getFullYear();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const consumoResult = await client.query(`
      SELECT kwh_atual FROM consumo_mensal 
      WHERE inquilino_id = $1 
      ORDER BY ano DESC, mes DESC 
      LIMIT 1
    `, [id]);

    if (consumoResult.rows.length === 0) {
      return res.status(404).json({ error: "Registro de consumo anterior não encontrado." });
    }

    const kwhInicial = parseFloat(consumoResult.rows[0].kwh_atual);
    const kwhAtualNovo = parseFloat(kwhatual);
    const kwhGasto = kwhAtualNovo - kwhInicial;

    if (kwhGasto < 0) {
      return res.status(400).json({ error: "O novo KWh Atual não pode ser menor que o anterior." });
    }

    const valorKwhResult = await client.query(`
      SELECT c.valorkwh 
      FROM casas c 
      JOIN inquilinos i ON i.casa_id = c.id 
      WHERE i.id = $1
    `, [id]);

    if (valorKwhResult.rows.length === 0) {
      throw new Error("Valor do kWh não encontrado para a casa.");
    }

    const valorKwh = parseFloat(valorKwhResult.rows[0].valorkwh);
    const valorTotal = parseFloat((kwhGasto * valorKwh).toFixed(2));

    await client.query(`
      INSERT INTO consumo_mensal (inquilino_id, mes, ano, kwh_inicial, kwh_atual, kwh_gasto)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [id, mes, ano, kwhInicial, kwhAtualNovo, kwhGasto]);

    await client.query(`
      INSERT INTO fatura_mensal (inquilino_id, mes, ano, valor_total, valor_kwh)
      VALUES ($1, $2, $3, $4, $5)
    `, [id, mes, ano, valorTotal, valorKwh]);

    await client.query("COMMIT");

    res.json({
      message: "KWh atualizado com sucesso!",
      kwh_inicial: kwhInicial,
      kwh_atual: kwhAtualNovo,
      kwh_gasto: kwhGasto,
      valor_total: valorTotal
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao atualizar KWh:", error);
    res.status(500).json({ error: "Erro ao atualizar KWh." });
  } finally {
    client.release();
  }
};

// HISTÓRICO DE CONSUMO DE UM INQUILINO
exports.buscarHistoricoConsumo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
    SELECT cm.mes, cm.ano, cm.kwh_inicial, cm.kwh_atual, cm.kwh_gasto,
       fm.valor_total, fm.valor_kwh
  FROM consumo_mensal cm
  LEFT JOIN fatura_mensal fm
    ON cm.inquilino_id = fm.inquilino_id AND cm.mes = fm.mes AND cm.ano = fm.ano
  WHERE cm.inquilino_id = $1
  ORDER BY cm.ano DESC, cm.mes DESC

    `, [id]);

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar histórico de consumo:", error);
    res.status(500).json({ error: "Erro ao buscar histórico de consumo." });
  }
};

// Controller: inquilinosController.js
exports.buscarHistoricoCompleto = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
  cm.mes,
  cm.ano,
  cm.kwh_inicial,
  cm.kwh_atual,
  cm.kwh_gasto,
  fm.valor_total,
  fm.valor_kwh
FROM consumo_mensal cm
LEFT JOIN fatura_mensal fm
  ON cm.inquilino_id = fm.inquilino_id AND cm.mes = fm.mes AND cm.ano = fm.ano
WHERE cm.inquilino_id = $1
ORDER BY cm.ano DESC, cm.mes DESC

    `, [id]);

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar histórico completo:", error);
    res.status(500).json({ error: "Erro ao buscar histórico completo." });
  }
};


// EXCLUIR INQUILINO
exports.excluirInquilino = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(`UPDATE inquilinos SET ativo = FALSE WHERE id = $1`, [id]);

    res.json({ message: "Inquilino excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir inquilino:", error);
    res.status(500).json({ error: "Erro ao excluir inquilino." });
  }
};
