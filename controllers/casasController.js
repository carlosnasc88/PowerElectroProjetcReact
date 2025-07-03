const pool = require("../db/db");

exports.adicionarCasa = async (req, res) => {
  const { numeroap, bloco, numerorel, kwhinicial, kwhatual, valorKwh } =
    req.body;
  try {
    const result = await pool.query(
      `INSERT INTO casas (numeroap, bloco, numerorel, kwhinicial, kwhatual, valorKwh, disponivel)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING *`,
      [numeroap, bloco, numerorel, kwhinicial, kwhatual, valorKwh]
    );
    res
      .status(201)
      .json({ message: "Casa salva com sucesso!", casa: result.rows[0] });
  } catch (error) {
    console.error("Erro ao salvar casa:", error);
    res.status(500).json({ error: "Erro ao salvar casa" });
  }
};

exports.listarCasas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM casas");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar casas" });
  }
};

exports.listarCasasAtivas = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM casas WHERE disponivel = FALSE"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar casas ativas" });
  }
};

exports.blocosDisponiveis = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT bloco FROM casas WHERE disponivel = TRUE ORDER BY bloco"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar blocos" });
  }
};

exports.casasDisponiveisPorBloco = async (req, res) => {
  const { bloco } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, numeroap, numerorel FROM casas
       WHERE bloco = $1 AND disponivel = TRUE AND id NOT IN (
         SELECT casa_id FROM inquilinos WHERE ativo = TRUE
       )`,
      [bloco]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar casas disponíveis" });
  }
};

exports.numeroApDisponiveisPorBloco = async (req, res) => {
  const { bloco } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, numeroap, numerorel FROM casas 
       WHERE bloco = $1 AND disponivel = TRUE AND id NOT IN (
         SELECT casa_id FROM inquilinos WHERE ativo = TRUE
       )`,
      [bloco]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar numeroap disponíveis:", error);
    res
      .status(500)
      .json({ error: "Erro ao buscar número de apartamentos disponíveis" });
  }
};
