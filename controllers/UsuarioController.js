const pool = require("../db/db");

// Criar usuário
exports.criarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
      [nome, email, senha]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nome, email FROM usuarios");
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Atualizar usuário
exports.atualizarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4",
      [nome, email, senha, id]
    );
    res.json({ message: "Usuário atualizado com sucesso" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Deletar usuário
exports.deletarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    res.json({ message: "Usuário excluído com sucesso" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
