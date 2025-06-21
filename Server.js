// server.js
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const port = 5500;

//TRATATIVAS EM CASA

// Rota para adicionar casa ao banco de dados
app.post("/casas", async (req, res) => {
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
});

// Rota para listar todas as casas
app.get("/casas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM casas ");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar casas:", error);
    res.status(500).json({ error: "Erro ao buscar casas" });
  }
});
// Rota para retornar as casas ativas (disponível = false)
app.get("/CasasAtivas", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM casas WHERE disponivel = FALSE"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar casas ativas:", error);
    res.status(500).json({ error: "Erro ao buscar casas ativas" });
  }
});

// const{disponivel} = req.query;

// try{
//   let resultado;
//   if(disponivel !== undefined){
//     resultado = await pool.query(
//       'SELECT * FROM casas WHERE disponivel = $1',
//       [disponivel ===  'true']
//     );

//   }else{
//     resultado = await pool.query('SELECT * FROM casas')
//   }

//   res.json(resultado.rows);
// }catch(err){
//   console.error('Erro ao buscas casas')
//   res.status(500).json({erro: 'Erro ao bucar casasa'})
// }

// Endpoint para pegar os blocos disponíveis
app.get("/blocos-disponiveis", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT bloco FROM casas WHERE disponivel = TRUE ORDER BY bloco"
    );
    res.json(result.rows); // [{ bloco: 'A' }, { bloco: 'B' }, ...]
  } catch (err) {
    console.error("Erro ao buscar blocos:", err);
    res.status(500).json({ error: "Erro ao buscar blocos" });
  }
});

// Endpoint para pegar as casas disponíveis de um bloco específico
app.get("/casas-disponiveis/:bloco", async (req, res) => {
  const { bloco } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT id, numeroap, numerorel
      FROM casas
      WHERE bloco = $1
        AND disponivel = true
        AND id NOT IN (
          SELECT casa_id FROM inquilinos WHERE ativo = true
        )
      `,
      [bloco]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar casas disponíveis:", error);
    res.status(500).json({ error: "Erro ao buscar casas disponíveis" });
  }
});

// Inserir inquilino
app.post("/inquilinos", async (req, res) => {
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

    const result = await client.query(insertQuery, [
      nome,
      cpf,
      celular,
      email,
      bloco,
      casaId,
      numerorel,
    ]);

    const updateQuery = `UPDATE casas SET disponivel = FALSE WHERE id = $1`;
    await client.query(updateQuery, [casaId]);

    await client.query("COMMIT");

    res.status(201).json({
      message: "Inquilino salvo com sucesso!",
      inquilino: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao salvar inquilino:", error);
    res.status(500).json({ error: "Erro ao salvar inquilino" });
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
