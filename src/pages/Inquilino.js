import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Inquilino.css";

export default function Inquilino() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    celular: "",
    email: "",
    bloco: "",
    casaId: "",
    numeroap: "",
    numerorel: "",
  });

  const [blocos, setBlocos] = useState([]);
  const [casas, setCasas] = useState([]);
  const [erro, setErro] = useState("");
  const [formAtivo, setFormAtivo] = useState(Boolean(id)); // Ativa o formulário ao clicar em "Novo"

  const isEditando = Boolean(id);

  useEffect(() => {
    if (isEditando) {
      fetch(`http://localhost:5500/inquilinos/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao carregar inquilino");
          return res.json();
        })
        .then((data) => {
          setForm({
            nome: data.nome,
            cpf: data.cpf,
            celular: data.celular,
            email: data.email,
            bloco: data.bloco,
            casaId: data.casa_id.toString(),
            numeroap: data.numeroap,
            numerorel: data.numerorel,
          });
        })
        .catch(() => setErro("Erro ao carregar inquilino."));
    }
  }, [id, isEditando]);

  useEffect(() => {
    fetch("http://localhost:5500/blocos-disponiveis")
      .then((res) => res.json())
      .then((data) => setBlocos(data.map((item) => item.bloco)))
      .catch(() => setErro("Erro ao carregar blocos."));
  }, []);

  useEffect(() => {
    if (form.bloco) {
      fetch(`http://localhost:5500/numeroaps-disponiveis/${form.bloco}`)
        .then((res) => res.json())
        .then((data) => {
          setCasas(Array.isArray(data) ? data : []);
          if (!isEditando) {
            setForm((f) => ({ ...f, casaId: "", numerorel: "" }));
          }
        })
        .catch(() => {
          setCasas([]);
          setErro("Erro ao carregar casas.");
        });
    } else {
      setCasas([]);
      setForm((f) => ({ ...f, casaId: "", numerorel: "" }));
    }
  }, [form.bloco, isEditando]);

  const formatCPF = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{3})(\d)/, "$1.$2");
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1-$2");
    return value;
  };

  const formatCelular = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cpf") {
      setForm({ ...form, cpf: formatCPF(value) });
    } else if (name === "celular") {
      setForm({ ...form, celular: formatCelular(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCasaChange = (e) => {
    const casaId = e.target.value;
    const casaSelecionada = casas.find((casa) => casa.id.toString() === casaId);
    setForm({
      ...form,
      casaId,
      numerorel: casaSelecionada ? casaSelecionada.numerorel : "",
      numeroap: casaSelecionada ? casaSelecionada.numeroap : "",
    });
  };

  const validarCadastro = () => {
    const { nome, cpf, celular, email, bloco, casaId, numerorel } = form;
    if (!nome || !cpf || !celular || !email || !bloco || !casaId || !numerorel) {
      setErro("Por favor, preencha todos os campos.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErro("E-mail inválido.");
      return false;
    }
    setErro("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarCadastro()) return;

    const url = isEditando
      ? `http://localhost:5500/inquilinos/${id}`
      : "http://localhost:5500/inquilinos";

    const method = isEditando ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao salvar inquilino");
        return res.json();
      })
      .then(() => {
        navigate("/inquilinos/listagem-inquilinos");
      })
      .catch(() => {
        setErro("Erro ao salvar inquilino.");
      });
  };

  return (
    <div >
      <main>
        <h1>{isEditando ? "Editar Inquilino" : "Cadastro de Inquilino"}</h1>

        {erro && <p className="error-message">{erro}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Nome</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                disabled={!formAtivo}
              />
            </div>

            <div className="form-field">
              <label>CPF</label>
              <input
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                maxLength={14}
                disabled={!formAtivo}
              />
            </div>

            <div className="form-field">
              <label>Celular</label>
              <input
                name="celular"
                value={form.celular}
                onChange={handleChange}
                maxLength={15}
                disabled={!formAtivo}
              />
            </div>

            <div className="form-field">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!formAtivo}
              />
            </div>
          </div>

          <div className="form-grid two-columns">
            <div className="form-field">
              <label>Bloco</label>
              <select
                name="bloco"
                value={form.bloco}
                onChange={handleChange}
                disabled={!formAtivo}
              >
                <option value="">Selecione</option>
                {blocos.map((b, i) => (
                  <option key={i} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>N° da Casa</label>
              <select
                name="casaId"
                value={form.casaId}
                onChange={handleCasaChange}
                disabled={!formAtivo}
              >
                <option value="">Selecione</option>
                {casas.map((casa) => (
                  <option key={casa.id} value={casa.id}>{casa.numeroap}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>N° do Relógio</label>
              <input name="numerorel" value={form.numerorel} readOnly />
            </div>
          </div>

          {formAtivo && (
            <div className="button-group">
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => navigate("/inquilinos/listagem-inquilinos")}>
                Cancelar
              </button>
            </div>
          )}
        </form>

        {/* Botões Fixos Inferiores */}
        {!formAtivo && !isEditando && (
          <div className="button-group" style={{ marginTop: "30px", justifyContent: "center" }}>
            <button type="button" onClick={() => setFormAtivo(true)}>Novo Inquilino</button>
            <button type="button" onClick={() => navigate("/inquilinos/listagem-inquilinos")}>Listar Inquilinos</button>
            <button onClick={() => navigate("/")}>Voltar para Página Inicial</button>

          </div>
        )}
      </main>
    </div>
  );
}
